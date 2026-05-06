from PIL import Image
import os

# הנתיב לתיקיית התמונות שלך (נווט לתיקיית הגלריה)
directory = './images/gallery'

for filename in os.listdir(directory):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        filepath = os.path.join(directory, filename)
        try:
            img = Image.open(filepath)
            
            # בדיקה אם זו תמונת PNG שיש לה שקיפות (RGBA) כדי לשמור עליה
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
                
            # שומר את התמונה ודורס את הישנה עם כיווץ איכות
            img.save(filepath, optimize=True, quality=75)
            print(f"Compressed: {filename}")
        except Exception as e:
            print(f"Error compressing {filename}: {e}")

print("All images compressed successfully!")