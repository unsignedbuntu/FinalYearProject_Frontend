import os
import sys
import subprocess
import time

# Oyun dosyasının yolu
GAME_PATH = os.path.join(os.path.dirname(__file__), "Game.py")
GAME_DIR = os.path.dirname(__file__)
SCORE_FILE = os.path.join(GAME_DIR, "last_score.txt")

def run_game():
    """Oyunu çalıştırır ve puan dosyasına kaydeder"""
    
    print("Oyun başlatılıyor...")
    print(f"Oyun dosyası: {GAME_PATH}")
    
    # Mevcut oyun kodunu geçici olarak değiştiriyoruz
    # Oyun bitiminde skoru dosyaya yazdıracak şekilde
    with open(GAME_PATH, 'r', encoding='utf-8') as f:
        game_code = f.read()
    
    # Skorun dosyaya yazılacağı kodu ekleyen geçici bir dosya oluştur
    temp_game_path = os.path.join(GAME_DIR, "temp_game.py")
    
    # Skoru dosyaya yazacak kodu ekle
    save_score_code = '''
# Skoru dosyaya yaz
def save_score_to_file():
    with open('last_score.txt', 'w') as f:
        f.write(str(score))

# Game over olduğunda skoru kaydet
if game_over:
    save_score_to_file()
'''
    # Geçici dosya oluştur ve kodu değiştir
    modified_code = game_code.replace('def draw():', f'def draw():\n{save_score_code}')
    
    with open(temp_game_path, 'w', encoding='utf-8') as f:
        f.write(modified_code)
    
    # Varsa önceki skor dosyasını temizle
    if os.path.exists(SCORE_FILE):
        os.remove(SCORE_FILE)
    
    # Oyunu subprocess ile çalıştır
    print("Pygame Zero oyunu başlatılıyor...")
    print("Oyun penceresi açılacak. Oynamayı bitirdiğinizde oyun penceresini kapatın.")
    
    # Oyunu çalıştır
    try:
        subprocess.run(
            [sys.executable, temp_game_path],
            cwd=GAME_DIR
        )
        
        # Geçici dosyayı temizle
        os.remove(temp_game_path)
        
        # Skor dosyasını kontrol et
        score = 0
        if os.path.exists(SCORE_FILE):
            with open(SCORE_FILE, 'r') as f:
                score_str = f.read().strip()
                try:
                    score = int(score_str)
                    print(f"Oyun bitti! Skor: {score}")
                except ValueError:
                    print(f"Skor dosyasındaki değer geçerli bir sayı değil: {score_str}")
        else:
            print("Skor dosyası bulunamadı.")
        
        return score
        
    except Exception as e:
        print(f"Oyun çalıştırma hatası: {e}")
        return 0

# Oyunu çalıştır
if __name__ == "__main__":
    score = run_game()
    print(f"Final skor: {score}")
    print("Bu skoru LoyaltyProgram sayfasında görebilirsiniz.") 