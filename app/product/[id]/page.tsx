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
                console.log('Fetching data for product ID:', params.id);

                const [productsData, suppliersData, storesData] = await Promise.all([
                    getProducts(),
                    getProductSuppliers(),
                    getStores()
                ]);

                const foundProduct = productsData.find(
                    (p: Product) => p.productID === Number(params.id)
                );

                console.log('Found product:', foundProduct);

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
                            const categoryName = foundProduct.category?.categoryName || foundProduct.categoryName || '';
                            console.log('Category Name:', categoryName);

                            const prompts = generateProductPrompt(
                                foundProduct.productName || '',
                                categoryName
                            );

                            if (prompts?.main) {
                                console.log("Fetching image from API:", prompts.main);
                                const mainImageResponse = await fetch('/api/ImageCache', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        pageID: 'products',
                                        prompt: prompts.main
                                    })
                                });

                                console.log("Main image response:", mainImageResponse); //LOG EKLENDİ 

                                const mainImageData = await mainImageResponse.json();

                                console.log("Main image data:", mainImageData); //LOG EKLENDİ
                                
                                const additionalImages = prompts.views && prompts.views.length > 0 ? 
                                    await Promise.all(
                                        prompts.views.map(async (viewPrompt) => {
                                            console.log('Generating view with prompt:', `${prompts.main}, ${viewPrompt}`); 
                                            const fullPrompt = `${prompts.main}, ${viewPrompt}`;

                                            try {
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
                                                
                                                console.log("Additional image response:", response); // LOG EKLENDİ
                                                const data = await response.json();
                                                
                                                console.log("Additional image data:", data); // LOG EKLENDİ
                                                
                                                return data.success && data.image ? 
                                                    `data:image/jpeg;base64,${data.image}` : null;
                                            } catch (error) {
                                                console.error('Error generating additional image:', error);
                                                return null;
                                            }
                                        })
                                    ) : [];

                            foundProduct.image = mainImageData.success ? 
                                    `data:image/jpeg;base64,${mainImageData.image}` : null;

                            console.log("Main image URL:", foundProduct.image); //LOG EKLENDİ
                            foundProduct.additionalImages = additionalImages.filter(img => img !== null);
                        }
                            setProduct({
                                ...foundProduct,
                                reviews: formattedReviews
                            });
                            setSupplier(productSupplier || null);
                        } catch (error) {
                            console.error('Error generating images:', error);
                        }
                    }
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="aspect-square bg-white rounded-xl shadow-lg overflow-hidden">
                            <Image
                                src={product.image || '/placeholder.png'}
                                alt={product.productName}
                                layout="fill"
                                objectFit="contain"
                                className="p-4"
                            />
                        </div>
                        
                        {product.additionalImages && product.additionalImages.length > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                                {product.additionalImages.map((img, i) => (
                                    <div key={i} className="aspect-square bg-white rounded-xl shadow-lg overflow-hidden">
                                        <Image
                                            src={img}
                                            alt={`${product.productName} view ${i + 1}`}
                                            layout="fill"
                                            objectFit="contain"
                                            className="p-4"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h1 className="text-3xl font-bold mb-4">{product.productName}</h1>

                        <div className="flex items-center justify-between mb-6">
                            <div className="text-3xl font-bold text-blue-600">
                                {product.price} TL
                            </div>
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className="text-2xl text-yellow-400"
                                    >
                                        ★
                                    </span>
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