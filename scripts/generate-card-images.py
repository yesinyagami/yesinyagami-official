#!/usr/bin/env python3
"""
Generate placeholder tarot card images for Night God Tarot
Creates beautiful gradient cards with card names and symbols
"""

import os
from PIL import Image, ImageDraw, ImageFont
import colorsys

# Card dimensions
CARD_WIDTH = 300
CARD_HEIGHT = 450

# Directory setup
OUTPUT_DIR = "public/assets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_gradient(width, height, color1, color2):
    """Create a gradient image"""
    base = Image.new('RGB', (width, height), color1)
    top = Image.new('RGB', (width, height), color2)
    mask = Image.new('L', (width, height))
    mask_data = []
    for y in range(height):
        mask_data.extend([int(255 * y / height)] * width)
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base

def get_card_color(card_type, index):
    """Get color scheme for card type"""
    if card_type == "major":
        hue = (index * 16) % 360
        color1 = tuple(int(c * 255) for c in colorsys.hsv_to_rgb(hue/360, 0.7, 0.4))
        color2 = tuple(int(c * 255) for c in colorsys.hsv_to_rgb((hue+30)/360, 0.5, 0.6))
    elif card_type == "wands":
        color1 = (150, 50, 0)
        color2 = (255, 150, 50)
    elif card_type == "cups":
        color1 = (0, 50, 150)
        color2 = (50, 150, 255)
    elif card_type == "swords":
        color1 = (100, 100, 150)
        color2 = (200, 200, 255)
    elif card_type == "pentacles":
        color1 = (0, 100, 0)
        color2 = (150, 200, 50)
    else:  # hidden
        color1 = (75, 0, 130)
        color2 = (138, 43, 226)
    return color1, color2

def get_card_symbol(card_type):
    """Get Unicode symbol for card type"""
    symbols = {
        "major": "✨",
        "wands": "🔥",
        "cups": "💧",
        "swords": "⚔️",
        "pentacles": "💰",
        "hidden": "🔮"
    }
    return symbols.get(card_type, "🃏")

def create_card(number, name, card_type):
    """Create a single tarot card image"""
    # Get colors
    color1, color2 = get_card_color(card_type, number)
    
    # Create gradient background
    img = create_gradient(CARD_WIDTH, CARD_HEIGHT, color1, color2)
    
    # Add border
    draw = ImageDraw.Draw(img)
    draw.rectangle([5, 5, CARD_WIDTH-5, CARD_HEIGHT-5], outline=(255, 215, 0), width=3)
    
    # Try to use a font, fallback to default if not available
    try:
        title_font = ImageFont.truetype("arial.ttf", 24)
        number_font = ImageFont.truetype("arial.ttf", 18)
        symbol_font = ImageFont.truetype("arial.ttf", 48)
    except:
        # Use default font if TrueType fonts aren't available
        title_font = ImageFont.load_default()
        number_font = ImageFont.load_default()
        symbol_font = ImageFont.load_default()
    
    # Add card number
    number_text = str(number).zfill(2)
    draw.text((20, 20), number_text, fill=(255, 215, 0), font=number_font)
    draw.text((CARD_WIDTH-40, 20), number_text, fill=(255, 215, 0), font=number_font)
    
    # Add card name (wrap if needed)
    name_lines = name.split(' ')
    if len(name_lines) > 2:
        # Split into two lines for long names
        mid = len(name_lines) // 2
        line1 = ' '.join(name_lines[:mid])
        line2 = ' '.join(name_lines[mid:])
        draw.text((CARD_WIDTH//2, CARD_HEIGHT-80), line1, fill=(255, 255, 255), 
                 font=title_font, anchor="mm")
        draw.text((CARD_WIDTH//2, CARD_HEIGHT-50), line2, fill=(255, 255, 255), 
                 font=title_font, anchor="mm")
    else:
        draw.text((CARD_WIDTH//2, CARD_HEIGHT-50), name, fill=(255, 255, 255), 
                 font=title_font, anchor="mm")
    
    # Add central symbol (text representation since emoji won't render in PIL)
    symbol_text = {
        "major": "MAJOR",
        "wands": "WANDS",
        "cups": "CUPS", 
        "swords": "SWORDS",
        "pentacles": "COINS",
        "hidden": "HIDDEN"
    }.get(card_type, "TAROT")
    
    draw.text((CARD_WIDTH//2, CARD_HEIGHT//2), symbol_text, fill=(255, 215, 0, 128), 
             font=symbol_font, anchor="mm")
    
    # Add decorative corners
    corner_size = 30
    draw.line([(10, 10), (10, 10+corner_size)], fill=(255, 215, 0), width=2)
    draw.line([(10, 10), (10+corner_size, 10)], fill=(255, 215, 0), width=2)
    draw.line([(CARD_WIDTH-10, 10), (CARD_WIDTH-10, 10+corner_size)], fill=(255, 215, 0), width=2)
    draw.line([(CARD_WIDTH-10, 10), (CARD_WIDTH-10-corner_size, 10)], fill=(255, 215, 0), width=2)
    draw.line([(10, CARD_HEIGHT-10), (10, CARD_HEIGHT-10-corner_size)], fill=(255, 215, 0), width=2)
    draw.line([(10, CARD_HEIGHT-10), (10+corner_size, CARD_HEIGHT-10)], fill=(255, 215, 0), width=2)
    draw.line([(CARD_WIDTH-10, CARD_HEIGHT-10), (CARD_WIDTH-10, CARD_HEIGHT-10-corner_size)], fill=(255, 215, 0), width=2)
    draw.line([(CARD_WIDTH-10, CARD_HEIGHT-10), (CARD_WIDTH-10-corner_size, CARD_HEIGHT-10)], fill=(255, 215, 0), width=2)
    
    return img

# Generate all cards
cards_data = [
    # Major Arcana (1-22)
    (1, "The Fool", "major"),
    (2, "The Magician", "major"),
    (3, "The High Priestess", "major"),
    (4, "The Empress", "major"),
    (5, "The Emperor", "major"),
    (6, "The Hierophant", "major"),
    (7, "The Lovers", "major"),
    (8, "The Chariot", "major"),
    (9, "Strength", "major"),
    (10, "The Hermit", "major"),
    (11, "Wheel of Fortune", "major"),
    (12, "Justice", "major"),
    (13, "The Hanged Man", "major"),
    (14, "Death", "major"),
    (15, "Temperance", "major"),
    (16, "The Devil", "major"),
    (17, "The Tower", "major"),
    (18, "The Star", "major"),
    (19, "The Moon", "major"),
    (20, "The Sun", "major"),
    (21, "Judgement", "major"),
    (22, "The World", "major"),
    
    # Wands (23-36)
    (23, "Ace of Wands", "wands"),
    (24, "Two of Wands", "wands"),
    (25, "Three of Wands", "wands"),
    (26, "Four of Wands", "wands"),
    (27, "Five of Wands", "wands"),
    (28, "Six of Wands", "wands"),
    (29, "Seven of Wands", "wands"),
    (30, "Eight of Wands", "wands"),
    (31, "Nine of Wands", "wands"),
    (32, "Ten of Wands", "wands"),
    (33, "Page of Wands", "wands"),
    (34, "Knight of Wands", "wands"),
    (35, "Queen of Wands", "wands"),
    (36, "King of Wands", "wands"),
    
    # Cups (37-50)
    (37, "Ace of Cups", "cups"),
    (38, "Two of Cups", "cups"),
    (39, "Three of Cups", "cups"),
    (40, "Four of Cups", "cups"),
    (41, "Five of Cups", "cups"),
    (42, "Six of Cups", "cups"),
    (43, "Seven of Cups", "cups"),
    (44, "Eight of Cups", "cups"),
    (45, "Nine of Cups", "cups"),
    (46, "Ten of Cups", "cups"),
    (47, "Page of Cups", "cups"),
    (48, "Knight of Cups", "cups"),
    (49, "Queen of Cups", "cups"),
    (50, "King of Cups", "cups"),
    
    # Swords (51-64)
    (51, "Ace of Swords", "swords"),
    (52, "Two of Swords", "swords"),
    (53, "Three of Swords", "swords"),
    (54, "Four of Swords", "swords"),
    (55, "Five of Swords", "swords"),
    (56, "Six of Swords", "swords"),
    (57, "Seven of Swords", "swords"),
    (58, "Eight of Swords", "swords"),
    (59, "Nine of Swords", "swords"),
    (60, "Ten of Swords", "swords"),
    (61, "Page of Swords", "swords"),
    (62, "Knight of Swords", "swords"),
    (63, "Queen of Swords", "swords"),
    (64, "King of Swords", "swords"),
    
    # Pentacles (65-78)
    (65, "Ace of Pentacles", "pentacles"),
    (66, "Two of Pentacles", "pentacles"),
    (67, "Three of Pentacles", "pentacles"),
    (68, "Four of Pentacles", "pentacles"),
    (69, "Five of Pentacles", "pentacles"),
    (70, "Six of Pentacles", "pentacles"),
    (71, "Seven of Pentacles", "pentacles"),
    (72, "Eight of Pentacles", "pentacles"),
    (73, "Nine of Pentacles", "pentacles"),
    (74, "Ten of Pentacles", "pentacles"),
    (75, "Page of Pentacles", "pentacles"),
    (76, "Knight of Pentacles", "pentacles"),
    (77, "Queen of Pentacles", "pentacles"),
    (78, "King of Pentacles", "pentacles"),
    
    # Hidden Cards (79-94)
    (79, "The Hidden Oracle", "hidden"),
    (80, "The Shadow Guide", "hidden"),
    (81, "The Light Bearer", "hidden"),
    (82, "The Dream Walker", "hidden"),
    (83, "The Soul Mirror", "hidden"),
    (84, "The Time Keeper", "hidden"),
    (85, "The Fate Weaver", "hidden"),
    (86, "The Spirit Guardian", "hidden"),
    (87, "The Mystic Vision", "hidden"),
    (88, "The Sacred Journey", "hidden"),
    (89, "The Inner Truth", "hidden"),
    (90, "The Cosmic Balance", "hidden"),
    (91, "The Divine Messenger", "hidden"),
    (92, "The Eternal Flame", "hidden"),
    (93, "The Wisdom Keeper", "hidden"),
    (94, "The Heart's Desire", "hidden"),
]

print("Generating Night God Tarot card images...")
print(f"Output directory: {OUTPUT_DIR}")

for number, name, card_type in cards_data:
    filename = f"{str(number).zfill(2)}_{name.replace(' ', '_')}.png"
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    print(f"Creating card {number}: {name}...")
    card_img = create_card(number, name, card_type)
    card_img.save(filepath, "PNG")

print(f"Successfully generated {len(cards_data)} tarot card images!")
print("Night God Tarot card deck is complete!")