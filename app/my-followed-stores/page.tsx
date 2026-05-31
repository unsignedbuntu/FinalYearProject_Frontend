"use client"
import { useState, useEffect } from 'react';
import { getSuppliers } from '@/services/Category_Actions';
import { generatePrompt } from '@/services/image-generation'; // generateImage'i sildik!
import { createCacheImage } from '@/services/Category_Actions'; // getImageFromCache'i sildik!
import Image from 'next/image';

interface Supplier {
    supplierID: number;
    supplierName: string;
    contactEmail: string;
}

const DEFAULT_PLACEHOLDER = '/placeholder.jpg';

export default function MyFollowedStores() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [supplierImages, setSupplierImages] = useState<{[key: number]: string}>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [customPrompts, setCustomPrompts] = useState<{[key: number]: string}>({});
    const [isGenerating, setIsGenerating] = useState<{[key: number]: boolean}>({});

    const generateStoreImage = async (supplierName: string, supplierID: number, customPrompt?: string) => {
        try {
            setIsGenerating(prev => ({ ...prev, [supplierID]: true }));
            
            // Başlangıçta placeholder göster
            if (!supplierImages[supplierID]) {
                setSupplierImages(prev => ({ ...prev, [supplierID]: DEFAULT_PLACEHOLDER }));
            }

            // Eğer kullanıcı kutuya özel bir şey yazdıysa onu kullan, yoksa otomatik üret
            const finalPrompt = customPrompt || generatePrompt(
                supplierName,
                "modern storefront design with professional appearance"
            ).prompt;

            console.log('İstek atılıyor, Prompt:', finalPrompt);

            // SİHİRLİ DOKUNUŞ: Tek bir fonksiyon her şeyi hallediyor!
            // Cache'de varsa getirir, yoksa çizer ve kaydeder.
            const result = await createCacheImage({
                pageID: supplierID.toString(), // DB'de sayıya çevrilebilmesi için ID gönderiyoruz
                prompt: finalPrompt,
            });

            if (result.success && result.image) {
                setSupplierImages(prev => ({
                    ...prev,
                    [supplierID]: `data:image/jpeg;base64,${result.image}`
                }));
            } else {
                throw new Error(result.error || 'Görsel getirilemedi.');
            }

        } catch (error: any) {
            console.error('Error in generateStoreImage:', error);
            setError(error instanceof Error ? error.message : 'Failed to generate image');
            
            // Hata durumunda placeholder'a geri dön
            setSupplierImages(prev => ({ ...prev, [supplierID]: DEFAULT_PLACEHOLDER }));
        } finally {
            setIsGenerating(prev => ({ ...prev, [supplierID]: false }));
        }
    };

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            try {
                const data = await getSuppliers();
                if (!mounted) return;

                setSuppliers(data);
                setIsLoading(false);

                // Veriler yüklendikten sonra resimleri sırayla çek
                for (const supplier of data) {
                    if (!mounted) break;
                    await generateStoreImage(supplier.supplierName, supplier.supplierID);
                    
                    // Yapay zeka ve API'yi boğmamak için araya yarım saniye mola koyuyoruz
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            } catch (err) {
                if (!mounted) return;
                setError('Failed to load suppliers');
                console.error(err);
            }
        };

        loadData();

        return () => {
            mounted = false;
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
            customPrompts[supplier.supplierID] // Kullanıcının yazdığı özel prompt'u gönder
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