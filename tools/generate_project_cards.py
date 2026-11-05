import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Load fonts
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"

def get_font(size, bold=True):
    path = FONT_BOLD if bold else FONT_REG
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def round_corners(im, rad):
    mask = Image.new('L', im.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), im.size], rad, fill=255)
    out = im.copy()
    out.putalpha(mask)
    return out

def create_card_base(w, h, orig_alpha, border_color=(255, 50, 40)):
    # Dark cinematic background canvas
    base = Image.new('RGBA', (w, h), (10, 8, 14, 255))
    draw = ImageDraw.Draw(base)
    
    # Subtle inner gradient vignette
    for y in range(h):
        fac = y / h
        col = int(12 + fac * 14)
        draw.line([(0, y), (w, y)], fill=(col, int(col * 0.8), int(col * 1.1), 255))
        
    # Glowing top and bottom edge lines
    draw.line([(0, 0), (w, 0)], fill=(*border_color, 180), width=2)
    draw.line([(0, h - 1), (w, h - 1)], fill=(*border_color, 80), width=1)
    
    return base

def finalize_card(canvas, orig_alpha_path):
    orig = Image.open(orig_alpha_path)
    orig_alpha = np.array(orig)[:, :, 3]
    
    # Apply original feathered quad alpha mask
    final = canvas.copy()
    alpha_im = Image.fromarray(orig_alpha)
    final.putalpha(alpha_im)
    return final

def generate_recovfit():
    orig_path = "public/projects/originals/p01_timeless.png"
    orig = Image.open(orig_path)
    w, h = orig.size  # 384, 273
    
    card = create_card_base(w, h, orig_path, border_color=(255, 60, 45))
    draw = ImageDraw.Draw(card)
    
    # Left: App Icon & Typography
    icon_path = "public/projects/recovfit/icon.jpg"
    if os.path.exists(icon_path):
        icon = Image.open(icon_path).resize((48, 48), Image.Resampling.LANCZOS)
        icon = round_corners(icon, 12)
        card.paste(icon, (24, 28), icon)
    
    # Live Badge
    badge_w, badge_h = 138, 20
    draw.rounded_rectangle([(80, 28), (80 + badge_w, 28 + badge_h)], 10, fill=(35, 12, 16), outline=(255, 60, 45), width=1)
    draw.text((88, 31), " LIVE ON APP STORE", font=get_font(9, True), fill=(255, 90, 80))
    
    # Title & Subtitle
    draw.text((24, 88), "RECOVFIT", font=get_font(26, True), fill=(255, 255, 255))
    draw.text((24, 120), "Patient Recovery & Fitness", font=get_font(13, True), fill=(230, 210, 200))
    draw.text((24, 138), "Official Healthcare iOS App (SIMATS)", font=get_font(10, False), fill=(160, 150, 160))
    
    # Feature Pills
    pills = ["SwiftUI", "Video Calling", "AI Chatbot", "PHP & MySQL"]
    px = 24
    for p in pills:
        pw = len(p) * 6 + 14
        draw.rounded_rectangle([(px, 168), (px + pw, 186)], 4, fill=(28, 20, 26), outline=(200, 60, 50, 100), width=1)
        draw.text((px + 7, 172), p, font=get_font(9, True), fill=(240, 200, 195))
        px += pw + 8
        
    # Footer telemetry
    draw.text((24, 214), "APP ID: 6753745934 · 120Hz PROMOTION · MVVM", font=get_font(9, False), fill=(180, 90, 80))
    
    # Right: Real Screenshot in Phone Mockup
    screen_path = "public/projects/recovfit/screen1.jpg"
    if os.path.exists(screen_path):
        sc = Image.open(screen_path)
        sc_w, sc_h = 105, 210
        sc = sc.resize((sc_w, sc_h), Image.Resampling.LANCZOS)
        sc = round_corners(sc, 16)
        
        # Phone frame backing
        draw.rounded_rectangle([(w - sc_w - 26, 32), (w - 22, 32 + sc_h + 4)], 18, fill=(0, 0, 0, 220), outline=(255, 60, 45, 140), width=2)
        card.paste(sc, (w - sc_w - 24, 34), sc)

    final = finalize_card(card, orig_path)
    final.save("public/projects/p01_timeless.png", "PNG")
    print("Generated p01_timeless.png (RecovFit)")

def generate_smart_ulcer():
    orig_path = "public/projects/originals/p03_build.png"
    orig = Image.open(orig_path)
    w, h = orig.size  # 471, 288 (Center Hero Card)
    
    card = create_card_base(w, h, orig_path, border_color=(255, 45, 45))
    draw = ImageDraw.Draw(card)
    
    # Left: App Icon & Typography
    icon_path = "public/projects/smart_ulcer/icon.jpg"
    if os.path.exists(icon_path):
        icon = Image.open(icon_path).resize((52, 52), Image.Resampling.LANCZOS)
        icon = round_corners(icon, 14)
        card.paste(icon, (32, 30), icon)
        
    # Live Badge
    badge_w, badge_h = 142, 22
    draw.rounded_rectangle([(92, 30), (92 + badge_w, 30 + badge_h)], 11, fill=(35, 12, 16), outline=(255, 55, 45), width=1)
    draw.text((102, 34), " LIVE ON APP STORE", font=get_font(9, True), fill=(255, 90, 80))
    
    # Title & Subtitle
    draw.text((32, 94), "SMART ULCER PREDICTOR", font=get_font(25, True), fill=(255, 255, 255))
    draw.text((32, 126), "Deep Learning Wound Diagnostic Tool", font=get_font(14, True), fill=(240, 220, 215))
    draw.text((32, 146), "Instant Classification: Healing · Not Healing · Normal Skin", font=get_font(10, False), fill=(180, 170, 180))
    
    # Feature Pills
    pills = ["Deep Learning", "Vision + CoreML", "iPadOS & iOS", "Clinical Decision Support"]
    px = 32
    for p in pills:
        pw = len(p) * 6 + 14
        draw.rounded_rectangle([(px, 178), (px + pw, 198)], 4, fill=(28, 20, 26), outline=(220, 60, 50, 120), width=1)
        draw.text((px + 7, 183), p, font=get_font(9, True), fill=(245, 205, 200))
        px += pw + 8
        
    # Footer telemetry
    draw.text((32, 226), "APP ID: 6755873140 · CONVOLUTIONAL NEURAL NETWORKS · REAL-TIME", font=get_font(9, False), fill=(200, 80, 70))
    
    # Right: Real Screenshot in Mockup
    screen_path = "public/projects/smart_ulcer/screen1.jpg"
    if os.path.exists(screen_path):
        sc = Image.open(screen_path)
        sc_w, sc_h = 116, 230
        sc = sc.resize((sc_w, sc_h), Image.Resampling.LANCZOS)
        sc = round_corners(sc, 18)
        
        # Phone frame backing
        draw.rounded_rectangle([(w - sc_w - 30, 28), (w - 26, 28 + sc_h + 4)], 20, fill=(0, 0, 0, 220), outline=(255, 55, 45, 160), width=2)
        card.paste(sc, (w - sc_w - 28, 30), sc)

    final = finalize_card(card, orig_path)
    final.save("public/projects/p03_build.png", "PNG")
    print("Generated p03_build.png (Smart Ulcer Predictor)")

def generate_urosonic():
    orig_path = "public/projects/originals/p02_game.png"
    orig = Image.open(orig_path)
    w, h = orig.size  # 428, 269
    
    card = create_card_base(w, h, orig_path, border_color=(40, 130, 255))
    draw = ImageDraw.Draw(card)
    
    # Badge
    draw.rounded_rectangle([(28, 28), (28 + 150, 48)], 10, fill=(10, 22, 40), outline=(40, 130, 255), width=1)
    draw.text((36, 32), "ACOUSTIC AI · MEDICAL", font=get_font(9, True), fill=(80, 170, 255))
    
    # Title & Subtitle
    draw.text((28, 70), "UROSONIC / UROFLOW", font=get_font(24, True), fill=(255, 255, 255))
    draw.text((28, 102), "Smartphone Acoustic Uroflowmetry", font=get_font(13, True), fill=(200, 220, 245))
    draw.text((28, 122), "Continuous Volumetric Flow Curve & Qmax Calculation", font=get_font(10, False), fill=(140, 160, 190))
    
    # Acoustic wave visual
    for x in range(28, 240, 4):
        h_line = int(np.sin(x * 0.08) * 16 + np.sin(x * 0.03) * 10)
        draw.line([(x, 175 - abs(h_line)), (x, 175 + abs(h_line))], fill=(40, 140, 255, 180), width=2)
        
    pills = ["Acoustic DSP", "Python FFT", "SwiftUI", "Doctor Portal"]
    px = 28
    for p in pills:
        pw = len(p) * 6 + 12
        draw.rounded_rectangle([(px, 205), (px + pw, 223)], 4, fill=(12, 24, 40), outline=(40, 120, 240, 100), width=1)
        draw.text((px + 6, 209), p, font=get_font(9, True), fill=(160, 210, 255))
        px += pw + 6
        
    final = finalize_card(card, orig_path)
    final.save("public/projects/p02_game.png", "PNG")
    print("Generated p02_game.png (Urosonic AI)")

def generate_dental():
    orig_path = "public/projects/originals/p04_driven.png"
    orig = Image.open(orig_path)
    w, h = orig.size  # 460, 377
    
    card = create_card_base(w, h, orig_path, border_color=(255, 90, 40))
    draw = ImageDraw.Draw(card)
    
    draw.rounded_rectangle([(32, 34), (32 + 160, 56)], 11, fill=(35, 18, 12), outline=(255, 100, 40), width=1)
    draw.text((42, 38), "BIOMEDICAL VISION · AI", font=get_font(9, True), fill=(255, 130, 80))
    
    draw.text((32, 86), "DENTAL AI SEGMENTATION", font=get_font(24, True), fill=(255, 255, 255))
    draw.text((32, 118), "Radiographic Structure Delineation", font=get_font(13, True), fill=(240, 220, 200))
    draw.text((32, 138), "Automated Pathological & Anatomical Pixel Segmentation", font=get_font(10, False), fill=(170, 150, 150))
    
    # Segmentation mesh grid visual
    for r in range(4):
        for c in range(6):
            rx, ry = 32 + c * 34, 180 + r * 28
            draw.rectangle([(rx, ry), (rx + 28, ry + 22)], outline=(255, 110, 50, 120), fill=(40, 20, 15, 80), width=1)
            
    pills = ["PyTorch Deep CNN", "OpenCV Preprocessing", "IoU Benchmark", "Report Gen"]
    px = 32
    for p in pills:
        pw = len(p) * 6 + 14
        draw.rounded_rectangle([(px, 310), (px + pw, 330)], 4, fill=(30, 18, 14), outline=(255, 100, 40, 120), width=1)
        draw.text((px + 7, 315), p, font=get_font(9, True), fill=(255, 190, 160))
        px += pw + 8
        
    final = finalize_card(card, orig_path)
    final.save("public/projects/p04_driven.png", "PNG")
    print("Generated p04_driven.png (Dental AI)")

def generate_gamified_dsa():
    orig_path = "public/projects/originals/p05_ideas.png"
    orig = Image.open(orig_path)
    w, h = orig.size  # 232, 198
    
    card = create_card_base(w, h, orig_path, border_color=(255, 160, 40))
    draw = ImageDraw.Draw(card)
    
    draw.text((16, 20), "EDTECH · ALGORITHMS", font=get_font(8, True), fill=(255, 180, 60))
    draw.text((16, 38), "GAMIFIED DSA", font=get_font(18, True), fill=(255, 255, 255))
    draw.text((16, 62), "Duolingo-Style Code Platform", font=get_font(10, True), fill=(240, 220, 190))
    
    # Mascot badge
    draw.text((16, 86), "🐦‍🔥 PHOENIX MASCOT GUIDE", font=get_font(9, True), fill=(255, 140, 40))
    draw.text((16, 104), "Interactive BST / Graph Visualizer", font=get_font(9, False), fill=(170, 160, 150))
    draw.text((16, 120), "Streaks · XP Engine · Swift Concurrency", font=get_font(8, False), fill=(140, 130, 120))
    
    # Tree node visual
    draw.ellipse([(175, 130), (195, 150)], outline=(255, 160, 40), width=1)
    draw.text((181, 134), "50", font=get_font(8, True), fill=(255, 200, 100))
    
    final = finalize_card(card, orig_path)
    final.save("public/projects/p05_ideas.png", "PNG")
    print("Generated p05_ideas.png (Gamified DSA)")

generate_recovfit()
generate_smart_ulcer()
generate_urosonic()
generate_dental()
generate_gamified_dsa()

def generate_small_cards():
    cards_data = [
        ("p06_sound", "FIREBASE SYNC", "Realtime DB & APNs Push", "Cloud Auth · Firestore · APNs", (255, 140, 40)),
        ("p07_food", "ORACLE SQL", "AI Database Architecture", "Certified Relational Design", (220, 60, 40)),
        ("p08_travel", "SELENIUM QA", "Automated Web Testing", "Cross-Browser Regression CI", (40, 160, 240)),
        ("p09_space", "APPIUM QA", "Mobile Device Testing", "iOS & Android Automation", (140, 90, 240)),
        ("p10_play", "SECURITY SHIELD", "Vulnerability Pentesting", "OWASP Top 10 · Burp Suite", (255, 60, 50)),
        ("p11_cleaner", "LOAD TESTING", "1,000+ VU Performance", "Concurrency & Stress SRE", (60, 200, 120)),
        ("p12_steps", "APP STORE DEPLOY", "Certificates & TestFlight", "Apple HIG & Privacy Manifests", (40, 140, 255)),
    ]
    
    for filename, title, sub, pills_text, col in cards_data:
        orig_path = f"public/projects/originals/{filename}.png"
        orig = Image.open(orig_path)
        w, h = orig.size
        
        card = create_card_base(w, h, orig_path, border_color=col)
        draw = ImageDraw.Draw(card)
        
        draw.text((14, 18), "ENGINEERING PILLAR", font=get_font(7, True), fill=(*col, 220))
        draw.text((14, 34), title, font=get_font(15, True), fill=(255, 255, 255))
        draw.text((14, 56), sub, font=get_font(9, True), fill=(210, 200, 210))
        draw.text((14, 76), pills_text, font=get_font(8, False), fill=(160, 150, 160))
        
        final = finalize_card(card, orig_path)
        final.save(f"public/projects/{filename}.png", "PNG")
        print(f"Generated {filename}.png ({title})")

generate_small_cards()
