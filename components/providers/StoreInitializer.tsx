'use client';

import { useEffect, useRef } from 'react';
import { useUserStore } from '@/app/stores/userStore';
import { useCartActions } from '@/app/stores/cartStore';
import { useFavoritesActions } from '@/app/stores/favoritesStore';

// Bu bileşen, kullanıcı giriş yaptığında store'ları başlatır
// ve çıkış yaptığında temizler.
function StoreInitializer() {
  const { user, hasCheckedAuth } = useUserStore(); // Auth durumunu kontrol et
  const { initializeCart, _clearLocalState: clearCartState } = useCartActions();
  const { initializeFavorites, _clearLocalState: clearFavoritesState } = useFavoritesActions();
  const initialized = useRef(false); // İlk yüklemede çift çağrıyı önlemek için (Strict Mode)

  useEffect(() => {
    // Strict Mode'da çift useEffect çağrısını ve
    // kimlik doğrulama kontrolü bitmeden çalıştırmayı önle
    if (initialized.current || !hasCheckedAuth) {
        // Eğer zaten başlatıldıysa veya auth kontrolü bitmediyse bir şey yapma
        // Ama auth kontrolü bitti ve kullanıcı *yoksa* state'i temizle
        if (hasCheckedAuth && !user) {
            console.log("Auth checked, user is null. Clearing stores.");
            clearCartState();
            clearFavoritesState();
            initialized.current = false; // Reset initialization flag on logout
        }
      return;
    }

    if (user?.id) {
      console.log("User authenticated, initializing stores...");
      initialized.current = true; // Sadece bir kere başlat
      // Kullanıcı giriş yapmışsa store'ları başlat
      const loadStores = async () => {
        await initializeCart();
        await initializeFavorites();
        console.log("Stores initialized.");
      };
      loadStores();
    } else {
      // Kullanıcı giriş yapmamışsa veya çıkış yapmışsa store'ları temizle
      console.log("User not authenticated or logged out, clearing stores...");
      clearCartState();
      clearFavoritesState();
      initialized.current = false; // Reset flag if user logs out during session
    }

    // useEffect bağımlılıkları: Kullanıcı durumu veya auth kontrol durumu değiştiğinde tetiklenir
  }, [user, hasCheckedAuth, initializeCart, initializeFavorites, clearCartState, clearFavoritesState]);

  // Bu bileşen UI render etmez, sadece store'ları yönetir.
  return null;
}

export default StoreInitializer; 