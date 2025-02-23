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
            // Cache kontrolü
            const cacheResponse = await axios.get(
                `${API_URL}/api/ImageCache/${pageID}/${encodeURIComponent(prompt)}`,
                {
                    httpsAgent: new https.Agent({ rejectUnauthorized: false })
                }
            );

            // Cache'de varsa direkt dön
            if (cacheResponse.status === 200 && cacheResponse.data?.image) {
                return NextResponse.json({
                    success: true,
                    image: cacheResponse.data.image,
                    cached: true
                });
            }

        } catch (error: any) {
            // 404 hatası normal akış, devam et
            if (error.response?.status !== 404) {
                console.error('Cache check error:', error);
                return NextResponse.json({
                    success: false,
                    error: 'Cache kontrol hatası',
                    details: error.message
                }, { status: 500 });
            }
        }

        // Yeni görsel üret
        const response = await axios.post(`${AUTOMATIC1111_API_URL}/sdapi/v1/txt2img`, {
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

        // Cache'e kaydet
        try {
            await axios.post(`${API_URL}/api/ImageCache`, {
                PageID: pageID,
                Prompt: prompt,
                Image: base64Image,
                Status: true
            }, {
                headers: { 'Content-Type': 'application/json' },
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });
        } catch (error: any) {
            console.error('Cache save error:', error);
            // Cache kayıt hatası kritik değil, görseli yine de dönelim
        }

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
// GET endpoint'i aynı kalabilir...