import { Review } from "../types/Product";

// Basit bir olumlu/olumsuz kelime listesi (daha kapsamlı bir liste kullanılabilir)
const positiveKeywords = ['great', 'excellent', 'perfect', 'amazing', 'love', 'best', 'recommend', 'helpful', 'easy', 'durable', 'stylish', 'vibrant', 'clear', 'comfortable', 'delicious', 'refreshing', 'safe', 'effective', 'quiet', 'powerful', 'versatile'];
const negativeKeywords = ['bad', 'terrible', 'awful', 'poor', 'disappointing', 'frustrating', 'expensive', 'difficult', 'uncomfortable', 'broken', 'useless', 'inaccurate', 'noisy', 'slow', 'stale', 'rough', 'overpowering', 'inconsistent'];

// İnceleme metninin olumlu mu, olumsuz mu olduğunu belirleyen fonksiyon
const getSentimentScore = (comment: string): number => {
  const commentLower = comment.toLowerCase();
  let positiveScore = 0;
  let negativeScore = 0;

  positiveKeywords.forEach(word => {
    if (commentLower.includes(word)) {
      positiveScore++;
    }
  });

  negativeKeywords.forEach(word => {
    if (commentLower.includes(word)) {
      negativeScore++;
    }
  });

  return positiveScore - negativeScore;
};

export const categoryReviews: Record<string, string[]> = {
    'Computer/Tablet': [
        "Fast performance and great display. Perfect for work.",
        "Lightweight and easy to carry, great for travel.",
        "Handles all my gaming needs flawlessly. Impressive.",
        "Excellent battery life, lasts all day.",
        "User-friendly interface, easy to navigate.",
        "Crashes frequently and loses my work. Very frustrating.", // Negative
        "The screen is so clear, movies look incredible!", // Positive
        "Keyboard is comfortable for long typing sessions.", // Positive
    ],
    'Printers & Projectors': [
        "Prints high-quality documents and photos quickly.",
        "Easy to set up and use, even for non-tech users.",
        "Reliable performance, no paper jams or errors.",
        "Great value for the price, very cost-effective.",
        "Compact design, fits easily in small spaces.",
        "Ink cartridges are too expensive and don't last long.", // Negative
        "Colors are vibrant and true to life!", // Positive
        "Projector is bright even in daylight.", // Positive
    ],
    'Telephone': [
        "Clear sound quality, excellent for calls.",
        "Durable build, withstands daily wear and tear.",
        "Easy to use interface, simple navigation.",
        "Long battery life, lasts throughout the day.",
        "Stylish design, looks great on any desk.",
        "Speakerphone is too quiet to be useful.", // Negative
        "Voice assistant is incredibly helpful.", // Positive
        "Easy to connect to my Bluetooth headset.", // Positive
    ],
    'TV, Visual and Audio Systems': [
        "Immersive picture quality, vibrant colors.",
        "Excellent sound system, enhances the viewing experience.",
        "Easy to connect to other devices, versatile.",
        "Sleek design, complements any living room.",
        "User-friendly interface, simple to navigate.",
        "Remote control is unresponsive at times.", // Negative
        "The smart features are super convenient!", // Positive
        "Surround sound is like being at the movies.", // Positive
    ],
    'White Goods': [
        "Energy-efficient, saves on electricity bills.",
        "Spacious interior, fits all my groceries.",
        "Quiet operation, doesn't disturb the household.",
        "Durable build, lasts for years.",
        "Easy to clean, low maintenance.",
        "The ice maker keeps breaking down.", // Negative
        "Keeps food perfectly fresh for much longer!", // Positive
        "The adjustable shelves make organizing so easy.", // Positive
    ],
    'Air Conditioners and Heaters': [
        "Cools or heats the room quickly and efficiently.",
        "Quiet operation, doesn't disturb sleep.",
        "Easy to set up and use, simple controls.",
        "Energy-efficient, saves on energy bills.",
        "Stylish design, blends well with decor.",
        "The thermostat is inaccurate and fluctuates too much.", // Negative
        "Keeps my room perfectly cool during summer nights.", // Positive
        "The automatic timer is a really useful feature.", // Positive
    ],
    'Electrical Appliances': [
        "Powerful performance, gets the job done quickly.",
        "Easy to use, simple controls and settings.",
        "Durable build, withstands daily use.",
        "Versatile, can be used for multiple purposes.",
        "Compact design, easy to store.",
        "The cord is too short and limits my reach.", // Negative
        "Makes cooking so much easier and faster!", // Positive
        "The safety features are a great peace of mind.", // Positive
    ],
    'Photo and Camera': [
        "Captures stunning photos and videos.",
        "Easy to use, even for beginners.",
        "Durable build, can withstand outdoor use.",
        "Versatile, can be used for various types of photography.",
        "Long battery life, allows for extended use.",
        "Image stabilization is not very effective in low light.", // Negative
        "The zoom lens is incredibly powerful!", // Positive
        "The built-in filters add a creative touch.", // Positive
    ],
    'Cleaning Products': [
        "Effectively cleans surfaces, removes dirt and grime.",
        "Leaves a fresh scent, makes the house smell clean.",
        "Easy to use, simple spray and wipe.",
        "Safe for use on various surfaces.",
        "Affordable price, great value for money.",
        "The smell is too overpowering and gives me a headache.", // Negative
        "Leaves my kitchen sparkling clean!", // Positive
        "Works great on tough stains.", // Positive
    ],
    'Diaper and Wet Wipes': [
        "Gentle on baby's skin, prevents irritation.",
        "Absorbent and leak-proof, keeps baby dry.",
        "Easy to use, convenient for diaper changes.",
        "Safe for use on sensitive skin.",
        "Affordable price, economical for daily use.",
        "The wipes are too thin and tear easily.", // Negative
        "They are so soft and gentle on my baby's skin!", // Positive
        "The resealable packaging keeps them fresh.", // Positive
    ],
    'Paper Products': [
        "Soft and absorbent, gentle on skin.",
        "Durable, doesn't tear easily.",
        "Easy to use, convenient for various purposes.",
        "Affordable price, economical for household use.",
        "Environmentally friendly, made from recycled materials.",
        "Too rough for sensitive skin.", // Negative
        "Great for cleaning up spills!", // Positive
        "Perfect for arts and crafts projects.", // Positive
    ],
    'Drinks': [
        "Refreshing taste, quenches thirst.",
        "Variety of flavors, caters to different preferences.",
        "Convenient packaging, easy to carry.",
        "Affordable price, great value for money.",
        "Provides energy and hydration.",
        "Too much sugar, not a healthy option.", // Negative
        "Perfect for a hot summer day!", // Positive
        "The new flavor is absolutely delicious.", // Positive
    ],
    'Food Products': [
        "Delicious taste, satisfies cravings.",
        "Nutritious and healthy, provides essential nutrients.",
        "Easy to prepare, convenient for quick meals.",
        "Versatile, can be used in various recipes.",
        "Affordable price, economical for daily consumption.",
        "Too much sodium, not suitable for low-sodium diets.", // Negative
        "Makes a quick and easy weeknight dinner!", // Positive
        "Perfect for meal prepping.", // Positive
    ],
    'Petshop': [
        "Wide variety of products for all types of pets.",
        "High-quality products, safe for pets.",
        "Knowledgeable staff, provides helpful advice.",
        "Clean and organized store, easy to shop.",
        "Competitive prices, great deals on pet supplies.",
        "The grooming services are overpriced.", // Negative
        "My dog loves the new treats I got here!", // Positive
        "The staff helped me find the perfect bed for my cat.", // Positive
    ],
    'Household Consumables': [
        "Essential for daily household tasks.",
        "Convenient and easy to use.",
        "Durable and long-lasting.",
        "Affordable and economical.",
        "Wide variety of products to choose from.",
        "The dish soap doesn't lather well.", // Negative
        "My floors have never been so clean!", // Positive
        "The air freshener smells amazing.", // Positive
    ],
    'Womens Clothing': [
        "Stylish and trendy, keeps you up-to-date with fashion.",
        "Comfortable and well-fitting, feels great to wear.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be dressed up or down.",
        "Affordable prices, great value for money.",
        "The sizing is inconsistent and runs small.", // Negative
        "I always get compliments when I wear this dress!", // Positive
        "So comfortable I could sleep in it!", // Positive
    ],
    'Womens Accessories and Jewelry': [
        "Adds a touch of elegance to any outfit.",
        "Stylish and trendy designs.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be worn for various occasions.",
        "Affordable prices, enhances your look without breaking the bank.",
        "The clasp broke after only a few wears.", // Negative
        "Adds the perfect touch of sparkle to any outfit!", // Positive
        "I get so many compliments when I wear this necklace!", // Positive
    ],
    'Mens Clothing': [
        "Stylish and modern, keeps you looking sharp.",
        "Comfortable and well-fitting, feels great to wear.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be worn for various occasions.",
        "Affordable prices, enhances your style without overspending.",
        "The material shrinks after washing.", // Negative
        "Fits perfectly and looks great!", // Positive
        "So comfortable for everyday wear.", // Positive
    ],
    'Mens Accessories and Jewelry': [
        "Adds a touch of sophistication to any outfit.",
        "Stylish and classic designs.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be worn for various occasions.",
        "Affordable prices, complements your look without costing too much.",
        "The color faded quickly.", // Negative
        "Adds the perfect amount of style to any outfit!", // Positive
        "I wear this bracelet every day and it still looks brand new.", // Positive
    ],
    'Womens Shoes and Bags': [
        "Stylish and trendy, complements any outfit.",
        "Comfortable and well-fitting, feels great to wear.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be worn for various occasions.",
        "Affordable prices, completes your look without breaking the bank.",
        "The soles wore out too quickly.", // Negative
        "So comfortable I can walk in them all day!", // Positive
        "The perfect bag for travel!", // Positive
    ],
    'Mens Shoes and Bags': [
        "Stylish and functional, complements any outfit.",
        "Comfortable and well-fitting shoes, practical bags.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be used for various occasions.",
        "Affordable prices, complements your style without overspending.",
        "The laces broke after only a few uses.", // Negative
        "Provides all day comfort while on my feet!", // Positive
        "It’s lightweight and holds a lot of items, perfect for travel!", // Positive
    ],
    'Kids': [
        "Cute and comfortable, perfect for kids.",
        "Durable and easy to clean.",
        "Safe materials, parents don't need to worry",
        "Variety of styles and colors, caters to different tastes.",
        "Affordable prices, economical for growing kids.",
        "The seams came apart after only a few washes.", // Negative
        "My daughter loves the sparkly unicorn design!", // Positive
        "Easy for my toddler to put on themselves.", // Positive
    ],
    'Smart Home Devices': [
        "Easy to set up and use, smart technology for everyone.",
        "Convenient and time-saving, simplifies daily tasks.",
        "Secure and reliable, protects your home.",
        "Energy-efficient, saves on energy bills.",
        "Stylish design, blends well with modern homes.",
        "Frequently loses connection to the internet.", // Negative
        "Turns my apartment into the Smart Home of the Future!!", // Positive
        "The voice control feature makes turning off lights so easy.", // Positive
    ],
    'Gaming Equipment': [
        "Immersive gaming experience, high-performance gear.",
        "Comfortable and ergonomic design.",
        "Durable and long-lasting materials.",
        "Versatile, compatible with various gaming platforms.",
        "Enhances your gameplay, gives you a competitive edge.",
        "The headset gets uncomfortable after long gaming sessions.", // Negative
        "Takes my gaming experience to the next level!", // Positive
        "Buttons are very responsive and easy to press.", // Positive
    ],
    'Musical Instruments': [
        "Clear sound quality, allows for expressive playing.",
        "Durable build, withstands frequent use.",
        "Easy to learn, perfect for beginners.",
        "Versatile, can be used for various genres of music.",
        "Inspires creativity, encourages musical expression.",
        "The tuning pegs slip easily.", // Negative
        "Easy to learn and get the hang of!", // Positive
        "The tone is rich and full.", // Positive
    ],
    'Office Supplies': [
        "Essential for daily office tasks.",
        "Convenient and easy to use.",
        "Durable and long-lasting.",
        "Affordable and economical.",
        "Helps you stay organized and productive.",
        "The pens run out of ink too quickly.", // Negative
        "Has helped streamline all work processes!", // Positive
        "Helps me organize my desk and stay focused.", // Positive
    ],
    'Sports Equipment': [
        "Enhances your performance, improves your fitness.",
        "Durable and reliable, withstands rigorous use.",
        "Comfortable and easy to use.",
        "Versatile, can be used for various sports and activities.",
        "Helps you stay active and healthy.",
        "The seams started to unravel after only a few uses.", // Negative
        "Provides superior support and cushioning!", // Positive
        "Easy to adjust for a comfortable fit.", // Positive
    ],
    'Beauty and Personal Care': [
        "Enhances your natural beauty, boosts your confidence.",
        "Gentle and effective, suitable for sensitive skin.",
        "High-quality ingredients, safe and nourishing.",
        "Versatile, can be used for various skin types and concerns.",
        "Helps you feel good about yourself.",
        "Caused an allergic reaction.", // Negative
        "Has helped clear up my acne and makes my skin glow.", // Positive
        "Smells amazing and leaves my skin feeling soft.", // Positive
    ],
    'Home Decor': [
        "Adds a touch of style and personality to your home.",
        "Stylish and trendy designs.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be used in various rooms and styles.",
        "Enhances the ambiance of your living space.",
        "The colors faded quickly.", // Negative
        "Instantly upgrades any room!", // Positive
        "Has helped give our house a more “homey” feel!", // Positive
    ],
    'Garden Tools': [
        "Essential for maintaining your garden.",
        "Durable and reliable, withstands outdoor use.",
        "Easy to use, simplifies gardening tasks.",
        "Versatile, can be used for various gardening activities.",
        "Helps you create a beautiful and thriving garden.",
        "The handle broke after only a few uses.", // Negative
        "The blades are super sharp and make pruning a breeze!", // Positive
        "Lightweight and easy to maneuver.", // Positive
    ],
    'Automotive Accessories': [
        "Enhances your driving experience, adds convenience.",
        "Stylish and functional designs.",
        "Durable and reliable, withstands daily use.",
        "Versatile, can be used in various types of vehicles.",
        "Improves the functionality and appearance of your car.",
        "The adhesive failed and it fell off the dashboard.", // Negative
        "Super helpful with directions while on the road!", // Positive
        "It was very easy to install!", // Positive
    ],
    'Books and Stationery': [
        "Provides knowledge and inspiration.",
        "Helps you stay organized and creative.",
        "Durable and long-lasting.",
        "Affordable and accessible.",
        "Enriches your mind and stimulates your imagination.",
        "The pages are too thin and the ink bleeds through.", // Negative
        "Incredibly helpful and easy to follow along!", // Positive
        "The book is very engaging and well-written.", // Positive
    ],
    'Bakery Products': [
        "Delicious and fresh, perfect for a treat.",
        "Wide variety of flavors and options.",
        "High-quality ingredients, tastes great.",
        "Conveniently packaged, easy to enjoy.",
        "Brightens your day with every bite.",
        "The cake was dry and stale.", // Negative
        "The frosting is the perfect sweetness!", // Positive
        "Melts in your mouth", // Positive
    ],
    'Frozen Foods': [
        "Convenient and easy to prepare, saves time.",
        "Versatile, can be used in various recipes.",
        "Maintains freshness, lasts longer than fresh foods.",
        "Affordable prices, economical for busy individuals.",
        "Provides a quick and easy meal solution.",
        "The texture was mushy after cooking.", // Negative
        "Made preparing our meals 10x faster!", // Positive
        "Quick, easy, and saves money! Perfect solution for busy parents!", // Positive
    ],
    'Dairy Products': [
        "Nutritious and healthy, provides essential nutrients.",
        "Versatile, can be used in various meals and snacks.",
        "High-quality ingredients, tastes great.",
        "Conveniently packaged, easy to store.",
        "Supports bone health and overall well-being.",
        "The milk spoiled before the expiration date.", // Negative
        "Is helping me with my fitness journey!", // Positive
        "Perfect to pair with coffee and breakfast!", // Positive
    ],
    'Organic Foods': [
        "Healthy and natural, free from harmful chemicals.",
        "Nutritious and delicious, great for a balanced diet.",
        "Environmentally friendly, supports sustainable farming.",
        "Versatile, can be used in various recipes.",
        "Promotes a healthier lifestyle.",
        "The produce was wilted and bruised.", // Negative
        "The flavor of the vegetables is amazing!", // Positive
        "It’s good to know that it is ethically sourced!", // Positive
    ],
    'Pet Accessories': [
        "Fun and functional, enhances your pet's life.",
        "Durable and safe, designed for pet use.",
        "Variety of styles and designs.",
        "Convenient and easy to use.",
        "Helps you take care of your pet's needs.",
        "My cat was able to destroy it within a week.", // Negative
        "Super helpful for cleaning and grooming my pet!", // Positive
        "This is great for car travel! Allows me to keep an eye on them while driving!", // Positive
    ],
    'Fresh Produce': [
        "Nutritious and delicious, provides essential vitamins.",
        "Fresh and vibrant, tastes great.",
        "Versatile, can be used in various recipes.",
        "Supports a healthy diet.",
        "Available in a wide variety of options.",
        "It was wilted and bruised.", // Negative
        "The flavor of the vegetables is amazing!", // Positive
        "I love the vibrant colors", // Positive
    ],
    'Beverages': [
        "Refreshing and thirst-quenching.",
        "Variety of flavors and options.",
        "Conveniently packaged, easy to carry.",
        "Affordable and accessible.",
        "Provides energy and hydration.",
        "Was way too sugary, felt unhealthy", // Negative
        "Perfect for a hot summer day!", // Positive
        "The new flavor is absolutely delicious", // Positive
    ],
    'Snacks and Confectionery': [
        "Delicious and satisfying, perfect for a treat.",
        "Variety of flavors and textures.",
        "Conveniently packaged, easy to enjoy.",
        "Affordable and accessible.",
        "Brightens your day with every bite.",
        "Too much sugar, not good for my diet.", // Negative
        "Melts in my mouth!", // Positive
        "The texture is perfect!", // Positive
    ],
    'Mobile Accessories': [
        "Enhances your mobile experience, adds convenience.",
        "Stylish and functional designs.",
        "Durable and reliable, protects your phone.",
        "Versatile, can be used with various phone models.",
        "Improves the functionality and appearance of your phone.",
        "Broke after only a few weeks.", // Negative
        "Gives my phone super fast charging!", // Positive
        "Is the perfect size!", // Positive
    ],
    'Computer Components': [
        "High-performance and reliable.",
        "Easy to install and use.",
        "Durable and long-lasting.",
        "Enhances your computer's capabilities.",
        "Provides a smooth and efficient computing experience.",
        "Too small and didn’t function as advertised", // Negative
        "Increased my pc’s performance substantially!", // Positive
        "Was very easy to connect to existing hardware!", // Positive
    ],
    'Networking Equipment': [
        "Reliable and secure network connection.",
        "Easy to set up and use.",
        "Durable and long-lasting.",
        "Versatile, can be used for various network setups.",
        "Provides a fast and stable internet connection.",
        "Didn’t improve my wifi connection at all", // Negative
        "Allowed me to finally play video games online lag free!!", // Positive
        "The router was super easy to set up, and the whole house can use it!", // Positive
    ],
    'Storage Devices': [
        "Large capacity and fast transfer speeds.",
        "Easy to use and portable.",
        "Durable and reliable.",
        "Versatile, can be used for various storage needs.",
        "Protects your data and provides convenient storage.",
        "Failed after only a few months.", // Negative
        "Allows me to store all my favorite content!", // Positive
        "The usb drive fit perfectly on my key chain!", // Positive
    ],
    'Wearable Technology': [
        "Tracks your fitness and health metrics.",
        "Stylish and comfortable design.",
        "Easy to use and connected.",
        "Versatile, can be used for various activities.",
        "Helps you stay active and healthy.",
        "Was not accurate at all, could not correctly measure heart rate", // Negative
        "Tracked all my fitness and health metrics with ease!", // Positive
        "This smart watch helps me stay on top of my goals every single day!", // Positive
    ],
    'Audio Equipment': [
        "High-quality sound and immersive experience.",
        "Comfortable and stylish design.",
        "Easy to use and connected.",
        "Versatile, can be used for various audio sources.",
        "Enhances your listening experience.",
        "The headphones broke only after a few weeks.", // Negative
        "The sound quality is absolutely perfect!", // Positive
        "Makes working long hours more bearable!", // Positive
    ],
    'Kids Fashion': [
        "Cute and comfortable, perfect for kids.",
        "Durable and easy to clean.",
        "Safe materials, parents don't need to worry",
        "Variety of styles and colors, caters to different tastes.",
        "Affordable prices, economical for growing kids.",
        "The seams came apart after only a few washes.", // Negative
        "Looks great on my child!", // Positive
        "Easy to wear and looks amazing!", // Positive
    ],
    'Maternity Wear': [
        "Comfortable and supportive, perfect for pregnancy.",
        "Stylish and trendy designs.",
        "Safe materials, gentle on sensitive skin.",
        "Versatile, can be worn during and after pregnancy.",
        "Helps you feel good about yourself during this special time.",
        "Was too constricting and felt extremely uncomfortable.", // Negative
        "It’s easy to wear with a stylish design!", // Positive
        "It was very versatile!", // Positive
    ],
    'Sportswear': [
        "Comfortable and breathable, enhances your performance.",
        "Durable and reliable, withstands rigorous use.",
        "Stylish and functional designs.",
        "Versatile, can be used for various sports and activities.",
        "Helps you stay active and healthy.",
        "The seams started to unravel after only a few uses.", // Negative
        "Is very effective while hiking!", // Positive
        "Provides me with comfort and confidence while at the gym!", // Positive
    ],
    'Underwear and Lingerie': [
        "Comfortable and stylish, feels great to wear.",
        "Delicate and elegant designs.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be worn for various occasions.",
        "Boosts your confidence and enhances your comfort.",
        "Is very uncomfortable and itchy.", // Negative
        "Very easy to wear!", // Positive
        "Is so soft and great to sleep in!", // Positive
    ],
    'Seasonal Fashion': [
        "Trendy and stylish, keeps you up-to-date with fashion.",
        "Comfortable and well-fitting, feels great to wear.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be dressed up or down.",
        "Affordable prices, great value for money.",
        "The color faded quickly.", // Negative
        "Helps me keep up with the latest trends!", // Positive
        "So easy to dress up or dress down!", // Positive
    ],
    'Luxury Fashion': [
        "Exclusive and high-end, makes a statement.",
        "Sophisticated and elegant designs.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be worn for special occasions.",
        "Elevates your style and enhances your presence.",
        "Seams fell apart after only a few wears", // Negative
        "Fits perfectly and looks amazing", // Positive
        "It’s timeless and never gets old!", // Positive
    ],
    'Professional Workwear': [
        "Comfortable and professional, enhances your career.",
        "Durable and easy to clean.",
        "Stylish and functional designs.",
        "Versatile, can be worn in various workplaces.",
        "Helps you make a good impression and stay productive.",
        "Is very constricting and uncomfortable while working", // Negative
        "Looks sharp while in the office!", // Positive
        "Easy to clean and I can get right back to work", // Positive
    ],
    'Traditional Wear': [
        "Cultural and unique, showcases your heritage.",
        "Comfortable and stylish designs.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be worn for cultural events.",
        "Connects you with your roots and celebrates your identity.",
        "It was too itchy", // Negative
        "It’s incredibly easy to style!", // Positive
        "Great and high quality fabric", // Positive
    ],
    'Fashion Accessories': [
        "Enhances your outfit, adds a touch of style.",
        "Trendy and fashionable designs.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be used for various occasions.",
        "Completes your look and expresses your personality.",
        "Color faded super quickly.", // Negative
        "Adds the perfect touch to any outfit!", // Positive
        "So happy with the way it looks!", // Positive
    ],
    'Outdoor Clothing': [
        "Comfortable and protective, enhances your outdoor experience.",
        "Durable and weather-resistant.",
        "Stylish and functional designs.",
        "Versatile, can be used for various outdoor activities.",
        "Helps you stay active and explore nature.",
        "Did not hold up against weather, and quickly got wet.", // Negative
        "Offers amazing protection against harsh sunlight and other weather elements!", // Positive
        "Is perfect for hiking, backpacking, running, you name it!", // Positive
    ],
    'Kitchen Appliances': [
        "Efficient and reliable, simplifies cooking tasks.",
        "Easy to use and clean.",
        "Durable and long-lasting.",
        "Versatile, can be used for various recipes.",
        "Helps you cook delicious meals with ease.",
        "Burnt all my meals and was not efficient at all.", // Negative
        "Incredibly easy to use!", // Positive
        "I can easily store this after every use!", // Positive
    ],
    'Personal Care Appliances': [
        "Effective and gentle, enhances your grooming routine.",
        "Easy to use and clean.",
        "Durable and reliable.",
        "Versatile, can be used for various personal care needs.",
        "Helps you look and feel your best.",
        "I was burnt multiple times", // Negative
        "The perfect way to enhance my self care and grooming!", // Positive
        "Super easy to clean!", // Positive
    ],
    'Home Cleaning Appliances': [
        "Efficient and powerful, simplifies cleaning tasks.",
        "Easy to use and maintain.",
        "Durable and long-lasting.",
        "Versatile, can be used for various surfaces.",
        "Helps you keep your home clean and healthy.",
        "Had no suction, and barely cleaned.", // Negative
        "It now takes me half the time to clean!", // Positive
        "The multiple settings are perfect!", // Positive
    ],  
    'Home Security Devices': [
        "Reliable and secure, protects your home.",
        "Easy to set up and use.",
        "Durable and long-lasting.",
        "Versatile, can be used in various home settings.",
        "Provides peace of mind and enhances your safety.",
        "System was hacked and made me feel unsafe.", // Negative
        "So easy to setup and use!”, “Helped me protect my family while at work!", // Positive
        "Now I don’t need to worry when going on vacation!", // Positive
    ],
    'Smart Wearables': [
        "Tracks your fitness and health metrics.",
        "Stylish and comfortable design.",
        "Easy to use and connected.",
        "Versatile, can be used for various activities.",
        "Helps you stay active and healthy.",
        "Stopped working after only a few weeks.", // Negative
        "Tracks my progress so I can achieve new goals!", // Positive
        "Has a cool stylish design!", // Positive
    ],
    'Pet Food': [
        "Nutritious and delicious, provides essential nutrients.",
        "High-quality ingredients, safe for pets.",
        "Variety of flavors and options.",
        "Conveniently packaged, easy to store.",
        "Supports your pet's health and well-being.",
        "My pet did not eat it at all", // Negative
        "This is the only brand that has not upset my pet’s stomach!", // Positive
        "We noticed and immediate increase in energy!", // Positive
    ],
    'Pet Care Products': [
        "Effective and safe, enhances your pet's hygiene.",
        "Easy to use and maintain.",
        "Durable and reliable.",
        "Versatile, can be used for various pet care needs.",
        "Helps you keep your pet happy and healthy.",
        "Smelled horrible", // Negative
        "This brush helps maintain my pets shedding", // Positive
        "My dog loved the smell and had no problems!", // Positive
    ],
    'Organic Beverages': [
        "Refreshing and healthy, made with organic ingredients.",
        "Variety of flavors and options.",
        "Conveniently packaged, easy to carry.",
        "Supports a healthy lifestyle.",
        "Provides energy and hydration.",
        "Was way too sugary, not the best for my diet", // Negative
        "Perfect for a hot summers day! Very refreshing!", // Positive
        "Helps me keep up with my goals!", // Positive
    ],
    'Organic Snacks': [
        "Delicious and guilt-free, made with organic ingredients.",
        "Variety of flavors and textures.",
        "Conveniently packaged, easy to enjoy.",
        "Supports a healthy diet.",
        "Provides a tasty and nutritious snack.",
        "The taste was horrible", // Negative
        "It helped curb my appetite", // Positive
        "This allowed me to stay on track with my goals!", // Positive
    ],
    'Luxury Bags': [
        "Exclusive and high-end, makes a statement.",
        "Sophisticated and elegant designs.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be used for special occasions.",
        "Elevates your style and enhances your presence.",
        "The seams came apart after only a few wears.", // Negative
        "It looks great and the quality is superb!", // Positive
        "Made me feel like a star!", // Positive
    ],
    'Luxury Shoes': [
        "Exclusive and high-end, makes a statement.",
        "Stylish and sophisticated designs.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be worn for special occasions.",
        "Elevates your style and enhances your presence.",
        "The seams came apart after only a few wears.", // Negative
        "The look is very stylish!", // Positive
        "This boosted my confidence!", // Positive
    ],
    'Luxury Watches': [
        "Exclusive and high-end, showcases your status.",
        "Timeless and elegant designs.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be worn for special occasions.",
        "Enhances your style and adds sophistication.",
        "It was a fake. Didn’t not realize until a few weeks", // Negative
        "I wear it everyday! Makes me feel great!", // Positive
        "You can't go wrong with these materials", // Positive
    ],
    'Luxury Jewelry': [
        "Exclusive and high-end, makes a statement.",
        "Sparkling and elegant designs.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be worn for special occasions.",
        "Enhances your beauty and adds sophistication.",
        "Color faded within a few weeks.", // Negative
        "Incredible quality! Worth every dollar spent!", // Positive
        "Elevated my look with ease!", // Positive
    ],
    'Designer Clothing': [
        "Innovative and stylish, pushes the boundaries of fashion.",
        "Unique and eye-catching designs.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be worn for fashion events.",
        "Expresses your individuality and creativity.",
        "Seams came apart within 2 days of wear", // Negative
        "Loved the unique design and high quality stitching!", // Positive
        "This product pushes the boundaries in the fashion world", // Positive
    ],
    'Designer Accessories': [
        "Unique and stylish, adds a touch of personality.",
        "Innovative and eye-catching designs.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be used for various occasions.",
        "Expresses your individuality and enhances your style.",
        "Broke as soon as it was taken out of the package", // Negative
        "This adds a touch of class to my outfits!", // Positive
        "So many compliments on this accessory!", // Positive
    ],
    'Designer Shoes': [
        "Avant-garde and stylish, makes a bold statement.",
        "Unique and eye-catching designs.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be worn for fashion events.",
        "Expresses your individuality and creativity.",
        "These shoes are so uncomfortable!", // Negative
        "I love the attention I get with these designer shoe!", // Positive
        "These are great for red carpets!", // Positive
    ],
    'Designer Bags': [
    "Innovative and functional, combines style and practicality.",
    "Unique and eye-catching designs.",
    "High-quality materials, durable and long-lasting.",
    "Versatile, can be used for various occasions.",
    "Expresses your individuality and enhances your style.",
    "Is way too small. I can barely get anything in it!", // Negative
    "Great for travel and fashion", // Positive
    "This bag allows me to express my inner artistic side", // Positive
    ],
    'Designer Jewelry': [
        "Contemporary and elegant, adds a touch of sophistication.",
        "Unique and eye-catching designs.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be worn for various occasions.",
        "Expresses your individuality and enhances your beauty.",
        "The clasp broke after only a month of wearing it.", // Negative
        "This necklace makes any outfit look instantly more chic!", // Positive
        "I receive compliments on it every time I wear it; it's a showstopper!", // Positive
    ],
    'Luxury Home Decor': [
        "Elevates your home's ambiance, creates a luxurious atmosphere.",
        "Stylish and refined designs.",
        "High-quality materials, durable and long-lasting.",
        "Versatile, can be used in various rooms and styles.",
        "Enhances the beauty and comfort of your living space.",
        "The color faded significantly after a few weeks in sunlight.", // Negative
        "These luxurious curtains transformed my living room into a palace!", // Positive
        "The craftsmanship is impeccable; it's like a work of art for my home.", // Positive
    ],
    'Luxury Beauty Products': [
        "Indulgent and effective, enhances your natural beauty.",
        "Gentle and nourishing, suitable for sensitive skin.",
        "High-quality ingredients, safe and luxurious.",
        "Versatile, can be used for various skin types and concerns.",
        "Helps you feel pampered and confident.",
        "The fragrance was overpowering and caused a headache.", // Negative
        "My skin has never looked so radiant! This product is a miracle worker.", // Positive
        "The packaging is exquisite, and the formula is divine; worth every penny!", // Positive
    ],
    'Luxury Personal Care': [
        "Refined and comforting, enhances your self-care routine.",
        "Gentle and effective, suitable for sensitive skin.",
        "High-quality ingredients, safe and luxurious.",
        "Versatile, can be used for various personal care needs.",
        "Helps you relax and rejuvenate.",  
        "The scent was too strong and artificial.", // Negative
        "This bath oil transforms my ordinary bath into a spa experience!", // Positive
        "My skin feels incredibly soft and hydrated after using this; truly luxurious.", // Positive
    ],
    'Luxury Food Products': [
        "Gourmet and exclusive, delights your taste buds.",
        "High-quality ingredients, tastes exquisite.",
        "Versatile, can be used in various recipes.",
        "Creates a memorable dining experience.",
        "Elevates your culinary creations.",
        "The truffle oil tasted artificial and overpowering.", // Negative
        "This artisanal cheese is a symphony of flavors; truly exquisite!", // Positive
        "The quality is unparalleled; this chocolate is a decadent indulgence.", // Positive
    ],
    'Luxury Drinks': [
        "Premium and sophisticated, enhances any occasion.",
        "Refined flavors and exquisite taste.",
        "Versatile, can be enjoyed in various settings.",
        "Creates a memorable drinking experience.",
        "Elevates your social gatherings.",
        "The taste was bland and underwhelming for the price.", // Negative
        "This vintage champagne is the epitome of elegance and sophistication!", // Positive
        "The aroma is intoxicating, and the taste is heavenly; a perfect celebration drink.", // Positive
    ],
    'Luxury Snacks': [
        "Delectable and indulgent, satisfies your cravings.",
        "High-quality ingredients, tastes exquisite.",
        "Versatile, can be enjoyed at any time.",
        "Creates a memorable snacking experience.",
        "Elevates your everyday moments.",
        "The nuts were stale and lacked flavor.", // Negative
        "These handcrafted truffles are a decadent delight; pure bliss in every bite!", // Positive
        "The perfect treat to elevate any moment; worth every calorie!", // Positive
    ],
    'Luxury Kitchen Appliances': [
        "Efficient and stylish, simplifies cooking tasks.",
        "Easy to use and clean.",
        "Durable and long-lasting.",
        "Versatile, can be used for various recipes.",
        "Enhances your cooking experience and creates culinary masterpieces.",
        "The temperature controls were inaccurate, ruining several recipes.", // Negative
        "This high-end oven has revolutionized my cooking; a dream come true for any chef!", // Positive
        "The sleek design is a statement piece in my kitchen; cooking has never been so stylish!", // Positive
    ],
    'Luxury Home Appliances': [
        "Efficient and powerful, simplifies household tasks.",
        "Easy to use and maintain.",
        "Durable and long-lasting.",
        "Versatile, can be used for various home cleaning needs.",
        "Creates a comfortable and healthy living environment.",
        "The vacuum cleaner was too heavy and difficult to maneuver.", // Negative
        "This high-end washer and dryer make laundry a luxurious experience!", // Positive
        "The intuitive controls and powerful performance make household chores a breeze.", // Positive
    ],
    'Luxury Electronics': [
        "Immersive and innovative, enhances your entertainment experience.",
        "Cutting-edge technology and stylish design.",
        "Easy to use and connected.",
        "Versatile, can be used for various entertainment purposes.",
        "Elevates your leisure time and enhances your lifestyle.",
        "The screen flickered intermittently, causing eye strain.", // Negative
        "This high-definition TV is breathtaking; the visuals are simply stunning!", // Positive
        "The sound system is unparalleled; movie nights have become a cinematic experience.", // Positive
    ],
    'Luxury Wearables': [
        "Sophisticated and connected, enhances your active lifestyle.",
        "Stylish and comfortable design.",
        "Easy to use and personalized.",
        "Versatile, can be used for various activities.",
        "Helps you stay connected and achieve your fitness goals.",
        "The battery life was far shorter than advertised.", // Negative
        "This smartwatch seamlessly integrates into my life; the notifications are discreet and helpful.", // Positive
        "The design is so elegant; it's a stylish accessory as well as a fitness tracker.", // Positive
    ],
    'Luxury Smart Home Devices': [
        "Automated and connected, enhances your home's convenience.",
        "Seamless integration and stylish design.",
        "Easy to use and personalized.",
        "Versatile, can be used for various smart home needs.",
        "Creates a secure, efficient, and comfortable living environment.",
        "The smart hub was buggy and frequently disconnected from other devices.", // Negative
        "This smart lighting system has transformed my home; the ambiance is always perfect!", // Positive
        "The voice control is incredibly convenient; I can adjust the lighting and temperature with just a command.", // Positive
    ]
};

  
export const generateReviews = (category: string): Review[] => {
    const reviews = categoryReviews[category] || categoryReviews.default;
  
    return reviews.map(comment => {
      const sentimentScore = getSentimentScore(comment);
      let rating: number;
  
      if (sentimentScore > 2) {
        rating = 5; // Çok olumlu
      } else if (sentimentScore > 0) {
        rating = 4; // Olumlu
      } else if (sentimentScore < -2) {
        rating = 1; // Çok olumsuz
      } else if (sentimentScore < 0) {
        rating = 2; // Olumsuz
      } else {
        rating = 3; // Nötr
      }
  
      return {
        rating,
        comment,
        userName: `User${Math.floor(Math.random() * 1000)}`,
        date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
        avatar: `/avatars/user${Math.floor(Math.random() * 5) + 1}.png`
      };
    });
  };