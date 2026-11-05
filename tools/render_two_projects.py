import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SCALE = 4
W = 500 * SCALE
H = 335 * SCALE

FONT_PATH = "/System/Library/Fonts/Helvetica.ttc"
def get_font(size, bold=True):
    idx = 1 if bold else 0
    try:
        return ImageFont.truetype(FONT_PATH, int(size * SCALE), index=idx)
    except Exception:
        return ImageFont.load_default()

def draw_squircle_mask(size, radius):
    w, h = size
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), (w, h)], radius=radius, fill=255)
    return mask

def create_curved_screen_base(glow_color=(255, 60, 45), curve_dir=-1):
    """
    Creates a cylindrical curved screen base with soft volumetric bloom and glass rim.
    curve_dir: -1 for left screen (curving inward to right), +1 for right screen (curving inward to left)
    """
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    
    pad = 16 * SCALE
    card_rect = [(pad, pad), (W - pad, H - pad)]
    corner_rad = 36 * SCALE
    
    # 1. Screen Mask with slight cylindrical curvature
    card_mask = Image.new("L", (W, H), 0)
    mask_draw = ImageDraw.Draw(card_mask)
    mask_draw.rounded_rectangle(card_rect, radius=corner_rad, fill=255)
    
    # 2. Rich cinematic dark gradient background
    bg = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bg_draw = ImageDraw.Draw(bg)
    
    for y in range(H):
        fac = y / H
        # Deep obsidian with volcanic crimson undertone
        r = int(14 + (1 - fac) * 18 + fac * 5)
        g = int(10 + (1 - fac) * 8 + fac * 2)
        b = int(14 + (1 - fac) * 12 + fac * 2)
        bg_draw.line([(0, y), (W, y)], fill=(r, g, b, 255))
        
    # Central radiant glow behind where the logo sits
    cx, cy = W // 2, int(H * 0.43)
    glow_overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow_overlay)
    max_rad = int(W * 0.52)
    for rad in range(max_rad, 0, -8 * SCALE):
        alpha = int(70 * (1 - rad / max_rad))
        g_draw.ellipse([(cx - rad, cy - rad), (cx + rad, cy + rad)], fill=(*glow_color, alpha))
    glow_overlay = glow_overlay.filter(ImageFilter.GaussianBlur(38 * SCALE))
    bg = Image.alpha_composite(bg, glow_overlay)
    
    # Glass sheen reflection streak across the top
    sheen = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(sheen)
    s_draw.polygon([
        (pad, pad),
        (W - pad, pad),
        (W - pad, int(H * 0.35)),
        (pad, int(H * 0.48))
    ], fill=(255, 255, 255, 12))
    bg = Image.alpha_composite(bg, sheen)
    
    # Apply card shape mask
    bg.putalpha(card_mask)
    img = Image.alpha_composite(img, bg)
    
    # Glowing rim bezel
    rim = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    rim_draw = ImageDraw.Draw(rim)
    rim_draw.rounded_rectangle(card_rect, radius=corner_rad, outline=(*glow_color, 160), width=int(2.5 * SCALE))
    rim_glow = rim.filter(ImageFilter.GaussianBlur(8 * SCALE))
    
    sharp_rim = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sharp_draw = ImageDraw.Draw(sharp_rim)
    sharp_draw.rounded_rectangle(card_rect, radius=corner_rad, outline=(255, 255, 255, 180), width=int(1 * SCALE))
    
    img = Image.alpha_composite(img, rim_glow)
    img = Image.alpha_composite(img, sharp_rim)
    
    return img, card_rect

def build_recovfit_logo_card():
    glow = (255, 60, 45)
    screen, card_rect = create_curved_screen_base(glow_color=glow, curve_dir=-1)
    draw = ImageDraw.Draw(screen)
    
    cx = W // 2
    logo_cy = int(H * 0.40)
    
    # 1. Creative Biometric Kinetic Wave in background
    wave_overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    w_draw = ImageDraw.Draw(wave_overlay)
    
    # Concentric orbital rings around logo
    for r in [int(95 * SCALE), int(135 * SCALE), int(180 * SCALE)]:
        w_draw.ellipse([(cx - r, logo_cy - r), (cx + r, logo_cy + r)], outline=(255, 80, 65, 35), width=int(1 * SCALE))
    
    # Sine biometric ECG pulse line through the center
    points = []
    for x in range(int(30 * SCALE), int(W - 30 * SCALE), 4 * SCALE):
        dx = (x - cx) / (W * 0.4)
        if -0.28 < dx < 0.28:
            y = logo_cy + math.sin(dx * 18) * 38 * SCALE * (1 - abs(dx) / 0.28)
        else:
            y = logo_cy + math.sin(dx * 5) * 6 * SCALE
        points.append((x, y))
    for i in range(len(points) - 1):
        w_draw.line([points[i], points[i+1]], fill=(255, 80, 65, 55), width=int(1.5 * SCALE))
        
    screen = Image.alpha_composite(screen, wave_overlay)
    draw = ImageDraw.Draw(screen)
    
    # 2. Top Status Badge (CLEAN TEXT WITHOUT MISSING GLYPHS)
    top_y = int(36 * SCALE)
    beacon_rad = int(4.5 * SCALE)
    badge_text = "APPLE APP STORE · VERIFIED LIVE · ID: 6753745934"
    badge_font = get_font(9.5, bold=True)
    bbox = draw.textbbox((0, 0), badge_text, font=badge_font)
    bw = (bbox[2] - bbox[0]) + int(28 * SCALE)
    bh = int(22 * SCALE)
    bx = cx - bw // 2
    
    draw.rounded_rectangle([(bx, top_y), (bx + bw, top_y + bh)], radius=bh // 2, fill=(24, 14, 18, 230), outline=(255, 75, 60, 160), width=int(1 * SCALE))
    # Green pulse dot
    dot_x = bx + int(10 * SCALE)
    dot_y = top_y + bh // 2
    draw.ellipse([(dot_x - beacon_rad, dot_y - beacon_rad), (dot_x + beacon_rad, dot_y + beacon_rad)], fill=(48, 209, 88, 255))
    draw.text((dot_x + beacon_rad + int(6 * SCALE), top_y + int(3.5 * SCALE)), badge_text, font=badge_font, fill=(240, 240, 245, 230))
    
    # 3. Hero App Logo (Large 3D Squircle with vibrant glow)
    icon_path = "public/projects/recovfit/icon.jpg"
    if os.path.exists(icon_path):
        icon = Image.open(icon_path)
        icon_size = int(96 * SCALE)
        icon_resized = icon.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
        
        ix = cx - icon_size // 2
        iy = logo_cy - icon_size // 2
        
        # Logo aura glow behind
        aura = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        a_draw = ImageDraw.Draw(aura)
        a_draw.rounded_rectangle([(ix - 16 * SCALE, iy - 16 * SCALE), (ix + icon_size + 16 * SCALE, iy + icon_size + 16 * SCALE)], radius=int(34 * SCALE), fill=(255, 65, 50, 210))
        aura = aura.filter(ImageFilter.GaussianBlur(18 * SCALE))
        screen = Image.alpha_composite(screen, aura)
        
        # Rounded icon
        imask = draw_squircle_mask((icon_size, icon_size), int(24 * SCALE))
        icon_resized.putalpha(imask)
        screen.paste(icon_resized, (ix, iy), icon_resized)
        
        # Metallic squircle border
        draw = ImageDraw.Draw(screen)
        draw.rounded_rectangle([(ix - 2 * SCALE, iy - 2 * SCALE), (ix + icon_size + 2 * SCALE, iy + icon_size + 2 * SCALE)], radius=int(25 * SCALE), outline=(255, 255, 255, 200), width=int(2 * SCALE))
        
    # 4. Bold Cinematic App Title
    title_y = logo_cy + int(62 * SCALE)
    title_text = "R E C O V F I T"
    title_font = get_font(28, bold=True)
    t_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    t_w = t_bbox[2] - t_bbox[0]
    draw.text((cx - t_w // 2, title_y), title_text, font=title_font, fill=(255, 255, 255, 255))
    
    # 5. Subtitle (Exact App Store description)
    sub_y = title_y + int(36 * SCALE)
    sub_text = "Personal Fitness Trainer for Patient Recovery"
    sub_font = get_font(13, bold=True)
    s_bbox = draw.textbbox((0, 0), sub_text, font=sub_font)
    s_w = s_bbox[2] - s_bbox[0]
    draw.text((cx - s_w // 2, sub_y), sub_text, font=sub_font, fill=(255, 95, 80, 255))
    
    # 6. Creative Architecture Pills
    pills = ["SwiftUI", "WebRTC Video", "AI Clinical Bot", "SIMATS Health"]
    p_font = get_font(9.5, bold=True)
    total_pw = 0
    p_widths = []
    for p in pills:
        pb = draw.textbbox((0, 0), p, font=p_font)
        w_pill = (pb[2] - pb[0]) + int(18 * SCALE)
        p_widths.append(w_pill)
        total_pw += w_pill
    total_pw += (len(pills) - 1) * int(8 * SCALE)
    
    start_px = cx - total_pw // 2
    py = sub_y + int(26 * SCALE)
    for p, pw in zip(pills, p_widths):
        draw.rounded_rectangle([(start_px, py), (start_px + pw, py + int(19 * SCALE))], radius=int(9.5 * SCALE), fill=(26, 18, 22, 230), outline=(255, 75, 60, 110), width=int(1 * SCALE))
        draw.text((start_px + int(9 * SCALE), py + int(2.5 * SCALE)), p, font=p_font, fill=(245, 225, 220, 240))
        start_px += pw + int(8 * SCALE)
        
    # 7. Action prompt at bottom (CLEAN TEXT)
    prompt_y = py + int(30 * SCALE)
    prompt_text = "TAP SCREEN TO OPEN APP DOSSIER & SCREENSHOTS"
    pr_font = get_font(9.5, bold=True)
    pr_bbox = draw.textbbox((0, 0), prompt_text, font=pr_font)
    pr_w = pr_bbox[2] - pr_bbox[0]
    draw.text((cx - pr_w // 2, prompt_y), prompt_text, font=pr_font, fill=(200, 195, 205, 200))
    
    final = screen.resize((500, 335), Image.Resampling.LANCZOS)
    return final

def build_smart_ulcer_logo_card():
    glow = (255, 50, 75)
    screen, card_rect = create_curved_screen_base(glow_color=glow, curve_dir=1)
    draw = ImageDraw.Draw(screen)
    
    cx = W // 2
    logo_cy = int(H * 0.40)
    
    # 1. Creative Neural AI Targeting Reticle in background
    ai_overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    a_draw = ImageDraw.Draw(ai_overlay)
    
    # Concentric scanner reticles
    for r in [int(95 * SCALE), int(140 * SCALE), int(185 * SCALE)]:
        a_draw.ellipse([(cx - r, logo_cy - r), (cx + r, logo_cy + r)], outline=(255, 60, 95, 35), width=int(1 * SCALE))
    
    # Neural crosshair tick marks
    cross_len = int(220 * SCALE)
    a_draw.line([(cx - cross_len, logo_cy), (cx + cross_len, logo_cy)], fill=(255, 60, 95, 30), width=int(1 * SCALE))
    a_draw.line([(cx, logo_cy - int(125 * SCALE)), (cx, logo_cy + int(125 * SCALE))], fill=(255, 60, 95, 30), width=int(1 * SCALE))
    
    # Corner viewfinder brackets
    br = int(75 * SCALE)
    bw = int(20 * SCALE)
    # top-left
    a_draw.line([(cx - br, logo_cy - br), (cx - br + bw, logo_cy - br)], fill=(255, 75, 110, 90), width=int(2 * SCALE))
    a_draw.line([(cx - br, logo_cy - br), (cx - br, logo_cy - br + bw)], fill=(255, 75, 110, 90), width=int(2 * SCALE))
    # top-right
    a_draw.line([(cx + br, logo_cy - br), (cx + br - bw, logo_cy - br)], fill=(255, 75, 110, 90), width=int(2 * SCALE))
    a_draw.line([(cx + br, logo_cy - br), (cx + br, logo_cy - br + bw)], fill=(255, 75, 110, 90), width=int(2 * SCALE))
    # bottom-left
    a_draw.line([(cx - br, logo_cy + br), (cx - br + bw, logo_cy + br)], fill=(255, 75, 110, 90), width=int(2 * SCALE))
    a_draw.line([(cx - br, logo_cy + br), (cx - br, logo_cy + br - bw)], fill=(255, 75, 110, 90), width=int(2 * SCALE))
    # bottom-right
    a_draw.line([(cx + br, logo_cy + br), (cx + br - bw, logo_cy + br)], fill=(255, 75, 110, 90), width=int(2 * SCALE))
    a_draw.line([(cx + br, logo_cy + br), (cx + br, logo_cy + br - bw)], fill=(255, 75, 110, 90), width=int(2 * SCALE))
    
    screen = Image.alpha_composite(screen, ai_overlay)
    draw = ImageDraw.Draw(screen)
    
    # 2. Top Status Badge (CLEAN TEXT WITHOUT MISSING GLYPHS)
    top_y = int(36 * SCALE)
    beacon_rad = int(4.5 * SCALE)
    badge_text = "APPLE APP STORE · VERIFIED LIVE · ID: 6755873140"
    badge_font = get_font(9.5, bold=True)
    bbox = draw.textbbox((0, 0), badge_text, font=badge_font)
    bw = (bbox[2] - bbox[0]) + int(28 * SCALE)
    bh = int(22 * SCALE)
    bx = cx - bw // 2
    
    draw.rounded_rectangle([(bx, top_y), (bx + bw, top_y + bh)], radius=bh // 2, fill=(24, 14, 20, 230), outline=(255, 60, 95, 160), width=int(1 * SCALE))
    dot_x = bx + int(10 * SCALE)
    dot_y = top_y + bh // 2
    draw.ellipse([(dot_x - beacon_rad, dot_y - beacon_rad), (dot_x + beacon_rad, dot_y + beacon_rad)], fill=(48, 209, 88, 255))
    draw.text((dot_x + beacon_rad + int(6 * SCALE), top_y + int(3.5 * SCALE)), badge_text, font=badge_font, fill=(240, 240, 245, 230))
    
    # 3. Hero App Logo (Large 3D Squircle with vibrant glow)
    icon_path = "public/projects/smart_ulcer/icon.jpg"
    if os.path.exists(icon_path):
        icon = Image.open(icon_path)
        icon_size = int(96 * SCALE)
        icon_resized = icon.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
        
        ix = cx - icon_size // 2
        iy = logo_cy - icon_size // 2
        
        aura = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        a_draw = ImageDraw.Draw(aura)
        a_draw.rounded_rectangle([(ix - 16 * SCALE, iy - 16 * SCALE), (ix + icon_size + 16 * SCALE, iy + icon_size + 16 * SCALE)], radius=int(34 * SCALE), fill=(255, 50, 90, 210))
        aura = aura.filter(ImageFilter.GaussianBlur(18 * SCALE))
        screen = Image.alpha_composite(screen, aura)
        
        imask = draw_squircle_mask((icon_size, icon_size), int(24 * SCALE))
        icon_resized.putalpha(imask)
        screen.paste(icon_resized, (ix, iy), icon_resized)
        
        draw = ImageDraw.Draw(screen)
        draw.rounded_rectangle([(ix - 2 * SCALE, iy - 2 * SCALE), (ix + icon_size + 2 * SCALE, iy + icon_size + 2 * SCALE)], radius=int(25 * SCALE), outline=(255, 255, 255, 200), width=int(2 * SCALE))
        
    # 4. Bold Cinematic App Title (EXACT APP STORE NAME: SMART ULCER PREDICTOR)
    title_y = logo_cy + int(62 * SCALE)
    title_text = "SMART ULCER PREDICTOR"
    title_font = get_font(24, bold=True)
    t_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    t_w = t_bbox[2] - t_bbox[0]
    draw.text((cx - t_w // 2, title_y), title_text, font=title_font, fill=(255, 255, 255, 255))
    
    # 5. Subtitle
    sub_y = title_y + int(36 * SCALE)
    sub_text = "AI-Powered Medical Support Tool (Healing / Not Healing)"
    sub_font = get_font(12, bold=True)
    s_bbox = draw.textbbox((0, 0), sub_text, font=sub_font)
    s_w = s_bbox[2] - s_bbox[0]
    draw.text((cx - s_w // 2, sub_y), sub_text, font=sub_font, fill=(255, 80, 115, 255))
    
    # 6. Creative Architecture Pills
    pills = ["Vision + CoreML", "Deep CNN", "Instant Triage", "iPadOS & iOS"]
    p_font = get_font(9.5, bold=True)
    total_pw = 0
    p_widths = []
    for p in pills:
        pb = draw.textbbox((0, 0), p, font=p_font)
        w_pill = (pb[2] - pb[0]) + int(18 * SCALE)
        p_widths.append(w_pill)
        total_pw += w_pill
    total_pw += (len(pills) - 1) * int(8 * SCALE)
    
    start_px = cx - total_pw // 2
    py = sub_y + int(26 * SCALE)
    for p, pw in zip(pills, p_widths):
        draw.rounded_rectangle([(start_px, py), (start_px + pw, py + int(19 * SCALE))], radius=int(9.5 * SCALE), fill=(26, 16, 22, 230), outline=(255, 60, 95, 110), width=int(1 * SCALE))
        draw.text((start_px + int(9 * SCALE), py + int(2.5 * SCALE)), p, font=p_font, fill=(245, 220, 230, 240))
        start_px += pw + int(8 * SCALE)
        
    # 7. Action prompt at bottom (CLEAN TEXT)
    prompt_y = py + int(30 * SCALE)
    prompt_text = "TAP SCREEN TO OPEN APP DOSSIER & SCREENSHOTS"
    pr_font = get_font(9.5, bold=True)
    pr_bbox = draw.textbbox((0, 0), prompt_text, font=pr_font)
    pr_w = pr_bbox[2] - pr_bbox[0]
    draw.text((cx - pr_w // 2, prompt_y), prompt_text, font=pr_font, fill=(200, 195, 205, 200))
    
    final = screen.resize((500, 335), Image.Resampling.LANCZOS)
    return final

if __name__ == '__main__':
    recov = build_recovfit_logo_card()
    recov.save("public/projects/p01_timeless.png", "PNG")
    print("Successfully rendered p01_timeless.png (RecovFit Logo Hero):", recov.size)
    
    ulcer = build_smart_ulcer_logo_card()
    ulcer.save("public/projects/p03_build.png", "PNG")
    print("Successfully rendered p03_build.png (Smart Ulcer Predictor Logo Hero):", ulcer.size)
