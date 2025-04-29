'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getProducts, getProductSuppliers, getStores, getSuppliers, getCategories } from '@/services/API_Service';
import CartFavorites from '@/components/icons/CartFavorites';
import FavoriteIcon from '@/components/icons/FavoriteIcon';
import FavoritesPageHover from '@/components/icons/FavoritesPageHover';
import CartSuccessMessage from '@/components/messages/CartSuccessMessage';
import FavoritesAddedMessage from '@/components/messages/FavoritesAddedMessage';
import { categoryReviews } from './data/categoryReviews';
import { Product, ProductSupplier, Store, Category, Review } from './types/Product';
import { basePrompts, CategoryKey } from './data/basePrompts';
import { productDetails as productDescriptionData } from './data/productDescription';
import Link from 'next/link';
import { useCartStore } from '@/app/stores/cartStore';
import { useFavoritesStore, FavoriteProduct } from '@/app/stores/favoritesStore';
import { toast } from 'react-hot-toast';

// Ürün detayları için geçici veri
const productDetailsStatic = {
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

// Tüm işlenmiş promptları takip etmek için global bir cache oluştur
const globalImageCache: Record<string, string> = {};

// Benzer Ürünler bileşeni
const SimilarProducts = ({ products, containerId = "similar-products-container", categoryName = "" }: { products: Product[], containerId?: string, categoryName?: string }) => {
    if (!products || products.length === 0) return null;
    
    const [hoveredProducts, setHoveredProducts] = useState<Record<number, boolean>>({});
    const [hoveredFavorites, setHoveredFavorites] = useState<Record<number, boolean>>({});
    const [hoveredCarts, setHoveredCarts] = useState<Record<number, boolean>>({});
    const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});
    const [imagesGenerated, setImagesGenerated] = useState(false);
    
    // Store hooks
    const { addItem: addToCart } = useCartStore();
    const { addProduct: addToFavorites, removeProduct: removeFromFavorites, isFavorite } = useFavoritesStore();
    
    // Görsel üretme fonksiyonu - Frontend cache kontrolü kaldırıldı
    const generateProductImage = useCallback(async (product: Product) => {
        if (product.image && product.image.length > 0 && !product.image.includes('placeholder') && product.image !== '/placeholder.png') {
            return;
        }
        
        console.log("SP: Attempting to get/generate image for:", product.productID, product.productName);
            setLoadingImages(prev => ({ ...prev, [product.productID]: true }));

        try {
            const categories = await getCategories();
            const productCategory = categories.find((c: any) => c.categoryID === product.categoryID);
            const categoryName = productCategory?.categoryName || 'default';
            const categoryPrompt = basePrompts[categoryName as CategoryKey] || basePrompts.default;
            const mainPrompt = categoryPrompt.main(product.productName);
            
            // Directly call API - Backend handles caching
                const response = await fetch('/api/ImageCache', {
                    method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pageID: 'products', prompt: mainPrompt, checkOnly: false })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.image) {
                    console.log("SP: Successfully got image for product:", product.productID);
                    product.image = `data:image/jpeg;base64,${data.image}`;
                    } else {
                    console.error("SP: Failed to get image (API):", product.productID, data.message || '');
                        product.image = '/placeholder.png';
                    }
                } else {
                console.error("SP: Failed to get image (HTTP):", product.productID, response.status);
                    product.image = '/placeholder.png';
                }
            } catch (error) {
            console.error("SP: Exception during image fetch:", product.productID, error);
                product.image = '/placeholder.png';
        } finally {
            setLoadingImages(prev => ({ ...prev, [product.productID]: false }));
        }
    }, []);
    
    // Ürünlerin görsellerini kontrol et - generateProductImage bağımlılığı kaldırıldı
    useEffect(() => {
        if (imagesGenerated) {
            // console.log("SP: Images already generated."); // Optional log
            return;
        }
        
        const initialLoadingState: Record<number, boolean> = {};
        products.forEach(product => { initialLoadingState[product.productID] = false; });
        setLoadingImages(initialLoadingState);
        
        const productsNeedingImages = products.filter(p => 
            !p.image || p.image === '/placeholder.png' || p.image.includes('placeholder')
        );
        
        if (productsNeedingImages.length > 0) {
            console.log(`SP: Found ${productsNeedingImages.length} products needing images`);
            const generateImages = async () => {
                for (const product of productsNeedingImages) {
                    await generateProductImage(product);
                    await new Promise(resolve => setTimeout(resolve, 500)); // Keep delay
                }
                console.log("SP: Finished generating images loop.");
                setImagesGenerated(true);
                // Force update by creating new array reference AFTER generation attempt
                const updatedProducts = products.map(p => ({...p}));
                // Find the parent component update mechanism if needed, or rely on loading state change
                console.log("SP: Image generation attempts complete.");
            };
            generateImages();
        } else {
            console.log("SP: No products needed image generation.");
            setImagesGenerated(true);
        }
    // Removed generateProductImage from dependency array
    }, [products, imagesGenerated]);
    
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
                        if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
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
                    {products.map((similarProduct) => {
                        const productIsFavorite = isFavorite(similarProduct.productID);
                        return (
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
                                            <span className="text-blue-600 font-bold">{similarProduct.price.toFixed(2)} TL</span>
                                        <span className="text-xs text-gray-500">{similarProduct.supplierName || 'GamerGear'}</span>
                                    </div>
                                </div>
                            </Link>
                            
                            {/* Butonlar */}
                            <div className="absolute bottom-3 right-3 flex space-x-2">
                                {/* Favorilere Ekle Butonu */}
                                <button 
                                        className={`p-2 rounded-full transition-colors shadow-sm ${ 
                                            productIsFavorite ? 'bg-red-500 text-white' : 
                                            hoveredFavorites[similarProduct.productID] ? 'bg-red-100 text-red-500' : 
                                            'bg-white text-gray-500 hover:bg-red-100'
                                        }`}
                                        title={productIsFavorite ? "Favorilerden Kaldır" : "Favorilere Ekle"}
                                    onMouseEnter={() => setHoveredFavorites(prev => ({ ...prev, [similarProduct.productID]: true }))}
                                    onMouseLeave={() => setHoveredFavorites(prev => ({ ...prev, [similarProduct.productID]: false }))}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                            const favProduct: FavoriteProduct = {
                                                id: similarProduct.productID, 
                                                name: similarProduct.productName, 
                                                price: similarProduct.price, 
                                                image: similarProduct.image || '/placeholder.png', 
                                                date: new Date(),
                                                inStock: (similarProduct.stockQuantity ?? 0) > 0,
                                                selected: false,
                                                listId: undefined
                                            };
                                            if (productIsFavorite) {
                                                removeFromFavorites(similarProduct.productID);
                                            } else {
                                                addToFavorites(favProduct);
                                            }
                                        }}
                                    >
                                        {productIsFavorite || hoveredFavorites[similarProduct.productID] ? (
                                        <FavoritesPageHover width={20} height={20} />
                                    ) : (
                                        <FavoriteIcon width={20} height={20} className="text-gray-600" />
                                    )}
                                </button>
                                
                                {/* Sepete Ekle Butonu */}
                                <button 
                                        className={`p-2 rounded-full shadow-sm transition-colors ${ 
                                        hoveredCarts[similarProduct.productID] 
                                            ? 'bg-blue-100 text-blue-500' 
                                                : 'bg-white text-gray-500 hover:bg-blue-100'
                                    }`}
                                    title="Add to Cart"
                                    onMouseEnter={() => setHoveredCarts(prev => ({ ...prev, [similarProduct.productID]: true }))}
                                    onMouseLeave={() => setHoveredCarts(prev => ({ ...prev, [similarProduct.productID]: false }))}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                            addToCart({ 
                                                productId: similarProduct.productID,
                                                name: similarProduct.productName,
                                                supplier: similarProduct.supplierName || 'GamerGear',
                                                price: similarProduct.price,
                                                image: '/placeholder.png'
                                            });
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
                        )
                    })}
                </div>
                
                <button 
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100"
                    onClick={() => {
                        const container = document.getElementById(containerId);
                        if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
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
    const productId = Number(params.id);
    const [product, setProduct] = useState<Product | null>(null);
    const [supplier, setSupplier] = useState<ProductSupplier | null>(null);
    const [store, setStore] = useState<Store | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCartNotification, setShowCartNotification] = useState(false);
    const [showFavoriteNotification, setShowFavoriteNotification] = useState(false);
    const [isFollowingStore, setIsFollowingStore] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('description');
    const [isHoveringFavorite, setIsHoveringFavorite] = useState(false);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    
    // Store hooks
    const { addItem: addToCart, items: cartItems } = useCartStore();
    const { addProduct: addToFavorites, removeProduct: removeFromFavorites, isFavorite } = useFavoritesStore();

    const productIsFavorite = isFavorite(productId);
    const productIsInCart = cartItems.some(item => item.id === productId);

    const storeRating = 5.7;

    useEffect(() => {
        const fetchData = async () => {
            if (!productId) return;
            console.log(`Fetching data for product ID: ${productId}`);
            try {
                setLoading(true);
                const [productsData, suppliersData, storesData, allSuppliers, categoriesData] = await Promise.all([
                    getProducts(),
                    getProductSuppliers(),
                    getStores(),
                    getSuppliers(),
                    getCategories()
                ]);

                console.log("Total products fetched:", productsData.length);
                console.log("Total categories fetched:", categoriesData.length);

                const foundProduct = productsData.find((p: Product) => p.productID === productId);

                if (foundProduct) {
                    console.log("Product found:", foundProduct.productName);
                    const productSupplier = suppliersData.find((s: ProductSupplier) => s.productID === foundProduct.productID);
                    let fetchedSupplier: ProductSupplier | null = null;
                    let fetchedStore: Store | null = null;

                    if (productSupplier) {
                        console.log("Supplier info found (raw API):", productSupplier);
                        const supplierDetails = allSuppliers.find((s: any) => s.supplierID === productSupplier.supplierID);

                        // Create fetchedSupplier - NO NEED to handle stock here
                        fetchedSupplier = {
                            productSupplierID: productSupplier.productSupplierID,
                            productID: productSupplier.productID,
                            supplierID: productSupplier.supplierID,
                            // status: productSupplier.status, // Status was removed
                            supplierName: supplierDetails?.supplierName || 'GamerGear',
                            rating: storeRating,
                            stock: 0 // Keep the field for type compatibility, but value comes from Product
                        };
                        setSupplier(fetchedSupplier);
                        console.log("Supplier state set (stock comes from Product):", fetchedSupplier);

                        const foundStore = storesData.find((s: Store) => s.storeID === productSupplier.supplierID);
                        if (foundStore) {
                           fetchedStore = {
                                ...foundStore,
                                rating: storeRating
                            };
                            setStore(fetchedStore);
                            console.log("Store details set:", fetchedStore);
                        }
                    } else {
                        console.warn("No supplier found for product ID:", productId);
                        // Even if no supplier, product itself has stockQuantity
                    }

                    const productCategory = categoriesData.find((c: Category) => c.categoryID === foundProduct.categoryID);
                    setCategory(productCategory || null);
                    const categoryName = productCategory?.categoryName || 'default';
                    console.log("Product category:", categoryName);

                    // Process description and specs (REVERTED LOGIC)
                    let productDescription = foundProduct.description;
                    let productSpecs: Record<string, string> = {};
                    try {
                        const productKey = foundProduct.productName as keyof typeof productDescriptionData;
                        console.log("Checking description/specs for product key:", productKey);
                        if (productDescriptionData[productKey]) {
                            const descData = productDescriptionData[productKey] as any;
                            console.log("Found data in productDescriptionData:", descData);
                            if (descData.description?.content) {
                                productDescription = descData.description.content;
                                console.log("Using description from productDescriptionData");
                            }
                            if (descData.specifications?.content) {
                                console.log("Found specifications in productDescriptionData");
                                const specContent = descData.specifications.content;
                                const parsedSpecs: Record<string, string> = {
                                    "Brand": foundProduct.productName.split(' ')[0] || "Generic",
                                    "Model": foundProduct.productName,
                                    "Warranty": "2 Years",
                                    "Condition": "New",
                                    "Package Contents": "1 x " + foundProduct.productName + ", User Manual, Warranty Card" // Default package contents
                                };
                                if (typeof specContent === 'string') {
                                    const cleanedSpecString = specContent.replace(/\.$/, '');
                                    const specParts = cleanedSpecString.split(', ');
                                    console.log("Parsed spec string parts:", specParts);
                                    if (specParts[0]?.includes('Ryzen') || specParts[0]?.includes('Core')) parsedSpecs["Processor"] = specParts[0];
                                    if (specParts[1]?.includes('GeForce')) parsedSpecs["Graphics"] = specParts[1];
                                    if (specParts[2]?.includes('RAM')) parsedSpecs["RAM"] = specParts[2];
                                    if (specParts[3]?.includes('SSD')) parsedSpecs["Storage"] = specParts[3];
                                    if (specParts[4]?.includes('inch')) parsedSpecs["Display"] = specParts[4];
                                } else if (typeof specContent === 'object') {
                                    Object.assign(parsedSpecs, specContent);
                                }
                                productSpecs = parsedSpecs;
                                console.log("Parsed specifications from productDescriptionData:", productSpecs);
                            }
                        }
                        
                        if (Object.keys(productSpecs).length === 0) {
                             console.log("No specific specs found, using category defaults");
                            // Kategori bazlı özellikler
                             if (categoryName.includes('Computer') || categoryName.includes('Laptop')) {
                                productSpecs = {
                                    "Brand": foundProduct.productName.split(' ')[0] || "Generic", "Model": foundProduct.productName, "Processor": "AMD Ryzen 9", "RAM": "16GB DDR4", "Storage": "1TB SSD", "Warranty": "2 Years", "Condition": "New", "Package Contents": "1 x " + foundProduct.productName + ", User Manual, Warranty Card"
                                };
                            } else if (categoryName.includes('Phone') || categoryName.includes('Mobile')) {
                                productSpecs = {
                                    "Brand": foundProduct.productName.split(' ')[0] || "Generic", "Model": foundProduct.productName, "Display": "6.1-inch OLED", "Processor": "A15 Bionic", "Storage": "128GB", "Warranty": "2 Years", "Condition": "New", "Package Contents": "1 x " + foundProduct.productName + ", User Manual, Warranty Card"
                                };
                            } else {
                                productSpecs = { "Brand": foundProduct.productName.split(' ')[0] || "Generic", "Model": foundProduct.productName, "Warranty": "2 Years", "Condition": "New", "Package Contents": "1 x " + foundProduct.productName + ", User Manual, Warranty Card" };
                            }
                             console.log("Applied category default specs:", productSpecs);
                        }
                    } catch (error) {
                        console.error('Error processing product description/specs:', error);
                        productDescription = productDescriptionData.defaultDescriptionTitle?.content as string || "High quality product.";
                        productSpecs = { "Brand": foundProduct.productName.split(' ')[0] || "Generic", "Model": foundProduct.productName, "Warranty": "2 Years", "Condition": "New", "Package Contents": "1 x " + foundProduct.productName + ", User Manual, Warranty Card" };
                        console.log("Applied error default specs:", productSpecs);
                    }

                    // Process reviews (REVERTED LOGIC)
                    let reviewComments: string[] = [];
                    if (categoryName && categoryReviews[categoryName as keyof typeof categoryReviews]) {
                        reviewComments = categoryReviews[categoryName as keyof typeof categoryReviews];
                    } else if (categoryReviews['Computer/Tablet']) { // Fallback
                        reviewComments = categoryReviews['Computer/Tablet'];
                    }
                    console.log(`Found ${reviewComments.length} review comments for category ${categoryName}`);
                    
                    const formattedReviews = reviewComments.map(comment => {
                        let rating = 3; // Default rating
                        const negativeKeywords = ['crashes', 'problem', 'issue', 'bug', 'poor', 'bad', 'slow', 'laggy', 'broken', 'fail'];
                        const positiveKeywords = ['great', 'good', 'excellent', 'amazing', 'fast', 'quality', 'value', 'recommend', 'happy'];
                        const lowerComment = comment.toLowerCase();
                        if (negativeKeywords.some(kw => lowerComment.includes(kw))) rating = Math.max(1, rating - 1);
                        if (positiveKeywords.some(kw => lowerComment.includes(kw))) rating = Math.min(5, rating + 1);
                        return {
                            rating, comment,
                            userName: `User${Math.floor(Math.random() * 1000)}`,
                            date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
                            avatar: `/avatars/user${Math.floor(Math.random() * 5) + 1}.png`
                        };
                    });
                    console.log("Formatted reviews count:", formattedReviews.length);

                     // Main and Additional Image Generation - Simplified Frontend Cache Logic
                    if (!foundProduct.image || foundProduct.image === '/placeholder.png' || foundProduct.image.includes('placeholder')) {
                        console.log("PP: Product needs main image generation.");
                        try {
                            const categories = await getCategories(); // Fetch categories if needed
                            const productCategory = categories.find((c: Category) => c.categoryID === foundProduct.categoryID);
                            const categoryName = productCategory?.categoryName || 'default';
                            const categoryPrompt = basePrompts[categoryName as CategoryKey] || basePrompts.default;
                            const mainPrompt = categoryPrompt.main(foundProduct.productName);
                            console.log("PP: Generating main image with prompt:", mainPrompt);

                            // Directly call API - Backend handles caching
                            const mainImageResponse = await fetch('/api/ImageCache', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ pageID: 'products', prompt: mainPrompt, checkOnly: false })
                            });

                            if (mainImageResponse.ok) {
                            const mainImageData = await mainImageResponse.json();
                            if (mainImageData.success && mainImageData.image) {
                                foundProduct.image = `data:image/jpeg;base64,${mainImageData.image}`;
                                    console.log("PP: Main image retrieved/generated.");
                                } else {
                                    console.error("PP: Main image generation failed (API):");
                                    foundProduct.image = '/placeholder.png';
                                }
                            } else {
                                console.error("PP: Main image generation failed (HTTP):");
                                foundProduct.image = '/placeholder.png';
                            }

                            // Generate additional images only if main image is valid
                            if (foundProduct.image && foundProduct.image !== '/placeholder.png') {
                                console.log("PP: Generating additional images...");
                                const additionalImagesPromises = categoryPrompt.views.slice(0, 3).map(async (viewPrompt) => {
                                    const fullPrompt = `${mainPrompt}, ${viewPrompt}`;
                                    console.log("PP: Generating additional image with prompt:", fullPrompt);
                                    try {
                                    const response = await fetch('/api/ImageCache', {
                                        method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ pageID: 'products', prompt: fullPrompt, checkOnly: false })
                                        });
                                        if (response.ok) {
                                    const data = await response.json();
                                            if (data.success && data.image) {
                                                return `data:image/jpeg;base64,${data.image}`;
                                            } else {
                                                console.error("PP: Add. image failed (API):"); return null;
                                            }
                                        } else {
                                            console.error("PP: Add. image failed (HTTP):"); return null;
                                        }
                        } catch (error) {
                                        console.error("PP: Add. image exception:", error); return null;
                                    }
                                });
                                foundProduct.additionalImages = (await Promise.all(additionalImagesPromises)).filter((img): img is string => img !== null);
                                console.log("PP: Generated additional images count:", foundProduct.additionalImages?.length || 0);
                    } else {
                                console.log("PP: Skipping additional images due to main image failure.");
                                foundProduct.additionalImages = [];
                            }
                        } catch (error) {
                            console.error('PP: Image generation process error:', error);
                            foundProduct.image = '/placeholder.png';
                            foundProduct.additionalImages = [];
                        }
                    } else {
                        console.log("PP: Product already has a main image.");
                        if (!Array.isArray(foundProduct.additionalImages)) {
                             foundProduct.additionalImages = []; // Ensure it's an array
                        }
                        // Potentially check/generate missing additional images even if main exists?
                        // (Current logic only generates additional if main was missing)
                    }

                    // Calculate stock from the main product data
                    const actualStock = foundProduct.stockQuantity ?? 0;
                    console.log("Using stockQuantity directly from foundProduct:", actualStock);

                    // Update product state using stock from foundProduct
                    setProduct((prevProduct) => ({
                        ...(prevProduct || foundProduct), // Use previous state or initial foundProduct
                        ...foundProduct, // Ensure latest basic product details are used
                        reviews: formattedReviews, // Assuming formattedReviews is defined earlier
                        description: productDescription, // Assuming defined earlier
                        specs: productSpecs, // Assuming defined earlier
                        stockQuantity: actualStock, // USE stockQuantity FROM foundProduct!
                        supplierName: fetchedSupplier?.supplierName || 'GamerGear'
                    }));
                    console.log("Final product state updated using foundProduct.stockQuantity.");

                    // Find similar products using categoryName
                    let sameCategoryProducts: Product[] = [];
                    // Ana ürünün categoryName'i var mı kontrol et
                    if (foundProduct.categoryName) { 
                         // categoryName'e göre filtrele
                        const filteredByCategoryName = productsData
                            .filter((p: Product) => {
                                // Hem p hem de foundProduct için categoryName var mı kontrol et
                                const match = p.categoryName === foundProduct.categoryName && p.productID !== foundProduct.productID;
                                return match;
                            });
                        
                        sameCategoryProducts = filteredByCategoryName.slice(0, 10); // Limit to 10
                         console.log(`Found ${sameCategoryProducts.length} similar products by categoryName (after slice).`);
                    } 
                    
                    // Add supplier name
                     sameCategoryProducts.forEach((sp: Product) => {
                        const spSupplier = suppliersData.find((s: ProductSupplier) => s.productID === sp.productID);
                        if (spSupplier) {
                            const spSupplierDetails = allSuppliers.find((s: any) => s.supplierID === spSupplier.supplierID);
                            sp.supplierName = spSupplierDetails?.supplierName || 'GamerGear';
                        } else {
                            sp.supplierName = 'GamerGear';
                        }
                    });
                    setSimilarProducts(sameCategoryProducts); 

                                } else {
                     console.error("Product not found for ID:", productId);
                            }
                        } catch (error) {
                console.error('Error fetching product data:', error);
            } finally {
                setLoading(false);
                console.log("Finished fetching data.");
            }
        };

            fetchData();
    }, [productId]);

    const handleAddToCart = () => {
        if (!product) return;
        // addToCart çağrılmadan önce product nesnesini logla
        console.log("Adding product to cart (page - product object):", JSON.stringify(product, null, 2)); 
        addToCart({
            productId: product.productID, 
            name: product.productName,
            supplier: product.supplierName || 'GamerGear',
            price: product.price,
            image: '/placeholder.png',
        });
        setShowCartNotification(true);
        setTimeout(() => setShowCartNotification(false), 3000);
    };

    const handleToggleFavorite = () => {
        if (!product) return;
        const favProduct: FavoriteProduct = {
            id: product.productID,
            name: product.productName,
            price: product.price,
            image: '/placeholder.png', 
            date: new Date(),
            inStock: (product.stockQuantity ?? 0) > 0,
            selected: false, 
            listId: undefined
        };
        if (isFavorite(product.productID)) {
            removeFromFavorites(product.productID);
            toast.success(`${product.productName} removed from favorites!`);
        } else {
            addToFavorites(favProduct);
            setShowFavoriteNotification(true);
        }
    };

    const handleToggleFollowStore = () => {
        setIsFollowingStore(!isFollowingStore);
        console.log("Follow store toggled (needs API integration)");
    };

    if (loading) { // Removed !product check, let loading handle initial state
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!product) {
         return <div className="flex justify-center items-center min-h-screen">Product not found.</div>;
    }

    return (
        <div className="flex-1">
            {showCartNotification && <CartSuccessMessage onClose={() => setShowCartNotification(false)} />}
            {showFavoriteNotification && <FavoritesAddedMessage onClose={() => setShowFavoriteNotification(false)} />}
            
            <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50">
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

                        {/* Image Gallery (Ensure this uses product.additionalImages) */}
                        {product.additionalImages && product.additionalImages.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                                {/* Thumbnail for main image */}
                                <button
                                    className="aspect-w-1 aspect-h-1 bg-white rounded-lg overflow-hidden shadow-sm border-2 border-blue-500" // Highlight current main
                                >
                                    <Image
                                        src={product.image || '/placeholder.png'}
                                        alt={`${product.productName} main view`}
                                        width={120}
                                        height={120}
                                        className="object-contain w-full h-full p-2"
                                    />
                                </button>
                                {/* Thumbnails for additional images */}
                                {product.additionalImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            console.log("Switching main image to additional image:", i);
                                            const currentMain = product.image;
                                            const newAdditional = [...(product.additionalImages || [])]; // Create a mutable copy
                                            newAdditional[i] = currentMain!; // Swap
                                            setProduct(prev => prev ? {
                                                ...prev,
                                                image: img, // Set new main image
                                                additionalImages: newAdditional // Set updated additional images
                                            } : null);
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
                                {product.price.toFixed(2)} TL
                            </div>
                            <div className="flex items-center">
                                {product.reviews && product.reviews.length > 0 ? (
                                    <>
                                {[1, 2, 3, 4, 5].map((star) => (
                                            <span key={star} className={`text-xl ${star <= Math.round(product.reviews!.reduce((a, b) => a + b.rating, 0) / product.reviews!.length) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                ))}
                                        <span className="text-sm text-gray-500 ml-2">({product.reviews.length} reviews)</span>
                                    </>
                                ) : (
                                     <span className="text-sm text-gray-500">No reviews yet</span> 
                                )} 
                            </div>
                        </div>

                        {/* GamerGear Information */}
                        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl mr-3">
                                        {(product.supplierName || '?')[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{product.supplierName || 'Unknown Supplier'}</p>
                                        <div className="flex items-center mt-1">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span key={star} className={`text-sm ${star <= Math.round(storeRating / 2) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span> 
                                                ))}
                                            </div>
                                            <span className="ml-1 text-sm text-gray-600">({storeRating.toFixed(1)}/10)</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleToggleFollowStore}
                                    className={`px-3 py-1 text-sm rounded-md ${isFollowingStore ? 'bg-gray-200 text-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                >
                                    {isFollowingStore ? 'Following' : 'Follow Store'}
                                </button>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-6">
                             Stock: <span className="font-semibold">{product.stockQuantity ?? 0}</span> { (product.stockQuantity ?? 0) === 1 ? 'unit' : 'units'} available
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={(product.stockQuantity ?? 0) === 0}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-colors ${(product.stockQuantity ?? 0) === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            >
                                <CartFavorites />
                                <span>{(product.stockQuantity ?? 0) === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                            </button>

                            <button
                                onClick={handleToggleFavorite}
                                onMouseEnter={() => setIsHoveringFavorite(true)}
                                onMouseLeave={() => setIsHoveringFavorite(false)}
                                className={`w-14 flex items-center justify-center rounded-lg transition-colors ${
                                    productIsFavorite ? 'bg-red-500 text-white' :
                                    isHoveringFavorite ? 'bg-red-100 text-red-500' :
                                    'bg-gray-200 text-gray-600 hover:bg-red-100'
                                }`}
                                title={productIsFavorite ? "Remove from Favorites" : "Add to Favorites"}
                                aria-label={productIsFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                                {productIsFavorite || isHoveringFavorite ? (
                                    <FavoritesPageHover width={24} height={24} />
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
                <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden md:col-span-2">
                    <div className="flex border-b">
                        <button 
                            className={`px-6 py-3 font-medium ${activeTab === 'description' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                            onClick={() => setActiveTab('description')}
                        >
                           Description 
                        </button>
                        <button 
                            className={`px-6 py-3 font-medium ${activeTab === 'specifications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                            onClick={() => setActiveTab('specifications')}
                        >
                           Specifications 
                        </button>
                        <button 
                            className={`px-6 py-3 font-medium ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews ({product.reviews?.length || 0})
                        </button>
                        <button 
                            className={`px-6 py-3 font-medium ${activeTab === 'shipping' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                            onClick={() => setActiveTab('shipping')}
                        >
                           Shipping 
                        </button>
                        <button 
                            className={`px-6 py-3 font-medium ${activeTab === 'returnPolicy' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                            onClick={() => setActiveTab('returnPolicy')}
                        >
                            Return Policy
                        </button>
                    </div>
                    
                    <div className="p-6">
                        {activeTab === 'description' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                                <p className="mb-4 text-gray-700 leading-relaxed">{product.description || "No description available."}</p> 
                                
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
                                <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                                {product.specs && Object.keys(product.specs).length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                        {Object.entries(product.specs).map(([key, value]) => (
                                            <div key={key} className="flex border-b border-gray-100 py-2 last:border-b-0">
                                                <span className="font-medium text-gray-700 w-1/3 capitalize">{key.replace(/_/g, ' ')}:</span>
                                                <span className="w-2/3 text-gray-600">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No specifications available for this product.</p>
                                )}
                            </div>
                        )}
                        
                        {activeTab === 'reviews' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                                
                                {product.reviews && product.reviews.length > 0 ? (
                                    <div className="space-y-6">
                                        {product.reviews.map((review, index) => (
                                            <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                                                <div className="flex items-start mb-2">
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3 flex-shrink-0">
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
                                                                {review.userName[0].toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-800">{review.userName}</p>
                                                        <div className="flex items-center mt-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <span key={star} className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                                            ))}
                                                            <span className="text-xs text-gray-500 ml-2">{review.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 ml-13 leading-relaxed">{review.comment}</p> 
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No reviews yet for this product.</p>
                                )}
                            </div>
                        )}
                        
                        {activeTab === 'shipping' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">{productDetailsStatic.shipping.title}</h3>
                                <div className="space-y-4 text-gray-700">
                                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                        <h5 className="font-medium mb-2 text-gray-800">Delivery Options</h5>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {productDetailsStatic.shipping.content.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                        <h5 className="font-medium mb-2 text-gray-800">Shipping Restrictions</h5>
                                        <p>
                                            Some products may not be available for delivery to certain regions. Please check the product details for more information.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'returnPolicy' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">{productDetailsStatic.returnPolicy.title}</h3>
                                
                                <div className="space-y-4 text-gray-700">
                                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                        <h5 className="font-medium mb-2 text-gray-800">Return Policy</h5>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {productDetailsStatic.returnPolicy.content.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                        <h5 className="font-medium mb-2 text-gray-800">{productDetailsStatic.cancellation.title}</h5>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {productDetailsStatic.cancellation.content.map((item, index) => (
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