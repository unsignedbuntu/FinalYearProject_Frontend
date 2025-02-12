"use client"
import { useState, useEffect } from 'react';
import { getSuppliers, getImageFromCache, createCacheImage } from '@/services/Category_Actions';
import { generatePrompt } from '@/services/image-generation';
import Image from 'next/image';

interface Supplier {
    supplierID: number;
    supplierName: string;
    contactEmail: string;
}

export default function MyFollowedStores() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [supplierImages, setSupplierImages] = useState<{[key: number]: string}>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState<{[key: number]: boolean}>({});

    const generateStoreImage = async (supplierName: string, supplierID: number) => {
        try {
            setIsGenerating(prev => ({ ...prev, [supplierID]: true }));

            const prompt = `${supplierName}, modern storefront design with professional appearance`;
            
            // Cache'den kontrol et
            const cacheResult = await getImageFromCache('my-followed-stores', prompt);
            console.log('Cache result:', cacheResult);

            if (cacheResult.cached && cacheResult.image) {
                setSupplierImages(prev => ({
                    ...prev,
                    [supplierID]: `data:image/jpeg;base64,${cacheResult.image}`
                }));
                return;
            }

            // Yeni görsel oluştur
            const result = await createCacheImage({
                pageID: 'my-followed-stores',
                prompt: prompt
            });

            if (result.success && result.image) {
                setSupplierImages(prev => ({
                    ...prev,
                    [supplierID]: `data:image/jpeg;base64,${result.image}`
                }));
            } else {
                throw new Error(result.error || 'Failed to generate image');
            }

        } catch (error) {
            console.error('Error generating image:', error);
            setError(error instanceof Error ? error.message : 'Failed to generate image');
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

                // Her tedarikçi için görsel oluştur
                for (const supplier of data) {
                    if (!mounted) break;
                    await generateStoreImage(supplier.supplierName, supplier.supplierID);
                    await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
                }

            } catch (err) {
                if (!mounted) return;
                setError('Failed to load suppliers');
                console.error(err);
            } finally {
                if (!mounted) return;
                setIsLoading(false);
            }
        };

        loadData();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-5xl font-bold text-center text-[#5365BF] mt-12 mb-8">
                My Followed Stores
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suppliers.map((supplier) => (
                    <div
                        key={supplier.supplierID}
                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                        <div className="relative h-48">
                            {supplierImages[supplier.supplierID] ? (
                                <Image
                                    src={supplierImages[supplier.supplierID]}
                                    alt={supplier.supplierName}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 animate-pulse" />
                            )}
                            {isGenerating[supplier.supplierID] && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                </div>
                            )}
                        </div>

                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-2">{supplier.supplierName}</h2>
                            <p className="text-gray-600 mb-4">{supplier.contactEmail}</p>

                            <div className="flex justify-between items-center">
                                <button
                                    onClick={() => generateStoreImage(supplier.supplierName, supplier.supplierID)}
                                    disabled={isGenerating[supplier.supplierID]}
                                    className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors ${
                                        isGenerating[supplier.supplierID] ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isGenerating[supplier.supplierID] ? 'Generating...' : 'Regenerate Image'}
                                </button>
                                <button className="text-red-500 hover:text-red-600 transition-colors">
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