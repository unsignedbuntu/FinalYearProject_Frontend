"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const apiUrl = 'https://your-backend-api-url.com/products';

interface Product {
  ProductID: number;
  ProductName: string;
  Price: number;
}

const LandingPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [overlayVisible, setOverlayVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Ürünleri yüklerken bir hata oluştu:', error);
    }
  };

  const handleSearch = () => {
    alert(`Arama yapıldı: ${searchQuery}`);
  };

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  return (
    <div>
      <header>
        <Link href="/"><img src="logo.png" alt="Logo" /></Link>
        <input
          type="text"
          id="searchInput"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ara..."
        />
        <button onClick={handleSearch}>Ara</button>
        <Link href="/cart"><button id="cartButton">My Cart</button></Link>
        <Link href="/favorites"><button id="favoritesButton">Favorites</button></Link>
        <button id="loginButton" onClick={toggleOverlay}>Sign In/Sign Up</button>
      </header>

      <nav>
        <button id="storesButton" onMouseEnter={showMegaMenu} onMouseLeave={hideMegaMenu}>Stores</button>
        <Link href="/loyalty"><button id="loyaltyButton">Loyalty Program</button></Link>
        <Link href="/ktungpt"><button id="ktungptButton">KTUN GPT</button></Link>
        <Link href="/support"><button id="supportButton">Support</button></Link>
      </nav>

      <div id="megaMenu" className="mega-menu">
        <div className="category">Kategori 1</div>
        <div className="category">Kategori 2</div>
        <div className="category">Kategori 3</div>
      </div>

      <div id="productContainer">
        {products.map(product => (
          <div key={product.ProductID} className="product">
            <h3>{product.ProductName}</h3>
            <div>Fiyat: {product.Price} TL</div>
            <button onClick={() => addToCart(product.ProductID)}>Sepete Ekle</button>
            <button onClick={() => addToFavorites(product.ProductID)}>Favorilere Ekle</button>
          </div>
        ))}
      </div>

      {overlayVisible && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Sign In/Sign Up</h2>
            <div>Overlay içeriği buraya gelecek.</div>
            <button onClick={toggleOverlay}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
};

const showMegaMenu = () => {
  const megaMenu = document.getElementById('megaMenu');
  if (megaMenu) {
    megaMenu.style.display = 'block';
  }
};

const hideMegaMenu = () => {
  const megaMenu = document.getElementById('megaMenu');
  if (megaMenu) {
    megaMenu.style.display = 'none';
  }
};

const addToCart = (productId: number) => {
  alert(`Ürün sepete eklendi: ${productId}`);
};

const addToFavorites = (productId: number) => {
  alert(`Ürün favorilere eklendi: ${productId}`);
};

export default LandingPage;