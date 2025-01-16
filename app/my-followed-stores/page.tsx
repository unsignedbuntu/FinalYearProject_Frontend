"use client"
import { useState, useEffect } from 'react';
import { getSuppliers } from '@/services/Category_Actions';
import Image from 'next/image';

interface Supplier {
  supplierID: number;
  supplierName: string;
  contactEmail: string;
}

export default function MyFollowedStores() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierImages, setSupplierImages] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch image URL without async/await
  const fetchUnsplashImage = (supplierName: string, supplierID: number) => {
    fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(supplierName)}&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
        },
      }
    )
      .then(response => response.json())
      .then(data => {
        const imageUrl = data.results[0]?.urls?.regular || '/placeholder.jpg';
        setSupplierImages(prev => ({
          ...prev,
          [supplierID]: imageUrl
        }));
      })
      .catch(error => {
        console.error('Error fetching Unsplash image:', error);
        setSupplierImages(prev => ({
          ...prev,
          [supplierID]: '/placeholder.jpg'
        }));
      });
  };

  useEffect(() => {
    let mounted = true;

    // Load suppliers data
    getSuppliers()
      .then(data => {
        if (!mounted) return;
        setSuppliers(data);
        
        // Fetch images for each supplier
        data.forEach((supplier: Supplier) => {
          fetchUnsplashImage(supplier.supplierName, supplier.supplierID);
        });
      })
      .catch(err => {
        if (!mounted) return;
        setError('Failed to load suppliers');
        console.error(err);
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
        <div className="flex items-center justify-center">  
          <h1 style={{color: '#5365BF'}} className="text-5xl font-bold mt-12">My Followed Stores</h1>  
        </div>  
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <div 
            key={supplier.supplierID}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-48">
              <Image
                src={supplierImages[supplier.supplierID] || '/placeholder.jpg'}
                alt={supplier.supplierName}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{supplier.supplierName}</h2>
              <p className="text-gray-600 mb-4">{supplier.contactEmail}</p>
              
              <div className="flex justify-between items-center">
                <button 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  View Details
                </button>
                <button 
                  className="text-red-500 hover:text-red-600 transition-colors duration-300"
                >
                  Unfollow
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}