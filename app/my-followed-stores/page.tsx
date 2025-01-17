"use client"
import { useState, useEffect } from 'react';
import { getSuppliers } from '@/services/Category_Actions';
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

    const generateStoreImage = async (supplierName: string, supplierID: number) => {
        try {
            const prompt = `${supplierName} store front design, modern and professional e-commerce style`;


            // Set placeholder while loading
            setSupplierImages(prev => ({
                ...prev,
                [supplierID]: DEFAULT_PLACEHOLDER
            }));

            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate image');
            }

            const data = await response.json();

            if (data && data.image) {
                setSupplierImages(prev => ({
                    ...prev,
                    [supplierID]: `data:image/jpeg;base64,${data.image}`
                }));
            } else {
                setSupplierImages(prev => ({
                    ...prev,
                    [supplierID]: DEFAULT_PLACEHOLDER
                }));
                  console.error('No image data received', data);
            }

        } catch (error) {
            console.error('Error generating image:', error);
            setSupplierImages(prev => ({
                ...prev,
                [supplierID]: DEFAULT_PLACEHOLDER
            }));
        }
    };


    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            try {
                const data = await getSuppliers();
                if (!mounted) return;

                setSuppliers(data);

                // Generate images sequentially
                for (const supplier of data) {
                    if (!mounted) break;
                    await generateStoreImage(supplier.supplierName, supplier.supplierID);
                     // Add a small delay between requests
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
                        </div>

                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-2">{supplier.supplierName}</h2>
                            <p className="text-gray-600 mb-4">{supplier.contactEmail}</p>

                            <div className="flex justify-between items-center">
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                                >
                                    View Details
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