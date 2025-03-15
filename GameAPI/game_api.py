from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import time
import subprocess
import os
import sys
import json

app = Flask(__name__)
# Tüm erişim izinleri - Next.js uygulamanızın erişebilmesi için
CORS(app)

# Gerçek oyun dosya yolu - services/Game4LoyaltyP/Game.py
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
GAME_PATH = os.path.join(PROJECT_ROOT, 'services', 'Game4LoyaltyP', 'Game.py')
GAME_DIR = os.path.join(PROJECT_ROOT, 'services', 'Game4LoyaltyP')

# Skor dosyası - oyun bitiminde skoru buraya yazacağız
SCORE_FILE = os.path.join(GAME_DIR, 'last_score.txt')

# Dosya yerini kontrol et
print(f"PROJECT_ROOT: {PROJECT_ROOT}")
print(f"GAME_PATH: {GAME_PATH}")
print(f"GAME_DIR: {GAME_DIR}")

def run_game():
    """
    Gerçek Pygame Zero oyununu çalıştırır ve puan sonucunu alır.
    
    Oyun dosyası yoksa, simülasyon modunda çalışır.
    
    Returns:
        int: Oyun puanı
    """
    # Oyun dosyasının varlığını kontrol et
    if os.path.exists(GAME_PATH):
        try:
            print(f"Oyun dosyası bulundu: {GAME_PATH}")
            print("Gerçek oyun başlatılıyor...")
            
            # Mevcut oyun kodunu geçici olarak değiştiriyoruz
            # Oyun bitiminde skoru dosyaya yazdıracak şekilde
            with open(GAME_PATH, 'r', encoding='utf-8') as f:
                game_code = f.read()
            
            # Skorun dosyaya yazılacağı kodu ekleyen geçici bir dosya oluştur
            temp_game_path = os.path.join(GAME_DIR, 'temp_game.py')
            
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
            print("Pygame Zero oyunu başlatılıyor... Lütfen oynayın ve bittiğinde skoru kaydedeceğiz.")
            print("Oyun penceresi açılacak. Oynamayı bitirdiğinizde oyun penceresini kapatın.")
            
            # Oyunu doğru klasörde çalıştır ki resim dosyalarını bulabilsin
            result = subprocess.run(
                [sys.executable, temp_game_path],
                cwd=GAME_DIR,  # Oyun klasöründe çalıştır
                timeout=120  # 2 dakika zaman aşımı
            )
            
            # Geçici dosyayı temizle
            os.remove(temp_game_path)
            
            # Skor dosyasını kontrol et
            if os.path.exists(SCORE_FILE):
                with open(SCORE_FILE, 'r') as f:
                    score_str = f.read().strip()
                    try:
                        score = int(score_str)
                        print(f"Oyun bitti! Skor dosyasından okunan puan: {score}")
                        return score
                    except ValueError:
                        print(f"Skor dosyasındaki değer geçerli bir sayı değil: {score_str}")
            
            # Skor dosyası yoksa veya geçerli bir sayı yoksa
            print("Skor dosyası bulunamadı veya geçerli bir puan içermiyor. Varsayılan puan üretiliyor.")
            return random.randint(100, 500)
                
        except subprocess.TimeoutExpired:
            print("Oyun zaman aşımına uğradı. 2 dakika içinde tamamlanmadı.")
            return random.randint(100, 200)  # Düşük puan döndür
            
        except Exception as e:
            print(f"Oyun çalıştırma hatası: {e}")
            return random.randint(100, 300)
    else:
        # Oyun dosyası yoksa, simülasyon modu
        print(f"Oyun dosyası bulunamadı: {GAME_PATH}")
        print("Simülasyon modu kullanılıyor...")
        
        # Oyun çalışıyor gibi yapıyoruz
        time.sleep(2)
        # Rastgele 100-1000 arası puan
        score = random.randint(100, 1000)
        print(f"Simülasyon bitti! Puan: {score}")
        return score

# Puana göre indirim hesapla
def calculate_discount(score):
    """
    Puan değerine göre indirim oranını hesaplar.
    
    Args:
        score (int): Oyun puanı
        
    Returns:
        float: İndirim oranı (%)
    """
    if score > 200:
        return 25.00
    elif score > 150:
        return 20.00
    elif score > 100:
        return 15.00
    elif score > 50:
        return 10.00
    else:
        return 5.00

# Puana göre puan çarpanı hesapla
def calculate_points_multiplier(score):
    """
    Puan değerine göre puan çarpanını hesaplar.
    
    Args:
        score (int): Oyun puanı
        
    Returns:
        int: Puan çarpanı
    """
    return max(1, score // 50)  # Her 50 puan için 1 çarpan

@app.route('/api/game/start', methods=['POST'])
def start_game():
    """
    Oyunu başlatır ve sonuçları döndürür.
    
    Returns:
        JSON: Oyun sonuçları
    """
    # İstek gövdesinden kullanıcı bilgilerini al
    data = request.json
    user_id = data.get('userId', 0)
    
    try:
        # Oyunu çalıştır
        score = run_game()
        
        # Sonuçları hesapla
        discount_rate = calculate_discount(score)
        points_multiplier = calculate_points_multiplier(score)
        
        # Sonuçları döndür
        return jsonify({
            'success': True,
            'userId': user_id,
            'score': score,
            'discountRate': discount_rate,
            'pointsMultiplier': points_multiplier,
            'programName': f"Oyun Ödülü - {score} Puan"
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/game/health', methods=['GET'])
def health_check():
    """
    API'nin çalışır durumda olup olmadığını kontrol eder.
    
    Returns:
        JSON: API durum bilgisi
    """
    game_exists = os.path.exists(GAME_PATH)
    pygame_installed = False
    
    try:
        import pgzrun
        pygame_installed = True
    except ImportError:
        pygame_installed = False
    
    return jsonify({
        'status': 'ok',
        'message': 'Game API is running',
        'gameFileExists': game_exists,
        'gameDirectory': GAME_DIR,
        'pygameZeroInstalled': pygame_installed
    })

if __name__ == '__main__':
    port = 5000
    print(f"Game API running on http://localhost:{port}")
    print(f"Oyun dosyası: {GAME_PATH} {'(Bulundu)' if os.path.exists(GAME_PATH) else '(Bulunamadı - Simülasyon modu)'}")
    print(f"Oyun klasörü: {GAME_DIR}")
    
    # Pygame Zero kurulu mu kontrol et
    try:
        import pgzrun
        print("Pygame Zero kurulu.")
    except ImportError:
        print("UYARI: Pygame Zero (pgzrun) kurulu değil. Gerçek oyunu çalıştırmak için kurmanız gerekir.")
        print("Kurulum için: pip install pgzero")
    
    app.run(host='0.0.0.0', port=port, debug=True) 