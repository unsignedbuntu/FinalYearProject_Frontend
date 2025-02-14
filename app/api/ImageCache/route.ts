import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

const AUTOMATIC1111_API_URL = 'http://127.0.0.1:7860';
const API_URL = process.env.URL;

// GET /api/ImageCache - Get cached image by pageId and prompt
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const pageID = searchParams.get('pageID');
        const prompt = searchParams.get('prompt');
        console.log("GET isteği - PageID:", pageID, "Prompt:", prompt);

        if (!pageID || !prompt) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        try {
            // URL yapısını backend'in beklediği formata uygun hale getiriyoruz
            const response = await axios.get(`${API_URL}/api/ImageCache/${pageID}/${prompt}`, {
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });

            if (response.data && response.data.cached) {
                console.log("Cache'den görsel bulundu");
                return NextResponse.json({
                    cached: true,
                    image: response.data.image
                });
            }

            console.log("Response:", response.data.image);
            return NextResponse.json({ cached: false });

        } catch (error) {
            console.error("Backend API hatası:", error);
            return NextResponse.json({ error: "Backend API error" }, { status: 500 });
        }

    } catch (error: any) {
        console.error('Genel hata:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/ImageCache - Generate and cache new image
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
            // Görsel oluşturma işlemi
            console.log('Generating image with parameters:', { pageID, prompt });
            const response = await axios.post(`${AUTOMATIC1111_API_URL}/sdapi/v1/txt2img`, {
                prompt: prompt,
                negative_prompt: '',
                steps: 15,
                sampler_name: "DPM++ 2M a",
                width: 512,
                height: 512,
                cfg_scale: 7
            }, {
                timeout: 300000
            });

            if (!response.data?.images?.[0]) {
                throw new Error('No image generated from AUTOMATIC1111');
            }

            // Oluşturulan görseli cache'e kaydet
            const imageToCache = response.data.images[0];
            console.log('Generated image:', imageToCache);
            const cacheResponse = await axios.post(`${API_URL}/api/ImageCache`, {
                pageID,
                prompt,
                image: imageToCache,
                status: true
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });

            if (!cacheResponse.data?.success) {
                throw new Error('Failed to cache the generated image');
            }

            return NextResponse.json({
                success: true,
                image: imageToCache,
                message: "Görsel başarıyla oluşturuldu ve cache'lendi"
            });

        } catch (error) {
            console.error('Error generating or caching image:', error);
            throw error; // Üst catch bloğuna gönder
        }

    } catch (error: any) {
        console.error('Error in POST request:', error);
        return NextResponse.json({
            success: false, 
            error: error.message || 'Görsel oluşturma işlemi başarısız oldu',
            details: error.stack
        }, { status: 500 });
    }
}
