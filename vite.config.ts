import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import string from 'vite-plugin-string';

export default defineConfig({
  plugins: [
    glsl(),
    string({
      include: ['**/*.glsl', '**/*.vert', '**/*.frag', '**/*.vs', '**/*.fs']
    })
  ],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  },
  optimizeDeps: {
    include: []
  }
});