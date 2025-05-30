"use client"
import { useState, useEffect, useCallback } from 'react';
import { 
    getSuppliers as getAllSuppliersFromApi, // Renamed to avoid conflict
    getProducts, 
    getProductSuppliers,
    getFollowedSuppliers,
    followSupplier,
    unfollowSupplier,
    type FollowedSupplierDto 
} from '@/services/API_Service';
import { useUserStore } from '@/app/stores/userStore'; // Import user store
import { generateImage, generatePrompt } from '@/services/image-generation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

// Kategori bazlı prompts için import - utils yerine direkt product/[id]/data/basePrompts kullanıyoruz
import { basePrompts, CategoryKey } from '@/app/product/[id]/data/basePrompts';

// Global değişkenler - görüntü oluşturma işlemini kontrol etmek için
// const globalImageCache: Record<string, string> = {}; // Bu artık API ile yönetilecek
// const globalProductImageCache: Record<string, string> = {}; // Bu artık API ile yönetilecek

// Base64 encoded 1x1 transparent PNG as a placeholder
const DEFAULT_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
// Mağaza başına sabit ürünleri tutmak için bir cache ekleyelim
const storeProductsCache: Record<number, Product[]> = {};
// Mağaza fotoğraflarının yüklenme durumunu takip etmek için flag
// const storeImagesLoadingComplete = { value: false }; // Bu state ile yönetilecek

// Mevcut Supplier interface'i, API'den gelen FollowedSupplierDto ile uyumlu olmalı veya bir dönüşüm yapılmalı.
// Şimdilik FollowedSupplierDto'yu temel alacağız ve Product interface'ini koruyacağız.
interface Supplier extends FollowedSupplierDto {
    // Gerekirse FollowedSupplierDto'dan farklı ek alanlar buraya eklenebilir
    // Veya FollowedSupplierDto doğrudan kullanılabilir. Şimdilik birleştiriyoruz.
}

interface Product {
    productID: number;
    productName: string;
    price: number;
    image?: string; // Bu, productImages state'inden gelecek
    categoryID: number;
    categoryName?: string;
    supplierID: number; // Ürünün hangi mağazaya ait olduğunu belirten ID
}

export default function MyFollowedStores() {
    const { user } = useUserStore(); // Get user from store
    const [activeTab, setActiveTab] = useState<'followed' | 'all'>('followed');
    
    // API'den gelen ve kullanıcının gerçekten takip ettiği mağazalar
    const [followedApiStores, setFollowedApiStores] = useState<FollowedSupplierDto[]>([]);
    // Tüm mağazaların listesi (takip edilmeyenleri göstermek için)
    const [allApiStores, setAllApiStores] = useState<FollowedSupplierDto[]>([]); 
    
    const [supplierImages, setSupplierImages] = useState<{[key: number]: string}>({});
    // const [followedSuppliersSet, setFollowedSuppliersSet] = useState<Set<number>>(new Set()); // Artık followedApiStores'tan türetilecek
    const [supplierRatings, setSupplierRatings] = useState<{[key: number]: number}>({});
    const [products, setProducts] = useState<Product[]>([]); // Tüm ürünler (mağazalara atanmak üzere)
    const [productImages, setProductImages] = useState<{[key: number]: string}>({});
    
    const [isLoadingFollowedStores, setIsLoadingFollowedStores] = useState(true);
    const [isLoadingAllStores, setIsLoadingAllStores] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true); // Product ve ProductSupplier yükleme durumu
    const [error, setError] = useState<string | null>(null);
    
    // const [storeImagesLoaded, setStoreImagesLoaded] = useState(false); // Bu artık her tab için ayrıca ele alınacak
    const [loadingSupplierImages, setLoadingSupplierImages] = useState(false); // Mağaza resimleri yükleniyor mu?
    const [loadingProductImagesForTab, setLoadingProductImagesForTab] = useState(false); // Sekme için ürün resimleri yükleniyor mu?

    // const [isGenerating, setIsGenerating] = useState<{[key: number]: boolean}>({}); // Bu artık kullanılmayacak gibi

    // const [initialSupplierImagesDone, setInitialSupplierImagesDone] = useState(false); // Tek seferlik yükleme logiği değişecek
    // const [isLoadingSupplierImagesGlobal, setIsLoadingSupplierImagesGlobal] = useState(false); // Global yükleme state'i yerine tab bazlı


    // 1. Adım: Temel verileri yükle (Tüm Mağazalar, Tüm Ürünler, Ürün-Tedarikçi İlişkileri)
    useEffect(() => {
        let mounted = true;
        const loadBaseData = async () => {
            setIsLoadingAllStores(true);
            setIsLoadingProducts(true);
            setError(null);
            try {
                const [allSuppliersData, productsData, productSuppliersData] = await Promise.all([
                    getAllSuppliersFromApi() as Promise<FollowedSupplierDto[]>, // API'den tüm tedarikçiler
                    getProducts() as Promise<Product[]>,
                    getProductSuppliers() as Promise<any[]>
                ]);
                
                if (!mounted) return;

                setAllApiStores(allSuppliersData || []);
                setProducts(productsData || []);
                
                // Mağaza puanlarını oluştur (Bu kısım aynı kalabilir)
                const ratings: {[key: number]: number} = {};
                (allSuppliersData || []).forEach(supplier => {
                    const randomVal = Math.random();
                    ratings[supplier.supplierID] = parseFloat((randomVal < 0.2 ? Math.random() * 5 : Math.random() * 5 + 5).toFixed(1));
                });
                setSupplierRatings(ratings);

                // Mağaza-ürün ilişkilerini kur (Bu kısım da büyük ölçüde aynı kalabilir)
                const supplierProductMap: Record<number, number[]> = {};
                (allSuppliersData || []).forEach(s => supplierProductMap[s.supplierID] = []);
                productSuppliersData.forEach(relation => {
                    if (relation.supplierID && relation.productID && supplierProductMap[relation.supplierID]) {
                        supplierProductMap[relation.supplierID].push(relation.productID);
                    }
                });
                 // Ensure all stores have at least an empty array for products
                (allSuppliersData || []).forEach(supplier => {
                    if (!supplierProductMap[supplier.supplierID]) {
                        supplierProductMap[supplier.supplierID] = [];
                    }
                     // Rastgele ürün atama (opsiyonel, eğer API'den boş geliyorsa ve göstermek isteniyorsa)
                    if (supplierProductMap[supplier.supplierID].length === 0 && (productsData || []).length > 0) {
                        const productCount = 3 + Math.floor(Math.random() * 3); // 3-5 ürün
                        const randomProductIds = [...productsData].sort(() => 0.5 - Math.random()).slice(0, productCount).map(p => p.productID);
                        supplierProductMap[supplier.supplierID] = randomProductIds;
                        console.log(`Mağaza ID ${supplier.supplierID} için rastgele ${randomProductIds.length} ürün atandı.`);
                    }
                });
                (window as any).productSupplierMap = supplierProductMap;
                console.log("✅ Temel Mağaza-Ürün eşleşmeleri oluşturuldu:", supplierProductMap);
                
            } catch (err: any) {
                if (!mounted) return;
                console.error('Temel veriler yüklenirken hata:', err);
                setError(err.message || 'Failed to load base store and product data.');
            } finally {
                if (mounted) {
                    setIsLoadingAllStores(false);
                    setIsLoadingProducts(false);
                }
            }
        };
        loadBaseData();
        return () => { mounted = false; };
    }, []);

    // 2. Adım: Kullanıcının takip ettiği mağazaları yükle (Kullanıcı değiştiğinde veya ilk yüklemede)
    useEffect(() => {
        let mounted = true;
        if (user?.id) {
            setIsLoadingFollowedStores(true);
            setError(null);
            getFollowedSuppliers(user.id)
                .then(response => {
                    if (!mounted) return;
                    if (response.success && response.data) {
                        setFollowedApiStores(response.data);
                        // const ids = new Set(response.data.map(s => s.supplierID));
                        // setFollowedSuppliersSet(ids); // Artık doğrudan followedApiStores kullanılacak
                    } else {
                        setFollowedApiStores([]);
                        // setFollowedSuppliersSet(new Set());
                        toast.error(response.message || "Takip edilen mağazalar yüklenemedi.");
                    }
                })
                .catch(err => {
                    if (!mounted) return;
                    console.error('Takip edilen mağazalar yüklenirken hata:', err);
                    setError(err.message || 'Failed to load followed stores.');
                    setFollowedApiStores([]);
                    // setFollowedSuppliersSet(new Set());
                })
                .finally(() => {
                    if (mounted) setIsLoadingFollowedStores(false);
                });
        } else {
            // Kullanıcı yoksa, takip edilen mağazalar boş olmalı
            setFollowedApiStores([]);
            // setFollowedSuppliersSet(new Set());
            setIsLoadingFollowedStores(false); // Yükleme bitti sayılır
        }
        return () => { mounted = false; };
    }, [user]);


    // Takip Etme İşlevi
    const handleFollowStore = useCallback(async (supplierId: number) => {
        if (!user?.id) {
            toast.error("Lütfen önce giriş yapın.");
            return;
        }
        const toastId = toast.loading("Takip ediliyor...");
        try {
            const response = await followSupplier(user.id, supplierId);
            if (response.success) {
                toast.success("Mağaza takip edildi!", { id: toastId });
                // Takip edilenler listesini yenile
                const updatedFollowed = await getFollowedSuppliers(user.id);
                if (updatedFollowed.success && updatedFollowed.data) {
                    setFollowedApiStores(updatedFollowed.data);
                }
            } else {
                toast.error(response.message || "Takip etme başarısız.", { id: toastId });
            }
        } catch (error: any) {
            toast.error(error.message || "Bir hata oluştu.", { id: toastId });
        }
    }, [user]);

    // Takipten Çıkarma İşlevi
    const handleUnfollowStore = useCallback(async (supplierId: number) => {
        if (!user?.id) {
            toast.error("Lütfen önce giriş yapın.");
            return;
        }
        const toastId = toast.loading("Takipten çıkarılıyor...");
        try {
            const response = await unfollowSupplier(user.id, supplierId);
            if (response.success) {
                toast.success("Mağaza takipten çıkarıldı!", { id: toastId });
                // Takip edilenler listesini yenile
                 setFollowedApiStores(prev => prev.filter(s => s.supplierID !== supplierId));
            } else {
                toast.error(response.message || "Takipten çıkarma başarısız.", { id: toastId });
            }
        } catch (error: any) {
            toast.error(error.message || "Bir hata oluştu.", { id: toastId });
        }
    }, [user]);


    // Mağaza ve Ürün Resimlerini Yükleme Mantığı (useEffect içinde, tab değişimine ve verilere bağlı)
    useEffect(() => {
        if (isLoadingFollowedStores || isLoadingAllStores || isLoadingProducts) {
            // Ana veriler yüklenmeden resim yüklemeye başlama
            return;
        }

        let mounted = true;
        const loadImagesForCurrentView = async () => {
            if (!mounted) return;
            setLoadingSupplierImages(true);
            setLoadingProductImagesForTab(true);

            const currentStoresToDisplay = activeTab === 'followed'
                ? followedApiStores
                : allApiStores.filter(store => !followedApiStores.some(fs => fs.supplierID === store.supplierID));

            console.log(`Sekme '${activeTab}' için ${currentStoresToDisplay.length} mağazanın resmi yüklenecek.`);

            // Önce tüm mağaza resimleri için placeholder ata
            const initialSupplierImgState: Record<number, string> = {};
            currentStoresToDisplay.forEach(store => {
                 if(!supplierImages[store.supplierID]) initialSupplierImgState[store.supplierID] = DEFAULT_PLACEHOLDER;
            });
            if(Object.keys(initialSupplierImgState).length > 0) setSupplierImages(prev => ({...prev, ...initialSupplierImgState}));


            for (const store of currentStoresToDisplay) {
                if (!mounted) break;
                // Mağaza resmi yükle (eğer daha önce yüklenmediyse veya placeholder ise)
                if (!supplierImages[store.supplierID] || supplierImages[store.supplierID] === DEFAULT_PLACEHOLDER) {
                    try {
                        const baseStorePromptFromCode = "Sleek, modern storefront design with a professional appearance, emphasizing brand identity and unique style.";
                        // ID 1-15 için özel prompt (test amaçlı, gerekirse kaldırılabilir)
                        // const actualBasePromptToUse = (store.supplierID >= 1 && store.supplierID <= 15)
                        //     ? baseStorePromptFromCode + " "
                        //     : baseStorePromptFromCode;
                        
                        const generatedPrompt = generatePrompt(store.supplierName, baseStorePromptFromCode);
                        
                        const imageResponse = await fetch('/api/ImageCache', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                prompt: generatedPrompt.prompt,
                                entityType: "Supplier",
                                entityId: store.supplierID,
                                checkOnly: false // Her zaman yeniden üretmeyi zorla (veya cache'e güveniyorsak true)
                            })
                        });

                        if (imageResponse.ok) {
                            const data = await imageResponse.json();
                            if (data.success && data.image) {
                                if (mounted) setSupplierImages(prev => ({ ...prev, [store.supplierID]: `data:image/jpeg;base64,${data.image}` }));
                                console.log(`✅ Mağaza ID ${store.supplierID} (${store.supplierName}) resmi yüklendi.`);
                            } else { console.warn(`⚠️ Mağaza ID ${store.supplierID} API success=false veya resim yok.`); }
                        } else { console.error(`❌ Mağaza ID ${store.supplierID} resim HTTP hatası ${imageResponse.status}.`);}
                    } catch (err) {
                        console.error(`❌ Mağaza ID ${store.supplierID} resmi yüklenirken istisna:`, err);
                    }
                    if (mounted) await new Promise(resolve => setTimeout(resolve, 200)); // API rate limit için küçük bir bekleme
                }

                // Mağazanın ürünlerini al ve resimlerini yükle
                const storeProducts = getStoreProducts(store.supplierID); // Bu fonksiyonu aşağıda tanımlayacağız
                for (const product of storeProducts) {
                    if (!mounted) break;
                    if (!productImages[product.productID] || productImages[product.productID] === DEFAULT_PLACEHOLDER) {
                         if (mounted) setProductImages(prev => ({ ...prev, [product.productID]: DEFAULT_PLACEHOLDER })); // Önce placeholder
                        try {
                            const categoryKey = product.categoryName as CategoryKey || 'default';
                            const categoryPrompt = basePrompts[categoryKey] || basePrompts.default;
                        const promptText = categoryPrompt.main(product.productName);
                            
                            const productImageResponse = await fetch('/api/ImageCache', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                prompt: promptText,
                                entityType: "Product",
                                entityId: product.productID,
                                    checkOnly: false
                                })
                            });
                            if (productImageResponse.ok) {
                                const data = await productImageResponse.json();
                                if (data.success && data.image) {
                                   if (mounted) setProductImages(prev => ({ ...prev, [product.productID]: `data:image/jpeg;base64,${data.image}` }));
                                    console.log(`✅ Ürün ID ${product.productID} (${product.productName}) resmi yüklendi (Mağaza: ${store.supplierName}).`);
                                } else { console.warn(`⚠️ Ürün ID ${product.productID} API success=false veya resim yok.`); }
                            } else { console.error(`❌ Ürün ID ${product.productID} resim HTTP hatası ${productImageResponse.status}.`);}
                        } catch (err) {
                            console.error(`❌ Ürün ID ${product.productID} resmi yüklenirken istisna:`, err);
                        }
                        if (mounted) await new Promise(resolve => setTimeout(resolve, 200));
                    }
                }
            }
            if (mounted) {
                setLoadingSupplierImages(false);
                setLoadingProductImagesForTab(false);
                console.log(`🎉 Sekme '${activeTab}' için tüm resim yüklemeleri tamamlandı (veya denendi).`);
            }
        };

        // Sadece ana veriler yüklendiyse ve kullanıcı varsa resimleri yükle
        if (user?.id) {
             loadImagesForCurrentView();
        } else if (!user?.id && (activeTab === 'all' && allApiStores.length > 0)) {
            // Kullanıcı giriş yapmamışsa ama "Tüm Mağazalar" sekmesindeyse, yine de mağaza resimlerini yükleyebiliriz (ürünler hariç)
            loadImagesForCurrentView();
        }


        return () => { 
            mounted = false;
            console.log("Resim yükleme useEffect cleanup");
        };
    }, [user, activeTab, followedApiStores, allApiStores, isLoadingFollowedStores, isLoadingAllStores, isLoadingProducts, products /* Ek bağımlılıklar eklendi */]);
    

    // Bir mağazanın ürünlerini getiren yardımcı fonksiyon (productSupplierMap ve products state'ine bağlı)
    const getStoreProducts = useCallback((storeId: number): Product[] => {
        if (isLoadingProducts || products.length === 0) return []; // Ürünler yüklenmediyse boş dön

        const productSupplierMap = (window as any).productSupplierMap || {};
        const productIdsForStore = productSupplierMap[storeId] || [];
        
        if (productIdsForStore.length === 0) return [];

        const supplierProducts = products.filter(p => productIdsForStore.includes(p.productID));
        
        // Mağaza başına gösterilecek ürün sayısını sınırlayabiliriz (örneğin ilk 3)
        // ve deterministik bir sıralama yapabiliriz.
        const sortedProducts = [...supplierProducts].sort((a, b) => {
            const hashA = (a.productID * storeId) % 997; // storeId ile deterministik sıralama
            const hashB = (b.productID * storeId) % 997;
            return hashA - hashB;
        });
        
        return sortedProducts.slice(0, 3); // İlk 3 ürünü al
    }, [products, isLoadingProducts]);

    // Sekme değiştiğinde resim yükleme bayraklarını sıfırla
    useEffect(() => {
        // setLoadingSupplierImages(true); // Hemen true yapmak yerine, resim yükleme useEffect'i tetiklenince olsun
        // setLoadingProductImagesForTab(true);
        console.log(`Sekme değişti: ${activeTab}. Resim yükleme bayrakları resetlenecek ve yeniden yükleme tetiklenecek.`);
    }, [activeTab]);


    // Yükleme Durumları
    if (isLoadingFollowedStores || isLoadingAllStores || isLoadingProducts && !products.length) { // Eğer ürünler hiç yüklenmediyse
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3">Veriler yükleniyor...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <div className="text-red-500 text-lg">Hata: {error}</div>
                <button 
                    onClick={() => window.location.reload()} // Sayfayı yeniden yükle basit bir çözüm
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Yeniden Dene
                </button>
            </div>
        );
    }

    // Gösterilecek mağazaları belirle
    const followedSupplierIDs = new Set(followedApiStores.map(s => s.supplierID));
    const storesToShow = activeTab === 'followed' 
        ? followedApiStores
        : allApiStores.filter(store => !followedSupplierIDs.has(store.supplierID));

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center">
                <h1 style={{color: '#5365BF'}} className="text-5xl font-bold mt-12">Stores</h1>
            </div>

            {/* Sekme Başlıkları */}
            <div className="flex justify-center mt-8 border-b border-gray-200">
                <button
                    className={`px-6 py-3 font-medium text-lg ${activeTab === 'followed' 
                        ? 'text-blue-600 border-b-2 border-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('followed')}
                    disabled={!user?.id} // Kullanıcı giriş yapmadıysa takip ettiklerini göremez
                >
                    My Followed Stores
                </button>
                <button
                    className={`px-6 py-3 font-medium text-lg ${activeTab === 'all' 
                        ? 'text-blue-600 border-b-2 border-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('all')}
                >
                    Unfollowed Stores
                </button>
            </div>
            
            {/* Mağaza Yükleme Göstergesi (Sadece resimler için) */}
            {(loadingSupplierImages || loadingProductImagesForTab) && (
                 <div className="text-center py-4 text-gray-600">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                    Mağaza ve ürün resimleri yükleniyor...
                </div>
            )}

            {/* Mağaza listesi */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {storesToShow.length === 0 && !(isLoadingFollowedStores || isLoadingAllStores) ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        {activeTab === 'followed' 
                            ? (user?.id ? "Henüz hiç mağaza takip etmiyorsunuz. 'Unfollowed Stores' sekmesinden takip edebilirsiniz." : "Takip ettiğiniz mağazaları görmek için lütfen giriş yapın.")
                            : "Takip edilecek başka mağaza bulunmuyor."}
                    </div>
                ) : (
                    storesToShow.map((store) => {
                        const storeProducts = getStoreProducts(store.supplierID);
                        const isFollowed = followedSupplierIDs.has(store.supplierID);
                        
                        return (
                            <div
                                key={store.supplierID}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="relative h-52">
                                    <Image
                                        src={supplierImages[store.supplierID] || DEFAULT_PLACEHOLDER}
                                        alt={store.supplierName}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        unoptimized // Eğer Cloudinary veya benzeri bir optimizasyon servisi yoksa
                                        priority={false} // İlk birkaç resim için true olabilir
                                    />
                                    {/* Resim yükleniyor göstergesi (opsiyonel, eğer placeholder anında yükleniyorsa) */}
                                    {/* {supplierImages[store.supplierID] === DEFAULT_PLACEHOLDER && loadingSupplierImages && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                        </div>
                                    )} */}
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-xl font-semibold">{store.supplierName}</h2>
                                        <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                                            <span className="text-yellow-500 mr-1">★</span>
                                            <span className="font-semibold">{supplierRatings[store.supplierID] || 'N/A'}</span>
                                            <span className="text-gray-500 text-sm">/10</span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-600 mb-4">{store.contactEmail || 'No contact email'}</p>

                                    {/* Satıcı Ürünleri Bölümü */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold border-b pb-2 mb-3">Seller's Products</h3>
                                        {storeProducts.length > 0 ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {storeProducts.map(product => (
                                                    <Link 
                                                        href={`/product/${product.productID}`} 
                                                        key={product.productID}
                                                        className="block group"
                                                    >
                                                        <div className="relative h-20 w-full mb-1 overflow-hidden rounded"> {/* w-full eklendi */}
                                                            <Image
                                                                src={productImages[product.productID] || DEFAULT_PLACEHOLDER}
                                                                alt={product.productName}
                                                                fill
                                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                                sizes="100px" // Daha spesifik bir boyut
                                                                unoptimized
                                                            />
                                                        </div>
                                                        <p className="text-xs font-medium truncate group-hover:text-blue-600">{product.productName}</p>
                                                        <p className="text-xs text-blue-600">${product.price?.toFixed(2) || 'N/A'}</p>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 text-center py-2">No products available for this store.</p>
                                        )}
                                        <Link 
                                            href={`/store/details/${store.supplierID}`} 
                                            className="block text-center text-blue-600 hover:text-blue-800 text-sm mt-3"
                                        >
                                            View All Products ({ ( (window as any).productSupplierMap?.[store.supplierID] || [] ).length })
                                        </Link>
                                    </div>

                                    {/* Takip Et / Takibi Bırak butonu */}
                                    {user?.id && ( // Butonları sadece giriş yapmış kullanıcı görsün
                                    <div>
                                            {isFollowed ? (
                                            <button
                                                onClick={() => handleUnfollowStore(store.supplierID)}
                                                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                                            >
                                                Unfollow
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleFollowStore(store.supplierID)}
                                                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                                            >
                                                Follow
                                            </button>
                                        )}
                                    </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}