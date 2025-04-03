"use client"
import { useState, useEffect } from 'react';
import { getSuppliers, getProducts, getProductSuppliers } from '@/services/API_Service';
import { generateImage, generatePrompt } from '@/services/image-generation';
import Image from 'next/image';
import Link from 'next/link';

// Kategori bazlı prompts için import - utils yerine direkt product/[id]/data/basePrompts kullanıyoruz
import { basePrompts, CategoryKey } from '@/app/product/[id]/data/basePrompts';

// Global değişkenler - görüntü oluşturma işlemini kontrol etmek için
const globalImageCache: Record<string, string> = {};
const globalProductImageCache: Record<string, string> = {};
// Base64 encoded 1x1 transparent PNG as a placeholder
const DEFAULT_PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
// Mağaza başına sabit ürünleri tutmak için bir cache ekleyelim
const storeProductsCache: Record<number, Product[]> = {};
// Mağaza fotoğraflarının yüklenme durumunu takip etmek için flag
const storeImagesLoadingComplete = { value: false };

interface Supplier {
    supplierID: number;
    supplierName: string;
    contactEmail: string;
}

interface Product {
    productID: number;
    productName: string;
    price: number;
    image?: string;
    categoryID: number;
    categoryName?: string;
    supplierID: number; // Ürünün hangi mağazaya ait olduğunu belirten ID
}

export default function MyFollowedStores() {
    const [activeTab, setActiveTab] = useState<'followed' | 'all'>('followed');
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [allStores, setAllStores] = useState<Supplier[]>([]);
    const [supplierImages, setSupplierImages] = useState<{[key: number]: string}>({});
    const [followedSuppliers, setFollowedSuppliers] = useState<Set<number>>(new Set());
    const [supplierRatings, setSupplierRatings] = useState<{[key: number]: number}>({});
    const [products, setProducts] = useState<Product[]>([]);
    const [productImages, setProductImages] = useState<{[key: number]: string}>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [storeImagesLoaded, setStoreImagesLoaded] = useState(false);
    const [loadingImages, setLoadingImages] = useState(false);
    const [isGenerating, setIsGenerating] = useState<{[key: number]: boolean}>({});

    // Resim üretme fonksiyonlarını kaldırıyoruz
    // generateStoreImage ve generateProductImage fonksiyonları artık kullanılmıyor

    // Verileri yükleme için useEffect
    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            try {
                // Tedarikçileri, ürünleri ve ürün-tedarikçi ilişkilerini paralel olarak yükle
                const [suppliersData, productsData, productSuppliersData] = await Promise.all([
                    getSuppliers() as Promise<Supplier[]>,
                    getProducts() as Promise<Product[]>,
                    getProductSuppliers() as Promise<any[]>
                ]);
                
                if (!mounted) return;

                console.log(`Toplam ${suppliersData.length} tedarikçi, ${productsData.length} ürün ve ${productSuppliersData.length} ürün-tedarikçi ilişkisi yüklendi`);
                
                // API'den gelen tüm ürün-tedarikçi ilişkilerini konsola yazdır
                console.log("📊 TÜM ÜRÜN-TEDARİKÇİ İLİŞKİLERİ:", productSuppliersData);
                
                // Mağaza puanlarını oluştur (5-10 arası ağırlıklı olacak şekilde)
                const ratings: {[key: number]: number} = {};
                for (const supplier of suppliersData) {
                    // 0-4 arası puan olasılığı %20, 5-10 arası puan olasılığı %80
                    const randomVal = Math.random();
                    if (randomVal < 0.2) {
                        ratings[supplier.supplierID] = parseFloat((Math.random() * 5).toFixed(1));
                    } else {
                        ratings[supplier.supplierID] = parseFloat((Math.random() * 5 + 5).toFixed(1));
                    }
                }
                setSupplierRatings(ratings);

                // Rasgele hangi mağazaların takip edildiğini belirle
                const followed = new Set<number>();
                suppliersData.forEach((supplier) => {
                    if (Math.random() > 0.5) {
                        followed.add(supplier.supplierID);
                    }
                });
                setFollowedSuppliers(followed);

                // Takip edilen mağazaları ayır
                const followedSuppliersList = suppliersData.filter(supplier => followed.has(supplier.supplierID));
                setSuppliers(followedSuppliersList);
                setAllStores(suppliersData);
                
                // Ürünleri kaydet
                setProducts(productsData);
                
                // Mağaza başına ürünleri atamak için bir yapı oluştur (API'den gelen veriye göre)
                // Örneğin: { 18: [72, 75, 94, 105, 115, 168, 183, 225, 253], 32: [...], ... }
                const supplierProductMap: Record<number, number[]> = {};
                
                // Her tedarikçi için boş ürün dizisi oluştur
                suppliersData.forEach(supplier => {
                    supplierProductMap[supplier.supplierID] = [];
                });
                
                // ProductSuppliers verisinden gerçek ilişkileri al
                productSuppliersData.forEach(relation => {
                    // supplierID ve productID'yi kontrol et ve mevcut ise ilişkiyi kaydet
                    if (relation.supplierID && relation.productID) {
                        if (!supplierProductMap[relation.supplierID]) {
                            supplierProductMap[relation.supplierID] = [];
                        }
                        supplierProductMap[relation.supplierID].push(relation.productID);
                    }
                });
                
                // İlişki bulunamayan mağazalar için rastgele ürünler ata
                suppliersData.forEach((supplier, index) => {
                    const supplierID = supplier.supplierID;
                    
                    // Eğer bu mağaza için hiç ürün yoksa (API'den veri gelmiyorsa)
                    if (!supplierProductMap[supplierID] || supplierProductMap[supplierID].length === 0) {
                        // Ürün sayısını belirle - rastgele 5-25 arası
                        const productCount = 5 + Math.floor(Math.random() * 20);
                        
                        // Bu mağaza için rastgele ürün ID'leri seç
                        const productIds = generateRandomProductIds(productsData.length, productCount);
                        
                        // Mağaza-ürün eşleşmesini kaydet
                        supplierProductMap[supplierID] = productIds;
                        
                        console.log(`⚠️ Mağaza ID ${supplierID} (${supplier.supplierName}) için gerçek ilişki bulunamadı, ${productIds.length} rastgele ürün atandı`);
                    } else {
                        console.log(`✅ Mağaza ID ${supplierID} (${supplier.supplierName}) için ${supplierProductMap[supplierID].length} gerçek ürün ilişkisi bulundu`);
                    }
                });
                
                // Tüm mağaza-ürün ilişkilerini detaylı olarak konsola yazdır
                console.log("📊 TÜM MAĞAZA-ÜRÜN İLİŞKİLERİ:");
                
                suppliersData.forEach((supplier, index) => {
                    const supplierID = supplier.supplierID;
                    const productIds = supplierProductMap[supplierID] || [];
                    
                    // Her bir mağaza için ürün bilgilerini bul
                    const supplierProducts = productIds.map(productId => {
                        const product = productsData.find(p => p.productID === productId);
                        return product 
                            ? { id: productId, name: product.productName, price: product.price } 
                            : { id: productId, name: "Ürün bulunamadı", price: 0 };
                    });
                    
                    console.log(`🏬 ${index+1}. Mağaza: ${supplier.supplierName} (ID: ${supplierID}) - ${productIds.length} ürün:`);
                    console.log(`   Ürün ID'leri: [${productIds.join(', ')}]`);
                    
                    // Her bir ürünün detayını göster
                    supplierProducts.forEach((product, idx) => {
                        console.log(`   ${idx+1}. Ürün: ${product.name} (ID: ${product.id}) - $${product.price}`);
                    });
                });
                
                // Mağaza-ürün haritasını global olarak sakla
                (window as any).productSupplierMap = supplierProductMap;
                
                console.log("✅ Mağaza-ürün eşleşmeleri oluşturuldu");
                
                setIsLoading(false);
            } catch (err) {
                if (!mounted) return;
                setError('Failed to load data');
                console.error(err);
            }
        };
        
        // Belirli miktarda rastgele ürün ID'si oluştur
        const generateRandomProductIds = (maxProductId: number, count: number): number[] => {
            const productIds: number[] = [];
            const allIds = Array.from({length: maxProductId}, (_, i) => i + 1);
            
            // Rastgele ürün ID'leri seç
            while (productIds.length < count && allIds.length > 0) {
                const randomIndex = Math.floor(Math.random() * allIds.length);
                const id = allIds.splice(randomIndex, 1)[0];
                productIds.push(id);
            }
            
            return productIds;
        };

        loadData();

        return () => {
            mounted = false;
        };
    }, []);

    // Mağaza takip etme/bırakma işlevleri
    const handleFollowStore = (storeId: number) => {
        setFollowedSuppliers(prev => {
            const newFollowed = new Set(prev);
            newFollowed.add(storeId);
            return newFollowed;
        });

        // Takip edilen mağazalar listesini güncelle
        setSuppliers(prev => {
            const storeToAdd = allStores.find(store => store.supplierID === storeId);
            if (storeToAdd && !prev.some(s => s.supplierID === storeId)) {
                return [...prev, storeToAdd];
            }
            return prev;
        });
    };

    const handleUnfollowStore = (storeId: number) => {
        setFollowedSuppliers(prev => {
            const newFollowed = new Set(prev);
            newFollowed.delete(storeId);
            return newFollowed;
        });

        // Takip edilen mağazalar listesini güncelle
        setSuppliers(prev => prev.filter(supplier => supplier.supplierID !== storeId));
    };

    // Bir mağazanın ürünlerini getiren yardımcı fonksiyon
    const getStoreProducts = (storeId: number) => {
        // Önbellekteki ürünleri doğrudan kullan - her mağaza gösterimi için sabit kalır
        if (storeProductsCache[storeId]) {
            return storeProductsCache[storeId];
        }
        
        // GlobalStore'dan productSupplier haritasını al
        const productSupplierMap = (window as any).productSupplierMap || {};
        
        // Bu mağazaya atanmış ürün kimlikleri
        const productIds = productSupplierMap[storeId] || [];
        
        if (productIds.length > 0) {
            // Bu kimliklerle eşleşen gerçek ürünleri bul
            const supplierProducts = products.filter(product => 
                productIds.includes(product.productID)
            );
            
            console.log(`Mağaza ID ${storeId} için bulunabilecek ${supplierProducts.length} / ${productIds.length} ürün var`);
            
            if (supplierProducts.length > 0) {
                // Rastgele karıştırmak yerine, storeId'yi kullanarak deterministik bir şekilde ürünleri seç
                // Bu şekilde her seferinde aynı ürünler görülecek
                const sortedProducts = [...supplierProducts].sort((a, b) => {
                    // storeId kullanarak deterministik bir sıralama, böylece her yenileme için aynı olacak
                    const hashA = (a.productID * storeId) % 997;
                    const hashB = (b.productID * storeId) % 997;
                    return hashA - hashB;
                });
                
                // İlk 3 ürünü seç (veya daha az varsa tümünü)
                const selected = sortedProducts.slice(0, Math.min(3, sortedProducts.length));
                
                console.log(`🔍 Mağaza ID ${storeId} için ${selected.length} sabit ürün seçildi (${supplierProducts.length} ürün içinden)`);
                
                // Önbelleğe al
                storeProductsCache[storeId] = selected;
                return selected;
            }
        }
        
        // Hiç ürün bulunamazsa boş liste döndür
        console.log(`⚠️ Mağaza ID ${storeId} için hiç ürün bulunamadı`);
        storeProductsCache[storeId] = [];
        return [];
    };

    // Görsel yükleme süreci - mağaza ve ürün resimlerini sıralı şekilde yükler
    useEffect(() => {
        if (isLoading) return;
        if (loadingImages) return; // Hali hazırda yükleme yapılıyorsa, bekle
        if (storeImagesLoaded) return; // Eğer görüntüler yüklendiyse tekrar yükleme yapma
        
        const loadAllImages = async () => {
            setLoadingImages(true);
            
            try {
                // Log: tüm mağazaların ve ürünlerini yazdır
                console.log("📊 TÜM MAĞAZALAR VE ÜRÜNLERİ");
                
                // GlobalStore'dan productSupplier haritasını al
                const productSupplierMap = (window as any).productSupplierMap || {};
                
                // Her mağaza için atanan ürünleri yazdır
                allStores.forEach((store, index) => {
                    const storeProductIds = productSupplierMap[store.supplierID] || [];
                    console.log(`🏬 ${store.supplierName} (ID: ${store.supplierID}) - ${index+1}. sırada: ${storeProductIds.length} ürün:`);
                    console.log(`   Ürün ID'leri: [${storeProductIds.join(', ')}]`);
                });
                
                // 1. ADIM: ÖNCE TÜM MAĞAZA GÖRSELLERİNİ YÜKLE - İLK FOLLOWED, SONRA UNFOLLOWED
                console.log("🔄 Mağaza görselleri yükleniyor...");
                
                // Tüm mağazalara placeholder atama
                [...suppliers, ...allStores.filter(store => !followedSuppliers.has(store.supplierID))].forEach(store => {
                    if (!supplierImages[store.supplierID]) {
                        setSupplierImages(prev => ({
                            ...prev,
                            [store.supplierID]: DEFAULT_PLACEHOLDER
                        }));
                    }
                });
                
                // İlk önce takip edilen mağazaların görsellerini yükle
                console.log(`🔵 ADIM 1/4: Takip edilen ${suppliers.length} mağazanın görselleri yükleniyor...`);
                const followedImagePromises = [];
                
                for (const store of suppliers) {
                    const loadStoreImage = async () => {
                        try {
                            const generatedPrompt = generatePrompt(
                                store.supplierName,
                                "modern storefront design with professional appearance"
                            );
                            
                            const response = await fetch('/api/ImageCache', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    pageID: 'my-followed-stores',
                                    prompt: generatedPrompt.prompt,
                                    checkOnly: false
                                })
                            });
                            
                            if (response.ok) {
                                const data = await response.json();
                                if (data.success && data.image) {
                                    const imageUrl = `data:image/jpeg;base64,${data.image}`;
                                    setSupplierImages(prev => ({
                                        ...prev,
                                        [store.supplierID]: imageUrl
                                    }));
                                    console.log(`✅ [FOLLOWED] Mağaza ID ${store.supplierID} (${store.supplierName}) için görsel yüklendi`);
                                }
                            }
                        } catch (error) {
                            console.error(`❌ Mağaza ID ${store.supplierID} için görsel yüklenemedi:`, error);
                        }
                    };
                    
                    followedImagePromises.push(loadStoreImage().then(() => 
                        new Promise(resolve => setTimeout(resolve, 300))
                    ));
                }
                
                // Takip edilen mağazaların görsellerinin yüklenmesini bekle
                await Promise.all(followedImagePromises);
                console.log("✅ Takip edilen tüm mağaza görselleri yüklendi");
                
                // Sonra takip edilmeyen mağazaların görsellerini yükle
                const unfollowedStores = allStores.filter(store => !followedSuppliers.has(store.supplierID));
                console.log(`🔵 ADIM 2/4: Takip edilmeyen ${unfollowedStores.length} mağazanın görselleri yükleniyor...`);
                
                const unfollowedImagePromises = [];
                
                for (const store of unfollowedStores) {
                    const loadStoreImage = async () => {
                        try {
                            const generatedPrompt = generatePrompt(
                                store.supplierName,
                                "modern storefront design with professional appearance"
                            );
                            
                            const response = await fetch('/api/ImageCache', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    pageID: 'my-followed-stores',
                                    prompt: generatedPrompt.prompt,
                                    checkOnly: false
                                })
                            });
                            
                            if (response.ok) {
                                const data = await response.json();
                                if (data.success && data.image) {
                                    const imageUrl = `data:image/jpeg;base64,${data.image}`;
                                    setSupplierImages(prev => ({
                                        ...prev,
                                        [store.supplierID]: imageUrl
                                    }));
                                    console.log(`✅ [UNFOLLOWED] Mağaza ID ${store.supplierID} (${store.supplierName}) için görsel yüklendi`);
                                }
                            }
                        } catch (error) {
                            console.error(`❌ Mağaza ID ${store.supplierID} için görsel yüklenemedi:`, error);
                        }
                    };
                    
                    unfollowedImagePromises.push(loadStoreImage().then(() => 
                        new Promise(resolve => setTimeout(resolve, 300))
                    ));
                }
                
                // Takip edilmeyen mağazaların görsellerinin yüklenmesini bekle
                await Promise.all(unfollowedImagePromises);
                console.log("✅ Takip edilmeyen tüm mağaza görselleri yüklendi");
                console.log("🎉 TÜM MAĞAZA GÖRSELLERİ BAŞARIYLA YÜKLENDİ");
                
                // Mağaza görselleri yüklenme işlemi tamamlandı
                storeImagesLoadingComplete.value = true;
                
                // 3. ADIM: TÜM MAĞAZALAR İÇİN PRODUCT-SUPPLIER İLİŞKİLERİNİ DOĞRU KURARIM
                console.log(`🔄 Tüm mağazalar için ürün ilişkileri kuruluyor...`);
                
                // Önce tüm mağazalar için rastgele 3 ürün seçimini yap
                allStores.forEach(store => {
                    // Önbelleği temizle ve yeniden ürünleri getir
                    delete storeProductsCache[store.supplierID];
                    
                    // Ürünleri getir ve önbelleğe al
                    storeProductsCache[store.supplierID] = getStoreProducts(store.supplierID);
                });
                
                // 4. ADIM: ÜRÜN GÖRSELLERİNİ YÜKLE - ÖNCE FOLLOWED SONRA UNFOLLOWED STORES
                console.log(`🔵 ADIM 3/4: Takip edilen mağazaların ürün görselleri yükleniyor...`);
                
                // Önce takip edilen mağazaların ürünlerini yükle
                for (const store of suppliers) {
                    // Bu mağazanın ürünlerini al
                    const storeProducts = storeProductsCache[store.supplierID] || [];
                    
                    if (storeProducts.length === 0) {
                        console.log(`ℹ️ Mağaza ID ${store.supplierID} (${store.supplierName}) için hiç ürün bulunamadı`);
                        continue;
                    }
                    
                    console.log(`🔄 [FOLLOWED] Mağaza: ${store.supplierName} için ${storeProducts.length} ürün görseli yükleniyor...`);
                    
                    // Önce tüm ürünlere placeholder atama
                    for (const product of storeProducts) {
                        if (!productImages[product.productID]) {
                            setProductImages(prev => ({
                                ...prev,
                                [product.productID]: DEFAULT_PLACEHOLDER
                            }));
                        }
                    }
                    
                    // Bu mağazanın tüm ürünlerinin görsellerini sırayla yükle
                    for (const product of storeProducts) {
                        try {
                            const categoryKey = product.categoryName as CategoryKey || 'default';
                            const categoryPrompt = basePrompts[categoryKey] || basePrompts.default;
                            const prompt = categoryPrompt.main(product.productName);
                            
                            const response = await fetch('/api/ImageCache', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    pageID: 'products',
                                    prompt: prompt,
                                    checkOnly: false
                                })
                            });
                            
                            if (response.ok) {
                                const data = await response.json();
                                if (data.success && data.image) {
                                    const imageUrl = `data:image/jpeg;base64,${data.image}`;
                                    setProductImages(prev => ({
                                        ...prev,
                                        [product.productID]: imageUrl
                                    }));
                                    console.log(`✅ [FOLLOWED] Mağaza: ${store.supplierName} - Ürün ID ${product.productID} (${product.productName}) için görsel yüklendi`);
                                }
                            }
                            
                            // Her ürün arasında kısa bir gecikme
                            await new Promise(resolve => setTimeout(resolve, 300));
                        } catch (error) {
                            console.error(`❌ Ürün ID ${product.productID} için görsel yüklenemedi:`, error);
                        }
                    }
                    
                    console.log(`✅ [FOLLOWED] Mağaza: ${store.supplierName} için tüm ürün görselleri yüklendi`);
                }
                
                console.log("✅ Takip edilen mağazaların tüm ürün görselleri yüklendi");
                console.log(`🔵 ADIM 4/4: Takip edilmeyen mağazaların ürün görselleri yükleniyor...`);
                
                // Sonra takip edilmeyen mağazaların ürünlerini yükle
                for (const store of unfollowedStores) {
                    // Bu mağazanın ürünlerini al
                    const storeProducts = storeProductsCache[store.supplierID] || [];
                    
                    if (storeProducts.length === 0) {
                        console.log(`ℹ️ Mağaza ID ${store.supplierID} (${store.supplierName}) için hiç ürün bulunamadı`);
                        continue;
                    }
                    
                    console.log(`🔄 [UNFOLLOWED] Mağaza: ${store.supplierName} için ${storeProducts.length} ürün görseli yükleniyor...`);
                    
                    // Önce tüm ürünlere placeholder atama
                    for (const product of storeProducts) {
                        if (!productImages[product.productID]) {
                            setProductImages(prev => ({
                                ...prev,
                                [product.productID]: DEFAULT_PLACEHOLDER
                            }));
                        }
                    }
                    
                    // Bu mağazanın tüm ürünlerinin görsellerini sırayla yükle
                    for (const product of storeProducts) {
                        try {
                            const categoryKey = product.categoryName as CategoryKey || 'default';
                            const categoryPrompt = basePrompts[categoryKey] || basePrompts.default;
                            const prompt = categoryPrompt.main(product.productName);
                            
                            const response = await fetch('/api/ImageCache', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    pageID: 'products',
                                    prompt: prompt,
                                    checkOnly: false
                                })
                            });
                            
                            if (response.ok) {
                                const data = await response.json();
                                if (data.success && data.image) {
                                    const imageUrl = `data:image/jpeg;base64,${data.image}`;
                                    setProductImages(prev => ({
                                        ...prev,
                                        [product.productID]: imageUrl
                                    }));
                                    console.log(`✅ [UNFOLLOWED] Mağaza: ${store.supplierName} - Ürün ID ${product.productID} (${product.productName}) için görsel yüklendi`);
                                }
                            }
                            
                            // Her ürün arasında kısa bir gecikme
                            await new Promise(resolve => setTimeout(resolve, 300));
                        } catch (error) {
                            console.error(`❌ Ürün ID ${product.productID} için görsel yüklenemedi:`, error);
                        }
                    }
                    
                    console.log(`✅ [UNFOLLOWED] Mağaza: ${store.supplierName} için tüm ürün görselleri yüklendi`);
                }
                
                console.log("🎉 TÜM GÖRSEL YÜKLEME İŞLEMLERİ BAŞARIYLA TAMAMLANDI");
                
            } catch (error) {
                console.error('❌ Görsel yükleme hatası:', error);
            } finally {
                setLoadingImages(false);
                setStoreImagesLoaded(true);
            }
        };
        
        // Sayfa ilk yüklendiğinde hemen başlamasın, biraz beklesin
        const timer = setTimeout(loadAllImages, 1000);
        
        return () => clearTimeout(timer);
        
    }, [isLoading, activeTab, storeImagesLoaded]);
    
    // Mağaza resimlerinden önce ürünlerin local kopya resimlerini gösterme için
    useEffect(() => {
        if (!products || products.length === 0) return;
        
        // Sayfa açılır açılmaz tüm ürünlere placeholder atama
        // Bu sayede önce placeholder görünecek, sonra gerçek resimler gelince değişecek
        products.forEach(product => {
            if (!productImages[product.productID]) {
                setProductImages(prev => ({
                    ...prev,
                    [product.productID]: DEFAULT_PLACEHOLDER
                }));
            }
        });
    }, [products]);

    // Sekme değiştiğinde mağaza görsellerini yeniden yüklemeyi tetikle
    useEffect(() => {
        setStoreImagesLoaded(false); // Tab değiştiğinde, görsel yükleme işlemini sıfırla
    }, [activeTab]);

    // Yükleme ekranı
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Hata ekranı
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500">Failed to load data.</div>
            </div>
        );
    }

    // Mağaza listesini belirleme
    const storesToShow = activeTab === 'followed' 
        ? suppliers 
        : allStores.filter(store => !followedSuppliers.has(store.supplierID));

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

            {/* Mağaza listesi */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {storesToShow.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        {activeTab === 'followed' 
                            ? "You haven't followed any stores yet. Check the 'Unfollowed Stores' tab to follow some." 
                            : "No more stores to follow. You've followed them all!"}
                    </div>
                ) : (
                    storesToShow.map((store) => {
                        // Mağaza ürünlerini al
                        const storeProducts = getStoreProducts(store.supplierID);
                        
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
                                        unoptimized
                                    />
                                    {isGenerating[store.supplierID] && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-xl font-semibold">{store.supplierName}</h2>
                                        <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                                            <span className="text-yellow-500 mr-1">★</span>
                                            <span className="font-semibold">{supplierRatings[store.supplierID]}</span>
                                            <span className="text-gray-500 text-sm">/10</span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-600 mb-4">{store.contactEmail}</p>

                                    {/* Satıcı Ürünleri Bölümü */}
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold border-b pb-2 mb-3">Seller's Products</h3>
                                        {storeProducts.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-2">
                                                {storeProducts.map(product => (
                                                    <Link 
                                                        href={`/product/${product.productID}`} 
                                                        key={product.productID}
                                                        className="block group"
                                                    >
                                                        <div className="relative h-20 mb-1 overflow-hidden rounded">
                                                            <Image
                                                                src={productImages[product.productID] || DEFAULT_PLACEHOLDER}
                                                                alt={product.productName}
                                                                fill
                                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                                sizes="(max-width: 768px) 50vw, 120px"
                                                                unoptimized
                                                            />
                                                        </div>
                                                        <p className="text-xs font-medium truncate">{product.productName}</p>
                                                        <p className="text-xs text-blue-600">${product.price.toFixed(2)}</p>
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
                                            View All Products
                                        </Link>
                                    </div>

                                    {/* Takip Et / Takibi Bırak butonu */}
                                    <div>
                                        {followedSuppliers.has(store.supplierID) ? (
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
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}