import { NextResponse } from 'next/server';
import axios from 'axios';
// import https from 'https'; // Artık doğrudan C# backend'ine https agent ile gitmiyoruz, API_Service hallediyor.
// import { createHash } from 'crypto'; // Hashleme C# backend'inde yapılıyor.

import {
    getImageByPromptFromBackend,
    createOrUpdateImageInBackend,
    ImageCacheRequestDto,
    ImageCacheResponseDto
} from '../../../services/API_Service'; // Servislerin yolu projenize göre ayarlanmalı

const AUTOMATIC1111_API_URL = process.env.AUTOMATIC1111_API_URL || 'http://127.0.0.1:7860';
// const API_URL = process.env.URL; // Bu artık API_Service içinde yönetiliyor (getApiUrl())

// GET /api/ImageCache - Verilen prompt ile backend cache'inden resim getirmeyi dener.
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const prompt = searchParams.get('prompt');

        if (!prompt) {
            return NextResponse.json({ success: false, error: 'Prompt parameter is required' }, { status: 400 });
        }

        console.log("Next.js API GET /api/ImageCache - Prompt:", prompt);

        const cachedData = await getImageByPromptFromBackend(prompt);

        if (cachedData && cachedData.base64Image) {
            console.log("Next.js API GET: Image found in backend cache for prompt:", prompt);
            return NextResponse.json({
                success: true,
                image: cachedData.base64Image, // Base64 image'i döndür
                source: cachedData.imageUrl ? "backend_cache_via_prompt_get_route" : "backend_cache_redis_only_get_route",
                data: cachedData // Tüm DTO'yu da döndür
            });
        } else {
            console.log("Next.js API GET: Image not found in backend cache for prompt:", prompt);
            return NextResponse.json({ success: false, error: 'Image not found for the given prompt', source: "backend_not_found_get_route" }, { status: 404 });
        }

    } catch (error: any) {
        console.error('Error in Next.js GET /api/ImageCache:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal server error in Next.js GET' }, { status: 500 });
    }
}


// POST /api/ImageCache - Resim oluşturur, cache'ler veya var olanı getirir.
export async function POST(req: Request) {
    try {
        // pageID artık doğrudan kullanılmıyor, entityType ve entityId tercih ediliyor.
        // 'image' alanı 'directBase64Image' olarak yeniden adlandırıldı, daha açıklayıcı olması için.
        const {
            prompt,
            entityType, // Örn: "Product" ya da "Supplier"
            entityId,   // İlişkili ProductID ya da SupplierID
            base64Image: directBase64Image, // Frontend'den direkt gelen base64 resim (isteğe bağlı)
            checkOnly   // Sadece cache kontrolü mü yapılacak?
        } = await req.json();

        if (!prompt) {
            return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
        }

        console.log("Next.js API POST /api/ImageCache - Prompt:", prompt, "EntityType:", entityType, "EntityId:", entityId, "CheckOnly:", checkOnly, "HasDirectImage:", !!directBase64Image);

        // 1. Frontend'den direkt bir base64 resim gönderildiyse, bunu C# backend'ine kaydetmeyi dene
        if (directBase64Image) {
            console.log("Next.js API POST: Direct base64 image provided. Attempting to save to C# backend.");
            try {
                const dto: ImageCacheRequestDto = {
                    prompt,
                    base64Image: directBase64Image,
                    entityType,
                    entityId
                };
                const backendResult = await createOrUpdateImageInBackend(dto);
                if (backendResult && backendResult.base64Image) {
                    console.log("Next.js API POST: Successfully saved direct image to C# backend. ImageID:", backendResult.id);
                    return NextResponse.json({
                        success: true,
                        image: backendResult.base64Image,
                        source: "direct_image_saved_to_backend",
                        data: backendResult
                    });
                } else {
                    console.error("Next.js API POST: Failed to save direct image to C# backend.");
                    return NextResponse.json({ success: false, error: "Failed to save provided image to backend cache" }, { status: 500 });
                }
            } catch (e: any) {
                console.error("Next.js API POST: Exception saving direct image to C# backend:", e);
                return NextResponse.json({ success: false, error: e.message || "Error saving provided image to backend cache" }, { status: 500 });
            }
        }

        // 2. C# Backend cache'ini kontrol et (Redis -> DB)
        console.log("Next.js API POST: Checking C# backend cache for prompt:", prompt);
        try {
            const cachedData = await getImageByPromptFromBackend(prompt);
            if (cachedData && cachedData.base64Image) {
                console.log("Next.js API POST: Image found in C# backend cache. ImageID:", cachedData.id);
                return NextResponse.json({
                    success: true,
                    image: cachedData.base64Image,
                    source: cachedData.imageUrl ? "backend_cache_via_prompt_post_route" : "backend_cache_redis_only_post_route",
                    data: cachedData
                });
            }
            console.log("Next.js API POST: Image not found in C# backend cache for prompt:", prompt);
        } catch (e: any) {
            console.warn("Next.js API POST: Warning during C# backend cache check (will proceed to generation if not checkOnly):", e.message);
            // Hata olsa bile, eğer checkOnly değilse resim oluşturmaya devam et
        }

        // 3. Eğer 'checkOnly' true ise ve cache'de bulunamadıysa, burada dur.
        if (checkOnly) {
            console.log("Next.js API POST: checkOnly is true and image not in cache. Returning not found.");
            return NextResponse.json({ success: false, error: 'Image not found in cache', source: "check_only_not_found_post_route" }, { status: 404 });
        }

        // 4. Stable Diffusion API ile yeni resim oluştur
        let generatedBase64Image: string;
        console.log("Next.js API POST: Generating new image with Stable Diffusion for prompt:", prompt);
        try {
            // const sdAgent = new https.Agent({ rejectUnauthorized: false }); // Artık gerekmiyor, axios global ayarları kullanır
            const response = await axios.post(`${AUTOMATIC1111_API_URL}/sdapi/v1/txt2img`, {
                prompt,
                negative_prompt: "blurry, low quality, deformed, text, watermark, signature",
                steps: 20, // Daha kaliteli sonuç için biraz artırılabilir
                width: 512,
                height: 512,
                cfg_scale: 7,
                sampler_name: "Euler a" // Yaygın kullanılan bir sampler
            }, {
                // httpsAgent: sdAgent, // Gerekmiyorsa kaldırılabilir
                timeout: 240000
            });

            if (!response.data?.images?.[0]) {
                console.error("Next.js API POST: No image generated by Stable Diffusion API.");
                throw new Error('No image generated by Stable Diffusion API');
            }
            generatedBase64Image = response.data.images[0];
            console.log("Next.js API POST: Successfully generated image with Stable Diffusion.");
        } catch (sdError: any) {
            console.error("Next.js API POST: Stable Diffusion API error:", sdError.response?.data || sdError.message);
            return NextResponse.json({ success: false, error: sdError.message || 'Error generating image with Stable Diffusion' }, { status: 500 });
        }

        // 5. Oluşturulan yeni resmi C# backend'ine kaydet
        console.log("Next.js API POST: Saving newly generated image to C# backend for prompt:", prompt);
        try {
            const dto: ImageCacheRequestDto = {
                prompt,
                base64Image: generatedBase64Image,
                entityType,
                entityId
            };
            const backendResult = await createOrUpdateImageInBackend(dto);
            if (backendResult && backendResult.base64Image) {
                console.log("Next.js API POST: Successfully saved newly generated image to C# backend. ImageID:", backendResult.id);
                return NextResponse.json({
                    success: true,
                    image: backendResult.base64Image, // Backend'den dönen resmi kullan (eğer bir işlemden geçtiyse)
                    source: "newly_generated_and_cached_to_backend",
                    data: backendResult
                });
            } else {
                // Backend kaydı başarısız olsa bile, oluşturulan resmi frontend'e gönder.
                console.warn("Next.js API POST: Failed to save newly generated image to C# backend, but returning generated image to client.");
                return NextResponse.json({
                    success: true,
                    image: generatedBase64Image,
                    source: "newly_generated_backend_cache_failed",
                    error: "Image generated, but failed to save to backend cache."
                });
            }
        } catch (cacheError: any) {
            console.error("Next.js API POST: Exception saving newly generated image to C# backend:", cacheError.response?.data || cacheError.message);
            // Cache hatası olsa bile, oluşturulan resmi frontend'e gönder.
            return NextResponse.json({
                success: true,
                image: generatedBase64Image,
                source: "newly_generated_backend_cache_exception",
                error: cacheError.message || "Image generated, but exception occurred while saving to backend cache."
            });
        }

    } catch (error: any) {
        console.error('General error in Next.js POST /api/ImageCache:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Görsel işleme sırasında genel bir hata oluştu (Next.js API).',
            details: error.stack // Geliştirme ortamında detaylı hata için
        }, { status: 500 });
    }
}