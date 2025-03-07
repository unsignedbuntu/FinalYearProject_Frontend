'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getProducts, getProductSuppliers, getStores, getSuppliers, createCacheImage, getCategories } from '@/services/Category_Actions';
import CartFavorites from '@/components/icons/CartFavorites';
import FavoriteIcon from '@/components/icons/FavoriteIcon';
import FavoritesPageHover from '@/components/icons/FavoritesPageHover';
import CartSuccessMessage from '@/components/messages/CartSuccessMessage';
import { generateProductPrompt } from './data/basePrompts';
import { categoryReviews } from './data/categoryReviews';
import { Product, ProductSupplier, Store, Category } from './types/Product';
import { basePrompts } from './data/basePrompts';
import { CategoryKey } from './data/basePrompts';
import { productDetails as productDescriptionData } from './data/productDescription';
import Link from 'next/link';

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

// Benzer Ürünler bileşeni
const SimilarProducts = ({ products, containerId = "similar-products-container", categoryName = "" }: { products: Product[], containerId?: string, categoryName?: string }) => {
    if (!products || products.length === 0) return null;
    
    const [hoveredProducts, setHoveredProducts] = useState<Record<number, boolean>>({});
    const [hoveredFavorites, setHoveredFavorites] = useState<Record<number, boolean>>({});
    const [hoveredCarts, setHoveredCarts] = useState<Record<number, boolean>>({});
    const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});
    
    // Görsel üretme fonksiyonu
    const generateProductImage = useCallback(async (product: Product) => {
        // Zaten görseli varsa ve placeholder değilse üretme
        if (product.image && 
            product.image.length > 0 && 
            !product.image.includes('placeholder') && 
            product.image !== '/placeholder.png') {
            console.log("Product already has a valid image, skipping generation:", product.productID);
            setLoadingImages(prev => ({ ...prev, [product.productID]: false }));
            return;
        }
        
        try {
            console.log("Checking for cached image for product:", product.productID, product.productName);
            setLoadingImages(prev => ({ ...prev, [product.productID]: true }));

            // Kategori adını belirle
            let productCategory = await getCategories().then(categories => 
                categories.find((c: any) => c.categoryID === product.categoryID)
            );
            console.log("Product category:", productCategory);
            
            // Kategori adını al, yoksa 'default' kullan
            const categoryName = productCategory?.categoryName || 'default';
            console.log("Using category name:", categoryName);
            
            const categoryPrompt = basePrompts[categoryName as CategoryKey] || basePrompts.default;
            const mainPrompt = categoryPrompt.main(product.productName);
            
            // Önce doğrudan backend'den görüntüyü almaya çalış
            console.log("Checking if image exists in backend cache");
            try {
                const directCacheResponse = await fetch(`/api/ImageCache/${encodeURIComponent('products')}/${encodeURIComponent(mainPrompt)}`);
                
                if (directCacheResponse.ok) {
                    const cacheData = await directCacheResponse.json();
                    if (cacheData.image) {
                        console.log("Image found in backend cache, using existing image");
                        product.image = `data:image/jpeg;base64,${cacheData.image}`;
                        setLoadingImages(prev => ({ ...prev, [product.productID]: false }));
                        return;
                    }
                }
            } catch (cacheError) {
                console.log("Image not found in direct cache, will try POST request");
            }
            
            // Eğer doğrudan bulunamazsa, POST isteği ile al veya oluştur
            console.log("Using POST request to get or generate image with prompt:", mainPrompt);
            try {
                const response = await fetch('/api/ImageCache', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        pageID: 'products',
                        prompt: mainPrompt
                    })
                });
                
                console.log("Image response status:", response.status);
                
                if (response.ok) {
                    const imageData = await response.json();
                    
                    if (imageData.success && imageData.image) {
                        console.log("Successfully got image, source:", imageData.source || "unknown");
                        product.image = `data:image/jpeg;base64,${imageData.image}`;
                    } else {
                        console.error("Failed to get image: Invalid response data");
                        product.image = '/placeholder.png';
                    }
                } else {
                    console.error(`Failed to get image: ${response.statusText}`);
                    product.image = '/placeholder.png';
                }
            } catch (error) {
                console.error("Error getting/generating image:", error);
                product.image = '/placeholder.png';
            }
            
            setLoadingImages(prev => ({ ...prev, [product.productID]: false }));
        } catch (error) {
            console.error('Error in image process:', error);
            setLoadingImages(prev => ({ ...prev, [product.productID]: false }));
            product.image = '/placeholder.png';
        }
    }, []);
    
    // Ürünlerin görsellerini kontrol et
    useEffect(() => {
        console.log("SimilarProducts component - products:", products);
        
        // Başlangıçta tüm ürünlerin yükleme durumunu false olarak ayarla
        const initialLoadingState: Record<number, boolean> = {};
        products.forEach(product => {
            initialLoadingState[product.productID] = false;
        });
        setLoadingImages(initialLoadingState);
        
        // Sadece görseli olmayan veya placeholder olan ürünler için görsel oluştur
        const productsWithoutImages = products.filter(p => 
            !p.image || 
            p.image === '/placeholder.png' || 
            p.image.includes('placeholder')
        );
        console.log("Products without images:", productsWithoutImages.length);
        
        // Görüntü oluşturma işlemlerini takip etmek için bir Set kullanıyoruz
        const processedProductIds = new Set<number>();
        
        if (productsWithoutImages.length > 0) {
            // Görüntü oluşturma işlemlerini sırayla yapmak için async fonksiyon
            const generateImagesSequentially = async () => {
                for (const product of productsWithoutImages) {
                    // Eğer bu ürün için daha önce görüntü oluşturma işlemi başlatıldıysa, tekrar işlem yapma
                    if (processedProductIds.has(product.productID)) {
                        console.log("Skipping duplicate image generation for product:", product.productID);
                        continue;
                    }
                    
                    // Bu ürün için görüntü oluşturma işlemi başlatıldığını kaydet
                    processedProductIds.add(product.productID);
                    
                    // Görüntü oluşturma işlemini başlat
                    await generateProductImage(product);
                    
                    // Kısa bir bekleme süresi ekleyerek API'ye aşırı yük bindirmeyi önle
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            };
            
            // Görüntü oluşturma işlemini başlat
            generateImagesSequentially();
        }
    }, [products, generateProductImage]);
    
    return (
        <div className="mt-8 border-t pt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
                Similar Products {categoryName && <span className="text-sm font-normal text-gray-500 ml-2">({categoryName})</span>}
            </h3>
            <div className="relative">
                <button 
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100"
                    onClick={() => {
                        const container = document.getElementById(containerId);
                        if (container) {
                            container.scrollBy({ left: -300, behavior: 'smooth' });
                        }
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                
                <div 
                    id={containerId}
                    className="flex overflow-x-auto pb-4 hide-scrollbar gap-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((similarProduct) => (
                        <div 
                            key={similarProduct.productID}
                            className="flex-shrink-0 w-56 border rounded-lg overflow-hidden hover:shadow-md transition-shadow relative"
                            onMouseEnter={() => setHoveredProducts(prev => ({ ...prev, [similarProduct.productID]: true }))}
                            onMouseLeave={() => setHoveredProducts(prev => ({ ...prev, [similarProduct.productID]: false }))}
                        >
                            <Link 
                                href={`/product/${similarProduct.productID}`}
                                className="block"
                            >
                                <div className="h-40 bg-gray-100 relative">
                                    {loadingImages[similarProduct.productID] ? (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : (
                                        <Image
                                            src={similarProduct.image || '/placeholder.png'}
                                            alt={similarProduct.productName}
                                            fill
                                            className="object-contain p-2"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            priority
                                        />
                                    )}
                                </div>
                                <div className="p-3">
                                    <h4 className="font-medium text-sm line-clamp-2 h-10">{similarProduct.productName}</h4>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-blue-600 font-bold">${similarProduct.price.toFixed(2)}</span>
                                        <span className="text-xs text-gray-500">Product</span>
                                    </div>
                                </div>
                            </Link>
                            
                            {/* Butonlar */}
                            <div className="absolute bottom-3 right-3 flex space-x-2">
                                {/* Favorilere Ekle Butonu */}
                                <button 
                                    className="p-2 rounded-full bg-white hover:bg-red-100 transition-colors shadow-sm"
                                    title="Favorilere Ekle"
                                    onMouseEnter={() => setHoveredFavorites(prev => ({ ...prev, [similarProduct.productID]: true }))}
                                    onMouseLeave={() => setHoveredFavorites(prev => ({ ...prev, [similarProduct.productID]: false }))}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        // Favorilere ekleme işlemi
                                        console.log('Favorilere eklendi:', similarProduct.productName);
                                    }}
                                >
                                    {hoveredFavorites[similarProduct.productID] ? (
                                        <FavoritesPageHover width={20} height={20} />
                                    ) : (
                                        <FavoriteIcon width={20} height={20} className="text-gray-600" />
                                    )}
                                </button>
                                
                                {/* Sepete Ekle Butonu */}
                                <button 
                                    className={`p-2 rounded-full shadow-sm ${
                                        hoveredCarts[similarProduct.productID] 
                                            ? 'bg-blue-100 text-blue-500' 
                                            : 'bg-white text-gray-500'
                                    }`}
                                    title="Sepete Ekle"
                                    onMouseEnter={() => setHoveredCarts(prev => ({ ...prev, [similarProduct.productID]: true }))}
                                    onMouseLeave={() => setHoveredCarts(prev => ({ ...prev, [similarProduct.productID]: false }))}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        // Sepete ekleme işlemi
                                        console.log('Sepete eklendi:', similarProduct.productName);
                                    }}
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-5 w-5" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                <button 
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100"
                    onClick={() => {
                        const container = document.getElementById(containerId);
                        if (container) {
                            container.scrollBy({ left: 300, behavior: 'smooth' });
                        }
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

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
    const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    
    // Sabit GamerGear puanı
    const storeRating = 5.7;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsData, suppliersData, storesData, allSuppliers, categoriesData] = await Promise.all([
                    getProducts(),
                    getProductSuppliers(),
                    getStores(),
                    getSuppliers(),
                    getCategories()
                ]);

                console.log("All products:", productsData.length);
                console.log("All categories:", categoriesData.length);

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

                    
                    // Eğer categoryID yoksa, ürün adına göre benzer ürünleri bul
                    let sameCategoryProducts = [];
                    
                    if (foundProduct.categoryID) {
                        // CategoryID'ye göre benzer ürünleri bul
                        sameCategoryProducts = productsData
                            .filter((p: Product) => 
                                p.categoryID === foundProduct.categoryID && 
                                p.productID !== foundProduct.productID
                            )
                            .slice(0, 10);
                        
                        console.log(`Found ${sameCategoryProducts.length} products with same categoryID: ${foundProduct.categoryID}`);
                    } else {
                        // Ürün adına göre benzer ürünleri bul
                        const productNameWords = foundProduct.productName.toLowerCase().split(' ');
                        
                        sameCategoryProducts = productsData
                            .filter((p: Product) => {
                                if (p.productID === foundProduct.productID) return false;
                                
                                // Ürün adında benzer kelimeler var mı kontrol et
                                const pNameLower = p.productName.toLowerCase();
                                return productNameWords.some((word: string) => 
                                    word.length > 3 && pNameLower.includes(word)
                                );
                            })
                            .slice(0, 10);
                        
                        console.log(`Found ${sameCategoryProducts.length} products with similar name`);
                    }
                    
                    // Eğer hala benzer ürün bulunamadıysa, rastgele ürünleri göster
                    if (sameCategoryProducts.length === 0) {
                        console.log("No similar products found, showing random products");
                        
                        // Rastgele 10 ürün seç (mevcut ürün hariç)
                        sameCategoryProducts = productsData
                            .filter((p: Product) => p.productID !== foundProduct.productID)
                            .sort(() => 0.5 - Math.random())
                            .slice(0, 10);
                        
                        console.log(`Selected ${sameCategoryProducts.length} random products`);
                    }
                    
                    console.log("Similar products:", sameCategoryProducts.map((p: Product) => p.productName));
                    setSimilarProducts(sameCategoryProducts);
                    
                    // Benzer ürünler için görüntü oluştur
                    const processedProductIds = new Set<number>();
                    
                    // Görüntü oluşturma işlemlerini toplu olarak yapmak için bir dizi oluştur
                    const productsNeedingImages = sameCategoryProducts.filter((similarProduct: Product) => {
                        // Eğer bu ürün için daha önce görüntü oluşturma işlemi başlatıldıysa, tekrar işlem yapma
                        if (processedProductIds.has(similarProduct.productID)) {
                            console.log("Skipping duplicate image generation for similar product:", similarProduct.productName);
                            return false;
                        }
                        
                        // Eğer ürünün zaten geçerli bir görseli varsa, işlem yapma
                        if (similarProduct.image && 
                            similarProduct.image.length > 0 && 
                            !similarProduct.image.includes('placeholder') && 
                            similarProduct.image !== '/placeholder.png') {
                            console.log("Similar product already has a valid image, skipping generation:", similarProduct.productName);
                            return false;
                        }
                        
                        // Bu ürün için görüntü oluşturma işlemi başlatıldığını kaydet
                        processedProductIds.add(similarProduct.productID);
                        return true;
                    });
                    
                    console.log(`Found ${productsNeedingImages.length} similar products needing images`);
                    
                    // Her bir ürün için görüntü oluştur
                    for (const similarProduct of productsNeedingImages) {
                        try {
                            // Kategori adını belirle
                            const similarProductCategoryName = category?.categoryName || 'default';
                            
                            const similarProductCategoryPrompt = basePrompts[similarProductCategoryName as CategoryKey] || basePrompts.default;
                            const similarProductMainPrompt = similarProductCategoryPrompt.main(similarProduct.productName);
                            
                            // Önce doğrudan backend'den görüntüyü almaya çalış
                            console.log("Checking if image exists in backend cache for similar product:", similarProduct.productName);
                            try {
                                const directCacheResponse = await fetch(`/api/ImageCache/${encodeURIComponent('products')}/${encodeURIComponent(similarProductMainPrompt)}`);
                                
                                if (directCacheResponse.ok) {
                                    const cacheData = await directCacheResponse.json();
                                    if (cacheData.image) {
                                        console.log("Image found in backend cache, using existing image for similar product");
                                        similarProduct.image = `data:image/jpeg;base64,${cacheData.image}`;
                                        continue; // Bu ürün için işlem tamamlandı, sonraki ürüne geç
                                    }
                                }
                            } catch (cacheError) {
                                console.log("Image not found in direct cache for similar product, will try POST request");
                            }
                            
                            // Eğer doğrudan bulunamazsa, POST isteği ile al veya oluştur
                            console.log("Using POST request to get or generate image for similar product:", similarProduct.productName);
                            console.log("Using prompt:", similarProductMainPrompt);
                            
                            const response = await fetch('/api/ImageCache', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    pageID: 'products',
                                    prompt: similarProductMainPrompt
                                })
                            });
                            
                            console.log("Similar product image response status:", response.status);
                            
                            if (response.ok) {
                                const imageData = await response.json();
                                
                                if (imageData.success && imageData.image) {
                                    console.log("Successfully got image for similar product, source:", imageData.source || "unknown");
                                    similarProduct.image = `data:image/jpeg;base64,${imageData.image}`;
                                } else {
                                    console.error("Failed to get image for similar product: Invalid response data");
                                    similarProduct.image = '/placeholder.png';
                                }
                            } else {
                                console.error(`Failed to get image for similar product: ${response.statusText}`);
                                similarProduct.image = '/placeholder.png';
                            }
                        } catch (error) {
                            console.error("Error in image process for similar product:", error);
                            similarProduct.image = '/placeholder.png';
                        }
                    }

                    setCategory(foundProduct.category);
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
                                
                                {/* Benzer Ürünler */}
                                <div className="mt-8 border-t pt-4">
                                    {similarProducts.length > 0 ? (
                                        <SimilarProducts 
                                            products={similarProducts} 
                                            categoryName={category?.categoryName || ""}
                                        />
                                    ) : (
                                        <p className="text-gray-500 italic mt-4">No similar products found.</p>
                                    )}
                                </div>
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