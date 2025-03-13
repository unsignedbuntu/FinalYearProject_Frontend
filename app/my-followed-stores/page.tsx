"use client"
import { useState, useEffect } from 'react';
import { getSuppliers } from '@/services/Category_Actions';
import { generateImage, generatePrompt } from '@/services/image-generation';
import Image from 'next/image';

// Global değişkenler - görüntü oluşturma işlemini kontrol etmek için
const globalImageCache: Record<string, string> = {};
const processingPrompts = new Set<string>();
let imageGenerationInProgress = false;

interface Supplier {
    supplierID: number;
    supplierName: string;
    contactEmail: string;
}

const DEFAULT_PLACEHOLDER = '/placeholder.png';

export default function MyFollowedStores() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [supplierImages, setSupplierImages] = useState<{[key: number]: string}>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [customPrompts, setCustomPrompts] = useState<{[key: number]: string}>({});
    const [isGenerating, setIsGenerating] = useState<{[key: number]: boolean}>({});
    const [processedPrompts, setProcessedPrompts] = useState<Set<string>>(new Set());
    const [imagesGenerated, setImagesGenerated] = useState(false);

    const generateStoreImage = async (supplierName: string, supplierID: number, customPrompt?: string) => {
        // Try bloğunun dışında prompt değişkenini tanımla
        let currentPrompt = "";
        
        try {
            // Yükleme durumunu güncelle
            setIsGenerating(prev => ({ ...prev, [supplierID]: true }));
            
            // Başlangıçta placeholder göster
            setSupplierImages(prev => ({
                ...prev,
                [supplierID]: DEFAULT_PLACEHOLDER
            }));

            // Prompt oluştur
            const generatedPrompt = generatePrompt(
                supplierName,
                customPrompt || "modern storefront design with professional appearance"
            );

            const finalPrompt = generatedPrompt.prompt;
            // Dış değişkene değer ata ki finally'de kullanabilelim
            currentPrompt = finalPrompt;
            console.log('🔍 Using prompt:', finalPrompt);
            
            // Eğer bu prompt daha önce işlendiyse veya şu anda işleniyorsa, atla
            if (processedPrompts.has(finalPrompt) || processingPrompts.has(finalPrompt)) {
                console.log(`⏭️ Skipping supplier ${supplierID} - prompt already processed or currently processing`);
                setIsGenerating(prev => ({ ...prev, [supplierID]: false }));
                return;
            }
            
            // Eğer global cache'de varsa, ürünü güncelle ve devam et
            if (globalImageCache[finalPrompt]) {
                console.log(`💾 Using cached image for supplier ${supplierID}`);
                setSupplierImages(prev => ({
                    ...prev,
                    [supplierID]: globalImageCache[finalPrompt]
                }));
                setIsGenerating(prev => ({ ...prev, [supplierID]: false }));
                return;
            }

            // Bu promptu işlenmekte olarak işaretle
            processingPrompts.add(finalPrompt);
            
            // Bu promptu işlenmiş olarak işaretle
            setProcessedPrompts(prev => new Set([...prev, finalPrompt]));

            // Önce cache'den kontrol et
            console.log('🔄 Checking cache for:', { supplierID, finalPrompt });
            
            try {
                // Doğrudan POST isteği yap - resim varsa backend'de kontrol edilecek, yoksa oluştur
                const response = await fetch('/api/ImageCache', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        pageID: 'my-followed-stores',
                        prompt: finalPrompt,
                        checkOnly: false // Görüntüyü cache'de bulamazsa, doğrudan oluşturmasını sağla
                    }),
                    cache: 'no-store' // Cache'lemeyi devre dışı bırak
                });
                
                if (!response.ok) {
                    console.warn(`⚠️ API error with status ${response.status}`);
                    throw new Error(`API error: ${response.statusText}`);
                }
                
                const result = await response.json();
                console.log('📥 API result:', result);

                if (result && result.success && result.image) {
                    console.log(`✅ Image ${result.source === 'backend_cache' ? 'found in cache' : 'generated successfully'}`);
                    const imageUrl = `data:image/jpeg;base64,${result.image}`;
                    
                    setSupplierImages(prev => ({
                        ...prev,
                        [supplierID]: imageUrl
                    }));
                    
                    // Global cache'e ekle
                    if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image')) {
                        globalImageCache[finalPrompt] = imageUrl;
                    }
                    return;
                } else {
                    throw new Error(result?.error || 'Failed to get or generate image');
                }
            } catch (apiError) {
                console.error('❌ Error with API:', apiError);
                
                // API'den görüntü alamadıysak, direkt generateImage ile deneyelim
                try {
                    console.log('🎨 Fallback: Creating new image directly for:', supplierName);
                    
                    const generatedPrompt = generatePrompt(
                        supplierName,
                        "modern storefront design with professional appearance"
                    );
                    
            const result = await generateImage({
                prompt: finalPrompt,
                negative_prompt: generatedPrompt.negative_prompt,
                width: 512,
                height: 512,
                steps: 15,
                cfg_scale: 7,
                sampler_name: "DPM++ 2M a"
            });

            if (!result.success || !result.image) {
                throw new Error(result.error || 'Failed to generate image');
            }

                    const imageUrl = `data:image/jpeg;base64,${result.image}`;

            setSupplierImages(prev => ({
                ...prev,
                        [supplierID]: imageUrl
                    }));
                    
                    // Global cache'e ekle
                    if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image')) {
                        globalImageCache[finalPrompt] = imageUrl;
                    }
                    
                    // Daha sonra arka planda görüntüyü cache'e kaydetmeyi dene 
                    console.log('💾 Saving generated image to cache in background...');
                    
                    fetch('/api/ImageCache', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            pageID: 'my-followed-stores',
                            prompt: finalPrompt,
                            image: result.image,
                            checkOnly: false
                        }),
                        cache: 'no-store'
                    }).catch(cacheSaveError => {
                        console.warn('⚠️ Background cache save failed:', cacheSaveError);
                    });
                } catch (directGenerationError) {
                    console.error('❌ Direct image generation failed:', directGenerationError);
                    // Hata durumunda placeholder'a geri dön
                    setSupplierImages(prev => ({
                        ...prev,
                        [supplierID]: DEFAULT_PLACEHOLDER
                    }));
                }
            }
        } catch (error: any) {
            console.error('❌ Error in generateStoreImage:', error);
            setError(error instanceof Error ? error.message : 'Failed to generate image');
            // Hata durumunda placeholder'a geri dön
            setSupplierImages(prev => ({
                ...prev,
                [supplierID]: DEFAULT_PLACEHOLDER
            }));
        } finally {
            // İşleme tamamlandı, yükleme durumunu güncelle
            setIsGenerating(prev => ({ ...prev, [supplierID]: false }));
            // Promptu işlenmekte olan setinden kaldır
            processingPrompts.delete(currentPrompt);
        }
    };

    // Mağaza resimlerini yükleme için useEffect
    useEffect(() => {
        if (!isLoading && suppliers.length > 0 && !imagesGenerated && !imageGenerationInProgress) {
            console.log("📋 Checking suppliers for image generation");
            
            // Global flag'i true yaparak işlemin başladığını belirt
            imageGenerationInProgress = true;
            
            // Görüntü oluşturma işlemlerini sırayla yap
            const generateImages = async () => {
                try {
                    // İşlenen tedarikçi sayısını takip et
                    let processedCount = 0;
                    
                    // Görseli olmayan veya placeholder olan tedarikçileri filtrele
                    const suppliersNeedingImages = suppliers.filter(supplier => 
                        !supplierImages[supplier.supplierID] || 
                        supplierImages[supplier.supplierID] === DEFAULT_PLACEHOLDER
                    );
                    
                    console.log(`🔍 Found ${suppliersNeedingImages.length} suppliers needing images`);
                    
                    // Hiç işlenecek tedarikçi yoksa bitir
                    if (suppliersNeedingImages.length === 0) {
                        console.log("✅ No suppliers to process, all suppliers have images");
                        setImagesGenerated(true);
                        imageGenerationInProgress = false;
                        return;
                    }
                    
                    // Tüm promptları önceden hazırla ve kontrol et
                    const suppliersToProcess: Supplier[] = [];
                    const promptsToProcess: string[] = [];
                    
                    // Önce hangi tedarikçilerin işlenmesi gerektiğini belirle
                    for (const supplier of suppliersNeedingImages) {
                        // Prompt oluştur
                        const generatedPrompt = generatePrompt(
                            supplier.supplierName,
                            "modern storefront design with professional appearance"
                        );
                        
                        const finalPrompt = generatedPrompt.prompt;
                        
                        // Eğer bu prompt daha önce işlendiyse veya şu anda işleniyorsa, atla
                        if (processedPrompts.has(finalPrompt) || processingPrompts.has(finalPrompt)) {
                            console.log(`⏭️ Skipping supplier ${supplier.supplierID} - prompt already processed or currently processing`);
                            continue;
                        }
                        
                        // Eğer global cache'de varsa, ürünü güncelle ve devam et
                        if (globalImageCache[finalPrompt]) {
                            console.log(`💾 Using cached image for supplier ${supplier.supplierID}`);
                            
                            setSupplierImages(prev => ({
                                ...prev,
                                [supplier.supplierID]: globalImageCache[finalPrompt]
                            }));
                            
                            // Bu promptu işlenmiş olarak işaretle
                            setProcessedPrompts(prev => new Set([...prev, finalPrompt]));
                            continue;
                        }
                        
                        // Bu tedarikçi ve prompt işlenecek
                        suppliersToProcess.push(supplier);
                        promptsToProcess.push(finalPrompt);
                        
                        // İşlenecek promptu önceden işaretleyelim
                        processingPrompts.add(finalPrompt);
                    }
                    
                    console.log(`📊 Will process ${suppliersToProcess.length} suppliers after filtering already processed ones`);
                    
                    // Şimdi sırayla işle
                    for (let i = 0; i < suppliersToProcess.length; i++) {
                        const supplier = suppliersToProcess[i];
                        const prompt = promptsToProcess[i];
                        
                        // Bu promptu işlenmiş olarak işaretle
                        setProcessedPrompts(prev => new Set([...prev, prompt]));
                        
                        // Görüntü oluştur
                        console.log(`🔄 Processing supplier ${processedCount + 1}/${suppliersToProcess.length}: ${supplier.supplierName}`);
                        setIsGenerating(prev => ({ ...prev, [supplier.supplierID]: true }));
                        
                        try {
                            // Doğrudan POST isteği yap - resim varsa backend'de kontrol edilecek, yoksa oluştur
                            const response = await fetch('/api/ImageCache', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    pageID: 'my-followed-stores',
                                    prompt: prompt,
                                    checkOnly: false // Görüntüyü cache'de bulamazsa, doğrudan oluşturmasını sağla
                                }),
                                cache: 'no-store' // Cache'lemeyi devre dışı bırak
                            });
                            
                            if (!response.ok) {
                                console.warn(`⚠️ API error with status ${response.status}`);
                                throw new Error(`API error: ${response.statusText}`);
                            }
                            
                            const result = await response.json();
                            console.log('📥 API result:', result);

                            if (result && result.success && result.image) {
                                console.log(`✅ Image ${result.source === 'backend_cache' ? 'found in cache' : 'generated successfully'}`);
                                const imageUrl = `data:image/jpeg;base64,${result.image}`;
                                
                                setSupplierImages(prev => ({
                                    ...prev,
                                    [supplier.supplierID]: imageUrl
                                }));
                                
                                // Global cache'e ekle
                                if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image')) {
                                    globalImageCache[prompt] = imageUrl;
                                }
                            } else {
                                throw new Error(result?.error || 'Failed to get or generate image');
                            }
                        } catch (apiError) {
                            console.error('❌ Error with API:', apiError);
                            
                            // API'den görüntü alamadıysak, direkt generateImage ile deneyelim
                            try {
                                console.log('🎨 Fallback: Creating new image directly for:', supplier.supplierName);
                                
                                const generatedPrompt = generatePrompt(
                                    supplier.supplierName,
                                    "modern storefront design with professional appearance"
                                );
                                
                                const result = await generateImage({
                                    prompt: prompt,
                                    negative_prompt: generatedPrompt.negative_prompt,
                                    width: 512,
                                    height: 512,
                                    steps: 15,
                                    cfg_scale: 7,
                                    sampler_name: "DPM++ 2M a"
                                });
                                
                                if (!result.success || !result.image) {
                                    throw new Error(result.error || 'Failed to generate image');
                                }
                                
                                const imageUrl = `data:image/jpeg;base64,${result.image}`;
                                
                                setSupplierImages(prev => ({
                                    ...prev,
                                    [supplier.supplierID]: imageUrl
                                }));
                                
                                // Global cache'e ekle
                                if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image')) {
                                    globalImageCache[prompt] = imageUrl;
                                }
                                
                                // Daha sonra arka planda görüntüyü cache'e kaydetmeyi dene 
                                console.log('💾 Saving generated image to cache in background...');
                                
                                fetch('/api/ImageCache', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        pageID: 'my-followed-stores',
                                        prompt: prompt,
                                        image: result.image,
                                        checkOnly: false
                                    }),
                                    cache: 'no-store'
                                }).catch(cacheSaveError => {
                                    console.warn('⚠️ Background cache save failed:', cacheSaveError);
                                });
                            } catch (directGenerationError) {
                                console.error('❌ Direct image generation failed:', directGenerationError);
                                // Hata durumunda placeholder'a geri dön
                                setSupplierImages(prev => ({
                                    ...prev,
                                    [supplier.supplierID]: DEFAULT_PLACEHOLDER
                                }));
                            }
                        } finally {
                            // İşleme tamamlandı, yükleme durumunu güncelle
                            setIsGenerating(prev => ({ ...prev, [supplier.supplierID]: false }));
                            // Promptu işlenmekte olan setinden kaldır
                            processingPrompts.delete(prompt);
                        }
                        
                        // İşlenen tedarikçi sayısını artır
                        processedCount++;
                        console.log(`📊 Processed ${processedCount}/${suppliersToProcess.length} suppliers`);
                        
                        // API'ye yük bindirmeyi önlemek için daha uzun bir bekleme
                        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 saniye bekle
                    }
                    
                    // Tüm görüntüler oluşturuldu
                    console.log("🎉 All images have been generated successfully");
                    setImagesGenerated(true);
                } catch (error) {
                    console.error("❌ Error in image generation process:", error);
                } finally {
                    // İşlem bitti, global flag'i false yap
                    imageGenerationInProgress = false;
                }
            };
            
            // İşlemi başlat
            generateImages();
        }
    }, [isLoading, suppliers, imagesGenerated, supplierImages, processedPrompts]);

    // Verileri yükleme için useEffect
    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            try {
                const data = await getSuppliers();
                if (!mounted) return;

                setSuppliers(data);
                setIsLoading(false);

                // Eski direkt yükleme kodu kaldırıldı - artık ayrı useEffect'te yapılıyor
            } catch (err) {
                if (!mounted) return;
                setError('Failed to load suppliers');
                console.error(err);
            }
        };

        loadData();

        return () => {
            mounted = false;
            // Temizlik işlemi
            processingPrompts.clear();
            imageGenerationInProgress = false;
        };
    }, []);

    const handlePromptChange = (supplierID: number, prompt: string) => {
        setCustomPrompts(prev => ({
            ...prev,
            [supplierID]: prompt
        }));
    };

    const handleRegenerateImage = async (supplier: Supplier) => {
        await generateStoreImage(
            supplier.supplierName,
            supplier.supplierID,
            customPrompts[supplier.supplierID]
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500">Failed to load data.</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center">
                <h1 style={{color: '#5365BF'}} className="text-5xl font-bold mt-12">My Followed Stores</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {suppliers.map((supplier) => (
                    <div
                        key={supplier.supplierID}
                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="relative h-48">
                            <Image
                                src={supplierImages[supplier.supplierID] || DEFAULT_PLACEHOLDER}
                                alt={supplier.supplierName}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                unoptimized
                            />
                            {isGenerating[supplier.supplierID] && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                </div>
                            )}
                        </div>

                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-2">{supplier.supplierName}</h2>
                            <p className="text-gray-600 mb-4">{supplier.contactEmail}</p>

                            {/* Custom Prompt Input */}
                            <div className="mb-4">
                                <textarea
                                    value={customPrompts[supplier.supplierID] || ''}
                                    onChange={(e) => handlePromptChange(supplier.supplierID, e.target.value)}
                                    placeholder="Enter custom prompt for image generation..."
                                    className="w-full p-2 border rounded-lg text-sm"
                                    rows={2}
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() => handleRegenerateImage(supplier)}
                                    disabled={isGenerating[supplier.supplierID]}
                                    className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 ${
                                        isGenerating[supplier.supplierID] ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isGenerating[supplier.supplierID] ? 'Generating...' : 'Regenerate Image'}
                                </button>
                                <button
                                    className="text-red-500 hover:text-red-600 transition-colors duration-300"
                                >
                                    Unfollow
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}