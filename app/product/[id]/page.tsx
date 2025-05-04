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
import { useCartStore, useCartActions } from '@/app/stores/cartStore';
import { useFavoritesStore, FavoriteProduct, useFavoritesActions } from '@/app/stores/favoritesStore';
import { toast } from 'react-hot-toast';
import { useUserStore } from '@/app/stores/userStore';

// Temporary data for product details
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
            "Free shipping on orders over 500 TL" // Assuming TL is intentional currency symbol
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

// Type definition for tab types
type TabType = 'description' | 'specifications' | 'reviews' | 'shipping' | 'returnPolicy';

// Global cache to track all processed prompts (if needed outside component, otherwise keep local)
// const globalImageCache: Record<string, string> = {}; // If needed globally

// Similar Products component
const SimilarProducts = ({ products, containerId = "similar-products-container", categoryName = "" }: { products: Product[], containerId?: string, categoryName?: string }) => {
    if (!products || products.length === 0) return null;

    const [hoveredProducts, setHoveredProducts] = useState<Record<number, boolean>>({});
    const [hoveredFavorites, setHoveredFavorites] = useState<Record<number, boolean>>({});
    const [hoveredCarts, setHoveredCarts] = useState<Record<number, boolean>>({});
    const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});
    const [imagesGenerated, setImagesGenerated] = useState(false);
    const [showCartNotificationSP, setShowCartNotificationSP] = useState(false); // Separate state for SP notifications
    const [showFavoriteNotificationSP, setShowFavoriteNotificationSP] = useState(false); // Separate state for SP notifications


    // Store hooks
    const { addItem: addToCartAction } = useCartActions();
    const { addProduct: addToFavoritesAction, removeProduct: removeFromFavoritesAction } = useFavoritesActions();
    const { isFavorite } = useFavoritesStore();
    const { user } = useUserStore();

    // Image generation function - Frontend cache control removed
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
                        product.image = '/placeholder.png'; // Use consistent placeholder
                    }
                } else {
                console.error("SP: Failed to get image (HTTP):", product.productID, response.status);
                    product.image = '/placeholder.png'; // Use consistent placeholder
                }
            } catch (error) {
            console.error("SP: Exception during image fetch:", product.productID, error);
                product.image = '/placeholder.png'; // Use consistent placeholder
        } finally {
            setLoadingImages(prev => ({ ...prev, [product.productID]: false }));
        }
    }, []);

    // Check product images - generateProductImage dependency removed
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
                // const updatedProducts = products.map(p => ({...p})); // May not be necessary if state updates trigger re-render
                console.log("SP: Image generation attempts complete.");
            };
            generateImages();
        } else {
            console.log("SP: No products needed image generation.");
            setImagesGenerated(true);
        }
    // Removed generateProductImage from dependency array
    }, [products, imagesGenerated]); // Add imagesGenerated dependency

    const handleAddToCartSP = (product: Product) => {
        if (!user) {
            toast.error("You must be logged in to add items to the cart.");
            return;
        }
        addToCartAction({
            productId: product.productID,
            quantity: 1
        });
        setShowCartNotificationSP(true); // Show notification for SP item
    };

    const handleToggleFavoriteSP = (product: Product) => {
        if (!user) {
            toast.error("You must be logged in to manage favorites.");
            return;
        }
        if (isFavorite(product.productID)) {
            removeFromFavoritesAction(product.productID);
            // Optionally show a 'removed' notification
        } else {
            addToFavoritesAction(product.productID);
            setShowFavoriteNotificationSP(true); // Show notification for SP item
        }
    };

    return (
        <div className="mt-8 border-t pt-6 bg-gray-50 p-4 rounded-lg">
            {/* Notifications specific to Similar Products */}
            {showCartNotificationSP && <CartSuccessMessage onClose={() => setShowCartNotificationSP(false)} />}
            {showFavoriteNotificationSP && <FavoritesAddedMessage onClose={() => setShowFavoriteNotificationSP(false)} />}

            <h3 className="text-lg font-semibold mb-4">
                Similar Products {categoryName && <span className="text-sm font-normal text-gray-500 ml-2">({categoryName})</span>}
            </h3>
            <div className="relative">
                <button
                    aria-label="Scroll Left"
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 disabled:opacity-50"
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
                    {products.map((similarProduct: Product) => {
                        const productIsFavorite = isFavorite(similarProduct.productID);
                        return (
                        <div
                            key={similarProduct.productID}
                            className="flex-shrink-0 w-56 border rounded-lg overflow-hidden hover:shadow-md transition-shadow relative bg-white" // Added bg-white
                            onMouseEnter={() => setHoveredProducts(prev => ({ ...prev, [similarProduct.productID]: true }))}
                            onMouseLeave={() => setHoveredProducts(prev => ({ ...prev, [similarProduct.productID]: false }))}
                        >
                            <Link
                                href={`/product/${similarProduct.productID}`}
                                className="block"
                                aria-label={`View details for ${similarProduct.productName}`}
                            >
                                <div className="h-40 bg-gray-100 relative flex items-center justify-center"> {/* Flex center */}
                                    {loadingImages[similarProduct.productID] ? (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : (
                                        <Image
                                            src={similarProduct.image || '/placeholder.png'} // Use consistent placeholder
                                            alt={similarProduct.productName}
                                            fill
                                            className="object-contain p-2" // Maintain object-contain
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            priority={false} // Lower priority for similar products
                                        />
                                    )}
                                </div>
                                <div className="p-3">
                                    <h4 className="font-medium text-sm line-clamp-2 h-10">{similarProduct.productName}</h4>
                                    <div className="flex justify-between items-center mt-2">
                                            <span className="text-blue-600 font-bold">{similarProduct.price.toFixed(2)} TL</span> {/* Assuming TL */}
                                        <span className="text-xs text-gray-500">{similarProduct.supplierName || 'GamerGear'}</span>
                                    </div>
                                </div>
                            </Link>

                            {/* Buttons */}
                            <div className="absolute bottom-3 right-3 flex space-x-2">
                                {/* Add to Favorites Button */}
                                <button
                                        className={`p-2 rounded-full transition-colors shadow-sm ${
                                            productIsFavorite ? 'bg-red-500 text-white hover:bg-red-600' : // Added hover for active
                                            hoveredFavorites[similarProduct.productID] ? 'bg-red-100 text-red-500' :
                                            'bg-white text-gray-500 hover:bg-red-100 hover:text-red-500' // Added hover text color
                                        }`}
                                        title={productIsFavorite ? "Remove from Favorites" : "Add to Favorites"}
                                        aria-label={productIsFavorite ? "Remove from favorites" : "Add to favorites"}
                                    onMouseEnter={() => setHoveredFavorites(prev => ({ ...prev, [similarProduct.productID]: true }))}
                                    onMouseLeave={() => setHoveredFavorites(prev => ({ ...prev, [similarProduct.productID]: false }))}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleToggleFavoriteSP(similarProduct); // Use SP handler
                                    }}
                                    >
                                        {productIsFavorite || hoveredFavorites[similarProduct.productID] ? (
                                        <FavoritesPageHover width={20} height={20} />
                                    ) : (
                                        <FavoriteIcon width={20} height={20} className="text-gray-600" />
                                    )}
                                </button>

                                {/* Add to Cart Button */}
                                <button
                                        className={`p-2 rounded-full shadow-sm transition-colors ${
                                        hoveredCarts[similarProduct.productID]
                                            ? 'bg-blue-100 text-blue-500'
                                                : 'bg-white text-gray-500 hover:bg-blue-100 hover:text-blue-500' // Added hover text color
                                    }`}
                                    title="Add to Cart"
                                    aria-label="Add to Cart"
                                    onMouseEnter={() => setHoveredCarts(prev => ({ ...prev, [similarProduct.productID]: true }))}
                                    onMouseLeave={() => setHoveredCarts(prev => ({ ...prev, [similarProduct.productID]: false }))}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleAddToCartSP(similarProduct); // Use SP handler
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
                    aria-label="Scroll Right"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 disabled:opacity-50"
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
    const [showCartNotification, setShowCartNotification] = useState(false); // State for cart notification
    const [showFavoriteNotification, setShowFavoriteNotification] = useState(false); // State for favorite notification
    const [isFollowingStore, setIsFollowingStore] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('description');
    const [isHoveringFavorite, setIsHoveringFavorite] = useState(false);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [quantity, setQuantity] = useState(1); // Quantity state (if needed)

    // Store hooks
    const { items: cartItems } = useCartStore();
    const { addItem: addToCartAction } = useCartActions();
    const { addProduct: addToFavoritesAction, removeProduct: removeFromFavoritesAction } = useFavoritesActions();
    const { isFavorite } = useFavoritesStore();
    const { user } = useUserStore();

    const productIsFavorite = isFavorite(productId);
    // const productIsInCart = cartItems.some(item => item.id === productId); // If needed for UI

    const storeRating = 5.7; // Example static rating

    useEffect(() => {
        const fetchData = async () => {
            if (!productId) return;
            console.log(`Fetching data for product ID: ${productId}`);
            try {
                setLoading(true);
                // Reset notifications on new product load
                setShowCartNotification(false);
                setShowFavoriteNotification(false);

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

                        // Create fetchedSupplier - stock comes from Product object
                        fetchedSupplier = {
                            productSupplierID: productSupplier.productSupplierID,
                            productID: productSupplier.productID,
                            supplierID: productSupplier.supplierID,
                            supplierName: supplierDetails?.supplierName || 'GamerGear',
                            rating: storeRating, // Example static rating
                            stock: 0 // Stock comes from Product.stockQuantity
                        };
                        setSupplier(fetchedSupplier);
                        console.log("Supplier state set (stock comes from Product):", fetchedSupplier);

                        const foundStore = storesData.find((s: Store) => s.storeID === productSupplier.supplierID);
                        if (foundStore) {
                           fetchedStore = {
                                ...foundStore,
                                rating: storeRating // Example static rating
                            };
                            setStore(fetchedStore);
                            console.log("Store details set:", fetchedStore);
                        }
                    } else {
                        console.warn("No supplier found for product ID:", productId);
                    }

                    const productCategory = categoriesData.find((c: Category) => c.categoryID === foundProduct.categoryID);
                    setCategory(productCategory || null);
                    const categoryName = productCategory?.categoryName || 'default';
                    console.log("Product category:", categoryName);

                    // Process description and specs
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
                                const parsedSpecs: Record<string, string> = { // Base specs
                                    "Brand": foundProduct.productName.split(' ')[0] || "Generic",
                                    "Model": foundProduct.productName,
                                    "Warranty": "2 Years",
                                    "Condition": "New",
                                    "Package Contents": `1 x ${foundProduct.productName}, User Manual, Warranty Card`
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
                                } else if (typeof specContent === 'object') { // Merge if object
                                    Object.assign(parsedSpecs, specContent);
                                }
                                productSpecs = parsedSpecs;
                                console.log("Parsed specifications from productDescriptionData:", productSpecs);
                            }
                        }

                        if (Object.keys(productSpecs).length <= 5) { // Check if only base specs are present
                             console.log("No specific specs found or only base specs, using category defaults");
                            // Category-based default specs
                             const defaultSpecs = { "Brand": foundProduct.productName.split(' ')[0] || "Generic", "Model": foundProduct.productName, "Warranty": "2 Years", "Condition": "New", "Package Contents": `1 x ${foundProduct.productName}, User Manual, Warranty Card` };
                             if (categoryName.includes('Computer') || categoryName.includes('Laptop')) {
                                productSpecs = { ...defaultSpecs, "Processor": "AMD Ryzen 9", "RAM": "16GB DDR4", "Storage": "1TB SSD" };
                            } else if (categoryName.includes('Phone') || categoryName.includes('Mobile')) {
                                productSpecs = { ...defaultSpecs, "Display": "6.1-inch OLED", "Processor": "A15 Bionic", "Storage": "128GB" };
                            } else {
                                productSpecs = defaultSpecs; // Only base defaults
                            }
                             console.log("Applied category default specs:", productSpecs);
                        }
                    } catch (error) {
                        console.error('Error processing product description/specs:', error);
                        productDescription = productDescriptionData.defaultDescriptionTitle?.content as string || "High quality product.";
                        productSpecs = { "Brand": foundProduct.productName.split(' ')[0] || "Generic", "Model": foundProduct.productName, "Warranty": "2 Years", "Condition": "New", "Package Contents": `1 x ${foundProduct.productName}, User Manual, Warranty Card` };
                        console.log("Applied error default specs:", productSpecs);
                    }

                    // Process reviews
                    let reviewComments: string[] = [];
                    const categoryReviewKey = categoryName as keyof typeof categoryReviews;
                    if (categoryName && categoryReviews[categoryReviewKey]) {
                        reviewComments = categoryReviews[categoryReviewKey];
                    } else if (categoryReviews['Computer/Tablet']) { // Fallback
                        reviewComments = categoryReviews['Computer/Tablet'];
                    }
                    console.log(`Found ${reviewComments.length} review comments for category ${categoryName}`);

                    const formattedReviews: Review[] = reviewComments.map(comment => {
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

                     // Main and Additional Image Generation
                    if (!foundProduct.image || foundProduct.image === '/placeholder.png' || foundProduct.image.includes('placeholder')) {
                        console.log("PP: Product needs main image generation.");
                        try {
                            // Fetch categories again if needed (or ensure they are available from outer scope)
                            const categoriesForImage = categoriesData; // Use already fetched categories
                            const productCategoryForImage = categoriesForImage.find((c: Category) => c.categoryID === foundProduct.categoryID);
                            const categoryNameForImage = productCategoryForImage?.categoryName || 'default';
                            const categoryPrompt = basePrompts[categoryNameForImage as CategoryKey] || basePrompts.default;
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
                                    console.error("PP: Main image generation failed (API):", mainImageData.message || 'Unknown API error');
                                    foundProduct.image = '/placeholder.png';
                                }
                            } else {
                                console.error("PP: Main image generation failed (HTTP):", mainImageResponse.status, mainImageResponse.statusText);
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
                                                console.error("PP: Add. image failed (API):", data.message || 'Unknown API error'); return null;
                                            }
                                        } else {
                                            console.error("PP: Add. image failed (HTTP):", response.status, response.statusText); return null;
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
                        // Consider logic to generate missing additional images if needed
                    }

                    // Calculate stock from the main product data
                    const actualStock = foundProduct.stockQuantity ?? 0;
                    console.log("Using stockQuantity directly from foundProduct:", actualStock);

                    // Update product state using stock from foundProduct
                    setProduct({
                        ...foundProduct, // Spread all properties from foundProduct first
                        reviews: formattedReviews,
                        description: productDescription,
                        specs: productSpecs,
                        stockQuantity: actualStock, // Ensure this overrides any default
                        supplierName: fetchedSupplier?.supplierName || 'GamerGear', // Use fetched or default
                        additionalImages: Array.isArray(foundProduct.additionalImages) ? foundProduct.additionalImages : [] // Ensure array
                    });
                    console.log("Final product state updated using foundProduct.stockQuantity.");

                    // Find similar products
                    let sameCategoryProducts: Product[] = [];
                    if (foundProduct.categoryName) {
                        const filteredByCategoryName = productsData
                            .filter((p: Product) => p.categoryName === foundProduct.categoryName && p.productID !== foundProduct.productID)
                            .slice(0, 10); // Filter and slice
                        sameCategoryProducts = filteredByCategoryName;
                        console.log(`Found ${sameCategoryProducts.length} similar products by categoryName.`);
                    }

                    // Add supplier name to similar products
                     sameCategoryProducts.forEach((sp: Product) => {
                        const spSupplier = suppliersData.find((s: ProductSupplier) => s.productID === sp.productID);
                        if (spSupplier) {
                            const spSupplierDetails = allSuppliers.find((s: any) => s.supplierID === spSupplier.supplierID);
                            sp.supplierName = spSupplierDetails?.supplierName || 'GamerGear';
                        } else {
                            sp.supplierName = 'GamerGear'; // Default if no supplier link
                        }
                    });
                    setSimilarProducts(sameCategoryProducts);

                } else {
                     console.error("Product not found for ID:", productId);
                     setProduct(null); // Ensure product is null if not found
                }
            } catch (error) {
                console.error('Error fetching product data:', error);
                setProduct(null); // Set product to null on error
            } finally {
                setLoading(false);
                console.log("Finished fetching data.");
            }
        };

            fetchData();
    }, [productId]); // Rerun only when productId changes

    const handleAddToCart = () => {
        if (!user) {
            toast.error("You must be logged in to add items to the cart.");
            return;
        }
        if (!product) return;
        console.log("Adding product to cart (page - product object):", JSON.stringify(product, null, 2));
        addToCartAction({
            productId: product.productID,
            quantity: quantity // Use state quantity
        });
        setShowCartNotification(true); // Show success notification
    };

    const handleToggleFavorite = () => {
        if (!user) {
            toast.error("You must be logged in to manage favorites."); // English error
            return;
        }
        if (!product) return;

        if (isFavorite(product.productID)) {
            removeFromFavoritesAction(product.productID);
            // Optionally: toast.success("Removed from favorites");
        } else {
            addToFavoritesAction(product.productID);
            setShowFavoriteNotification(true); // Show success notification ONLY when adding
        }
    };

    const handleToggleFollowStore = () => {
        // Add API integration later
        setIsFollowingStore(!isFollowingStore);
        toast.success(isFollowingStore ? 'Unfollowed store' : 'Following store'); // Placeholder feedback
        console.log("Follow store toggled (needs API integration)");
    };

    // Handle quantity change (example)
    const handleQuantityChange = (change: number) => {
        setQuantity(prev => Math.max(1, prev + change)); // Ensure quantity is at least 1
    };


    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading product details...</div>; // English text
    }

    if (!product) {
         return <div className="flex justify-center items-center min-h-screen">Product not found.</div>; // English text
    }

    return (
        <div className="flex-1">
            {/* Render Notifications */}
            {showCartNotification && <CartSuccessMessage onClose={() => setShowCartNotification(false)} />}
            {showFavoriteNotification && <FavoritesAddedMessage onClose={() => setShowFavoriteNotification(false)} />}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50"> {/* Added responsive padding */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-w-1 aspect-h-1 bg-white rounded-lg overflow-hidden shadow-md flex items-center justify-center"> {/* Added flex center */}
                            <Image
                                src={product.image || '/placeholder.png'} // Use consistent placeholder
                                alt={product.productName}
                                width={500}
                                height={500}
                                className="object-contain w-full h-full p-4" // Keep padding
                                priority // Main image is priority
                            />
                        </div>

                        {/* Image Gallery */}
                        {product.additionalImages && product.additionalImages.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                                {/* Thumbnail for current main image */}
                                <button
                                    disabled // Cannot click the main image thumbnail
                                    className="aspect-w-1 aspect-h-1 bg-white rounded-lg overflow-hidden shadow-sm border-2 border-blue-500 cursor-default" // Highlight current main, disable cursor
                                >
                                    <Image
                                        src={product.image || '/placeholder.png'} // Show current main image
                                        alt={`${product.productName} main view`}
                                        width={120}
                                        height={120}
                                        className="object-contain w-full h-full p-1" // Smaller padding for thumbnails
                                    />
                                </button>
                                {/* Thumbnails for additional images */}
                                {product.additionalImages.map((img, i) => (
                                    <button
                                        key={i}
                                        aria-label={`View image ${i + 2}`}
                                        onClick={() => {
                                            console.log("Switching main image to additional image:", i);
                                            // Simple swap logic:
                                            const currentMain = product.image; // Store current main
                                            const newAdditional = [...(product.additionalImages || [])]; // Copy additional images
                                            newAdditional[i] = currentMain!; // Replace clicked additional with old main
                                            setProduct(prev => prev ? {
                                                ...prev,
                                                image: img, // Set new main image (the one clicked)
                                                additionalImages: newAdditional // Set updated additional images
                                            } : null);
                                        }}
                                        className="aspect-w-1 aspect-h-1 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-2 hover:border-blue-300 transition-all" // Added hover state
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.productName} view ${i + 2}`} // Correct numbering
                                            width={120}
                                            height={120}
                                            className="object-contain w-full h-full p-1" // Smaller padding
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Product Info */}
                    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col"> {/* Added flex flex-col */}
                        <h1 className="text-2xl lg:text-3xl font-bold mb-4">{product.productName}</h1> {/* Responsive text size */}

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4"> {/* Responsive layout */}
                            <div className="text-3xl font-bold text-blue-600">
                                {product.price.toFixed(2)} TL {/* Assuming TL */}
                            </div>
                            <div className="flex items-center">
                                {product.reviews && product.reviews.length > 0 ? (
                                    <>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span key={star} className={`text-xl ${star <= Math.round(product.reviews!.reduce((a, b) => a + b.rating, 0) / product.reviews!.length) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-500 ml-2">({product.reviews.length} reviews)</span>
                                    </>
                                ) : (
                                     <span className="text-sm text-gray-500">No reviews yet</span>
                                )}
                            </div>
                        </div>

                        {/* Supplier/Store Information */}
                        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"> {/* Responsive layout */}
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-semibold mr-3 flex-shrink-0"> {/* Added font-semibold */}
                                        {(product.supplierName || '?')[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{product.supplierName || 'Unknown Supplier'}</p>
                                        <div className="flex items-center mt-1">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span key={star} className={`text-sm ${star <= Math.round(storeRating / 2) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                                ))}
                                            </div>
                                            <span className="ml-1 text-sm text-gray-600">({storeRating.toFixed(1)}/10 Store Rating)</span> {/* Added context */}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleToggleFollowStore}
                                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${isFollowingStore ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                >
                                    {isFollowingStore ? 'Following' : 'Follow Store'}
                                </button>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-4"> {/* Adjusted margin */}
                             Stock: <span className="font-semibold">{product.stockQuantity ?? 0}</span> { (product.stockQuantity ?? 0) === 1 ? 'unit' : 'units'} available
                        </div>

                        {/* Quantity Selector (Example) */}
                        <div className="flex items-center gap-3 mb-6">
                             <label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity:</label>
                             <div className="flex items-center border rounded">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    className="px-3 py-1 border-r text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                    aria-label="Decrease quantity"
                                >-</button>
                                <input
                                    id="quantity"
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-12 text-center border-none focus:ring-0"
                                    min="1"
                                />
                                <button
                                     onClick={() => handleQuantityChange(1)}
                                     disabled={quantity >= (product.stockQuantity ?? 0)} // Disable if quantity reaches stock
                                     className="px-3 py-1 border-l text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                     aria-label="Increase quantity"
                                 >+</button>
                            </div>
                         </div>


                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-auto"> {/* mt-auto pushes buttons down */}
                            <button
                                onClick={handleAddToCart}
                                disabled={(product.stockQuantity ?? 0) === 0}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors text-base font-medium ${ // Added padding, font size/weight
                                    (product.stockQuantity ?? 0) === 0
                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed' // Adjusted disabled style
                                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800' // Added active state
                                }`}
                            >
                                <CartFavorites /> {/* Assuming this is the cart icon */}
                                <span>{(product.stockQuantity ?? 0) === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                            </button>

                            <button
                                onClick={handleToggleFavorite}
                                onMouseEnter={() => setIsHoveringFavorite(true)}
                                onMouseLeave={() => setIsHoveringFavorite(false)}
                                className={`w-14 h-14 flex items-center justify-center rounded-lg transition-colors border ${ // Made square, added border
                                    productIsFavorite ? 'bg-red-500 text-white border-red-600 hover:bg-red-600' : // Active state
                                    isHoveringFavorite ? 'bg-red-100 text-red-500 border-red-200' : // Hover state
                                    'bg-gray-100 text-gray-600 border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100' // Default state
                                }`}
                                title={productIsFavorite ? "Remove from Favorites" : "Add to Favorites"}
                                aria-label={productIsFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                                {productIsFavorite || isHoveringFavorite ? (
                                    <FavoritesPageHover width={24} height={24} /> // Assuming filled heart
                                ) : (
                                    <FavoriteIcon width={24} height={24} /> // Assuming outline heart
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden"> {/* Removed md:col-span-2 */}
                    <div className="flex border-b overflow-x-auto hide-scrollbar"> {/* Added overflow-x-auto */}
                        <button
                            className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-medium whitespace-nowrap ${activeTab === 'description' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                            onClick={() => setActiveTab('description')}
                        >
                           Description
                        </button>
                        <button
                            className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-medium whitespace-nowrap ${activeTab === 'specifications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                            onClick={() => setActiveTab('specifications')}
                        >
                           Specifications
                        </button>
                        <button
                            className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-medium whitespace-nowrap ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews ({product.reviews?.length || 0})
                        </button>
                        <button
                            className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-medium whitespace-nowrap ${activeTab === 'shipping' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                            onClick={() => setActiveTab('shipping')}
                        >
                           Shipping
                        </button>
                        <button
                            className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-medium whitespace-nowrap ${activeTab === 'returnPolicy' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                            onClick={() => setActiveTab('returnPolicy')}
                        >
                            Return Policy
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'description' && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                                <p className="mb-4 text-gray-700 leading-relaxed whitespace-pre-wrap">{product.description || "No description available."}</p> {/* Added whitespace-pre-wrap */}

                                {/* Similar Products Section */}
                                <div className="mt-8 pt-4"> {/* Removed border-t */}
                                    {similarProducts.length > 0 ? (
                                        <SimilarProducts
                                            products={similarProducts}
                                            categoryName={category?.categoryName || ""}
                                            containerId="similar-products-description-tab" // Unique ID
                                        />
                                    ) : (
                                        <p className="text-gray-500 italic mt-4">No similar products found in this category.</p> // Improved text
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
                                                                alt={`${review.userName}'s avatar`} // Improved alt text
                                                                width={40}
                                                                height={40}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-medium">
                                                                {review.userName[0].toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-800">{review.userName}</p>
                                                        <div className="flex items-center mt-1">
                                                            <div className="flex"> {/* Wrap stars */}
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <span key={star} className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                                                ))}
                                                            </div>
                                                            <span className="text-xs text-gray-500 ml-2">{review.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 ml-13 leading-relaxed">{review.comment}</p> {/* Use ml-13 if spacing requires it */}
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
                                            Some products may not be available for delivery to certain regions. Please check shipping details during checkout.
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
                                        <h5 className="font-medium mb-2 text-gray-800">Return Conditions</h5>
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