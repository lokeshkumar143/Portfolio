"""Static dev server.

Plain http.server lets the browser hold on to ES modules across edits, which
means you end up debugging code that is no longer on disk. Everything is served
no-store here, and the few types that matter get explicit content types.
"""

import base64
import http.server
import os
import socketserver
import sys
import urllib.parse

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
SHOT_DIR = os.environ.get("SHOT_DIR", "shots")

TYPES = {
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".webm": "video/webm",
    ".mp4": "video/mp4",
    ".woff2": "font/woff2",
    ".png": "image/png",
    ".jpg": "image/jpeg",
}


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        """POST /__shot writes a base64 PNG to disk."""
        if not self.path.startswith("/__shot"):
            self.send_error(404)
            return
        n = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(n).decode("utf-8", "replace")
        name = self.path.split("=")[-1] if "=" in self.path else "shot"
        name = "".join(c for c in name if c.isalnum() or c in "-_.") or "shot"
        head, _, b64 = raw.partition(",")
        out = os.path.join(SHOT_DIR, name + ".png")
        os.makedirs(SHOT_DIR, exist_ok=True)
        with open(out, "wb") as f:
            f.write(base64.b64decode(b64 or head))
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(out.encode())

    def send_head(self):
        """Common code for GET and HEAD commands supporting Range requests (HTTP 206)."""
        clean_path = self.path.split("?")[0].split("#")[0]
        path = self.translate_path(clean_path)
        f = None
        if os.path.isdir(path):
            parts = urllib.parse.urlsplit(self.path)
            if not parts.path.endswith(('/', '%2f', '%2F')):
                self.send_response(http.HTTPStatus.MOVED_PERMANENTLY)
                new_parts = (parts[0], parts[1], parts[2] + '/', parts[3], parts[4])
                self.send_header("Location", urllib.parse.urlunsplit(new_parts))
                self.send_header("Content-Length", "0")
                self.end_headers()
                return None
            for index in self.index_pages:
                index = os.path.join(path, index)
                if os.path.isfile(index):
                    path = index
                    break
            else:
                return self.list_directory(path)

        ctype = self.guess_type(path)
        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(http.HTTPStatus.NOT_FOUND, "File not found")
            return None

        try:
            fs = os.fstat(f.fileno())
            size = fs[6]

            # Range request handling for video streaming (crucial for Safari/iOS)
            range_header = self.headers.get("Range")
            if range_header and range_header.startswith("bytes="):
                try:
                    ranges = range_header[6:].split("-")
                    start = int(ranges[0]) if ranges[0] else 0
                    end = int(ranges[1]) if ranges[1] else size - 1
                    if start >= size:
                        self.send_error(416, "Requested Range Not Satisfiable")
                        self.send_header("Content-Range", f"bytes */{size}")
                        self.end_headers()
                        f.close()
                        return None
                    end = min(end, size - 1)
                    length = end - start + 1

                    self.send_response(206, "Partial Content")
                    self.send_header("Content-Type", ctype)
                    self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
                    self.send_header("Content-Length", str(length))
                    self.send_header("Accept-Ranges", "bytes")
                    self.end_headers()
                    f.seek(start)
                    self.range_length = length
                    return f
                except Exception:
                    pass

            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(size))
            self.send_header("Accept-Ranges", "bytes")
            self.end_headers()
            self.range_length = size
            return f
        except Exception:
            f.close()
            raise

    def copyfile(self, source, outputfile):
        """Copy specific byte range if range request was processed."""
        if hasattr(self, 'range_length') and self.range_length is not None:
            bytes_to_send = self.range_length
            bufsize = 64 * 1024
            while bytes_to_send > 0:
                n = min(bytes_to_send, bufsize)
                buf = source.read(n)
                if not buf:
                    break
                try:
                    outputfile.write(buf)
                except (BrokenPipeError, ConnectionResetError):
                    break
                bytes_to_send -= len(buf)
        else:
            super().copyfile(source, outputfile)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        super().end_headers()

    def guess_type(self, path):
        clean = str(path).split("?")[0].split("#")[0].lower()
        for ext, mime in TYPES.items():
            if clean.endswith(ext):
                return mime
        return super().guess_type(path)

    def log_message(self, fmt, *args):
        msg = fmt % args
        sys.stderr.write("%s\n" % msg)
        sys.stderr.flush()


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    with Server(("", PORT), Handler) as httpd:
        print("serving on http://127.0.0.1:%d and http://localhost:%d" % (PORT, PORT), flush=True)
        httpd.serve_forever()
