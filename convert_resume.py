
"""
Simple script to convert resume image to PDF
Usage: python3 convert_resume.py
"""

from PIL import Image
import os
import sys

def convert_image_to_pdf():
    """Convert resume image files to PDF"""
    
    # Check for common image formats
    image_extensions = ['.jpg', '.jpeg', '.png', '.bmp']
    image_file = None
    
    # Look for resume image files
    for ext in image_extensions:
        for filename in os.listdir('.'):
            if filename.lower().startswith('resume') and filename.lower().endswith(ext):
                image_file = filename
                break
        if image_file:
            break
    
    if not image_file:
        print("❌ No resume image found!")
        print("Please place a resume image (resume.jpg, resume.png, etc.) in this folder")
        return False
    
    try:
        print(f"📸 Found: {image_file}")
        print(f"🔄 Converting to PDF...")
        
        # Open image and convert to RGB (for PNG with transparency)
        img = Image.open(image_file)
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Save as PDF
        img.save('resume.pdf', 'PDF', quality=95)
        
        print(f"✅ Success! Created: resume.pdf")
        print(f"📦 File size: {os.path.getsize('resume.pdf') / 1024:.2f} KB")
        print(f"✨ Your resume is now ready for download!")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == '__main__':
    convert_image_to_pdf()
