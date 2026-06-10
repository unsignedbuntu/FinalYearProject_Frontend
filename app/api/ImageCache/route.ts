import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

const API_URL = process.env.NEXT_PUBLIC_URL;

// BURAYA STABILITY AI SİTESİNDEN ALDIĞIN "sk-" İLE BAŞLAYAN ANAHTARI YAPIŞTIR
const STABILITY_API_KEY = process.env.STABILITY_KEY; 

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { pageID, prompt } = body;

        if (!pageID || !prompt) {
            return NextResponse.json({ success: false, error: 'PageID and prompt are required' }, { status: 400 });
        }

        // =================================================================
        // 1. AŞAMA: ÖNCE C# BACKEND'E (REDIS & VERİTABANI) BAK
        // =================================================================
        try {
            const cacheResponse = await axios.get(
                `${API_URL}/api/ImageCache/prompt/${encodeURIComponent(prompt)}`,
                { httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
            );

            // Resim C#'ta varsa, yapay zekaya gitmeden direkt bunu dön!
            if (cacheResponse.status === 200 && cacheResponse.data?.data?.base64Image) {
                return NextResponse.json({
                    success: true,
                    image: cacheResponse.data.data.base64Image,
                    cached: true
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status !== 404) {
                console.error('Cache check error:', error.message);
            }
        }

    // =================================================================
        // 2. AŞAMA: REMOTE GERÇEK STABLE DIFFUSION (STABILITY AI - SDXL)
        // =================================================================
        let base64Image = "";

        try {
            // En güncel ve en güçlü motor: SDXL
            const aiResponse = await axios.post(
                "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
                {
                    text_prompts: [
                        {
                            text: prompt,
                            weight: 1
                        }
                    ],
                    cfg_scale: 7,
                    height: 1024, // SDXL 1024x1024 çözünürlük zorunluluğu ister!
                    width: 1024,  // SDXL 1024x1024 çözünürlük zorunluluğu ister!
                    samples: 1,
                    steps: 30
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${STABILITY_API_KEY}`,
                    },
                }
            );

            // Stability AI resmi doğrudan Base64 formatında gönderir
            if (aiResponse.data && aiResponse.data.artifacts && aiResponse.data.artifacts.length > 0) {
                base64Image = aiResponse.data.artifacts[0].base64;
            } else {
                throw new Error("API'den resim verisi dönmedi.");
            }
            
        } catch (error) {
            const err = error as any;
            console.error("Stability AI Hatası:", err.response?.data?.message || err.message);
            return NextResponse.json({ 
                success: false, 
                image: null, 
                error: 'Remote yapay zeka servisi resmi çizemedi.' 
            }, { status: 200 }); 
        }
        // =================================================================
        // 3. AŞAMA: ÇİZİLEN YENİ RESMİ C# BACKEND'E KAYDET
        // =================================================================
        if (base64Image) {
            try {
                await axios.post(`${API_URL}/api/ImageCache`, {
                    Prompt: prompt,
                    Base64Image: base64Image, 
                    EntityType: "Product",    
                    EntityId: parseInt(pageID) 
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    httpsAgent: new https.Agent({ rejectUnauthorized: false })
                });
            } catch (error) { 
                const err = error as Error;
                console.error('Cache save error:', err.message);
            }
        }

        // =================================================================
        // 4. AŞAMA: KULLANICIYA GÖNDER
        // =================================================================
        return NextResponse.json({
            success: true,
            image: base64Image,
            cached: false
        });

    } catch (error) {
        const err = error as Error;
        console.error('Error in POST request:', err.message);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
