'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getProducts, getProductSuppliers, getStores, createCacheImage } from '@/services/Category_Actions';
import Cart from '@/components/icons/Cart';
import FavoriteIcon from '@/components/icons/FavoriteIcon';
import CartSuccessMessage from '@/components/messages/CartSuccessMessage';
import ProductDescription from './ProductDescription/ProductDescription';
import { generateProductPrompt } from './data/basePrompts';
import { categoryReviews } from './data/categoryReviews';
import { Product, ProductSupplier, Store } from './types/Product';
import { basePrompts } from './data/basePrompts';
import { CategoryKey } from './data/basePrompts';

export default function ProductPage() {
    const params = useParams() as { id: string };
    const [product, setProduct] = useState<Product | null>(null);
    const [supplier, setSupplier] = useState<ProductSupplier | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    const [showCartNotification, setShowCartNotification] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsData, suppliersData, storesData] = await Promise.all([
                    getProducts(),
                    getProductSuppliers(),
                    getStores()
                ]);

                const foundProduct = productsData.find((p: Product) => p.productID === Number(params.id));

                if (foundProduct) {
                    const productSupplier = suppliersData.find(
                        (s: ProductSupplier) => s.productID === foundProduct.productID
                    );

                    console.log('Found supplier:', productSupplier);

                    if (productSupplier) {
                        const foundStore = storesData.find(
                            (s: Store) => s.storeID === productSupplier.supplierID
                        );
                        setSupplier(productSupplier || null);
                    }

                    // categoryReviews'den ilgili kategorinin yorumlarını al
                    const categoryName = foundProduct.category?.categoryName || foundProduct.categoryName || 'default';
                    const reviews = categoryReviews[categoryName] || categoryReviews.default;
                    console.log("Reviews:", reviews);
                    console.log("Category Name:", categoryName);
                    // Yorumları Review interface'ine uygun formata dönüştür
                    const formattedReviews = reviews.map(comment => ({
                        rating: Math.floor(Math.random() * 2) + 4, // 4 veya 5 yıldız
                        comment,
                        userName: `User${Math.floor(Math.random() * 1000)}`,
                        date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
                        avatar: `/avatars/user${Math.floor(Math.random() * 5) + 1}.png`
                    }));

                    if (!foundProduct.image) {
                        try {
                            const categoryPrompt = basePrompts[foundProduct.categoryName as CategoryKey] || basePrompts.default;
                            const mainPrompt = categoryPrompt.main(foundProduct.productName);

                            console.log("Category Prompt:", categoryPrompt);
                            console.log("Main Prompt:", mainPrompt);

                            // Ana görsel için POST isteği
                            const mainImageResponse = await fetch('/api/ImageCache', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    pageID: 'products',
                                    prompt: mainPrompt
                                })
                            });

                            if (!mainImageResponse.ok) {
                                throw new Error(`Image generation failed: ${mainImageResponse.statusText}`);
                            }

                            const mainImageData = await mainImageResponse.json();
                            console.log('Main image response:', mainImageData);

                            if (mainImageData.success && mainImageData.image) {
                                foundProduct.image = `data:image/jpeg;base64,${mainImageData.image}`;
                            }

                            // Ek görseller için POST istekleri
                            const additionalImages = await Promise.all(
                                categoryPrompt.views.map(async (viewPrompt) => {
                                    const fullPrompt = `${mainPrompt}, ${viewPrompt}`;
                                    console.log('Processing view prompt:', fullPrompt);

                                    const response = await fetch('/api/ImageCache', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            pageID: 'products',
                                            prompt: fullPrompt
                                        })
                                    });

                                    if (!response.ok) {
                                        console.error(`Failed to generate additional image: ${response.statusText}`);
                                        return null;
                                    }

                                    const data = await response.json();
                                    return data.success && data.image ? 
                                        `data:image/jpeg;base64,${data.image}` : null;
                                })
                            );

                            foundProduct.additionalImages = additionalImages.filter((img: string | null) => img !== null);
                        } catch (error) {
                            console.error('Image generation error:', error);
                            foundProduct.image = '/placeholder.png';
                        }
                    }

                    setProduct({
                        ...foundProduct,
                        reviews: formattedReviews
                    });
                    setSupplier(productSupplier || null);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchData();
        }
    }, [params.id]);

    const handleAddToCart = () => {
        setIsInCart(true);
        setShowCartNotification(true);
        setTimeout(() => setShowCartNotification(false), 3000);
    };

    const handleToggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    if (loading || !product || !supplier) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {showCartNotification && <CartSuccessMessage onClose={() => setShowCartNotification(false)} />}
            
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Sol Kolon - Ürün Görselleri */}
                    <div className="space-y-4">
                        {/* Ana Görsel */}
                        <div className="aspect-w-1 aspect-h-1 bg-white rounded-lg overflow-hidden shadow-md">
                            <Image
                                src={product.image || '/placeholder.png'}
                                alt={product.productName}
                                width={500}
                                height={500}
                                className="object-contain w-full h-full p-4"
                                priority
                            />
                        </div>

                        {/* Küçük Görsel Galerisi */}
                        {product.additionalImages && product.additionalImages.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.additionalImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            const currentMain = product.image;
                                            setProduct({
                                                ...product,
                                                image: img,
                                                additionalImages: [
                                                    ...(product.additionalImages ? product.additionalImages.slice(0, i) : []),
                                                    currentMain!,
                                                    ...(product.additionalImages ? product.additionalImages.slice(i + 1) : [])

                                                ]
                                            });
                                        }}
                                        className="aspect-w-1 aspect-h-1 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.productName} view ${i + 1}`}
                                            width={120}
                                            height={120}
                                            className="object-contain w-full h-full p-2"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sağ Kolon - Ürün Bilgileri */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-2xl font-bold mb-4">{product.productName}</h1>
                        
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-3xl font-bold text-blue-600">
                                {product.price} TL
                            </div>
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star} className="text-xl text-yellow-400">★</span>
                                ))}
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-6">
                            Stock: <span className="font-semibold">{product.quantity}</span> units
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                                <Cart width={24} height={24} />
                                <span>Add to Cart</span>
                            </button>

                            <button
                                onClick={handleToggleFavorite}
                                className={`w-14 flex items-center justify-center rounded-lg transition-colors ${
                                    isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
                                }`}
                            >
                                <FavoriteIcon width={24} height={24} />
                            </button>
                        </div>
                    </div>
                </div>

                <ProductDescription product={product} supplier={supplier} />
            </div>
        </div>
    );
}