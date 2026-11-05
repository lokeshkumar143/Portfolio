import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1200, 900  # 4:3 high-definition resolution

FONT_PATH = "/System/Library/Fonts/Helvetica.ttc"
def get_font(size, bold=True):
    idx = 1 if bold else 0
    try:
        return ImageFont.truetype(FONT_PATH, size, index=idx)
    except Exception:
        return ImageFont.load_default()

def draw_squircle_mask(size, radius):
    w, h = size
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), (w, h)], radius=radius, fill=255)
    return mask

def create_base_canvas(accent_color=(255, 140, 40)):
    im = Image.new("RGBA", (W, H), (14, 11, 10, 255))
    draw = ImageDraw.Draw(im)
    
    # 1. Subtle radial gradient spotlight
    cx, cy = int(W * 0.55), int(H * 0.45)
    spot = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(spot)
    for r in range(int(W * 0.65), 0, -14):
        alpha = int(48 * (1 - r / (W * 0.65)))
        s_draw.ellipse([(cx - r, cy - r), (cx + r, cy + r)], fill=(*accent_color, alpha))
    spot = spot.filter(ImageFilter.GaussianBlur(50))
    im = Image.alpha_composite(im, spot)
    
    # 2. Subtle architectural perspective grid on floor/walls
    grid = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(grid)
    for y in range(int(H * 0.55), H, 24):
        alpha = int(25 * ((y - H * 0.55) / (H * 0.45)))
        g_draw.line([(0, y), (W, y)], fill=(*accent_color, alpha), width=1)
    for x in range(0, W + 1, 60):
        # vanishing perspective lines
        g_draw.line([(cx, int(H * 0.45)), (x, H)], fill=(*accent_color, 18), width=1)
    im = Image.alpha_composite(im, grid)
    
    # 3. Soft vignette around borders
    vignette = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    v_draw.rectangle([(0, 0), (W, H)], outline=(0, 0, 0, 180), width=35)
    vignette = vignette.filter(ImageFilter.GaussianBlur(30))
    im = Image.alpha_composite(im, vignette)
    
    return im

# -----------------------------------------------------------------------------
# 2021: Foundations (Higher Secondary · Computing Curiosity · Logic Foundations)
# -----------------------------------------------------------------------------
def make_2021():
    accent = (255, 140, 50)
    im = create_base_canvas(accent_color=accent)
    draw = ImageDraw.Draw(im)
    
    # Terminal Window frame in perspective
    tw, th = 840, 560
    tx, ty = (W - tw) // 2, (H - th) // 2 - 20
    
    # Shadow
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle([(tx - 15, ty - 10), (tx + tw + 15, ty + th + 25)], radius=24, fill=(0, 0, 0, 200))
    shadow = shadow.filter(ImageFilter.GaussianBlur(25))
    im = Image.alpha_composite(im, shadow)
    
    # Window Body
    draw = ImageDraw.Draw(im)
    draw.rounded_rectangle([(tx, ty), (tx + tw, ty + th)], radius=18, fill=(18, 14, 16, 240), outline=(255, 140, 50, 120), width=2)
    
    # Title bar
    draw.rounded_rectangle([(tx, ty), (tx + tw, ty + 42)], radius=18, fill=(28, 22, 24, 255))
    draw.rectangle([(tx, ty + 24), (tx + tw, ty + 42)], fill=(28, 22, 24, 255))
    # Traffic lights
    for i, col in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        draw.ellipse([(tx + 18 + i * 22, ty + 14), (tx + 30 + i * 22, ty + 26)], fill=col)
    draw.text((tx + 95, ty + 12), "bash - foundations_logic.py — 2021 Computing Curiosity", font=get_font(13, False), fill=(180, 170, 175))
    
    # Code content inside terminal
    code_lines = [
        ("#!/usr/bin/env python3", (120, 120, 130)),
        ("# 2021 // Higher Secondary Computing Curiosity", (255, 150, 60)),
        ("", (0,0,0)),
        ("class AlgorithmicFoundation:", (255, 210, 120)),
        ("    def __init__(self):", (230, 230, 240)),
        ("        self.focus = ['Logic Gates', 'Binary Arithmetic', 'Control Flow']", (170, 215, 255)),
        ("        self.curiosity_quotient = float('inf')", (255, 180, 100)),
        ("", (0,0,0)),
        ("    def solve(self, problem):", (230, 230, 240)),
        ("        steps = break_down_first_principles(problem)", (170, 215, 255)),
        ("        while not optimized(steps):", (255, 120, 90)),
        ("            steps.refactor()", (240, 240, 250)),
        ("        return Excellence(steps)  # -> Ignited passion for code", (100, 230, 150)),
        ("", (0,0,0)),
        (">>> Starting kernel... System ready for engineering journey.", (255, 180, 60))
    ]
    
    cy = ty + 60
    f_code = get_font(15, bold=False)
    for text, color in code_lines:
        draw.text((tx + 32, cy), text, font=f_code, fill=color)
        cy += 28
        
    # Floating Holographic Badge
    draw.rounded_rectangle([(tx + tw - 240, ty + th - 65), (tx + tw - 30, ty + th - 25)], radius=10, fill=(35, 18, 12, 230), outline=(255, 140, 50, 180), width=1)
    draw.text((tx + tw - 225, ty + th - 55), "LOGIC FOUNDATIONS · 2021", font=get_font(11, True), fill=(255, 180, 100))
    
    return im.convert("RGB")

# -----------------------------------------------------------------------------
# 2022: CS Engineering (SIMATS B.E. CSE · Software Systems · Core Engineering)
# -----------------------------------------------------------------------------
def make_2022():
    accent = (255, 110, 45)
    im = create_base_canvas(accent_color=accent)
    draw = ImageDraw.Draw(im)
    
    # Engineering Architecture Diagram Frame
    fw, fh = 880, 580
    fx, fy = (W - fw) // 2, (H - fh) // 2 - 20
    
    # Shadow
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle([(fx - 15, fy - 10), (fx + fw + 15, fy + fh + 25)], radius=24, fill=(0, 0, 0, 200))
    shadow = shadow.filter(ImageFilter.GaussianBlur(25))
    im = Image.alpha_composite(im, shadow)
    
    draw = ImageDraw.Draw(im)
    draw.rounded_rectangle([(fx, fy), (fx + fw, fy + fh)], radius=18, fill=(16, 12, 14, 240), outline=(255, 110, 45, 130), width=2)
    
    # Title bar
    draw.rounded_rectangle([(fx, fy), (fx + fw, fy + 42)], radius=18, fill=(28, 20, 22, 255))
    draw.rectangle([(fx, fy + 24), (fx + fw, fy + 42)], fill=(28, 20, 22, 255))
    draw.text((fx + 24, fy + 12), "SIMATS ENGINEERING // B.E. COMPUTER SCIENCE & ENGINEERING", font=get_font(13, True), fill=(255, 170, 100))
    
    # Core Architecture Pillars Cards
    pillars = [
        ("DATA STRUCTURES", "Arrays · Linked Lists · Trees · Graphs", (255, 120, 60)),
        ("SYSTEM ARCHITECTURE", "OS Kernels · Concurrency · Memory Hierarchy", (255, 160, 70)),
        ("DATABASE INTEGRITY", "Relational Normalization · ACID · SQL Engines", (255, 200, 90)),
        ("OBJECT-ORIENTED DESIGN", "Design Patterns · SOLID · Modularity", (255, 140, 110))
    ]
    
    for i, (title, sub, col) in enumerate(pillars):
        px = fx + 36 + (i % 2) * 410
        py = fy + 65 + (i // 2) * 170
        pw, ph = 380, 140
        draw.rounded_rectangle([(px, py), (px + pw, py + ph)], radius=12, fill=(24, 18, 20, 220), outline=(*col, 120), width=1)
        # Pillar icon badge
        draw.rounded_rectangle([(px + 18, py + 18), (px + 46, py + 46)], radius=8, fill=(*col, 40), outline=col, width=1)
        draw.text((px + 26, py + 22), f"0{i+1}", font=get_font(12, True), fill=col)
        draw.text((px + 56, py + 22), title, font=get_font(13, True), fill=(255, 255, 255))
        draw.text((px + 20, py + 65), sub, font=get_font(11, False), fill=(190, 180, 185))
        # Micro bar
        draw.rounded_rectangle([(px + 20, py + 105), (px + pw - 20, py + 110)], radius=3, fill=(35, 25, 28, 255))
        draw.rounded_rectangle([(px + 20, py + 105), (px + int((pw - 40) * (0.85 + i * 0.04)), py + 110)], radius=3, fill=col)
        
    # Academic Accreditation Badge at bottom
    draw.rounded_rectangle([(fx + 36, fy + fh - 65), (fx + fw - 36, fy + fh - 20)], radius=8, fill=(28, 16, 18, 220), outline=(255, 100, 50, 100), width=1)
    draw.text((fx + 56, fy + fh - 50), "ACCREDITED HIGHER ENGINEERING · ALGORITHMIC RIGOR · SYSTEM MODELING", font=get_font(11, True), fill=(255, 180, 120))
    
    return im.convert("RGB")

# -----------------------------------------------------------------------------
# 2023: Algorithms & Mobile (Data Structures · Swift & UIKit Basics · Mobile)
# -----------------------------------------------------------------------------
def make_2023():
    accent = (255, 90, 45)
    im = create_base_canvas(accent_color=accent)
    draw = ImageDraw.Draw(im)
    
    # Xcode Workspace Window
    xw, xh = 880, 580
    xx, xy = (W - xw) // 2, (H - xh) // 2 - 20
    
    # Shadow
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle([(xx - 15, xy - 10), (xx + xw + 15, xy + xh + 25)], radius=24, fill=(0, 0, 0, 200))
    shadow = shadow.filter(ImageFilter.GaussianBlur(25))
    im = Image.alpha_composite(im, shadow)
    
    draw = ImageDraw.Draw(im)
    draw.rounded_rectangle([(xx, xy), (xx + xw, xy + xh)], radius=18, fill=(18, 14, 18, 245), outline=(255, 90, 45, 140), width=2)
    
    # Xcode Header
    draw.rounded_rectangle([(xx, xy), (xx + xw, xy + 42)], radius=18, fill=(28, 20, 24, 255))
    draw.rectangle([(xx, xy + 24), (xx + xw, xy + 42)], fill=(28, 20, 24, 255))
    draw.text((xx + 24, xy + 12), "Xcode 15 — MobileAlgorithms.swift — Building Native iOS Foundations", font=get_font(13, True), fill=(255, 150, 90))
    
    # Left sidebar: Swift code
    code_text = [
        ("import UIKit", (255, 120, 100)),
        ("import Combine", (255, 120, 100)),
        ("", (0,0,0)),
        ("final class AlgorithmVisualizer: UIViewController {", (255, 220, 130)),
        ("    private let binaryTree = BinarySearchTree<Int>()", (220, 220, 235)),
        ("    private let hapticFeedback = UIImpactFeedbackGenerator()", (180, 210, 255)),
        ("", (0,0,0)),
        ("    override func viewDidLoad() {", (255, 150, 80)),
        ("        super.viewDidLoad()", (220, 220, 235)),
        ("        setupInteractiveCanvas()", (180, 210, 255)),
        ("        benchmarkAlgorithmComplexity()", (180, 210, 255)),
        ("    }", (220, 220, 235)),
        ("", (0,0,0)),
        ("    // O(log N) balanced tree insertion with 60 FPS animation", (120, 180, 130)),
        ("    func insert(_ val: Int) { binaryTree.insert(val) }", (255, 180, 100))
    ]
    
    cy = xy + 60
    f_code = get_font(14, bold=False)
    for t, col in code_lines if 'code_lines' in dir() else code_text:
        draw.text((xx + 30, cy), t, font=f_code, fill=col)
        cy += 26
        
    # Right panel: Visual Tree Graph simulator
    rx, ry = xx + 490, xy + 65
    rw, rh = 360, 480
    draw.rounded_rectangle([(rx, ry), (rx + rw, ry + rh)], radius=14, fill=(12, 10, 14, 255), outline=(255, 90, 45, 90), width=1)
    draw.text((rx + 20, ry + 16), "BINARY SEARCH TREE VISUALIZER", font=get_font(10, True), fill=(255, 140, 70))
    
    # Draw animated tree nodes
    nodes = [
        (rx + 180, ry + 80, "50", True),
        (rx + 100, ry + 160, "30", False),
        (rx + 260, ry + 160, "75", False),
        (rx + 60, ry + 240, "20", False),
        (rx + 140, ry + 240, "40", False),
        (rx + 220, ry + 240, "60", False),
        (rx + 300, ry + 240, "90", False)
    ]
    # Branches
    draw.line([(rx + 180, ry + 80), (rx + 100, ry + 160)], fill=(255, 90, 45, 120), width=2)
    draw.line([(rx + 180, ry + 80), (rx + 260, ry + 160)], fill=(255, 90, 45, 120), width=2)
    draw.line([(rx + 100, ry + 160), (rx + 60, ry + 240)], fill=(255, 90, 45, 100), width=2)
    draw.line([(rx + 100, ry + 160), (rx + 140, ry + 240)], fill=(255, 90, 45, 100), width=2)
    draw.line([(rx + 260, ry + 160), (rx + 220, ry + 240)], fill=(255, 90, 45, 100), width=2)
    draw.line([(rx + 260, ry + 160), (rx + 300, ry + 240)], fill=(255, 90, 45, 100), width=2)
    
    for nx, ny, val, root in nodes:
        rad = 22 if root else 18
        col = (255, 90, 45) if root else (255, 150, 70)
        draw.ellipse([(nx - rad, ny - rad), (nx + rad, ny + rad)], fill=(28, 16, 20), outline=col, width=2)
        draw.text((nx - 8, ny - 8), val, font=get_font(12, True), fill=(255, 255, 255))
        
    draw.rounded_rectangle([(rx + 20, ry + rh - 60), (rx + rw - 20, ry + rh - 18)], radius=8, fill=(28, 16, 20), outline=(255, 90, 45, 100), width=1)
    draw.text((rx + 35, ry + rh - 45), "Traversal: In-Order O(N) Verified", font=get_font(11, True), fill=(100, 230, 150))
    
    return im.convert("RGB")

# -----------------------------------------------------------------------------
# 2024: Full-Stack & QA (Selenium & Appium QA · Security Audits · Load Testing)
# -----------------------------------------------------------------------------
def make_2024():
    accent = (255, 75, 45)
    im = create_base_canvas(accent_color=accent)
    draw = ImageDraw.Draw(im)
    
    # QA Automation Console
    qw, qh = 880, 580
    qx, qy = (W - qw) // 2, (H - qh) // 2 - 20
    
    # Shadow
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle([(qx - 15, qy - 10), (qx + qw + 15, qy + qh + 25)], radius=24, fill=(0, 0, 0, 200))
    shadow = shadow.filter(ImageFilter.GaussianBlur(25))
    im = Image.alpha_composite(im, shadow)
    
    draw = ImageDraw.Draw(im)
    draw.rounded_rectangle([(qx, qy), (qx + qw, qy + qh)], radius=18, fill=(16, 12, 16, 245), outline=(255, 75, 45, 130), width=2)
    
    # Header
    draw.rounded_rectangle([(qx, qy), (qx + qw, qy + 42)], radius=18, fill=(26, 18, 22, 255))
    draw.rectangle([(qx, qy + 24), (qx + qw, qy + 42)], fill=(26, 18, 22, 255))
    draw.text((qx + 24, qy + 12), "AUTOMATED QUALITY ENGINEERING & MOBILE QA PIPELINE", font=get_font(13, True), fill=(255, 140, 90))
    
    # QA Pillars Grid
    test_cards = [
        ("APPIUM MOBILE AUTOMATION", "iOS XCUITest & Android UIAutomator2 · 100% Flow Pass", "99.8% PASS", (39, 201, 63)),
        ("SELENIUM WEB MATRIX", "Cross-Browser Regression · Headless CI Integration", "142 SUITES", (255, 160, 60)),
        ("HIGH-CONCURRENCY STRESS", "1,000+ Concurrent Virtual Users · Sub-120ms Latency", "1,000+ VU", (255, 80, 60)),
        ("OWASP SECURITY PENTEST", "CSRF · SQL Injection · Token Replay Immunity Verified", "PASSED", (100, 200, 255))
    ]
    
    for i, (title, sub, metric, col) in enumerate(test_cards):
        cx = qx + 36 + (i % 2) * 410
        cy = qy + 65 + (i // 2) * 170
        cw, ch = 380, 140
        draw.rounded_rectangle([(cx, cy), (cx + cw, cy + ch)], radius=12, fill=(24, 16, 20, 220), outline=(*col, 100), width=1)
        draw.text((cx + 20, cy + 20), title, font=get_font(12, True), fill=(255, 255, 255))
        draw.text((cx + 20, cy + 48), sub, font=get_font(11, False), fill=(180, 175, 185))
        
        # Pill status
        pw, ph = 110, 28
        draw.rounded_rectangle([(cx + 20, cy + 90), (cx + 20 + pw, cy + 90 + ph)], radius=6, fill=(*col, 35), outline=col, width=1)
        draw.text((cx + 30, cy + 96), metric, font=get_font(11, True), fill=col)
        
    # Telemetry stream at bottom
    draw.rounded_rectangle([(qx + 36, qy + qh - 65), (qx + qw - 36, qy + qh - 20)], radius=8, fill=(24, 14, 18), outline=(255, 75, 45, 90), width=1)
    draw.text((qx + 56, qy + qh - 50), "CI/CD BUILD #1408 · GITHUB ACTIONS RUNNER · ZERO DEFECT SHIP GATE", font=get_font(11, True), fill=(255, 160, 100))
    
    return im.convert("RGB")

# -----------------------------------------------------------------------------
# 2025: iOS Dev & Trainer (Full-Time in 2 Months · SwiftUI Architecture · Mentor)
# -----------------------------------------------------------------------------
def make_2025():
    accent = (255, 60, 45)
    im = create_base_canvas(accent_color=accent)
    draw = ImageDraw.Draw(im)
    
    # Modern SwiftUI Developer & Mentorship Canvas
    mw, mh = 880, 580
    mx, my = (W - mw) // 2, (H - mh) // 2 - 20
    
    # Shadow
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle([(mx - 15, my - 10), (mx + mw + 15, my + mh + 25)], radius=24, fill=(0, 0, 0, 200))
    shadow = shadow.filter(ImageFilter.GaussianBlur(25))
    im = Image.alpha_composite(im, shadow)
    
    draw = ImageDraw.Draw(im)
    draw.rounded_rectangle([(mx, my), (mx + mw, my + mh)], radius=18, fill=(18, 12, 16, 245), outline=(255, 60, 45, 140), width=2)
    
    # Header
    draw.rounded_rectangle([(mx, my), (mx + mw, my + 42)], radius=18, fill=(28, 18, 22, 255))
    draw.rectangle([(mx, my + 24), (mx + mw, my + 42)], fill=(28, 18, 22, 255))
    draw.text((mx + 24, my + 12), "FULL-TIME iOS DEVELOPER & TECHNICAL MENTOR — 2025", font=get_font(13, True), fill=(255, 140, 90))
    
    # Left: SwiftUI Declarative Architecture
    draw.rounded_rectangle([(mx + 30, my + 60), (mx + 460, my + mh - 30)], radius=12, fill=(12, 10, 14), outline=(255, 60, 45, 90), width=1)
    draw.text((mx + 50, my + 78), "SWIFTUI 6.0 ARCHITECTURE & WORKFLOW", font=get_font(11, True), fill=(255, 120, 80))
    
    swift_code = [
        ("@Observable", (255, 100, 80)),
        ("final class PatientTelemetryVM {", (255, 200, 110)),
        ("    var adherenceRate: Double = 0.94", (220, 220, 235)),
        ("    var recoveryMilestone: Int = 4", (220, 220, 235)),
        ("", (0,0,0)),
        ("    // 120Hz ProMotion Animation Flow", (120, 180, 130)),
        ("    func triggerRecoveryPulse() {", (255, 150, 80)),
        ("        withAnimation(.snappy(duration: 0.35)) {", (255, 180, 100)),
        ("            adherenceRate = min(1.0, adherenceRate + 0.05)", (180, 210, 255)),
        ("        }", (220, 220, 235)),
        ("    }", (220, 220, 235)),
        ("}", (220, 220, 235))
    ]
    cy = my + 115
    for t, col in swift_code:
        draw.text((mx + 50, cy), t, font=get_font(13, False), fill=col)
        cy += 25
        
    # Right: Mentorship & Full-Time Achievements
    rx, ry = mx + 480, my + 60
    rw, rh = 370, mh - 90
    draw.rounded_rectangle([(rx, ry), (rx + rw, ry + rh)], radius=12, fill=(24, 16, 20), outline=(255, 60, 45, 100), width=1)
    draw.text((rx + 24, ry + 22), "CAREER & MENTORSHIP IMPACT", font=get_font(12, True), fill=(255, 255, 255))
    
    impacts = [
        ("Rapid Promotion", "Hired Full-Time in 2 Months after showcasing high-velocity production apps."),
        ("Engineering Mentor", "Trained and mentored junior engineers across Swift, MVVM, and clean code."),
        ("Modern Stack", "Architected SwiftUI declarative pipelines replacing legacy UIKit patterns.")
    ]
    
    iy = ry + 65
    for title, desc in impacts:
        draw.rounded_rectangle([(rx + 20, iy), (rx + rw - 20, iy + 85)], radius=8, fill=(32, 20, 24), outline=(255, 80, 60, 60), width=1)
        draw.text((rx + 34, iy + 14), title, font=get_font(12, True), fill=(255, 140, 80))
        draw.text((rx + 34, iy + 38), desc[:48], font=get_font(10.5, False), fill=(190, 185, 195))
        draw.text((rx + 34, iy + 56), desc[48:], font=get_font(10.5, False), fill=(190, 185, 195))
        iy += 100
        
    return im.convert("RGB")

# -----------------------------------------------------------------------------
# 2026: Production & AI (App Store Shipping · CoreML On-Device · Mentoring 100+)
# -----------------------------------------------------------------------------
def make_2026():
    accent = (255, 50, 40)
    im = create_base_canvas(accent_color=accent)
    draw = ImageDraw.Draw(im)
    
    # Apple App Store Shipping Showcase
    sw, sh = 880, 580
    sx, sy = (W - sw) // 2, (H - sh) // 2 - 20
    
    # Shadow
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle([(sx - 15, sy - 10), (sx + sw + 15, sy + sh + 25)], radius=24, fill=(0, 0, 0, 200))
    shadow = shadow.filter(ImageFilter.GaussianBlur(25))
    im = Image.alpha_composite(im, shadow)
    
    draw = ImageDraw.Draw(im)
    draw.rounded_rectangle([(sx, sy), (sx + sw, sy + sh)], radius=18, fill=(18, 10, 14, 250), outline=(255, 50, 40, 150), width=2)
    
    # Header
    draw.rounded_rectangle([(sx, sy), (sx + sw, sy + 42)], radius=18, fill=(28, 14, 18, 255))
    draw.rectangle([(sx, sy + 24), (sx + sw, sy + 42)], fill=(28, 14, 18, 255))
    draw.text((sx + 24, sy + 12), "APPLE APP STORE DEPLOYMENTS · 2026 PRODUCTION APPS", font=get_font(13, True), fill=(255, 130, 80))
    
    # Two Live App Cards: RecovFit and Smart Ulcer Predictor
    # 1. RecovFit
    rx, ry = sx + 36, sy + 65
    rw, rh = 380, 420
    draw.rounded_rectangle([(rx, ry), (rx + rw, ry + rh)], radius=14, fill=(26, 14, 18), outline=(255, 60, 45, 120), width=1)
    
    # RecovFit Icon
    recov_icon_path = "public/projects/recovfit/icon.jpg"
    if os.path.exists(recov_icon_path):
        icon = Image.open(recov_icon_path).resize((72, 72), Image.Resampling.LANCZOS)
        imask = draw_squircle_mask((72, 72), 18)
        icon.putalpha(imask)
        im.paste(icon, (rx + 24, ry + 24), icon)
        draw = ImageDraw.Draw(im)
        draw.rounded_rectangle([(rx + 23, ry + 23), (rx + 97, ry + 97)], radius=19, outline=(255, 255, 255, 140), width=1)
        
    draw.text((rx + 115, ry + 32), "RecovFit", font=get_font(20, True), fill=(255, 255, 255))
    draw.text((rx + 115, ry + 60), "LIVE ON APP STORE ", font=get_font(11, True), fill=(48, 209, 88))
    
    draw.text((rx + 24, ry + 120), "Patient Recovery & Clinical Fitness", font=get_font(13, True), fill=(255, 100, 80))
    draw.text((rx + 24, ry + 148), "Dual-portal patient & doctor iOS ecosystem.", font=get_font(11, False), fill=(200, 190, 195))
    draw.text((rx + 24, ry + 168), "WebRTC video calls · AI Clinical Chatbot.", font=get_font(11, False), fill=(200, 190, 195))
    draw.text((rx + 24, ry + 188), "Official SIMATS Healthcare Release.", font=get_font(11, False), fill=(200, 190, 195))
    
    # App Store ID badge
    draw.rounded_rectangle([(rx + 24, ry + 230), (rx + rw - 24, ry + 270)], radius=8, fill=(35, 18, 22), outline=(255, 60, 45, 100), width=1)
    draw.text((rx + 38, ry + 244), "App ID: 6753745934 · Swift 6.0", font=get_font(11, True), fill=(255, 170, 110))
    
    # Metric
    draw.rounded_rectangle([(rx + 24, ry + 290), (rx + rw - 24, ry + 380)], radius=8, fill=(18, 10, 14), outline=(48, 209, 88, 80), width=1)
    draw.text((rx + 38, ry + 308), "STATUS: VERIFIED ON APPLE APP STORE", font=get_font(10.5, True), fill=(48, 209, 88))
    draw.text((rx + 38, ry + 332), "Platform: iOS & iPadOS · 120Hz ProMotion", font=get_font(10.5, False), fill=(180, 175, 185))
    draw.text((rx + 38, ry + 352), "Category: Medical & Clinical Health", font=get_font(10.5, False), fill=(180, 175, 185))
    
    # 2. Smart Ulcer Predictor
    ux, uy = sx + 460, sy + 65
    uw, uh = 380, 420
    draw.rounded_rectangle([(ux, uy), (ux + uw, uy + uh)], radius=14, fill=(26, 12, 18), outline=(255, 50, 75, 120), width=1)
    
    # Smart Ulcer Icon
    ulcer_icon_path = "public/projects/smart_ulcer/icon.jpg"
    if os.path.exists(ulcer_icon_path):
        icon = Image.open(ulcer_icon_path).resize((72, 72), Image.Resampling.LANCZOS)
        imask = draw_squircle_mask((72, 72), 18)
        icon.putalpha(imask)
        im.paste(icon, (ux + 24, uy + 24), icon)
        draw = ImageDraw.Draw(im)
        draw.rounded_rectangle([(ux + 23, uy + 23), (ux + 97, uy + 97)], radius=19, outline=(255, 255, 255, 140), width=1)
        
    draw.text((ux + 115, uy + 32), "Smart Ulcer", font=get_font(20, True), fill=(255, 255, 255))
    draw.text((ux + 115, uy + 60), "LIVE ON APP STORE ", font=get_font(11, True), fill=(48, 209, 88))
    
    draw.text((ux + 24, uy + 120), "AI Wound Diagnostic Support Tool", font=get_font(13, True), fill=(255, 80, 110))
    draw.text((ux + 24, uy + 148), "Point-of-care computer vision inference.", font=get_font(11, False), fill=(200, 190, 195))
    draw.text((ux + 24, uy + 168), "Instant predictions: Healing / Not Healing.", font=get_font(11, False), fill=(200, 190, 195))
    draw.text((ux + 24, uy + 188), "Vision Framework + CoreML Engine.", font=get_font(11, False), fill=(200, 190, 195))
    
    # App Store ID badge
    draw.rounded_rectangle([(ux + 24, uy + 230), (ux + uw - 24, uy + 270)], radius=8, fill=(35, 16, 22), outline=(255, 50, 75, 100), width=1)
    draw.text((ux + 38, uy + 244), "App ID: 6755873140 · Vision + CoreML", font=get_font(11, True), fill=(255, 150, 140))
    
    # Metric
    draw.rounded_rectangle([(ux + 24, uy + 290), (ux + uw - 24, uy + 380)], radius=8, fill=(18, 10, 14), outline=(48, 209, 88, 80), width=1)
    draw.text((ux + 38, ry + 308), "STATUS: VERIFIED ON APPLE APP STORE", font=get_font(10.5, True), fill=(48, 209, 88))
    draw.text((ux + 38, ry + 332), "Inference: Deep Neural Network Classifier", font=get_font(10.5, False), fill=(180, 175, 185))
    draw.text((ux + 38, ry + 352), "Category: Medical AI & Computer Vision", font=get_font(10.5, False), fill=(180, 175, 185))
    
    # Bottom Milestone Banner
    draw.rounded_rectangle([(sx + 36, sy + sh - 60), (sx + sw - 36, sy + sh - 18)], radius=8, fill=(28, 14, 18), outline=(255, 50, 40, 120), width=1)
    draw.text((sx + 56, sy + sh - 44), "2026 // SHIPPING PRODUCTION CODE WORLDWIDE · COREML ACCELERATED · 100+ DEVS MENTORED", font=get_font(11, True), fill=(255, 180, 110))
    
    return im.convert("RGB")

if __name__ == '__main__':
    os.makedirs('public/years', exist_ok=True)
    
    im_2021 = make_2021()
    im_2021.save('public/years/2021.jpg', quality=95)
    print("Generated 2021.jpg:", im_2021.size)
    
    im_2022 = make_2022()
    im_2022.save('public/years/2022.jpg', quality=95)
    print("Generated 2022.jpg:", im_2022.size)
    
    im_2023 = make_2023()
    im_2023.save('public/years/2023.jpg', quality=95)
    print("Generated 2023.jpg:", im_2023.size)
    
    im_2024 = make_2024()
    im_2024.save('public/years/2024.jpg', quality=95)
    print("Generated 2024.jpg:", im_2024.size)
    
    im_2025 = make_2025()
    im_2025.save('public/years/2025.jpg', quality=95)
    print("Generated 2025.jpg:", im_2025.size)
    
    im_2026 = make_2026()
    im_2026.save('public/years/2026.jpg', quality=95)
    print("Generated 2026.jpg:", im_2026.size)
    print("All 6 journey cards successfully generated at 1200x900!")
