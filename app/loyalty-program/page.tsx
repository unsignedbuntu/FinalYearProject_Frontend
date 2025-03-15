"use client"
import { useState, useEffect } from 'react';
import { getLoyaltyPrograms } from '@/services/Category_Actions';
import Image from 'next/image';
import Link from 'next/link';

interface LoyaltyProgram {
    LoyaltyProgramID: number;
    ProgramName: string;
    DiscountRate: number;
    PointsMultiplier: number;
}

export default function LoyaltyProgramPage() {
    const [programs, setPrograms] = useState<LoyaltyProgram[]>([]);
    const [isGameActive, setIsGameActive] = useState(false);
    const [gameResult, setGameResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Loyalty programlarını getir
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                setIsLoading(true);
                const data = await getLoyaltyPrograms();
                setPrograms(data || []);
                setError(null);
            } catch (err) {
                console.error("Loyalty programları yüklenirken hata:", err);
                setError("Loyalty programları yüklenemedi.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchPrograms();
    }, []);

    // Oyunu başlat (API route kullanarak)
    const startGame = async () => {
        setIsGameActive(true);
        setGameResult(null);
        
        try {
            // API route'a istek gönder
            const response = await fetch('/api/run-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`API yanıt hatası: ${response.status}`);
            }
            
            const result = await response.json();
            setGameResult(result);
            
            if (result.success) {
                // Program listesini yenile
                const updatedPrograms = await getLoyaltyPrograms();
                setPrograms(updatedPrograms || []);
            }
        } catch (error) {
            console.error("Oyun başlatma hatası:", error);
            setGameResult({ 
                success: false, 
                error: "Oyun başlatılamadı. Lütfen tekrar deneyin." 
            });
        } finally {
            setIsGameActive(false);
        }
    };
    
    // Yükleme durumu
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center mb-8">
                <h1 style={{color: '#5365BF'}} className="text-5xl font-bold mt-12">Loyalty Program</h1>
            </div>
            
            {/* Oyun Bölümü */}
            <div className="mb-8 p-6 bg-blue-50 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Oyun İle İndirim Kazan!</h2>
                <p className="mb-4">Oyunumuzu oynayarak indirim kazanabilirsiniz. Yüksek puan = Daha yüksek indirim!</p>
                
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                    <button 
                        onClick={startGame}
                        disabled={isGameActive}
                        className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isGameActive ? 'Oyun Başlatılıyor...' : 'Oyunu Başlat'}
                    </button>
                </div>
                
                {gameResult && gameResult.success && (
                    <div className="mt-4 p-4 bg-green-100 rounded-lg">
                        <h3 className="font-bold text-xl mb-2">🎮 Oyun Sonucu</h3>
                        <div className="space-y-2">
                            <p><span className="font-semibold">Puan:</span> {gameResult.score}</p>
                            <p><span className="font-semibold">Kazanılan İndirim:</span> %{gameResult.discountRate}</p>
                            <p><span className="font-semibold">Puan Çarpanı:</span> {gameResult.pointsMultiplier}x</p>
                        </div>
                    </div>
                )}
                
                {gameResult && !gameResult.success && (
                    <div className="mt-4 p-4 bg-red-100 rounded-lg text-red-800">
                        <h3 className="font-bold text-xl mb-2">❌ Hata</h3>
                        <p>{gameResult.error}</p>
                    </div>
                )}
            </div>
            
            {/* Mevcut İndirimler Bölümü */}
            <h2 className="text-2xl font-bold mb-4">Mevcut İndirimleriniz</h2>
            
            {error && (
                <div className="p-4 bg-red-100 text-red-800 rounded-lg mb-4">
                    {error}
                </div>
            )}
            
            {programs.length === 0 ? (
                <div className="bg-gray-50 p-8 text-center rounded-lg">
                    <p className="text-gray-500">Henüz hiç loyalty program kaydınız bulunmuyor. Oyun oynayarak indirim kazanın!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programs.map((program) => (
                        <div key={program.LoyaltyProgramID} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-semibold">{program.ProgramName}</h3>
                                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                    ID: {program.LoyaltyProgramID}
                                </div>
                            </div>
                            <div className="flex items-center mb-3">
                                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold text-lg">
                                    %{program.DiscountRate} İndirim
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="text-yellow-500 mr-2">⭐</span>
                                <p className="text-gray-600">Puan Çarpanı: {program.PointsMultiplier}x</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 