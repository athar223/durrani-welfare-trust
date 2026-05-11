"""Generate application icon from logo image."""
import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Installing Pillow...")
    os.system(f"{sys.executable} -m pip install Pillow")
    from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
logo_path = os.path.join(BASE_DIR, "static", "img", "logo", "logo.png")
ico_path = os.path.join(BASE_DIR, "static", "img", "logo", "app_icon.ico")

if os.path.exists(logo_path):
    print(f"Converting {logo_path} to .ico ...")
    img = Image.open(logo_path)
    # Convert to RGBA if needed
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    # Create multiple icon sizes for best quality
    sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    icons = []
    for size in sizes:
        resized = img.resize(size, Image.LANCZOS)
        icons.append(resized)
    # Save as .ico with multiple sizes
    icons[0].save(ico_path, format='ICO', sizes=[s for s in sizes], append_images=icons[1:])
    print(f"Icon created: {ico_path}")
else:
    # Create a simple DWT icon if no logo exists
    print("Logo not found. Creating a simple icon...")
    sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    icons = []
    for size in sizes:
        img = Image.new('RGBA', size, (26, 107, 60, 255))  # DWT green
        draw = ImageDraw.Draw(img)
        # Draw a simple "D" letter
        font_size = size[0] // 2
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except OSError:
            font = ImageFont.load_default()
        text = "D"
        bbox = draw.textbbox((0, 0), text, font=font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        x = (size[0] - tw) // 2
        y = (size[1] - th) // 2
        draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)
        icons.append(img)
    icons[0].save(ico_path, format='ICO', sizes=[s for s in sizes], append_images=icons[1:])
    print(f"Icon created: {ico_path}")
