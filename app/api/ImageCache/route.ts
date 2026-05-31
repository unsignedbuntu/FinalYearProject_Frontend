import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

const API_URL = process.env.NEXT_PUBLIC_URL;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { pageID, prompt } = body;

        if (!pageID || !prompt) {
            return NextResponse.json({ 
                success: false,
                error: 'PageID and prompt are required' 
            }, { status: 400 });
        }

        try {
            // 1. C# BACKEND'DE VAR MI DİYE KONTROL ET (Düzeltilmiş URL)
            const cacheResponse = await axios.get(
                `${API_URL}/api/ImageCache/prompt/${encodeURIComponent(prompt)}`,
                {
                    httpsAgent: new https.Agent({ rejectUnauthorized: false })
                }
            );

            // Cache'de varsa direkt dön
            if (cacheResponse.status === 200 && cacheResponse.data?.data?.base64Image) {
                return NextResponse.json({
                    success: true,
                    image: cacheResponse.data.data.base64Image,
                    cached: true
                });
            }

        } catch (error: any) {
            if (error.response?.status !== 404) {
                console.error('Cache check error:', error);
            }
        }

        // 2. YENİ GÖRSEL ÜRET (Stable Diffusion)
        const response = await axios.post('http://127.0.0.1:7860/sdapi/v1/txt2img', {
            prompt,
            steps: 15,
            width: 512,
            height: 512
        });

        if (!response.data?.images?.[0]) {
            return NextResponse.json({
                success: false,
                error: 'No image generated'
            }, { status: 500 });
        }

        const base64Image = response.data.images[0];

        // 3. CACHE'E KAYDET (C# Backend'ine)
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
        } catch (error: any) { 
            // Burada o üç noktayı sildik ve hatayı konsola yazdırdık
            console.error('Cache save error:', error);
        }

        // 4. KULLANICIYA DÖN
        return NextResponse.json({
            success: true,
            image: base64Image,
            cached: false
        });

    } catch (error: any) {
        console.error('Error in POST request:', error);
        return NextResponse.json({
            success: false, 
            error: error.message || 'Görsel oluşturma işlemi başarısız oldu',
            details: error.stack
        }, { status: 500 });
    }
}