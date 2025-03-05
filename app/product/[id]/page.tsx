'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getProducts, getProductSuppliers, getStores, getSuppliers, createCacheImage } from '@/services/Category_Actions';
import CartFavorites from '@/components/icons/CartFavorites';
import FavoriteIcon from '@/components/icons/FavoriteIcon';
import FavoritesPageHover from '@/components/icons/FavoritesPageHover';
import CartSuccessMessage from '@/components/messages/CartSuccessMessage';
import { generateProductPrompt } from './data/basePrompts';
import { categoryReviews } from './data/categoryReviews';
import { Product, ProductSupplier, Store } from './types/Product';
import { basePrompts } from './data/basePrompts';
import { CategoryKey } from './data/basePrompts';
import { productDetails as productDescriptionData } from './data/productDescription';

// Ürün detayları için geçici veri
const productDetails = {
    description: {
        title: "Product Description",
        content: "This product offers excellent quality and performance. It is designed to meet your needs with its durable construction and user-friendly features."
    },
    specifications: {
        title: "Specifications",
        content: "No specifications available for this product."
    },
    reviews: {
        title: "Customer Reviews",
        content: "No reviews yet for this product."
    },
    returnPolicy: {
        title: "Return & Cancellation Policy",
        content: [
            "Returns accepted within 14 days of delivery.",
            "Product must be in original packaging and unused condition.",
            "Refunds will be processed within 5-7 business days after receiving the returned item.",
            "For digital products, returns are not accepted after purchase."
        ]
    },
    shipping: {
        title: "Shipping Information",
        content: [
            "Standard Delivery: 3-5 business days",
            "Express Delivery: 1-2 business days (additional fee)",
            "Free shipping on orders over 500 TL"
        ]
    },
    cancellation: {
        title: "Cancellation Policy",
        content: [
            "Orders can be cancelled before shipping",
            "Once shipped, the order cannot be cancelled but can be returned after delivery",
            "For digital products, cancellation is not possible after purchase"
        ]
    }
};

// Sekme türleri için tip tanımı
type TabType = 'description' | 'specifications' | 'reviews' | 'shipping' | 'returnPolicy';

export default function ProductPage() {
    const params = useParams() as { id: string };
    const [product, setProduct] = useState<Product | null>(null);
    const [supplier, setSupplier] = useState<ProductSupplier | null>(null);
    const [store, setStore] = useState<Store | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    const [showCartNotification, setShowCartNotification] = useState(false);
    const [isFollowingStore, setIsFollowingStore] = useState(false);
    const [supplierRating, setSupplierRating] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('description');
    const [isHoveringFavorite, setIsHoveringFavorite] = useState(false);
    
    // Sabit GamerGear puanı
    const storeRating = 5.7;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsData, suppliersData, storesData, allSuppliers] = await Promise.all([
                    getProducts(),
                    getProductSuppliers(),
                    getStores(),
                    getSuppliers()
                ]);

                const foundProduct = productsData.find((p: Product) => p.productID === Number(params.id));

                if (foundProduct) {
                    const productSupplier = suppliersData.find(
                        (s: ProductSupplier) => s.productID === foundProduct.productID
                    );

                    console.log('Found supplier:', productSupplier);

                    if (productSupplier) {
                        // Find the supplier name from the suppliers list
                        const supplierDetails = allSuppliers.find(
                            (s: any) => s.supplierID === productSupplier.supplierID
                        );
                        
                        // Sabit GamerGear puanını kullan
                        setSupplierRating(storeRating);

                        setSupplier({
                            ...productSupplier,
                            supplierName: supplierDetails?.supplierName || "GamerGear",
                            rating: storeRating
                        });

                        const foundStore = storesData.find(
                            (s: Store) => s.storeID === productSupplier.supplierID
                        );

                        if (foundStore) {
                            setStore({
                                ...foundStore,
                                rating: storeRating
                            });
                        }
                    }

                    // Get category name for the product
                    const categoryName = foundProduct.categoryName || 'default';
                    console.log("Category Name:", categoryName);
                    
                    // productDescription.ts'den ürün açıklamasını ve özelliklerini al
                    let productDescription = foundProduct.description;
                    let productSpecs: Record<string, string> = {};

                    try {
                        const productKey = foundProduct.productName as keyof typeof productDescriptionData;
                        console.log("Checking specifications for product:", productKey);
                        
                        // Ürün adına göre productDescription.ts'den veri al
                        if (productDescriptionData[productKey]) {
                            const descData = productDescriptionData[productKey] as any;
                           //const spesData = productSpecsData[productKey] as any;

                            console.log("Found product data:", descData);
                            
                            // Açıklama bilgisini al
                            if (descData.description && descData.description.content) {
                                productDescription = descData.description.content;
                                console.log("Found description:", productDescription);
                            }
                            
                            // Specifications bilgisini al - description ile aynı mantık
                            if (descData.specifications && descData.specifications.content) {
                                console.log("Found specifications in product data:", descData.specifications);
                                
                                // Specifications içeriğini al
                                const specContent = descData.specifications.content;
                                console.log("Specifications content:", specContent);
                                
                                // Temel bilgileri içeren bir nesne oluştur
                                const parsedSpecs: Record<string, string> = {
                                    "Brand": foundProduct.productName.split(' ')[0] || "Generic",
                                    "Model": foundProduct.productName,
                                    "Warranty": "2 Years",
                                    "Condition": "New",
                                    "Package Contents": "1 x " + foundProduct.productName + ", User Manual, Warranty Card"
                                };
                                
                                // Eğer content bir string ise, onu anahtar-değer çiftlerine dönüştür
                                if (typeof specContent === 'string') {
                                    // Nokta işaretini kaldır ve virgülle ayrılmış parçalara böl
                                    const cleanedSpecString = specContent.replace(/\.$/, '');
                                    const specParts = cleanedSpecString.split(', ');
                                    console.log("Parsed spec parts:", specParts);
                                    
                                    // Her bir parçayı işle
                                    if (specParts.length > 0) {
                                        // İşlemci bilgisi
                                        if (specParts[0] && (specParts[0].includes('Ryzen') || specParts[0].includes('Core'))) {
                                            parsedSpecs["Processor"] = specParts[0];
                                        }
                                        
                                        // Ekran kartı bilgisi
                                        if (specParts[1] && specParts[1].includes('GeForce')) {
                                            parsedSpecs["Graphics"] = specParts[1];
                                        }
                                        
                                        // RAM bilgisi
                                        if (specParts[2] && specParts[2].includes('RAM')) {
                                            parsedSpecs["RAM"] = specParts[2];
                                        }
                                        
                                        // Depolama bilgisi
                                        if (specParts[3] && specParts[3].includes('SSD')) {
                                            parsedSpecs["Storage"] = specParts[3];
                                        }
                                        
                                        // Ekran bilgisi
                                        if (specParts[4] && specParts[4].includes('inch')) {
                                            parsedSpecs["Display"] = specParts[4];
                                        }
                                    }
                                } else if (typeof specContent === 'object') {
                                    // Eğer content bir nesne ise, doğrudan kullan
                                    Object.assign(parsedSpecs, specContent);
                                }
                                
                                productSpecs = parsedSpecs;
                                console.log("Parsed specifications:", productSpecs);
                            }
                        }
                        
                        // Eğer specifications bulunamazsa, kategori bazlı varsayılan özellikleri kullan
                        if (Object.keys(productSpecs).length === 0) {
                            console.log("No specifications found, using category-based defaults");
                            // Kategori bazlı özellikler
                            if (foundProduct.categoryName?.includes('Computer') || foundProduct.categoryName?.includes('Laptop')) {
                                productSpecs = {
                                    "Brand": foundProduct.productName.split(' ')[0] || "Generic",
                                    "Model": foundProduct.productName,
                                    "Processor": "AMD Ryzen 9 5900HX",
                                    "RAM": "16GB DDR4 3200MHz",
                                    "Storage": "1TB NVMe SSD",
                                    "Display": "14-inch QHD (2560 x 1440) 120Hz",
                                    "Graphics": "NVIDIA GeForce RTX 3060 6GB GDDR6",
                                    "Operating System": "Windows 11 Home",
                                    "Battery": "76WHr",
                                    "Weight": "1.7 kg",
                                    "Warranty": "2 Years",
                                    "Condition": "New",
                                    "Package Contents": "1 x " + foundProduct.productName + ", User Manual, Warranty Card"
                                };
                            } else if (foundProduct.categoryName?.includes('Phone') || foundProduct.categoryName?.includes('Mobile')) {
                                productSpecs = {
                                    "Brand": foundProduct.productName.split(' ')[0] || "Generic",
                                    "Model": foundProduct.productName,
                                    "Display": "6.1-inch Super Retina XDR OLED",
                                    "Processor": "A15 Bionic chip",
                                    "RAM": "6GB",
                                    "Storage": "128GB",
                                    "Camera": "Dual 12MP camera system (Wide, Ultra Wide)",
                                    "Front Camera": "12MP TrueDepth",
                                    "Battery": "3240mAh",
                                    "Operating System": "iOS 15",
                                    "Warranty": "2 Years",
                                    "Condition": "New",
                                    "Package Contents": "1 x " + foundProduct.productName + ", User Manual, Warranty Card"
                                };
                            } else {
                                // Genel özellikler
                                productSpecs = {
                                    "Brand": foundProduct.productName.split(' ')[0] || "Generic",
                                    "Model": foundProduct.productName,
                                    "Warranty": "2 Years",
                                    "Condition": "New",
                                    "Package Contents": "1 x " + foundProduct.productName + ", User Manual, Warranty Card"
                                };
                            }
                        }
                    } catch (error) {
                        console.error('Error getting product description and specifications:', error);
                        
                        // Hata durumunda varsayılan değerleri kullan
                        if (productDescriptionData.defaultDescriptionTitle && productDescriptionData.defaultDescriptionTitle.content) {
                            productDescription = productDescriptionData.defaultDescriptionTitle.content as string;
                        }
                        
                        // Hata durumunda varsayılan özellikleri kullan
                        productSpecs = {
                            "Brand": foundProduct.productName.split(' ')[0] || "Generic",
                            "Model": foundProduct.productName,
                            "Warranty": "2 Years",
                            "Condition": "New",
                            "Package Contents": "1 x " + foundProduct.productName + ", User Manual, Warranty Card"
                        };
                    }

                    // Get reviews for the product's category
                    let reviewComments: string[] = [];
                    
                    // Kategori adını doğru şekilde kullanarak yorumları al
                    if (categoryName && categoryReviews[categoryName as keyof typeof categoryReviews]) {
                        reviewComments = categoryReviews[categoryName as keyof typeof categoryReviews];
                    } else if (categoryReviews['Computer/Tablet']) {
                        // Eğer kategori bulunamazsa varsayılan olarak Computer/Tablet kategorisini kullan
                        reviewComments = categoryReviews['Computer/Tablet'];
                    } else {
                        // Hiçbir kategori bulunamazsa boş dizi kullan
                        reviewComments = [];
                    }
                    
                    console.log("Reviews:", reviewComments);
                    
                    // Format reviews to match the Review interface with improved rating algorithm
                    const formattedReviews = reviewComments.map(comment => {
                        // Yorum içeriğine göre yıldız sayısını belirle
                        let rating = 3; // Varsayılan olarak 3 yıldız

                        // Olumsuz içerik kontrolü
                        const negativeKeywords = [
                            'crashes', 'crash', 'problem', 'issue', 'bug', 'error', 'fail', 'failed', 'failure', 
                            'poor', 'bad', 'terrible', 'awful', 'horrible', 'worst', 'waste', 'disappointed', 
                            'disappointing', 'slow', 'laggy', 'freezes', 'froze', 'broken', 'useless'
                        ];
                        
                        // Olumlu içerik kontrolü
                        const positiveKeywords = [
                            'great', 'good', 'excellent', 'amazing', 'awesome', 'fantastic', 'wonderful', 
                            'perfect', 'love', 'best', 'recommend', 'recommended', 'easy', 'fast', 'reliable', 
                            'quality', 'value', 'worth', 'happy', 'satisfied', 'impressive', 'impressed'
                        ];

                        const lowerComment = comment.toLowerCase();
                        
                        // Olumsuz anahtar kelimeler varsa düşük puan ver
                        for (const keyword of negativeKeywords) {
                            if (lowerComment.includes(keyword)) {
                                rating = Math.max(1, rating - 1); // En düşük 1 yıldız
                            }
                        }
                        
                        // Olumlu anahtar kelimeler varsa yüksek puan ver
                        for (const keyword of positiveKeywords) {
                            if (lowerComment.includes(keyword)) {
                                rating = Math.min(5, rating + 1); // En yüksek 5 yıldız
                            }
                        }

                        return {
                            rating,
                            comment,
                            userName: `User${Math.floor(Math.random() * 1000)}`,
                            date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
                            avatar: `/avatars/user${Math.floor(Math.random() * 5) + 1}.png`
                        };
                    });

                    if (!foundProduct.image) {
                        try {
                            const categoryPrompt = basePrompts[foundProduct.categoryName as CategoryKey] || basePrompts.default;
                            const mainPrompt = categoryPrompt.main(foundProduct.productName);

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

                            if (mainImageData.success && mainImageData.image) {
                                foundProduct.image = `data:image/jpeg;base64,${mainImageData.image}`;
                            }

                            // Ek görseller için POST istekleri
                            const additionalImages = await Promise.all(
                                categoryPrompt.views.map(async (viewPrompt) => {
                                    const fullPrompt = `${mainPrompt}, ${viewPrompt}`;

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

                            foundProduct.additionalImages = additionalImages.filter((img: string | null) => img !== null) as string[];
                        } catch (error) {
                            console.error('Image generation error:', error);
                            foundProduct.image = '/placeholder.png';
                        }
                    }

                    setProduct({
                        ...foundProduct,
                        reviews: formattedReviews,
                        description: productDescription,
                        specs: productSpecs,
                        stock: productSupplier?.stock || 0
                    });
                    
                    // Debug için ürün bilgilerini konsola yazdır
                    console.log("Final product specs:", productSpecs);
                    console.log("Final product object:", {
                        ...foundProduct,
                        reviews: formattedReviews,
                        description: productDescription,
                        specs: productSpecs,
                        stock: productSupplier?.stock || 0
                    });
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
    }, [params.id, storeRating]);

    const handleAddToCart = () => {
        setIsInCart(true);
        setShowCartNotification(true);
        setTimeout(() => setShowCartNotification(false), 3000);
    };

    const handleToggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const handleToggleFollowStore = () => {
        setIsFollowingStore(!isFollowingStore);
    };

    if (loading || !product || !supplier || supplierRating === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {showCartNotification && <CartSuccessMessage onClose={() => setShowCartNotification(false)} />}
            
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
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

                        {/* Image Gallery */}
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

                    {/* Right Column - Product Info */}
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

                        {/* GamerGear Information */}
                        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl mr-3">
                                        G
                                    </div>
                                    <div>
                                        <p className="font-semibold">GamerGear</p>
                                        <div className="flex items-center mt-1">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span key={star} className="text-sm text-yellow-400">★</span>
                                                ))}
                                            </div>
                                            <span className="ml-1 text-sm text-gray-600">({storeRating.toFixed(1)}/10)</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleToggleFollowStore}
                                    className={`px-3 py-1 text-sm rounded-md ${isFollowingStore ? 'bg-gray-200 text-gray-700' : 'bg-blue-600 text-white'}`}
                                >
                                    {isFollowingStore ? 'Following' : 'Follow Store'}
                                </button>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-6">
                            Stock: <span className="font-semibold">{product.quantity || 0}</span> {product.quantity === 1 ? 'unit' : 'units'} available
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                                <CartFavorites />
                                <span>Add to Cart</span>
                            </button>

                            <button
                                onClick={handleToggleFavorite}
                                onMouseEnter={() => setIsHoveringFavorite(true)}
                                onMouseLeave={() => setIsHoveringFavorite(false)}
                                className={`w-14 flex items-center justify-center rounded-lg transition-colors ${
                                    isFavorite ? 'bg-red-500 text-white' : 
                                    isHoveringFavorite ? 'bg-red-500 text-white' : 
                                    'bg-gray-200 text-gray-600'
                                }`}
                                title="Add to Favorites"
                                aria-label="Add to favorites"
                            >
                                {isHoveringFavorite || isFavorite ? (
                                    <FavoritesPageHover />
                                ) : (
                                    <FavoriteIcon 
                                        width={24} 
                                        height={24} 
                                        className="text-gray-600"
                                    />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="flex border-b">
                        <button 
                            className={`px-6 py-3 font-medium ${activeTab === 'description' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('description')}
                        >
                            {productDetails.description.title}
                        </button>
                        <button 
                            className={`px-6 py-3 font-medium ${activeTab === 'specifications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('specifications')}
                        >
                            {productDetails.specifications.title}
                        </button>
                        <button 
                            className={`px-6 py-3 font-medium ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            {productDetails.reviews.title}
                        </button>
                        <button 
                            className={`px-6 py-3 font-medium ${activeTab === 'shipping' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('shipping')}
                        >
                            {productDetails.shipping.title}
                        </button>
                        <button 
                            className={`px-6 py-3 font-medium ${activeTab === 'returnPolicy' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('returnPolicy')}
                        >
                            {productDetails.returnPolicy.title}
                        </button>
                    </div>
                    
                    <div className="p-6">
                        {activeTab === 'description' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">
                                    {productDescriptionData.defaultDescriptionTitle?.title || productDetails.description.title}
                                </h3>
                                <p className="mb-4">{product.description || productDescriptionData.defaultDescriptionTitle?.content || productDetails.description.content}</p>
                            </div>
                        )}
                        
                        {activeTab === 'specifications' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">
                                    {productDescriptionData.defaultSpecification?.title || productDetails.specifications.title}
                                </h3>
                                {product.specs && Object.keys(product.specs).length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(product.specs).map(([key, value]) => (
                                            <div key={key} className="flex border-b border-gray-100 py-2 last:border-b-0">
                                                <span className="font-medium w-1/3">{key}:</span>
                                                <span className="w-2/3">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">
                                        {productDescriptionData.defaultSpecification?.content || productDetails.specifications.content}
                                    </p>
                                )}
                            </div>
                        )}
                        
                        {activeTab === 'reviews' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">{productDetails.reviews.title}</h3>
                                
                                {product.reviews && product.reviews.length > 0 ? (
                                    <div className="space-y-6">
                                        {product.reviews.map((review, index) => (
                                            <div key={index} className="border-b pb-4 last:border-b-0">
                                                <div className="flex items-center mb-2">
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                                                        {review.avatar ? (
                                                            <Image 
                                                                src={review.avatar} 
                                                                alt={review.userName} 
                                                                width={40} 
                                                                height={40} 
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white">
                                                                {review.userName[0]}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{review.userName}</p>
                                                        <div className="flex items-center">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <span key={star} className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                                            ))}
                                                            <span className="text-xs text-gray-500 ml-2">{review.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">{productDetails.reviews.content}</p>
                                )}
                            </div>
                        )}
                        
                        {activeTab === 'shipping' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">{productDetails.shipping.title}</h3>
                                <div className="space-y-4">
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <h5 className="font-medium mb-2">Delivery Options</h5>
                                        <ul className="list-disc pl-5 text-gray-600">
                                            {productDetails.shipping.content.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <h5 className="font-medium mb-2">Shipping Restrictions</h5>
                                        <p className="text-gray-600">
                                            Some products may not be available for delivery to certain regions. Please check the product details for more information.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'returnPolicy' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">{productDetails.returnPolicy.title}</h3>
                                
                                <div className="space-y-4">
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <h5 className="font-medium mb-2">Return Policy</h5>
                                        <ul className="list-disc pl-5 text-gray-600">
                                            {productDetails.returnPolicy.content.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div className="p-4 border border-gray-200 rounded-lg">
                                        <h5 className="font-medium mb-2">{productDetails.cancellation.title}</h5>
                                        <ul className="list-disc pl-5 text-gray-600">
                                            {productDetails.cancellation.content.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}