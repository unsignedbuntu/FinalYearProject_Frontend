import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { createLoyaltyProgram } from '@/services/Category_Actions';

// Dosya yolları
const projectRoot = process.cwd();
const gameDir = path.join(projectRoot, 'services', 'Game4LoyaltyP');
const gamePath = path.join(gameDir, 'Game.py');
const scoreFilePath = path.join(gameDir, 'last_score.txt');
const tempGamePath = path.join(gameDir, 'temp_game.py');

export async function POST() {
  try {
    console.log("API: Oyun başlatılıyor...");
    console.log(`API: Oyun dizini: ${gameDir}`);
    console.log(`API: Oyun dosyası: ${gamePath}`);
    
    // Oyun dosyasının var olup olmadığını kontrol et
    try {
      await fs.access(gamePath);
      console.log("API: Oyun dosyası bulundu");
    } catch (error) {
      console.error("API: Oyun dosyası bulunamadı:", error);
      return NextResponse.json(
        { success: false, error: "Oyun dosyası bulunamadı" }, 
        { status: 404 }
      );
    }
    
    // Oyun kodunu oku ve modifiye et
    const gameCode = await fs.readFile(gamePath, 'utf-8');
    
    // Skoru dosyaya kaydetmek için kod ekle
    const saveScoreCode = `
# Skoru dosyaya yazacak fonksiyon - dosyanın üst kısmına eklenecek
def save_score_to_file():
    with open('last_score.txt', 'w') as f:
        f.write(str(score))
`;

    // "def draw():" satırını bulalım ve öncesine save_score_to_file fonksiyonunu ekleyelim
    const modifiedCode = gameCode.replace(/pgzrun\.go\(\)/g, `
# Eklenen fonksiyon
def save_score_to_file():
    with open('last_score.txt', 'w') as f:
        f.write(str(score))
        
pgzrun.go()`);

    // draw fonksiyonuna if bloğunu ekleyelim - indentation'ları doğru şekilde ayarlayarak
    const finalCode = modifiedCode.replace(/def draw\(\):([\s\S]*?)(?=\n\w+|$)/g, (match, drawContent) => {
      // game_over kontrolünü draw fonksiyonunun içine ekleyelim
      // İlk satırın indentation'ını tespit edelim
      const lines = drawContent.split('\n');
      let indent = '';
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim()) {
          const match = lines[i].match(/^(\s+)/);
          if (match) {
            indent = match[1];
            break;
          }
        }
      }
      
      // draw fonksiyonunun sonuna game_over kontrolünü ekleyelim, doğru indentation ile
      return `def draw():${drawContent}\n${indent}# Game over olduğunda skoru kaydet\n${indent}if game_over:\n${indent}    save_score_to_file()`;
    });
    
    // Geçici dosyaya yaz
    await fs.writeFile(tempGamePath, finalCode, 'utf-8');
    
    // Varsa önceki skor dosyasını temizle
    try {
      await fs.unlink(scoreFilePath);
    } catch (error) {
      // Dosya zaten yok, sorun değil
    }
    
    // Oyunu çalıştır (Promise kullanarak)
    const runGame = () => {
      return new Promise((resolve, reject) => {
        console.log("API: Oyun subprocess ile çalıştırılıyor...");
        
        // Oyunu başlat
        const process = exec(`python "${tempGamePath}"`, { 
          cwd: gameDir 
        });
        
        let output = '';
        process.stdout?.on('data', (data) => {
          output += data.toString();
          console.log('Oyun çıktısı:', data.toString());
        });
        
        process.stderr?.on('data', (data) => {
          console.error('Oyun hatası:', data.toString());
        });
        
        process.on('close', (code) => {
          console.log(`API: Oyun tamamlandı, çıkış kodu: ${code}`);
          if (code !== 0) {
            reject(new Error(`Oyun hatası ile sonlandı, kod: ${code}`));
          } else {
            resolve(output);
          }
        });
        
        // 2 dakika sonra zaman aşımı
        setTimeout(() => {
          process.kill();
          reject(new Error('Oyun zaman aşımına uğradı (2 dakika)'));
        }, 120000);
      });
    };
    
    try {
      // Oyunu çalıştır ve bitimini bekle
      await runGame();
      
      // Geçici dosyayı temizle
      await fs.unlink(tempGamePath);
      
      // Skoru oku
      let score = 0;
      try {
        const scoreText = await fs.readFile(scoreFilePath, 'utf-8');
        score = parseInt(scoreText.trim(), 10) || 0;
        console.log(`API: Oyun skoru: ${score}`);
      } catch (error) {
        console.error("API: Skor dosyası okunamadı:", error);
      }
      
      // Skora göre indirim oranı hesapla
      let discountRate = 5.00; // Varsayılan
      if (score > 200) {
        discountRate = 25.00;
      } else if (score > 150) {
        discountRate = 20.00;
      } else if (score > 100) {
        discountRate = 15.00;
      } else if (score > 50) {
        discountRate = 10.00;
      }
      
      // Skora göre puan çarpanı hesapla
      const pointsMultiplier = Math.max(1, Math.floor(score / 50));
      
      // Loyalty Program verisi oluştur
      const programData = {
        ProgramName: `Oyun Ödülü - ${score} Puan`,
        DiscountRate: discountRate,
        PointsMultiplier: pointsMultiplier
      };
      
      // Veritabanına kaydet
      console.log("API: Loyalty Program kaydediliyor:", programData);
      const saveResponse = await createLoyaltyProgram(programData);
      
      // Başarılı yanıt dön
      return NextResponse.json({
        success: true,
        score,
        discountRate,
        pointsMultiplier,
        programName: programData.ProgramName,
        savedProgram: saveResponse
      });
    } catch (error) {
      console.error("API: Oyun çalıştırma hatası:", error);
      return NextResponse.json(
        { success: false, error: "Oyun çalıştırılamadı: " + (error as Error).message }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API: Beklenmeyen hata:", error);
    return NextResponse.json(
      { success: false, error: "Beklenmeyen bir hata oluştu" }, 
      { status: 500 }
    );
  }
} 