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
import CartIcon from '@/components/icons/Cart';

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

// Global cache and control variables (similar to CategoryDetailsPage)
const imageCache: Record<string, string> = {}; // Used for main product, additional views, and similar products
const processingPrompts = new Set<string>();
let imageGenerationInProgressThisPage = false; // Page-specific flag to avoid conflicts if multiple instances were possible

// Similar Products component
const SimilarProducts = ({ products, containerId = "similar-products-container", categoryName = "" }: { products: Product[], containerId?: string, categoryName?: string }) => {
    if (!products || products.length === 0) return null;

    const [hoveredProducts, setHoveredProducts] = useState<Record<number, boolean>>({});
    const [hoveredFavorites, setHoveredFavorites] = useState<Record<number, boolean>>({});
    const [hoveredCarts, setHoveredCarts] = useState<Record<number, boolean>>({});
    const [loadingSimilarProductImages, setLoadingSimilarProductImages] = useState<Record<number, boolean>>({});

    const { addItem: addToCartAction } = useCartActions();
    const { addProductToMainFavorites: addToFavoritesAction, removeProductFromMainFavorites: removeFromFavoritesAction } = useFavoritesActions();
    const { isFavorite } = useFavoritesStore();
    const { user } = useUserStore();

    useEffect(() => {
        if (imageGenerationInProgressThisPage || products.length === 0) {
            return;
        }

        const generateSimilarProductImages = async () => {
            const initialLoadingState: Record<number, boolean> = {};
            products.forEach(p => { initialLoadingState[p.productID] = false; });
            setLoadingSimilarProductImages(initialLoadingState);

            for (const similarProduct of products) {
                 if (!imageGenerationInProgressThisPage) {
                    // Allow finishing current product then stop
                }

                if (similarProduct.image && !similarProduct.image.includes('placeholder') && similarProduct.image !== '/placeholder.png') {
                    continue;
                }

        try {
            const categories = await getCategories();
                    const productCategory = categories.find((c: any) => c.categoryID === similarProduct.categoryID);
                    const spCategoryName = productCategory?.categoryName || 'default';
                    const categoryPromptDef = basePrompts[spCategoryName as CategoryKey] || basePrompts.default;

                    if (!categoryPromptDef || typeof categoryPromptDef.main !== 'function') {
                        console.warn(`❓ SP: Could not find or use prompt function for category: ${spCategoryName}, product: ${similarProduct.productName}`);
                        continue;
                    }
                    const mainPrompt = categoryPromptDef.main(similarProduct.productName);

                    if (imageCache[mainPrompt]) {
                        similarProduct.image = imageCache[mainPrompt];
                        setLoadingSimilarProductImages(prev => ({ ...prev, [similarProduct.productID]: false }));
                        continue;
                    }

                    if (processingPrompts.has(mainPrompt)) {
                        continue;
                    }

                    setLoadingSimilarProductImages(prev => ({ ...prev, [similarProduct.productID]: true }));
                    processingPrompts.add(mainPrompt);

                const response = await fetch('/api/ImageCache', {
                    method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            prompt: mainPrompt,
                            entityType: "Product",
                            entityId: similarProduct.productID,
                            checkOnly: false
                        })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.image) {
                            const imageUrl = `data:image/jpeg;base64,${data.image}`;
                            imageCache[mainPrompt] = imageUrl;
                            similarProduct.image = imageUrl;
                    } else {
                            similarProduct.image = '/placeholder.png';
                    }
                } else {
                        similarProduct.image = '/placeholder.png';
                }
            } catch (error) {
                    similarProduct.image = '/placeholder.png';
        } finally {
                    const categories = await getCategories(); // Re-fetch for safety or pass down if stable
                    const productCategory = categories.find((c: any) => c.categoryID === similarProduct.categoryID);
                    const spCategoryName = productCategory?.categoryName || 'default';
                    const categoryPromptDef = basePrompts[spCategoryName as CategoryKey] || basePrompts.default;
                    if (categoryPromptDef && typeof categoryPromptDef.main === 'function') {
                         const mainPrompt = categoryPromptDef.main(similarProduct.productName);
                         processingPrompts.delete(mainPrompt);
                    }
                    setLoadingSimilarProductImages(prev => ({ ...prev, [similarProduct.productID]: false }));
                }
                await new Promise(resolve => setTimeout(resolve, 800));
            }
        };

        if (products.length > 0 && !imageGenerationInProgressThisPage) {
            setTimeout(generateSimilarProductImages, 1500);
        }
    }, [products, imageGenerationInProgressThisPage]);

    const handleToggleFavoriteSP = (product: Product) => {
        if (!user) {
            toast.error("You must be logged in to manage favorites.");
            return;
        }
        if (isFavorite(product.productID)) {
            removeFromFavoritesAction(product.productID);
        } else {
            addToFavoritesAction(product.productID);
            // Consider a dedicated SP favorite notification if needed
            toast.success(`${product.productName} added to favorites!`); 
        }
    };

    const handleAddToCartSP = (product: Product) => {
        if (!user) {
            toast.error("You must be logged in to add items to the cart.");
            return;
        }
        addToCartAction({
            productId: product.productID,
            quantity: 1
        });
        toast.success(`${product.productName} added to cart!`);
    };


    return (
        <div className="mt-8 border-t pt-6 bg-gray-50 p-4 rounded-lg">
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
                            className="flex-shrink-0 w-56 border rounded-lg overflow-hidden hover:shadow-md transition-shadow relative bg-white"
                            onMouseEnter={() => setHoveredProducts(prev => ({ ...prev, [similarProduct.productID]: true }))}
                            onMouseLeave={() => setHoveredProducts(prev => ({ ...prev, [similarProduct.productID]: false }))}
                        >
                            <Link
                                href={`/product/${similarProduct.productID}`}
                                className="block"
                                aria-label={`View details for ${similarProduct.productName}`}
                            >
                                <div className="h-40 bg-gray-100 relative flex items-center justify-center">
                                    {loadingSimilarProductImages[similarProduct.productID] ? (
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
                                            priority={false}
                                            unoptimized={similarProduct.image?.startsWith('data:')}
                                        />
                                    )}
                                </div>
                                <div className="p-3">
                                    <h4 className="font-medium text-sm line-clamp-2 h-10">{similarProduct.productName}</h4>
                                    <div className="flex justify-between items-center mt-2">
                                            <span className="text-blue-600 font-bold">{(similarProduct.price || 0).toFixed(2)} TL</span>
                                        <span className="text-xs text-gray-500">{similarProduct.supplierName || 'GamerGear'}</span>
                                    </div>
                                </div>
                            </Link>

                            <div className="absolute bottom-3 right-3 flex space-x-2">
                                <button
                                        className={`p-2 rounded-full transition-colors shadow-sm ${
                                        productIsFavorite ? 'bg-red-500 text-white hover:bg-red-600' :
                                            hoveredFavorites[similarProduct.productID] ? 'bg-red-100 text-red-500' :
                                        'bg-white text-gray-500 hover:bg-red-100 hover:text-red-500'
                                        }`}
                                        title={productIsFavorite ? "Remove from Favorites" : "Add to Favorites"}
                                        aria-label={productIsFavorite ? "Remove from favorites" : "Add to favorites"}
                                    onMouseEnter={() => setHoveredFavorites(prev => ({ ...prev, [similarProduct.productID]: true }))}
                                    onMouseLeave={() => setHoveredFavorites(prev => ({ ...prev, [similarProduct.productID]: false }))}
                                    onClick={(e) => {
                                        e.preventDefault(); e.stopPropagation();
                                        handleToggleFavoriteSP(similarProduct);
                                    }}
                                    >
                                        {productIsFavorite || hoveredFavorites[similarProduct.productID] ? (
                                        <FavoritesPageHover width={20} height={20} />
                                    ) : (
                                        <FavoriteIcon width={20} height={20} className="text-gray-600" />
                                    )}
                                </button>
                                <button
                                        className={`p-2 rounded-full shadow-sm transition-colors ${
                                        hoveredCarts[similarProduct.productID]
                                            ? 'bg-blue-100 text-blue-500'
                                        : 'bg-white text-gray-500 hover:bg-blue-100 hover:text-blue-500'
                                    }`}
                                    title="Add to Cart"
                                    aria-label="Add to Cart"
                                    disabled={(similarProduct.stockQuantity ?? 0) === 0}
                                    onMouseEnter={() => setHoveredCarts(prev => ({ ...prev, [similarProduct.productID]: true }))}
                                    onMouseLeave={() => setHoveredCarts(prev => ({ ...prev, [similarProduct.productID]: false }))}
                                    onClick={(e) => {
                                        e.preventDefault(); e.stopPropagation();
                                        handleAddToCartSP(similarProduct);
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        )}
                    )}
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
    const [isHoveringCart, setIsHoveringCart] = useState(false); // New state for cart button hover
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [quantity, setQuantity] = useState(1); // Quantity state (if needed)

    // Store hooks
    const { items: cartItems } = useCartStore();
    const { addItem: addToCartActionToStore } = useCartActions();
    const { addProductToMainFavorites: addProductToFavoritesAction, removeProductFromMainFavorites: removeProductFromFavoritesAction } = useFavoritesActions();
    const { isFavorite: getIsFavorite } = useFavoritesStore();
    const { user: currentUser } = useUserStore();

    const productIsFavorite = getIsFavorite(productId);
    // const productIsInCart = cartItems.some(item => item.id === productId); // If needed for UI

    const storeRating = 5.7; // Example static rating

    useEffect(() => {
        const fetchData = async () => {
            if (!productId) return;
            console.log(`PP: Fetching data for product ID: ${productId}`);
                setLoading(true);
            imageGenerationInProgressThisPage = true; // Signal that page-level generation might start
                setShowCartNotification(false);
                setShowFavoriteNotification(false);

            try {
                const [productsData, suppliersData, storesData, allSuppliers, categoriesData] = await Promise.all([
                    getProducts(), getProductSuppliers(), getStores(), getSuppliers(), getCategories()
                ]);

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
                        if (productDescriptionData[productKey]) {
                            const descData = productDescriptionData[productKey] as any;
                            if (descData.description?.content) productDescription = descData.description.content;
                            if (descData.specifications?.content) {
                                const specContent = descData.specifications.content;
                                const parsedSpecs: Record<string, string> = {
                                    "Brand": foundProduct.productName.split(' ')[0] || "Generic", "Model": foundProduct.productName,
                                    "Warranty": "2 Years", "Condition": "New",
                                    "Package Contents": `1 x ${foundProduct.productName}, User Manual, Warranty Card`
                                };
                                if (typeof specContent === 'string') {
                                    const cleanedSpecString = specContent.replace(/\.$/, '');
                                    const specParts = cleanedSpecString.split(', ');
                                    if (specParts[0]?.includes('Ryzen') || specParts[0]?.includes('Core')) parsedSpecs["Processor"] = specParts[0];
                                    if (specParts[1]?.includes('GeForce')) parsedSpecs["Graphics"] = specParts[1];
                                    if (specParts[2]?.includes('RAM')) parsedSpecs["RAM"] = specParts[2];
                                    if (specParts[3]?.includes('SSD')) parsedSpecs["Storage"] = specParts[3];
                                    if (specParts[4]?.includes('inch')) parsedSpecs["Display"] = specParts[4];
                                } else if (typeof specContent === 'object') { Object.assign(parsedSpecs, specContent); }
                                productSpecs = parsedSpecs;
                            }
                        }
                        if (Object.keys(productSpecs).length <= 5) {
                             const defaultSpecs = { "Brand": foundProduct.productName.split(' ')[0] || "Generic", "Model": foundProduct.productName, "Warranty": "2 Years", "Condition": "New", "Package Contents": `1 x ${foundProduct.productName}, User Manual, Warranty Card` };
                            const categoryNameForSpecs = categoriesData.find((c: Category) => c.categoryID === foundProduct.categoryID)?.categoryName || 'default';
                            if (categoryNameForSpecs.includes('Computer') || categoryNameForSpecs.includes('Laptop')) productSpecs = { ...defaultSpecs, "Processor": "AMD Ryzen 9", "RAM": "16GB DDR4", "Storage": "1TB SSD" };
                            else if (categoryNameForSpecs.includes('Phone') || categoryNameForSpecs.includes('Mobile')) productSpecs = { ...defaultSpecs, "Display": "6.1-inch OLED", "Processor": "A15 Bionic", "Storage": "128GB" };
                            else productSpecs = defaultSpecs;
                        }
                    } catch (error) {
                        console.error('PP: Error processing product description/specs:', error);
                        productDescription = productDescriptionData.defaultDescriptionTitle?.content as string || "High quality product.";
                        productSpecs = { "Brand": foundProduct.productName.split(' ')[0] || "Generic", "Model": foundProduct.productName, "Warranty": "2 Years", "Condition": "New", "Package Contents": `1 x ${foundProduct.productName}, User Manual, Warranty Card` };
                    }

                    let reviewComments: string[] = [];
                    const productCategoryForReviews = categoriesData.find((c: Category) => c.categoryID === foundProduct.categoryID);
                    const categoryReviewKey = (productCategoryForReviews?.categoryName || 'default') as keyof typeof categoryReviews;
                    if (categoryReviews[categoryReviewKey]) reviewComments = categoryReviews[categoryReviewKey];
                    else if (categoryReviews['Computer/Tablet']) reviewComments = categoryReviews['Computer/Tablet'];

                    const formattedReviews: Review[] = reviewComments.map(comment => ({
                        rating: ((negativeKeywords: string[]) => (positiveKeywords: string[]) => (lowerComment: string) => {
                            let r = 3;
                            if (negativeKeywords.some((kw: string) => lowerComment.includes(kw))) r = Math.max(1, r - 1);
                            if (positiveKeywords.some((kw: string) => lowerComment.includes(kw))) r = Math.min(5, r + 1);
                            return r;
                        })(['crashes', 'problem', 'issue', 'bug', 'poor', 'bad', 'slow', 'laggy', 'broken', 'fail'])
                          (['great', 'good', 'excellent', 'amazing', 'fast', 'quality', 'value', 'recommend', 'happy'])
                          (comment.toLowerCase()),
                        comment, userName: `User${Math.floor(Math.random() * 1000)}`,
                            date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
                            avatar: `/avatars/user${Math.floor(Math.random() * 5) + 1}.png`
                    }));
                    // END of existing data processing

                    // Main and Additional Image Generation (Refactored Logic)
                    const productImagesToGenerate: { type: 'main' | 'additional'; prompt: string; originalIndex?: number }[] = [];
                    const productCategoryForImages = categoriesData.find((c: Category) => c.categoryID === foundProduct.categoryID);
                    const categoryNameForImages = productCategoryForImages?.categoryName || 'default';
                    const categoryPromptDef = basePrompts[categoryNameForImages as CategoryKey] || basePrompts.default;

                    if (!categoryPromptDef || typeof categoryPromptDef.main !== 'function') {
                        console.warn(`❓ PP: Could not find or use prompt function for category: ${categoryNameForImages}, product: ${foundProduct.productName} (Main Image Setup)`);
                        foundProduct.image = '/placeholder.png'; // Set placeholder if prompt cannot be generated
                        foundProduct.additionalImages = [];
                    } else {
                        const mainPromptForProduct = categoryPromptDef.main(foundProduct.productName);

                        // Check main image
                    if (!foundProduct.image || foundProduct.image === '/placeholder.png' || foundProduct.image.includes('placeholder')) {
                            if (!imageCache[mainPromptForProduct] && !processingPrompts.has(mainPromptForProduct)) {
                                productImagesToGenerate.push({ type: 'main', prompt: mainPromptForProduct });
                            } else if (imageCache[mainPromptForProduct]) {
                                foundProduct.image = imageCache[mainPromptForProduct]; // Use from cache
                            }
                        }

                        // Check additional images (ensure it's an array)
                        if (!Array.isArray(foundProduct.additionalImages)) foundProduct.additionalImages = [];
                        const currentAdditionalImages = [...(foundProduct.additionalImages || [])];
                        const neededAdditionalPrompts = categoryPromptDef.views.slice(0, 3); // Max 3 additional

                        for (let i = 0; i < neededAdditionalPrompts.length; i++) {
                            const viewPromptText = neededAdditionalPrompts[i];
                            const fullAdditionalPrompt = `${mainPromptForProduct}, ${viewPromptText}`;
                            // Check if an image for this view (index i) already exists or is cached/processing
                            if (!currentAdditionalImages[i] || currentAdditionalImages[i].includes('placeholder')) {
                                if (!imageCache[fullAdditionalPrompt] && !processingPrompts.has(fullAdditionalPrompt)) {
                                    productImagesToGenerate.push({ type: 'additional', prompt: fullAdditionalPrompt, originalIndex: i });
                                } else if (imageCache[fullAdditionalPrompt] && currentAdditionalImages[i] !== imageCache[fullAdditionalPrompt]) {
                                   // If cached and different from current, update (will be handled by setProduct later)
                                   // This logic assumes additionalImages array will be repopulated based on cache if needed
                                }
                            }
                        }
                    }

                    if (productImagesToGenerate.length > 0) {
                        console.log(`PP: Found ${productImagesToGenerate.length} images (main/additional) to generate/fetch for ${foundProduct.productName}.`);
                        // imageGenerationInProgressThisPage is already true

                        for (const imageJob of productImagesToGenerate) {
                            if (!imageGenerationInProgressThisPage) {
                                console.log("PP: Image generation process was stopped externally (Main/Additional Loop).");
                                break;
                            }

                            // Double check cache and processing prompts again just before fetch
                            if (imageCache[imageJob.prompt]) {
                                console.log(`PP: Prompt "${imageJob.prompt.substring(0,50)}..." for ${foundProduct.productName} already in imageCache. Skipping fetch.`);
                                // Ensure product state reflects this cache (will be done in final setProduct)
                                continue;
                            }
                            if (processingPrompts.has(imageJob.prompt)) {
                                console.log(`PP: Prompt "${imageJob.prompt.substring(0,50)}..." for ${foundProduct.productName} is already processing. Skipping fetch.`);
                                continue;
                            }

                            console.log(`PP: Processing ${imageJob.type} image for ${foundProduct.productName} with prompt: "${imageJob.prompt.substring(0,80)}..."`);
                            processingPrompts.add(imageJob.prompt);

                                    try {
                                        const response = await fetch('/api/ImageCache', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        prompt: imageJob.prompt,
                                        entityType: "Product",
                                        entityId: foundProduct.productID,
                                        checkOnly: false
                                    })
                                        });

                                        if (response.ok) {
                                            const data = await response.json();
                                            if (data.success && data.image) {
                                        const imageUrl = `data:image/jpeg;base64,${data.image}`;
                                        imageCache[imageJob.prompt] = imageUrl;
                                        console.log(`PP: ${imageJob.type} image for ${foundProduct.productName} processed. Cached prompt: "${imageJob.prompt.substring(0,50)}..."`);
                                        // Defer direct state update; final setProduct will use imageCache
                                            } else {
                                        console.error(`PP: API success=false for ${imageJob.type} image for ${foundProduct.productName}. Prompt: "${imageJob.prompt.substring(0,50)}..."`, data.error || data.message);
                                            }
                                        } else {
                                    const errorText = await response.text().catch(() => "Could not read error text");
                                    console.error(`PP: HTTP Error for ${imageJob.type} image for ${foundProduct.productName}. Status: ${response.status}. Prompt: "${imageJob.prompt.substring(0,50)}..." Body: ${errorText}`);
                                        }
                                    } catch (error) {
                                console.error(`PP: Exception for ${imageJob.type} image for ${foundProduct.productName}. Prompt: "${imageJob.prompt.substring(0,50)}..."`, error);
                            } finally {
                                processingPrompts.delete(imageJob.prompt);
                                console.log(`PP: Finished attempt for prompt "${imageJob.prompt.substring(0,50)}...". Removed from processing.`);
                            }
                            if (imageGenerationInProgressThisPage) await new Promise(resolve => setTimeout(resolve, 750));
                        }
                        console.log(`PP: Finished generating/fetching main/additional images for ${foundProduct.productName}.`);
                            } else {
                        console.log(`PP: No new main/additional images needed generation for ${foundProduct.productName} based on initial check.`);
                    }

                    // Update product state using potentially new images from imageCache
                    const finalMainImage = imageCache[categoryPromptDef.main(foundProduct.productName)] || foundProduct.image || '/placeholder.png';
                    const finalAdditionalImages: string[] = [];
                    if (categoryPromptDef && typeof categoryPromptDef.main === 'function') {
                        const mainPromptForProduct = categoryPromptDef.main(foundProduct.productName);
                        categoryPromptDef.views.slice(0, 3).forEach((viewPromptText, index) => {
                            const fullAdditionalPrompt = `${mainPromptForProduct}, ${viewPromptText}`;
                            if (imageCache[fullAdditionalPrompt]) {
                                finalAdditionalImages[index] = imageCache[fullAdditionalPrompt];
                            } else if (foundProduct.additionalImages && foundProduct.additionalImages[index] && !foundProduct.additionalImages[index].includes('placeholder')) {
                                finalAdditionalImages[index] = foundProduct.additionalImages[index]; // Keep existing valid one if not re-cached
                    } else {
                                // finalAdditionalImages[index] = '/placeholder.png'; // Or leave undefined/null to not show a slot
                        }
                        });
                    }


                    const supplierDetailsForProductPage = suppliersData.find((s: ProductSupplier) => s.productID === foundProduct.productID);
                    const fetchedSupplierName = supplierDetailsForProductPage ? (allSuppliers.find((s: any) => s.supplierID === supplierDetailsForProductPage.supplierID)?.supplierName || 'GamerGear') : 'GamerGear';


                    setProduct({
                        ...foundProduct,
                        image: finalMainImage,
                        additionalImages: finalAdditionalImages.filter(img => img), // Remove empty slots
                        reviews: formattedReviews,
                        description: productDescription,
                        specs: productSpecs,
                        stockQuantity: foundProduct.stockQuantity ?? 0,
                        supplierName: fetchedSupplierName
                    });

                    // Find similar products (logic remains similar)
                    let sameCategoryProducts: Product[] = [];
                    if (foundProduct.categoryID) { // Use categoryID for more reliable filtering
                        sameCategoryProducts = productsData
                            .filter((p: Product) => p.categoryID === foundProduct.categoryID && p.productID !== foundProduct.productID)
                            .slice(0, 10);
                    }
                     sameCategoryProducts.forEach((sp: Product) => {
                        const spSupplier = suppliersData.find((s: ProductSupplier) => s.productID === sp.productID);
                        sp.supplierName = spSupplier ? (allSuppliers.find((s: any) => s.supplierID === spSupplier.supplierID)?.supplierName || 'GamerGear') : 'GamerGear';
                    });
                    setSimilarProducts(sameCategoryProducts); // This will trigger SimilarProducts useEffect

                } else {
                    console.error("PP: Product not found for ID:", productId);
                    setProduct(null);
                }
            } catch (error) {
                console.error('PP: Error fetching product data:', error);
                setProduct(null);
            } finally {
                setLoading(false);
                imageGenerationInProgressThisPage = false; // Page-level generation attempt is complete
                console.log("PP: Finished fetching data and main/additional image processing for ProductPage.");
            }
        };

            fetchData();

        // Cleanup function for ProductPage
        return () => {
            console.log(`PP: Cleaning up ProductPage (productId: ${productId}). Setting imageGenerationInProgressThisPage to false.`);
            imageGenerationInProgressThisPage = false;
            // No need to clear processingPrompts or imageCache here as they are module-level
            // and might be in use by other components or needed for quick revisits.
            // The checks at the beginning of generation loops handle stale processingPrompts.
        };
    }, [productId]); // Rerun only when productId changes

    const handleAddToCart = () => {
        if (!currentUser) {
            toast.error("You must be logged in to add items to the cart.");
            return;
        }
        if (!product) return;
        console.log("Adding product to cart (page - product object):", JSON.stringify(product, null, 2));
        addToCartActionToStore({
            productId: product.productID,
            quantity: quantity // Use state quantity
        });
        setShowCartNotification(true); // Show success notification
    };

    const handleToggleFavorite = () => {
        if (!currentUser) {
            toast.error("You must be logged in to manage favorites.");
            return;
        }
        if (!product) return;

        if (getIsFavorite(product.productID)) {
            removeProductFromFavoritesAction(product.productID);
            // Optionally: toast.success("Removed from favorites");
        } else {
            addProductToFavoritesAction(product.productID);
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
                                onMouseEnter={() => setIsHoveringCart(true)}
                                onMouseLeave={() => setIsHoveringCart(false)}
                                disabled={(product.stockQuantity ?? 0) === 0}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors text-base font-medium ${
                                    (product.stockQuantity ?? 0) === 0
                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                                }`}
                            >
                                {isHoveringCart ? <CartIcon width={24} height={24} /> : <CartFavorites width={24} height={24} />}
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
                                            containerId="similar-products-description-tab-final" // Ensured unique ID
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