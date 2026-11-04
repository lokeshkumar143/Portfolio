#!/usr/bin/env python3
"""
tools/build_perfect_finale.py
Rebuilds public/fin/plate.jpg and public/fin/man.png with studio-grade fidelity:
1. Eliminates all remnant letter cutouts, ghost blocks, and inpainting artifacts
2. Generates a seamless, organic volcanic crimson furnace atmosphere
3. Renders monolithic architectural 'L O K E S H' typography with authentic gradient and grunge
4. Defringes hair edges on Lokesh in public/fin/man.png to remove all studio halos
"""

import os
import subprocess
import io
import numpy as np
from PIL import Image, ImageFont, ImageDraw, ImageFilter

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(REPO_ROOT, "public", "fin")
os.makedirs(OUT_DIR, exist_ok=True)

# 1. Retrieve the clean reference base plate from git fde7de3
print("1. Extracting clean original reference plate...")
try:
    p = subprocess.run(
        ["git", "show", "fde7de3:public/fin/plate.jpg"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        cwd=REPO_ROOT,
        check=True
    )
    base_plate = Image.open(io.BytesIO(p.stdout)).convert("RGB")
except Exception as e:
    print(f"Fallback to /tmp/old_plate.jpg: {e}")
    base_plate = Image.open("/tmp/old_plate.jpg").convert("RGB")

arr = np.array(base_plate).astype(np.float32)
H, W = arr.shape[:2]

# Load grunge texture
grunge_path = os.path.join(REPO_ROOT, "public", "tex", "grunge.png")
grunge_raw = np.array(Image.open(grunge_path)).astype(np.float32) / 255.0
tile_y = int(np.ceil(H / grunge_raw.shape[0]))
tile_x = int(np.ceil(W / grunge_raw.shape[1]))
grunge = np.tile(grunge_raw, (tile_y, tile_x))[:H, :W]

print("2. Synthesizing seamless volcanic crimson furnace atmosphere...")
# Wordmark zone to completely erase and reconstruct
x0, x1 = 260, 1340
y0, y1 = 25, 785
bw = x1 - x0
bh = y1 - y0

# Coons patch from authentic surrounding boundaries
top_edge = arr[y0-1, x0:x1]
bot_edge = arr[y1+1, x0:x1]
left_edge = arr[y0:y1, x0-1]
right_edge = arr[y0:y1, x1+1]

u = np.linspace(0, 1, bw, dtype=np.float32)[None, :, None]
v = np.linspace(0, 1, bh, dtype=np.float32)[:, None, None]

c00 = arr[y0-1, x0-1]
c10 = arr[y0-1, x1+1]
c01 = arr[y1+1, x0-1]
c11 = arr[y1+1, x1+1]

r_top_bot = (1.0 - v) * top_edge[None, :, :] + v * bot_edge[None, :, :]
r_left_right = (1.0 - u) * left_edge[:, None, :] + u * right_edge[:, None, :]
corners = (1.0 - u) * (1.0 - v) * c00 + u * (1.0 - v) * c10 + (1.0 - u) * v * c01 + u * v * c11
coons = r_top_bot + r_left_right - corners

# Epic volcanic furnace glow field centered in upper-middle
cx, cy = 0.50, 0.42
sigma_x, sigma_y = 0.36, 0.40
dist_sq = ((u - cx) / sigma_x)**2 + ((v - cy) / sigma_y)**2
furnace_glow = np.exp(-0.5 * dist_sq)
furnace_color = np.array([138.0, 9.0, 7.0], dtype=np.float32)

patch_grunge = grunge[y0:y1, x0:x1, None]
rng = np.random.default_rng(2026)
patch_noise = rng.normal(0, 2.0, (bh, bw, 3)).astype(np.float32)

# Blend coons with furnace glow
bg_box = np.maximum(coons, furnace_glow * furnace_color)
bg_box = np.clip(bg_box * (0.88 + 0.24 * patch_grunge) + patch_noise, 0, 255)

# Smooth cosine boundary feather (24px) for perfect continuity
feather = 24
fx = np.ones((1, bw, 1), dtype=np.float32)
fy = np.ones((bh, 1, 1), dtype=np.float32)

fx[0, :feather, 0] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, feather))
fx[0, -feather:, 0] = 0.5 - 0.5 * np.cos(np.linspace(np.pi, 0, feather))
fy[:feather, 0, 0] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, feather))
fy[-feather:, 0, 0] = 0.5 - 0.5 * np.cos(np.linspace(np.pi, 0, feather))
box_weight = fx * fy

clean_bg = arr.copy()
clean_bg[y0:y1, x0:x1] = clean_bg[y0:y1, x0:x1] * (1.0 - box_weight) + bg_box * box_weight

print("3. Rendering monolithic architectural LOKESH typography...")
font_path = os.path.join(REPO_ROOT, "public", "fonts", "anton-400.woff2")
font = ImageFont.truetype(font_path, 800)
letters = ['L', 'O', 'K', 'E', 'S', 'H']
target_w = [144, 180, 178, 152, 172, 186]
target_h = 718
gap = 13
top_y = 42
total_w = sum(target_w) + gap * (len(letters) - 1)
start_x = 800 - total_w // 2

text_mask = np.zeros((H, W), dtype=np.float32)
curr_x = start_x

for ch, tw in zip(letters, target_w):
    bbox = font.getbbox(ch)
    nat_w = bbox[2] - bbox[0]
    nat_h = bbox[3] - bbox[1]
    char_im = Image.new('L', (nat_w + 40, nat_h + 40), 0)
    draw = ImageDraw.Draw(char_im)
    draw.text((20 - bbox[0], 20 - bbox[1]), ch, font=font, fill=255)
    char_scaled = char_im.crop((20, 20, 20 + nat_w, 20 + nat_h)).resize((tw, target_h), Image.Resampling.LANCZOS)
    c_arr = np.array(char_scaled).astype(np.float32) / 255.0
    text_mask[top_y:top_y+target_h, curr_x:curr_x+tw] = np.maximum(
        text_mask[top_y:top_y+target_h, curr_x:curr_x+tw], c_arr
    )
    curr_x += tw + gap

# Film-soft edge antialiasing
text_mask_im = Image.fromarray((text_mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.85))
text_mask = np.array(text_mask_im).astype(np.float32) / 255.0

# Smooth dissolution at bottom of letters (y in [630, 760]) so letters naturally melt into furnace smoke
y_grid = np.arange(H)[:, None]
bottom_melt = np.ones((H, 1), dtype=np.float32)
melt_mask = (y_grid >= 630).squeeze()
melt_t = np.clip((y_grid[melt_mask, 0] - 630.0) / (760.0 - 630.0), 0.0, 1.0)
bottom_melt[melt_mask, 0] = (0.5 + 0.5 * np.cos(melt_t * np.pi)) ** 1.3
text_mask *= bottom_melt

# Vertical color gradient matching reference artwork
grad_stops = [
    (0.00, np.array([254.0, 246.0, 240.0])),
    (0.12, np.array([252.0, 235.0, 225.0])),
    (0.28, np.array([244.0, 192.0, 170.0])),
    (0.48, np.array([220.0, 120.0,  95.0])),
    (0.68, np.array([182.0,  50.0,  35.0])),
    (0.84, np.array([125.0,  18.0,  12.0])),
    (0.95, np.array([ 70.0,   6.0,   4.0])),
    (1.00, np.array([ 35.0,   2.0,   1.0])),
]

letter_color = np.zeros((target_h, 3), dtype=np.float32)
for i in range(target_h):
    yf = i / (target_h - 1)
    for k in range(len(grad_stops) - 1):
        y_a, c_a = grad_stops[k]
        y_b, c_b = grad_stops[k+1]
        if y_a <= yf <= y_b:
            t = (yf - y_a) / (y_b - y_a)
            letter_color[i] = c_a * (1 - t) + c_b * t
            break

color_plate = np.zeros((H, W, 3), dtype=np.float32)
color_plate[top_y:top_y+target_h, :] = letter_color[:, None, :]

# Tactile grunge texture modulation
grunge_mod = 0.82 + 0.36 * grunge[..., None]
color_plate = np.clip(color_plate * grunge_mod, 0, 255)

# Outer fiery crimson bloom glow
bloom_mask = np.array(Image.fromarray((text_mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(14))).astype(np.float32) / 255.0
glow_color = np.array([220.0, 24.0, 14.0])
glow_layer = bloom_mask[..., None] * glow_color * 0.40

tm = text_mask[..., None]
final_plate = clean_bg * (1.0 - tm) + color_plate * tm + glow_layer * (1.0 - tm)
final_plate = np.clip(final_plate, 0, 255).astype(np.uint8)

plate_out = os.path.join(OUT_DIR, "plate.jpg")
Image.fromarray(final_plate).save(plate_out, quality=95)
print(f"Saved pristine plate: {plate_out}")

print("4. Defringing and perfecting Lokesh cutout in public/fin/man.png...")
man_path = os.path.join(OUT_DIR, "man.png")
man_im = Image.open(man_path)
arr_man = np.array(man_im).astype(np.float32)
mh, mw = arr_man.shape[:2]

# Defringe hair perimeter (y: 20..220, x: 90..360)
hair_mask = np.zeros((mh, mw), dtype=bool)
hair_mask[20:220, 90:360] = True

a = arr_man[:, :, 3] / 255.0
r, g, b = arr_man[:, :, 0], arr_man[:, :, 1], arr_man[:, :, 2]

# Detect neutral studio grey fringe on hair
grey_fringe = hair_mask & (a > 0.05) & (a < 0.92) & (np.abs(r - g) < 20) & (np.abs(g - b) < 20) & (r > 60)
hair_tone = np.array([28.0, 22.0, 20.0])
arr_man[grey_fringe, :3] = hair_tone[None, :] * (0.6 + 0.4 * (r[grey_fringe, None] / 150.0))

# Clean hair alpha choke to remove very faint translucent edge vapor
hair_alpha_choke = hair_mask & (a < 0.16)
arr_man[hair_alpha_choke, 3] *= 0.15

# Silky-smooth torso dissolution from row 460 down to 720
y_idx = np.arange(mh)[:, None]
torso_fade = np.ones((mh, 1), dtype=np.float32)
f_mask = (y_idx >= 460).squeeze()
t_f = np.clip((y_idx[f_mask, 0] - 460.0) / (720.0 - 460.0), 0.0, 1.0)
torso_fade[f_mask, 0] = (0.5 + 0.5 * np.cos(t_f * np.pi)) ** 1.4

# Gentle side feathering below row 440
side_fade = np.ones((mh, mw), dtype=np.float32)
for y in range(440, mh):
    yw = min(1.0, (y - 440) / 120.0)
    w_edge = int(45 * yw)
    if w_edge > 0:
        fade_curve = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, w_edge))
        side_fade[y, :w_edge] *= fade_curve
        side_fade[y, -w_edge:] *= fade_curve[::-1]

arr_man[:, :, 3] = np.clip(arr_man[:, :, 3] * torso_fade * side_fade, 0, 255)

# Keep lower suit pixels clean deep charcoal/black
bottom_suit = (y_idx >= 500).squeeze()
arr_man[bottom_suit, :3] = np.minimum(arr_man[bottom_suit, :3], 32.0)

cleaned_man = np.clip(arr_man, 0, 255).astype(np.uint8)
Image.fromarray(cleaned_man).save(man_path)
print(f"Saved pristine man cutout: {man_path}")
print("=== Rebuild complete! ===")

