'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getProducts, getProductSuppliers, getStores, createCacheImage } from '@/services/Category_Actions';
import Cart from '@/components/icons/Cart';
import FavoriteIcon from '@/components/icons/FavoriteIcon';
import Stores from '@/components/icons/Stores';
import CartSuccessMessage from '@/components/messages/CartSuccessMessage';

interface ProductDescriptionProps {
  product: Product;
  supplier: ProductSupplier;  // supplier bilgisi ekledik
}

export default function ProductDescription({ product, supplier }: ProductDescriptionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
            {supplier?.supplierName?.[0] || 'S'}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{supplier?.supplierName || 'Store Name'}</h3>
            <div className="flex items-center">
              {/* ... yıldız rating sistemi ... */}
            </div>
          </div>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Follow Store
        </button>
      </div>
      {/* ... diğer description içeriği ... */}
    </div>
  );
}
interface ProductSupplier {
    productID: number;
    supplierID: number;
}

interface Store {
    storeID: number;
    storeName: string;
}

interface Product {
    productID: number;
    productName: string;
    categoryID: number;
    categoryName: string;
    price: number;
    image?: string;
    quantity: number;
    description?: string;
    specs?: Record<string, string>;
    reviews?: Review[];
    additionalImages?: string[];
}

interface Review {
    rating: number;
    comment: string;
    userName: string;
    date: string;
    avatar: string;
}

const categoryReviews = {
  'Computer/Tablet': [
    "Fast performance and great display. Perfect for work.",
    "Lightweight and easy to carry, great for travel.",
    "Handles all my gaming needs flawlessly. Impressive.",
    "Excellent battery life, lasts all day.",
    "User-friendly interface, easy to navigate."
],
'Printers & Projectors': [
    "Prints high-quality documents and photos quickly.",
    "Easy to set up and use, even for non-tech users.",
    "Reliable performance, no paper jams or errors.",
    "Great value for the price, very cost-effective.",
    "Compact design, fits easily in small spaces."
],
'Telephone': [
    "Clear sound quality, excellent for calls.",
    "Durable build, withstands daily wear and tear.",
    "Easy to use interface, simple navigation.",
    "Long battery life, lasts throughout the day.",
    "Stylish design, looks great on any desk."
],
'TV, Visual and Audio Systems': [
    "Immersive picture quality, vibrant colors.",
    "Excellent sound system, enhances the viewing experience.",
    "Easy to connect to other devices, versatile.",
    "Sleek design, complements any living room.",
    "User-friendly interface, simple to navigate."
],
'White Goods': [
    "Energy-efficient, saves on electricity bills.",
    "Spacious interior, fits all my groceries.",
    "Quiet operation, doesn't disturb the household.",
    "Durable build, lasts for years.",
    "Easy to clean, low maintenance."
],
'Air Conditioners and Heaters': [
    "Cools or heats the room quickly and efficiently.",
    "Quiet operation, doesn't disturb sleep.",
    "Easy to set up and use, simple controls.",
    "Energy-efficient, saves on energy bills.",
    "Stylish design, blends well with decor."
],
'Electrical Appliances': [
    "Powerful performance, gets the job done quickly.",
    "Easy to use, simple controls and settings.",
    "Durable build, withstands daily use.",
    "Versatile, can be used for multiple purposes.",
    "Compact design, easy to store."
],
'Photo and Camera': [
    "Captures stunning photos and videos.",
    "Easy to use, even for beginners.",
    "Durable build, can withstand outdoor use.",
    "Versatile, can be used for various types of photography.",
    "Long battery life, allows for extended use."
],
'Cleaning Products': [
    "Effectively cleans surfaces, removes dirt and grime.",
    "Leaves a fresh scent, makes the house smell clean.",
    "Easy to use, simple spray and wipe.",
    "Safe for use on various surfaces.",
    "Affordable price, great value for money."
],
'Diaper and Wet Wipes': [
    "Gentle on baby's skin, prevents irritation.",
    "Absorbent and leak-proof, keeps baby dry.",
    "Easy to use, convenient for diaper changes.",
    "Safe for use on sensitive skin.",
    "Affordable price, economical for daily use."
],
'Paper Products': [
    "Soft and absorbent, gentle on skin.",
    "Durable, doesn't tear easily.",
    "Easy to use, convenient for various purposes.",
    "Affordable price, economical for household use.",
    "Environmentally friendly, made from recycled materials."
],
'Drinks': [
    "Refreshing taste, quenches thirst.",
    "Variety of flavors, caters to different preferences.",
    "Convenient packaging, easy to carry.",
    "Affordable price, great value for money.",
    "Provides energy and hydration."
],
'Food Products': [
    "Delicious taste, satisfies cravings.",
    "Nutritious and healthy, provides essential nutrients.",
    "Easy to prepare, convenient for quick meals.",
    "Versatile, can be used in various recipes.",
    "Affordable price, economical for daily consumption."
],
'Petshop': [
    "Wide variety of products for all types of pets.",
    "High-quality products, safe for pets.",
    "Knowledgeable staff, provides helpful advice.",
    "Clean and organized store, easy to shop.",
    "Competitive prices, great deals on pet supplies."
],
'Household Consumables': [
    "Essential for daily household tasks.",
    "Convenient and easy to use.",
    "Durable and long-lasting.",
    "Affordable and economical.",
    "Wide variety of products to choose from."
],
'Womens Clothing': [
    "Stylish and trendy, keeps you up-to-date with fashion.",
    "Comfortable and well-fitting, feels great to wear.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be dressed up or down.",
    "Affordable prices, great value for money."
],
'Womens Accessories and Jewelry': [
    "Adds a touch of elegance to any outfit.",
    "Stylish and trendy designs.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be worn for various occasions.",
    "Affordable prices, enhances your look without breaking the bank."
],
'Mens Clothing': [
    "Stylish and modern, keeps you looking sharp.",
    "Comfortable and well-fitting, feels great to wear.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be worn for various occasions.",
    "Affordable prices, enhances your style without overspending."
],
'Mens Accessories and Jewelry': [
    "Adds a touch of sophistication to any outfit.",
    "Stylish and classic designs.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be worn for various occasions.",
    "Affordable prices, complements your look without costing too much."
],
'Womens Shoes and Bags': [
    "Stylish and trendy, complements any outfit.",
    "Comfortable and well-fitting, feels great to wear.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be worn for various occasions.",
    "Affordable prices, completes your look without breaking the bank."
],
'Mens Shoes and Bags': [
    "Stylish and functional, complements any outfit.",
    "Comfortable and well-fitting shoes, practical bags.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be used for various occasions.",
    "Affordable prices, complements your style without overspending."
],
'Kids': [
    "Cute and comfortable, perfect for kids.",
    "Durable and easy to clean.",
    "Safe materials, parents don't need to worry",
    "Variety of styles and colors, caters to different tastes.",
    "Affordable prices, economical for growing kids."
],
'Smart Home Devices': [
    "Easy to set up and use, smart technology for everyone.",
    "Convenient and time-saving, simplifies daily tasks.",
    "Secure and reliable, protects your home.",
    "Energy-efficient, saves on energy bills.",
    "Stylish design, blends well with modern homes."
],
'Gaming Equipment': [
    "Immersive gaming experience, high-performance gear.",
    "Comfortable and ergonomic design.",
    "Durable and long-lasting materials.",
    "Versatile, compatible with various gaming platforms.",
    "Enhances your gameplay, gives you a competitive edge."
],
'Musical Instruments': [
    "Clear sound quality, allows for expressive playing.",
    "Durable build, withstands frequent use.",
    "Easy to learn, perfect for beginners.",
    "Versatile, can be used for various genres of music.",
    "Inspires creativity, encourages musical expression."
],
'Office Supplies': [
    "Essential for daily office tasks.",
    "Convenient and easy to use.",
    "Durable and long-lasting.",
    "Affordable and economical.",
    "Helps you stay organized and productive."
],
'Sports Equipment': [
    "Enhances your performance, improves your fitness.",
    "Durable and reliable, withstands rigorous use.",
    "Comfortable and easy to use.",
    "Versatile, can be used for various sports and activities.",
    "Helps you stay active and healthy."
],
'Beauty and Personal Care': [
    "Enhances your natural beauty, boosts your confidence.",
    "Gentle and effective, suitable for sensitive skin.",
    "High-quality ingredients, safe and nourishing.",
    "Versatile, can be used for various skin types and concerns.",
    "Helps you feel good about yourself."
],
'Home Decor': [
    "Adds a touch of style and personality to your home.",
    "Stylish and trendy designs.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be used in various rooms and styles.",
    "Enhances the ambiance of your living space."
],
'Garden Tools': [
    "Essential for maintaining your garden.",
    "Durable and reliable, withstands outdoor use.",
    "Easy to use, simplifies gardening tasks.",
    "Versatile, can be used for various gardening activities.",
    "Helps you create a beautiful and thriving garden."
],
'Automotive Accessories': [
    "Enhances your driving experience, adds convenience.",
    "Stylish and functional designs.",
    "Durable and reliable, withstands daily use.",
    "Versatile, can be used in various types of vehicles.",
    "Improves the functionality and appearance of your car."
],
'Books and Stationery': [
    "Provides knowledge and inspiration.",
    "Helps you stay organized and creative.",
    "Durable and long-lasting.",
    "Affordable and accessible.",
    "Enriches your mind and stimulates your imagination."
],
'Bakery Products': [
    "Delicious and fresh, perfect for a treat.",
    "Wide variety of flavors and options.",
    "High-quality ingredients, tastes great.",
    "Conveniently packaged, easy to enjoy.",
    "Brightens your day with every bite."
],
'Frozen Foods': [
    "Convenient and easy to prepare, saves time.",
    "Versatile, can be used in various recipes.",
    "Maintains freshness, lasts longer than fresh foods.",
    "Affordable prices, economical for busy individuals.",
    "Provides a quick and easy meal solution."
],
'Dairy Products': [
    "Nutritious and healthy, provides essential nutrients.",
    "Versatile, can be used in various meals and snacks.",
    "High-quality ingredients, tastes great.",
    "Conveniently packaged, easy to store.",
    "Supports bone health and overall well-being."
],
'Organic Foods': [
    "Healthy and natural, free from harmful chemicals.",
    "Nutritious and delicious, great for a balanced diet.",
    "Environmentally friendly, supports sustainable farming.",
    "Versatile, can be used in various recipes.",
    "Promotes a healthier lifestyle."
],
'Pet Accessories': [
    "Fun and functional, enhances your pet's life.",
    "Durable and safe, designed for pet use.",
    "Variety of styles and designs.",
    "Convenient and easy to use.",
    "Helps you take care of your pet's needs."
],
'Fresh Produce': [
    "Nutritious and delicious, provides essential vitamins.",
    "Fresh and vibrant, tastes great.",
    "Versatile, can be used in various recipes.",
    "Supports a healthy diet.",
    "Available in a wide variety of options."
],
'Beverages': [
    "Refreshing and thirst-quenching.",
    "Variety of flavors and options.",
    "Conveniently packaged, easy to carry.",
    "Affordable and accessible.",
    "Provides energy and hydration."
],
'Snacks and Confectionery': [
    "Delicious and satisfying, perfect for a treat.",
    "Variety of flavors and textures.",
    "Conveniently packaged, easy to enjoy.",
    "Affordable and accessible.",
    "Brightens your day with every bite."
],
'Mobile Accessories': [
    "Enhances your mobile experience, adds convenience.",
    "Stylish and functional designs.",
    "Durable and reliable, protects your phone.",
    "Versatile, can be used with various phone models.",
    "Improves the functionality and appearance of your phone."
],
'Computer Components': [
    "High-performance and reliable.",
    "Easy to install and use.",
    "Durable and long-lasting.",
    "Enhances your computer's capabilities.",
    "Provides a smooth and efficient computing experience."
],
'Networking Equipment': [
    "Reliable and secure network connection.",
    "Easy to set up and use.",
    "Durable and long-lasting.",
    "Versatile, can be used for various network setups.",
    "Provides a fast and stable internet connection."
],
'Storage Devices': [
    "Large capacity and fast transfer speeds.",
    "Easy to use and portable.",
    "Durable and reliable.",
    "Versatile, can be used for various storage needs.",
    "Protects your data and provides convenient storage."
],
'Wearable Technology': [
    "Tracks your fitness and health metrics.",
    "Stylish and comfortable design.",
    "Easy to use and connected.",
    "Versatile, can be used for various activities.",
    "Helps you stay active and healthy."
],
'Audio Equipment': [
    "High-quality sound and immersive experience.",
    "Comfortable and stylish design.",
    "Easy to use and connected.",
    "Versatile, can be used for various audio sources.",
    "Enhances your listening experience."
],
'Kids Fashion': [
    "Cute and comfortable, perfect for kids.",
    "Durable and easy to clean.",
    "Safe materials, parents don't need to worry",
    "Variety of styles and colors, caters to different tastes.",
    "Affordable prices, economical for growing kids."
],
'Maternity Wear': [
    "Comfortable and supportive, perfect for pregnancy.",
    "Stylish and trendy designs.",
    "Safe materials, gentle on sensitive skin.",
    "Versatile, can be worn during and after pregnancy.",
    "Helps you feel good about yourself during this special time."
],
'Sportswear': [
    "Comfortable and breathable, enhances your performance.",
    "Durable and reliable, withstands rigorous use.",
    "Stylish and functional designs.",
    "Versatile, can be used for various sports and activities.",
    "Helps you stay active and healthy."
],
'Underwear and Lingerie': [
    "Comfortable and stylish, feels great to wear.",
    "Delicate and elegant designs.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be worn for various occasions.",
    "Boosts your confidence and enhances your comfort."
],
'Seasonal Fashion': [
    "Trendy and stylish, keeps you up-to-date with fashion.",
    "Comfortable and well-fitting, feels great to wear.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be dressed up or down.",
    "Affordable prices, great value for money."
],
'Luxury Fashion': [
    "Exclusive and high-end, makes a statement.",
    "Sophisticated and elegant designs.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be worn for special occasions.",
    "Elevates your style and enhances your presence."
],
'Professional Workwear': [
    "Comfortable and professional, enhances your career.",
    "Durable and easy to clean.",
    "Stylish and functional designs.",
    "Versatile, can be worn in various workplaces.",
    "Helps you make a good impression and stay productive."
],
'Traditional Wear': [
    "Cultural and unique, showcases your heritage.",
    "Comfortable and stylish designs.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be worn for cultural events.",
    "Connects you with your roots and celebrates your identity."
],
'Fashion Accessories': [
    "Enhances your outfit, adds a touch of style.",
    "Trendy and fashionable designs.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be used for various occasions.",
    "Completes your look and expresses your personality."
],
'Outdoor Clothing': [
    "Comfortable and protective, enhances your outdoor experience.",
    "Durable and weather-resistant.",
    "Stylish and functional designs.",
    "Versatile, can be used for various outdoor activities.",
    "Helps you stay active and explore nature."
],
'Kitchen Appliances': [
    "Efficient and reliable, simplifies cooking tasks.",
    "Easy to use and clean.",
    "Durable and long-lasting.",
    "Versatile, can be used for various recipes.",
    "Helps you cook delicious meals with ease."
],
'Personal Care Appliances': [
    "Effective and gentle, enhances your grooming routine.",
    "Easy to use and clean.",
    "Durable and reliable.",
    "Versatile, can be used for various personal care needs.",
    "Helps you look and feel your best."
],
'Home Cleaning Appliances': [
    "Efficient and powerful, simplifies cleaning tasks.",
    "Easy to use and maintain.",
    "Durable and long-lasting.",
    "Versatile, can be used for various surfaces.",
    "Helps you keep your home clean and healthy."
],
'Home Security Devices': [
    "Reliable and secure, protects your home.",
    "Easy to set up and use.",
    "Durable and long-lasting.",
    "Versatile, can be used in various home settings.",
    "Provides peace of mind and enhances your safety."
],
'Smart Wearables': [
    "Tracks your fitness and health metrics.",
    "Stylish and comfortable design.",
    "Easy to use and connected.",
    "Versatile, can be used for various activities.",
    "Helps you stay active and healthy."
],
'Pet Food': [
    "Nutritious and delicious, provides essential nutrients.",
    "High-quality ingredients, safe for pets.",
    "Variety of flavors and options.",
    "Conveniently packaged, easy to store.",
    "Supports your pet's health and well-being."
],
'Pet Care Products': [
    "Effective and safe, enhances your pet's hygiene.",
    "Easy to use and maintain.",
    "Durable and reliable.",
    "Versatile, can be used for various pet care needs.",
    "Helps you keep your pet happy and healthy."
],
'Organic Beverages': [
    "Refreshing and healthy, made with organic ingredients.",
    "Variety of flavors and options.",
    "Conveniently packaged, easy to carry.",
    "Supports a healthy lifestyle.",
    "Provides energy and hydration."
],
'Organic Snacks': [
    "Delicious and guilt-free, made with organic ingredients.",
    "Variety of flavors and textures.",
    "Conveniently packaged, easy to enjoy.",
    "Supports a healthy diet.",
    "Provides a tasty and nutritious snack."
],
'Luxury Bags': [
    "Exclusive and high-end, makes a statement.",
    "Sophisticated and elegant designs.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be used for special occasions.",
    "Elevates your style and enhances your presence."
],
'Luxury Shoes': [
    "Exclusive and high-end, makes a statement.",
    "Stylish and sophisticated designs.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be worn for special occasions.",
    "Elevates your style and enhances your presence."
],
'Luxury Watches': [
    "Exclusive and high-end, showcases your status.",
    "Timeless and elegant designs.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be worn for special occasions.",
    "Enhances your style and adds sophistication."
],
'Luxury Jewelry': [
    "Exclusive and high-end, makes a statement.",
    "Sparkling and elegant designs.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be worn for special occasions.",
    "Enhances your beauty and adds sophistication."
],
'Designer Clothing': [
    "Innovative and stylish, pushes the boundaries of fashion.",
    "Unique and eye-catching designs.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be worn for fashion events.",
    "Expresses your individuality and creativity."
],
'Designer Accessories': [
    "Unique and stylish, adds a touch of personality.",
    "Innovative and eye-catching designs.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be used for various occasions.",
    "Expresses your individuality and enhances your style."
],
'Designer Shoes': [
    "Avant-garde and stylish, makes a bold statement.",
    "Unique and eye-catching designs.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be worn for fashion events.",
    "Expresses your individuality and creativity."
],
'Designer Bags': [
    "Innovative and functional, combines style and practicality.",
    "Unique and eye-catching designs.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be used for various occasions.",
    "Expresses your individuality and enhances your style."
],
'Designer Jewelry': [
    "Contemporary and elegant, adds a touch of sophistication.",
    "Unique and eye-catching designs.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be worn for various occasions.",
    "Expresses your individuality and enhances your beauty."
],
'Luxury Home Decor': [
    "Elevates your home's ambiance, creates a luxurious atmosphere.",
    "Stylish and refined designs.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be used in various rooms and styles.",
    "Enhances the beauty and comfort of your living space."
],
'Luxury Beauty Products': [
    "Indulgent and effective, enhances your natural beauty.",
    "Gentle and nourishing, suitable for sensitive skin.",
    "High-quality ingredients, safe and luxurious.",
    "Versatile, can be used for various skin types and concerns.",
    "Helps you feel pampered and confident."
],
'Luxury Personal Care': [
    "Refined and comforting, enhances your self-care routine.",
    "Gentle and effective, suitable for sensitive skin.",
    "High-quality ingredients, safe and luxurious.",
    "Versatile, can be used for various personal care needs.",
    "Helps you relax and rejuvenate."
],
'Luxury Food Products': [
    "Gourmet and exclusive, delights your taste buds.",
    "High-quality ingredients, tastes exquisite.",
    "Versatile, can be used in various recipes.",
    "Creates a memorable dining experience.",
    "Elevates your culinary creations."
],
'Luxury Drinks': [
    "Premium and sophisticated, enhances any occasion.",
    "Refined flavors and exquisite taste.",
    "Versatile, can be enjoyed in various settings.",
    "Creates a memorable drinking experience.",
    "Elevates your social gatherings."
],
'Luxury Snacks': [
    "Delectable and indulgent, satisfies your cravings.",
    "High-quality ingredients, tastes exquisite.",
    "Versatile, can be enjoyed at any time.",
    "Creates a memorable snacking experience.",
    "Elevates your everyday moments."
],
'Luxury Kitchen Appliances': [
    "Efficient and stylish, simplifies cooking tasks.",
    "Easy to use and clean.",
    "Durable and long-lasting.",
    "Versatile, can be used for various recipes.",
    "Enhances your cooking experience and creates culinary masterpieces."
],
'Luxury Home Appliances': [
    "Efficient and powerful, simplifies household tasks.",
    "Easy to use and maintain.",
    "Durable and long-lasting.",
    "Versatile, can be used for various home cleaning needs.",
    "Creates a comfortable and healthy living environment."
],
'Luxury Electronics': [
    "Immersive and innovative, enhances your entertainment experience.",
    "Cutting-edge technology and stylish design.",
    "Easy to use and connected.",
    "Versatile, can be used for various entertainment purposes.",
    "Elevates your leisure time and enhances your lifestyle."
],
'Luxury Wearables': [
    "Sophisticated and connected, enhances your active lifestyle.",
    "Stylish and comfortable design.",
    "Easy to use and personalized.",
    "Versatile, can be used for various activities.",
    "Helps you stay connected and achieve your fitness goals."
],
'Luxury Smart Home Devices': [
    "Automated and connected, enhances your home's convenience.",
    "Seamless integration and stylish design.",
    "Easy to use and personalized.",
    "Versatile, can be used for various smart home needs.",
    "Creates a secure, efficient, and comfortable living environment."
]
};


const generateReviews = (category: string) => {
    const reviews = categoryReviews[category] || categoryReviews.default;
    
    // Log için
    console.log('Generating reviews for category:', category);
    console.log('Found reviews:', reviews ? 'Yes' : 'Using default');

    return reviews.map(review => ({
        ...review,
        // Rastgele kullanıcı ve tarih ataması
        userName: `User${Math.floor(Math.random() * 1000)}`,
        date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString()
    }));
};

const SupplierInfo = ({ store }: { store: Store | null }) => {
    if (!store) return null;

    const randomRating = (Math.random() * 2 + 3).toFixed(1);

    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                        {store.storeName.charAt(0)}
                    </span>
                </div>
                <div>
                    <h3 className="font-medium text-gray-900">{store.storeName}</h3>
                    <div className="flex items-center">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`text-sm ${
                                        star <= Number(randomRating)
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                    }`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">({randomRating})</span>
                    </div>
                </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Follow Store
            </button>
        </div>
    );
};

const ProductDescription = ({ product, store }: { product: Product; store: Store | null }) => {
    return (
        <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-4">Product Description</h2>
                    <p className="text-gray-600">{product.description}</p>
                </div>

                <SupplierInfo store={store} />

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(product.specs || {}).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600 capitalize">{key}</div>
                                <div className="font-medium">{value as string}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
                <div className="space-y-4">
                    {product.reviews?.map((review: Review, index: number) => (
                        <div key={index} className="border-b last:border-0 pb-4">
                            <div className="flex items-center gap-4 mb-2">
                                <img
                                    src={review.avatar}
                                    alt="User"
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <div className="font-medium">{review.userName}</div>
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={`text-sm ${
                                                    star <= review.rating
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300'
                                                }`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                        <span className="ml-2 text-sm text-gray-500">
                                            {review.date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Kategori bazlı prompt oluşturma
const generateProductPrompt = (productName: string, category: string) => {

  const basePrompts = {

    'Computer/Tablet': {
        main: `ultra detailed product photography of ${productName}, modern gaming laptop, sleek design, premium build quality, RGB lighting, professional studio lighting, 8k resolution`,
        views: [
            'front view showing display and keyboard illumination',
            'side view highlighting slim profile and ports',
            '45-degree angle showcasing design elements',
            'close-up of keyboard and touchpad details'
        ]
    },
    'Printers & Projectors': {
        main: `professional product photography of ${productName}, office environment, crisp image, high resolution`,
        views: [
            'front view showing control panel',
            'side view showing paper tray',
            'angled view for overall design',
            'close-up of print quality'
        ]
    },
    'Telephone': {
        main: `modern product photography of ${productName}, sleek design, corporate environment, high detail`,
        views: [
            'front view with display lit up',
            'side view showing slim profile',
            'angled view for ergonomic design',
            'close-up of keypad and buttons'
        ]
    },
    'TV, Visual and Audio Systems': {
        main: `high-end product photography of ${productName}, entertainment setup, vibrant colors, immersive experience`,
        views: [
            'front view showing screen content',
            'side view showing slim design',
            'angled view for home integration',
            'close-up of ports and connections'
        ]
    },
    'White Goods': {
        main: `clean product photography of ${productName}, kitchen setting, stainless steel, modern appliances`,
        views: [
            'front view showing door and controls',
            'side view showing size and depth',
            'angled view for kitchen integration',
            'close-up of interior features'
        ]
    },
    'Air Conditioners and Heaters': {
        main: `product shot of ${productName}, room environment, energy efficient, comfort`,
        views: [
            'front view showing control panel',
            'side view showing slim profile',
            'angled view for room integration',
            'close-up of air vents and filters'
        ]
    },
    'Electrical Appliances': {
        main: `studio product shot of ${productName}, household use, ease of use, practical`,
        views: [
            'front view showing main features',
            'side view showing attachments',
            'angled view for handle and controls',
            'close-up of special functions'
        ]
    },
    'Photo and Camera': {
        main: `product photography of ${productName}, outdoor or studio setting, capturing moments, high resolution`,
        views: [
            'front view showing lens and controls',
            'side view showing grip and ports',
            'angled view for ergonomic design',
            'close-up of lens and sensor details'
        ]
    },
    'Cleaning Products': {
        main: `product shot of ${productName}, household cleaning, hygiene, effective`,
        views: [
            'front view showing bottle and label',
            'angled view showing spray nozzle',
            'close-up of ingredients and instructions',
            'contextual view in a cleaning setting'
        ]
    },
    'Diaper and Wet Wipes': {
        main: `product photography of ${productName}, baby care, gentle, safe`,
        views: [
            'front view showing packaging',
            'angled view showing contents',
            'close-up of material and texture',
            'contextual view in a baby care setting'
        ]
    },
    'Paper Products': {
        main: `product shot of ${productName}, household use, convenience, essential`,
        views: [
            'front view showing packaging',
            'angled view showing product stack',
            'close-up of material and texture',
            'contextual view in a household setting'
        ]
    },
    'Drinks': {
        main: `product photography of ${productName}, refreshment, tasty, variety`,
        views: [
            'front view showing bottle or can',
            'angled view showing drink pouring',
            'close-up of liquid texture',
            'contextual view in a social setting'
        ]
    },
    'Food Products': {
        main: `product shot of ${productName}, delicious, nutritious, quality`,
        views: [
            'front view showing packaging',
            'angled view showing food preparation',
            'close-up of ingredients and texture',
            'contextual view in a meal setting'
        ]
    },
    'Petshop': {
        main: `product photography of ${productName}, pet care, health, happiness`,
        views: [
            'front view showing packaging',
            'angled view showing product in use',
            'close-up of ingredients or features',
            'contextual view with a pet'
        ]
    },
    'Household Consumables': {
        main: `product shot of ${productName}, household essentials, practical, economical`,
        views: [
            'front view showing packaging',
            'angled view showing usage',
            'close-up of features and details',
            'contextual view in a household setting'
        ]
    },
    'Womens Clothing': {
        main: `fashion product photography of ${productName}, stylish, trendy, high fashion`,
        views: [
            'front view showing full outfit',
            'side view showing silhouette',
            'angled view showcasing design',
            'close-up of fabric and details'
        ]
    },
    'Womens Accessories and Jewelry': {
        main: `elegant product shot of ${productName}, stylish, sophisticated, delicate`,
        views: [
            'front view showing overall design',
            'side view showing depth and detail',
            'angled view showcasing sparkle',
            'close-up of gems and craftsmanship'
        ]
    },
    'Mens Clothing': {
        main: `fashion product photography of ${productName}, stylish, modern, tailored`,
        views: [
            'front view showing full outfit',
            'side view showing fit and cut',
            'angled view showcasing style',
            'close-up of fabric and details'
        ]
    },
    'Mens Accessories and Jewelry': {
        main: `elegant product shot of ${productName}, stylish, sophisticated, masculine`,
        views: [
            'front view showing overall design',
            'side view showing construction and detail',
            'angled view showcasing texture',
            'close-up of materials and craftsmanship'
        ]
    },
    'Womens Shoes and Bags': {
        main: `stylish product photography of ${productName}, elegant, trendy, fashionable`,
        views: [
            'front view showing overall design',
            'side view showing shape and height',
            'angled view showcasing texture',
            'close-up of materials and stitching'
        ]
    },
    'Mens Shoes and Bags': {
        main: `stylish product photography of ${productName}, trendy, modern, functional`,
        views: [
            'front view showing design and closure',
            'side view showing capacity and shape',
            'angled view showcasing materials',
            'close-up of details and features'
        ]
    },
    'Kids': {
        main: `product photography of ${productName}, playful, colorful, durable`,
        views: [
            'front view showing design and features',
            'side view showing comfort and size',
            'angled view showcasing details',
            'contextual view with a child'
        ]
    },
    'Smart Home Devices': {
        main: `product photography of ${productName}, connected, innovative, smart`,
        views: [
            'front view showing device interface',
            'side view showing size and integration',
            'angled view showcasing design',
            'contextual view in a home setting'
        ]
    },
   'Gaming Equipment': {
        main: `professional product shot of ${productName}, gaming peripheral, dramatic lighting, matte finish, high-end commercial photography`,
        views: [
            'front view with RGB lighting effects',
            'side profile showing ergonomic design',
            'top-down view of all buttons and features',
            'detail shot of special features'
        ]
    },
    'Musical Instruments': {
        main: `artistic product photography of ${productName}, classic, resonant, craftsmanship`,
        views: [
            'front view showing instrument body',
            'side view showing shape and form',
            'angled view showcasing details',
            'close-up of strings or keys'
        ]
    },
    'Office Supplies': {
        main: `clean product photography of ${productName}, organized, efficient, essential`,
        views: [
            'front view showing item set',
            'angled view showing functionality',
            'close-up of features and details',
            'contextual view on a desk'
        ]
    },
    'Sports Equipment': {
        main: `dynamic product photography of ${productName}, active, durable, high performance`,
        views: [
            'front view showing key features',
            'side view showing design and shape',
            'angled view showcasing material',
            'action shot in a sports setting'
        ]
    },
    'Beauty and Personal Care': {
        main: `elegant product photography of ${productName}, beauty, self-care, radiant`,
        views: [
            'front view showing packaging and product',
            'angled view showcasing texture and color',
            'close-up of ingredients and details',
            'contextual view in a self-care setting'
        ]
    },
    'Home Decor': {
        main: `stylish product photography of ${productName}, interior design, comfort, ambiance`,
        views: [
            'front view showing overall design',
            'angled view showcasing texture and color',
            'contextual view in a home setting',
            'detail shot of unique features'
        ]
    },
    'Garden Tools': {
        main: `clean product photography of ${productName}, gardening, outdoor, durable`,
        views: [
            'front view showing tool head',
            'side view showing handle and length',
            'angled view showcasing features',
            'contextual view in a garden setting'
        ]
    },
    'Automotive Accessories': {
        main: `dynamic product photography of ${productName}, automotive, style, performance`,
        views: [
            'front view showing accessory features',
            'side view showing fit and integration',
            'angled view showcasing design',
            'contextual view on a car'
        ]
    },
    'Books and Stationery': {
        main: `classic product photography of ${productName}, reading, writing, education`,
        views: [
            'front view showing cover and title',
            'side view showing spine and thickness',
            'angled view showcasing texture',
            'close-up of pages and details'
        ]
    },
    'Bakery Products': {
        main: `enticing product photography of ${productName}, delicious, fresh, artisanal`,
        views: [
            'front view showing product detail',
            'angled view showcasing texture and presentation',
            'close-up of ingredients and toppings',
            'contextual view in a bakery setting'
        ]
    },
    'Frozen Foods': {
        main: `clean product photography of ${productName}, convenience, tasty, preserved`,
        views: [
            'front view showing packaging and contents',
            'angled view showcasing ingredients',
            'close-up of texture and preparation',
            'contextual view in a freezer setting'
        ]
    },
    'Dairy Products': {
        main: `clean product photography of ${productName}, fresh, nutritious, healthy`,
        views: [
            'front view showing packaging and product',
            'angled view showcasing texture and consistency',
            'close-up of details and benefits',
            'contextual view in a breakfast setting'
        ]
    },
    'Organic Foods': {
        main: `natural product photography of ${productName}, organic, healthy, sustainable`,
        views: [
            'front view showing packaging and certifications',
            'angled view showcasing ingredients and texture',
            'close-up of labels and benefits',
            'contextual view in a farm setting'
        ]
    },
    'Pet Accessories': {
        main: `playful product photography of ${productName}, pet care, fun, durable`,
        views: [
            'front view showing accessory features',
            'angled view showcasing design and usage',
            'close-up of materials and details',
            'contextual view with a pet'
        ]
    },
    'Fresh Produce': {
        main: `vibrant product photography of ${productName}, fresh, organic, natural`,
        views: [
            'front view showing produce texture',
            'angled view showcasing color and shape',
            'close-up of details and freshness',
            'contextual view in a market setting'
        ]
    },
    'Beverages': {
        main: `refreshing product photography of ${productName}, tasty, cooling, variety`,
        views: [
            'front view showing bottle or can',
            'angled view showcasing liquid texture',
            'close-up of bubbles and condensation',
            'contextual view in a social setting'
        ]
    },
    'Snacks and Confectionery': {
        main: `enticing product photography of ${productName}, delicious, sweet, tempting`,
        views: [
            'front view showing snack features',
            'angled view showcasing texture and toppings',
            'close-up of ingredients and details',
            'contextual view in a relaxing setting'
        ]
    },
    'Mobile Accessories': {
        main: `modern product photography of ${productName}, stylish, functional, tech`,
        views: [
            'front view showing accessory features',
            'side view showing compatibility and fit',
            'angled view showcasing design',
            'contextual view with a mobile phone'
        ]
    },
    'Computer Components': {
        main: `technical product photography of ${productName}, high-performance, innovative, detailed`,
        views: [
            'front view showing component layout',
            'side view showing heat sinks and ports',
            'angled view showcasing craftsmanship',
            'close-up of circuit boards and connections'
        ]
    },
    'Networking Equipment': {
        main: `clean product photography of ${productName}, connected, efficient, reliable`,
        views: [
            'front view showing device ports',
            'side view showing size and shape',
            'angled view showcasing antennas',
            'contextual view in a home or office setting'
        ]
    },
    'Storage Devices': {
        main: `modern product photography of ${productName}, efficient, secure, portable`,
        views: [
            'front view showing device label',
            'side view showing size and port',
            'angled view showcasing design',
            'contextual view with a laptop'
        ]
    },
    'Wearable Technology': {
        main: `dynamic product photography of ${productName}, active, connected, stylish`,
        views: [
            'front view showing device display',
            'side view showing band and sensors',
            'angled view showcasing design',
            'contextual view on a wrist'
        ]
    },
    'Audio Equipment': {
        main: `artistic product photography of ${productName}, immersive, clear, resonant`,
        views: [
            'front view showing device design',
            'side view showing earcups or speakers',
            'angled view showcasing details',
            'contextual view in a listening setting'
        ]
    },
    'Kids Fashion': {
        main: `playful product photography of ${productName}, cute, stylish, comfortable`,
        views: [
            'front view showing garment detail',
            'side view showing fit and shape',
            'angled view showcasing color and pattern',
            'contextual view on a child'
        ]
    },
    'Maternity Wear': {
        main: `comfortable product photography of ${productName}, supportive, stylish, nurturing`,
        views: [
            'front view showing garment detail',
            'side view showing fit and comfort',
            'angled view showcasing design',
            'contextual view on a pregnant woman'
        ]
    },
    'Sportswear': {
        main: `dynamic product photography of ${productName}, active, breathable, durable`,
        views: [
            'front view showing garment features',
            'side view showing fit and mobility',
            'angled view showcasing material',
            'action shot in a sports setting'
        ]
    },
    'Underwear and Lingerie': {
        main: `elegant product photography of ${productName}, comfortable, stylish, delicate`,
        views: [
            'front view showing garment detail',
            'side view showing fit and shape',
            'angled view showcasing lace and details',
            'contextual view on a mannequin'
        ]
    },
    'Seasonal Fashion': {
        main: `trendy product photography of ${productName}, stylish, current, fashionable`,
        views: [
            'front view showing garment detail',
            'side view showing silhouette and trends',
            'angled view showcasing season-specific details',
            'contextual view in a fashion setting'
        ]
    },
    'Luxury Fashion': {
        main: `high-end product photography of ${productName}, exclusive, elegant, sophisticated`,
        views: [
            'front view showing garment detail',
            'side view showing tailoring and shape',
            'angled view showcasing luxury materials',
            'contextual view in a high-fashion setting'
        ]
    },
    'Professional Workwear': {
        main: `professional product photography of ${productName}, corporate, durable, stylish`,
        views: [
            'front view showing garment fit',
            'side view showing tailoring and design',
            'angled view showcasing materials',
            'contextual view in an office setting'
        ]
    },
    'Traditional Wear': {
        main: `cultural product photography of ${productName}, traditional, unique, authentic`,
        views: [
            'front view showing garment detail',
            'side view showing silhouette and fit',
            'angled view showcasing cultural details',
            'contextual view in a cultural setting'
        ]
    },
    'Fashion Accessories': {
        main: `stylish product photography of ${productName}, fashionable, trendy, chic`,
        views: [
            'front view showing accessory detail',
            'side view showing design and shape',
            'angled view showcasing unique features',
            'contextual view with a fashion model'
        ]
    },
    'Outdoor Clothing': {
        main: `dynamic product photography of ${productName}, durable, comfortable, weather-resistant`,
        views: [
            'front view showing garment features',
            'side view showing fit and mobility',
            'angled view showcasing material',
            'action shot in an outdoor setting'
        ]
    },
    'Kitchen Appliances': {
        main: `clean product photography of ${productName}, efficient, reliable, modern`,
        views: [
            'front view showing device panel',
            'side view showing size and integration',
            'angled view showcasing design',
            'contextual view in a kitchen setting'
        ]
    },
    'Personal Care Appliances': {
        main: `stylish product photography of ${productName}, grooming, personal, hygienic`,
        views: [
            'front view showing device features',
            'side view showing size and handle',
            'angled view showcasing design',
            'contextual view in a bathroom setting'
        ]
    },
    'Home Cleaning Appliances': {
        main: `clean product photography of ${productName}, efficient, powerful, hygienic`,
        views: [
            'front view showing device head',
            'side view showing size and reach',
            'angled view showcasing features',
            'contextual view in a cleaning setting'
        ]
    },
    'Home Security Devices': {
        main: `modern product photography of ${productName}, secure, connected, reliable`,
        views: [
            'front view showing device interface',
            'side view showing size and integration',
            'angled view showcasing design',
            'contextual view protecting a home'
        ]
    },
    'Smart Wearables': {
        main: `dynamic product photography of ${productName}, active, connected, stylish`,
        views: [
            'front view showing device display',
            'side view showing band and sensors',
            'angled view showcasing design',
            'contextual view on a wrist in action'
        ]
    },
    'Pet Food': {
        main: `natural product photography of ${productName}, healthy, nutritious, tasty`,
        views: [
            'front view showing packaging details',
            'angled view showcasing texture and ingredients',
            'close-up of nutritional information',
            'contextual view near a pet'
        ]
    },
    'Pet Care Products': {
        main: `playful product photography of ${productName}, caring, essential, reliable`,
        views: [
            'front view showing product features',
            'angled view showcasing design and usage',
            'close-up of materials and instructions',
            'contextual view with a pet owner'
        ]
    },
    'Organic Beverages': {
        main: `natural product photography of ${productName}, refreshing, healthy, organic`,
        views: [
            'front view showing bottle or can',
            'angled view showcasing liquid clarity',
            'close-up of labels and benefits',
            'contextual view in a health-conscious setting'
        ]
    },
    'Organic Snacks': {
        main: `natural product photography of ${productName}, tasty, guilt-free, organic`,
        views: [
            'front view showing snack details',
            'angled view showcasing texture and ingredients',
            'close-up of nutritional information',
            'contextual view in a snack setting'
        ]
    },
    'Luxury Bags': {
        main: `high-end product photography of ${productName}, exclusive, elegant, fashionable`,
        views: [
            'front view showing bag features',
            'side view showing shape and dimensions',
            'angled view showcasing material quality',
            'contextual view with a luxury outfit'
        ]
    },
    'Luxury Shoes': {
        main: `high-end product photography of ${productName}, exclusive, stylish, sophisticated`,
        views: [
            'front view showing shoe design',
            'side view showing heel height and shape',
            'angled view showcasing material elegance',
            'contextual view with a designer outfit'
        ]
    },
    'Luxury Watches': {
        main: `high-end product photography of ${productName}, timeless, precise, exquisite`,
        views: [
            'front view showing dial and hands',
            'side view showing case and band',
            'angled view showcasing craftsmanship',
            'close-up of gears and face details'
        ]
    },
    'Luxury Jewelry': {
        main: `high-end product photography of ${productName}, sparkling, elegant, precious`,
        views: [
            'front view showing jewelry detail',
            'side view showing clasp and setting',
            'angled view showcasing gemstone brilliance',
            'contextual view on a model'
        ]
    },
    'Designer Clothing': {
        main: `artistic product photography of ${productName}, innovative, stylish, iconic`,
        views: [
            'front view showing garment design',
            'side view showing cut and silhouette',
            'angled view showcasing fabric texture',
            'contextual view in a fashion shoot'
        ]
    },
    'Designer Accessories': {
        main: `artistic product photography of ${productName}, innovative, stylish, unique`,
        views: [
            'front view showing accessory design',
            'side view showing shape and function',
            'angled view showcasing material texture',
            'contextual view with a designer outfit'
        ]
    },
    'Designer Shoes': {
        main: `artistic product photography of ${productName}, avant-garde, stylish, luxurious`,
        views: [
            'front view showing shoe design',
            'side view showing construction and shape',
            'angled view showcasing unique details',
            'contextual view with a fashion ensemble'
        ]
    },
    'Designer Bags': {
        main: `artistic product photography of ${productName}, innovative, functional, chic`,
        views: [
            'front view showing bag features',
            'side view showing shape and dimensions',
            'angled view showcasing material and hardware',
            'contextual view in an urban setting'
        ]
    },
    'Designer Jewelry': {
        main: `artistic product photography of ${productName}, contemporary, elegant, precious`,
        views: [
            'front view showing jewelry design',
            'side view showing clasp and setting',
            'angled view showcasing craftsmanship',
            'contextual view on a model'
        ]
    },
    'Luxury Home Decor': {
        main: `refined product photography of ${productName}, luxurious, stylish, elegant`,
        views: [
            'front view showing decor detail',
            'angled view showcasing material quality',
            'contextual view in a luxury home',
            'detail shot highlighting craftsmanship'
        ]
    },
    'Luxury Beauty Products': {
        main: `elegant product photography of ${productName}, radiant, youthful, indulgent`,
        views: [
            'front view showing product packaging',
            'angled view showcasing textures and colors',
            'close-up of ingredients and benefits',
            'contextual view in a beauty setting'
        ]
    },
    'Luxury Personal Care': {
        main: `refined product photography of ${productName}, comforting, indulgent, quality`,
        views: [
            'front view showing product features',
            'angled view showcasing textures and aromas',
            'close-up of ingredients and benefits',
            'contextual view in a spa setting'
        ]
    },
    'Luxury Food Products': {
        main: `refined product photography of ${productName}, gourmet, exclusive, delightful`,
        views: [
            'front view showing product presentation',
            'angled view showcasing ingredients',
            'close-up of textures and aromas',
            'contextual view in a fine dining setting'
        ]
    },
    'Luxury Drinks': {
        main: `refined product photography of ${productName}, premium, refreshing, sophisticated`,
        views: [
            'front view showing bottle or glass',
            'angled view showcasing liquid texture',
            'close-up of bubbles and presentation',
            'contextual view in a social setting'
        ]
    },
    'Luxury Snacks': {
        main: `refined product photography of ${productName}, delectable, indulgent, exquisite`,
        views: [
            'front view showing snack presentation',
            'angled view showcasing textures and flavors',
            'close-up of ingredients and toppings',
            'contextual view in an elegant setting'
        ]
    },
    'Luxury Kitchen Appliances': {
        main: `high-end product photography of ${productName}, efficient, stylish, state-of-the-art`,
        views: [
            'front view showing device panel',
            'side view showing size and integration',
            'angled view showcasing design',
            'contextual view in a luxury kitchen'
        ]
    },
    'Luxury Home Appliances': {
        main: `high-end product photography of ${productName}, efficient, powerful, whisper-quiet`,
        views: [
            'front view showing appliance features',
            'side view showing size and efficiency',
            'angled view showcasing materials',
            'contextual view in a luxury home'
        ]
    },
    'Luxury Electronics': {
        main: `high-end product photography of ${productName}, cutting-edge, immersive, sleek`,
        views: [
            'front view showing device screen',
            'side view showing design and ports',
            'angled view showcasing craftsmanship',
            'contextual view in an entertainment setting'
        ]
    },
    'Luxury Wearables': {
        main: `high-end product photography of ${productName}, sophisticated, connected, stylish`,
        views: [
            'front view showing watch face',
            'side view showing band and sensors',
            'angled view showcasing materials',
            'contextual view on a wrist'
        ]
    },
    'Luxury Smart Home Devices': {
        main: `high-end product photography of ${productName}, automated, connected, secure`,
        views: [
            'front view showing device interface',
            'side view showing size and elegance',
            'angled view showcasing design',
            'contextual view in a smart home setting'
        ]
    },
    default: {
        main: `professional product photography of ${productName}, clean background, commercial product shot, studio lighting, 8k quality`,
        views: [
            'front view product showcase',
            'side view showing depth',
            '45-degree angle view',
            'detail shot of main features'
        ]
    }
};

    const categoryPrompt = basePrompts[category as keyof typeof basePrompts] || basePrompts.default;
    return categoryPrompt;
};

export default function ProductPage() {
    const params = useParams() as { id: string };
    const [product, setProduct] = useState<Product | null>(null);
    const [store, setStore] = useState<Store | null>(null);
    const [loading, setLoading] = useState(true);
    const [isInCart, setIsInCart] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showCartNotification, setShowCartNotification] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsData, suppliersData, storesData] = await Promise.all([
                    getProducts(),
                    getProductSuppliers(),
                    getStores()
                ]);

                const foundProduct = productsData.find((p: Product) => p.productID === Number(params.id));

                if (foundProduct) {
                    const productSupplier = suppliersData.find(
                        (ps: ProductSupplier) => ps.productID === foundProduct.productID
                    );

                    if (productSupplier) {
                        const foundStore = storesData.find(
                            (s: Store) => s.storeID === productSupplier.supplierID
                        );
                        setStore(foundStore || null);
                    }

                    if (!foundProduct.image) {
                        try {
                            // Kategori kontrolü ve log
                            console.log('Product category:', foundProduct.categoryName);
                            console.log('Available categories:', Object.keys(basePrompts));

                            const categoryPrompt = basePrompts[foundProduct.categoryName] || basePrompts.default;
                            console.log('Selected prompt template:', categoryPrompt ? 'Category specific' : 'Default');

                            // Ana ürün fotoğrafı için cache kontrolü
                            console.log('Generating main image with prompt:', categoryPrompt.main);

                            // POST isteği ile resim oluşturma/cache kontrolü
                            const mainImageResponse = await fetch('/api/ImageCache', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                pageID: 'products',
                                prompt: categoryPrompt.main
                              })
                            });

                            const mainImageData = await mainImageResponse.json();
                            console.log('Image generation response:', {
                              cached: mainImageData.cached,
                              success: mainImageData.success,
                              hasImage: !!mainImageData.image
                            });

                            if (mainImageData.success && mainImageData.image) {
                              foundProduct.image = `data:image/jpeg;base64,${mainImageData.image}`;
                            }

                            // Diğer görünümler için
                            const additionalImages = await Promise.all(
                              categoryPrompt.views.map(async (viewPrompt, index) => {
                                console.log(`Generating view ${index + 1} with prompt:`, viewPrompt);
                                
                                const response = await fetch('/api/ImageCache', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    pageID: 'products',
                                    prompt: `${categoryPrompt.main}, ${viewPrompt}`
                                  })
                                });

                                const data = await response.json();
                                return data.success && data.image ? 
                                  `data:image/jpeg;base64,${data.image}` : null;
                              })
                            );

                            foundProduct.additionalImages = additionalImages.filter(img => img !== null);

                        } catch (error) {
                            console.error('Image generation error:', error);
                            foundProduct.image = '/placeholder.png';
                        }
                    }

                    setProduct({
                        ...foundProduct,
                        reviews: generateReviews(foundProduct.categoryName)
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
    }, [params.id]);

    const handleAddToCart = () => {
        setIsInCart(true);
        setShowCartNotification(true);
        setTimeout(() => setShowCartNotification(false), 3000);
    };

    const handleToggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    if (loading || !product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {showCartNotification && <CartSuccessMessage onClose={() => setShowCartNotification(false)} />}

            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="aspect-square bg-white rounded-xl shadow-lg overflow-hidden">
                            <Image
                                src={product.image || '/placeholder.png'}
                                alt={product.productName}
                                layout="fill"
                                objectFit="contain"
                                className="p-4"
                            />
                        </div>
                        
                        {product.additionalImages && product.additionalImages.length > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                                {product.additionalImages.map((img, i) => (
                                    <div key={i} className="aspect-square bg-white rounded-xl shadow-lg overflow-hidden">
                                        <Image
                                            src={img}
                                            alt={`${product.productName} view ${i + 1}`}
                                            layout="fill"
                                            objectFit="contain"
                                            className="p-4"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h1 className="text-3xl font-bold mb-4">{product.productName}</h1>

                        <div className="flex items-center justify-between mb-6">
                            <div className="text-3xl font-bold text-blue-600">
                                {product.price} TL
                            </div>
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className="text-2xl text-yellow-400"
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-6">
                            Stock: <span className="font-semibold">{product.quantity}</span> units
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                                <Cart width={24} height={24} />
                                <span>Add to Cart</span>
                            </button>

                            <button
                                onClick={handleToggleFavorite}
                                className={`w-14 flex items-center justify-center rounded-lg transition-colors ${
                                    isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
                                    }`}
                            >
                                <FavoriteIcon width={24} height={24} />
                            </button>
                        </div>
                    </div>
                </div>

                <ProductDescription product={product} store={store} />
            </div>
        </div>
    );
}