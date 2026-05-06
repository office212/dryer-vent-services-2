from PIL import Image
import os

# סריקה של כל התיקייה הנוכחית וכל תתי-התיקיות שלה
root_dir = '.'
MAX_SIZE = 1920

for dirpath, dirnames, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            filepath = os.path.join(dirpath, filename)
            try:
                # בדיקה: אם הקובץ כבר קל מ-300KB, תדלג עליו
                if os.path.getsize(filepath) < 300000:
                    continue
                    
                img = Image.open(filepath)
                
                # המרה כדי למנוע שגיאות בצבעים
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                    
                # אם התמונה ענקית פיזית, נקטין אותה לפרופורציות הגיוניות של מסך
                if img.width > MAX_SIZE or img.height > MAX_SIZE:
                    img.thumbnail((MAX_SIZE, MAX_SIZE), Image.Resampling.LANCZOS)
                    
                # דחיסה ושמירה (דורס את הקובץ הקיים)
                img.save(filepath, optimize=True, quality=75)
                print(f"BOOM! Compressed & Resized: {filepath}")
            except Exception as e:
                print(f"Error on {filepath}: {e}")

print("Mission Complete! All heavy images destroyed.")