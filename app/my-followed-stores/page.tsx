"use client"
import { useState, useEffect } from 'react';
import { getSuppliers, getImageFromCache, createCacheImage } from '@/services/Category_Actions';
import { generatePrompt } from '@/services/image-generation';
import Image from 'next/image';
import axios from 'axios';

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

            // Set placeholder while loading
            setSupplierImages(prev => ({
                ...prev,
                [supplierID]: DEFAULT_PLACEHOLDER
            }));

            const generatedPrompt = generatePrompt(
                supplierName,
                "modern storefront design with professional appearance"
            );

            const finalPrompt = customPrompt || generatedPrompt.prompt;
            console.log('Using prompt:', finalPrompt);

            // Check if image exists in cache
            const cacheResult = await getImageFromCache('my-followed-stores', finalPrompt);

            if (cacheResult.cached) {
                console.log('Using cached image for:', supplierName);
                setSupplierImages(prev => ({
                    ...prev,
                    [supplierID]: `data:image/jpeg;base64,${cacheResult.image}`
                }));
                return;
            }

            // Generate new image
            const result = await createCacheImage(
                {
                    pageID: 'my-followed-stores',
                    prompt: finalPrompt,
                }
      
            );
console.log(result);
            if (result.success) {
                const imageUrl = `data:image/jpeg;base64,${result.image}`;
                setSupplierImages(prev => ({
                    ...prev,
                    [supplierID]: imageUrl
                }));
                console.log('Generated new image for:', supplierName);
            } else {
                throw new Error(result.error || 'Failed to generate image');
            }

        } catch (error) {
            console.error('Error generating image:', error);
            setSupplierImages(prev => ({
                ...prev,
                [supplierID]: DEFAULT_PLACEHOLDER
            }));
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

                 for (const supplier of data){
                     if (!mounted) 
                        break; 
                        console.log('Generating image for supplier:', supplier.supplierName);
                         await generateStoreImage(supplier.supplierName, supplier.supplierID);
                           await new Promise(resolve => setTimeout(resolve, 500));
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