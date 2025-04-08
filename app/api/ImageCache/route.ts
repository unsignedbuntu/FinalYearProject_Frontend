import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import { createHash } from 'crypto';

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
        const { pageID, prompt, checkOnly, image } = await req.json();

        if (!pageID || !prompt) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields'
            }, { status: 400 });
        }

        console.log("POST request received for pageID:", pageID, "prompt:", prompt);

        // Eğer image doğrudan gönderilmişse, backend'e direkt olarak kaydet
        if (image) {
            console.log("Image data received directly, saving to backend cache");
            try {
                const cacheResponse = await axios.post(`${API_URL}/api/ImageCache`, {
                    PageID: pageID,
                    Prompt: prompt,
                    Image: image,
                    Status: true
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    httpsAgent: new https.Agent({ rejectUnauthorized: false })
                });
                
                return NextResponse.json({
                    success: true,
                    image: image,
                    source: "direct_upload"
                });
            } catch (saveError: any) {
                console.error("Error saving direct image:", saveError);
                return NextResponse.json({
                    success: false,
                    error: saveError.message || 'Error saving image to backend'
                }, { status: 500 });
            }
        }

        // Önce backend'den direkt olarak görüntüyü almaya çalış
        try {
            console.log("Checking if image exists in backend cache");
            const directCacheResponse = await axios.get(`${API_URL}/api/ImageCache/${pageID}/${encodeURIComponent(prompt)}`, {
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });
            
            // Eğer görüntü zaten varsa, doğrudan döndür
            if (directCacheResponse.status === 200 && directCacheResponse.data.image) {
                console.log("Image found in backend cache, returning existing image");
                return NextResponse.json({
                    success: true,
                    image: directCacheResponse.data.image,
                    source: "backend_cache"
                });
            }
        } catch (error: any) {
            // 404 hatası normal, görüntü bulunamadı demektir
            if (error.response && error.response.status === 404) {
                console.log("Image not found in backend cache, will try to generate");
            } else {
                console.error("Error checking backend cache:", error);
            }
        }

        // Eğer checkOnly parametresi true ise, sadece kontrol et ve görüntü oluşturma
        if (checkOnly) {
            console.log("checkOnly parameter is true, skipping image generation");
            return NextResponse.json({
                success: false,
                error: 'Image not found in cache',
                source: "check_only"
            }, { status: 404 });
        }

        // Stable Diffusion API'ye istek gönder
        console.log("Generating new image with Stable Diffusion API");
        try {
            const sdAgent = new https.Agent({ 
                rejectUnauthorized: false 
            });
            
            // HTTP kullan veya farklı bir endpoint dene
            // Not: Backend sistemini kontrol et, hangi endpointin doğru olduğunu belirle
            const response = await axios.post(`http://127.0.0.1:7860/sdapi/v1/txt2img`, {
                prompt,
                negative_prompt: "blurry, low quality, deformed",
                steps: 15,
                width: 512,
                height: 512,
                cfg_scale: 7
            }, {
                httpsAgent: sdAgent,
                timeout: 240000 
            });

            if (!response.data?.images?.[0]) {
                console.error("No image generated by Stable Diffusion API");
                return NextResponse.json({
                    success: false,
                    error: 'No image generated'
                }, { status: 500 });
            }

            const base64Image = response.data.images[0];
            console.log("Successfully generated image with Stable Diffusion API");

            // Cache'e kaydet
            try {
                console.log("Saving image to backend cache");
                const cacheResponse = await axios.post(`${API_URL}/api/ImageCache`, {
                    PageID: pageID,
                    Prompt: prompt,
                    Image: base64Image,
                    Status: true
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    httpsAgent: new https.Agent({ rejectUnauthorized: false })
                });
                
                console.log("Cache save response status:", cacheResponse.status);
                
                // Başarılı bir şekilde kaydedildi
                return NextResponse.json({
                    success: true,
                    image: base64Image,
                    source: "newly_generated"
                });
            } catch (error: any) {
                // 409 hatası alırsak, bu görüntü zaten var demektir
                if (error.response && error.response.status === 409) {
                    console.log("Image already exists in backend cache (409), retrieving existing image");
                    
                    // Mevcut görüntüyü almak için tekrar GET isteği gönder
                    try {
                        const existingImageResponse = await axios.get(`${API_URL}/api/ImageCache/${pageID}/${encodeURIComponent(prompt)}`, {
                            httpsAgent: new https.Agent({ rejectUnauthorized: false })
                        });
                        
                        if (existingImageResponse.status === 200 && existingImageResponse.data.image) {
                            console.log("Successfully retrieved existing image from backend cache");
                            return NextResponse.json({
                                success: true,
                                image: existingImageResponse.data.image,
                                source: "backend_cache_after_conflict"
                            });
                        }
                    } catch (getError) {
                        console.error("Error getting existing image after conflict:", getError);
                    }
                }
                
                console.error("Cache save error:", error);
                // Cache kaydetme hatası olsa bile, görüntüyü döndürebiliriz
                return NextResponse.json({
                    success: true,
                    image: base64Image,
                    source: "newly_generated_cache_error"
                });
            }
        } catch (sdError: any) {
            console.error("Stable Diffusion API error:", sdError);
            return NextResponse.json({
                success: false,
                error: sdError.message || 'Error generating image with Stable Diffusion API'
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error('General error in POST request:', error);
        return NextResponse.json({
            success: false, 
            error: error.message || 'Görsel oluşturma işlemi başarısız oldu',
            details: error.stack
        }, { status: 500 });
    }
}
// GET endpoint'i aynı kalabilir...