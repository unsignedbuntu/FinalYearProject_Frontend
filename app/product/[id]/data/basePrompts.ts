export const basePrompts = {
    'Computer/Tablet': {
      main:(productName: string) => `ultra detailed product photography of ${productName}, modern gaming laptop, sleek design, premium build quality, RGB lighting, professional studio lighting`,
      views: [
        'front view showing display and keyboard illumination',
        'side view highlighting slim profile and ports',
        '45-degree angle showcasing design elements',
        'close-up of keyboard and touchpad details'
      ]
    },
    'Printers & Projectors': {
        main: (productName: string) => `professional product photography of ${productName}, office environment, crisp image, high resolution`,
      views: [
        'front view showing control panel',
        'side view showing paper tray',
        'angled view for overall design',
        'close-up of print quality'
      ]
    },
    'Telephone': {
      main: (productName: string) => `modern product photography of ${productName}, sleek design, corporate environment, high detail`,
      views: [
        'front view with display lit up',
        'side view showing slim profile',
        'angled view for ergonomic design',
        'close-up of keypad and buttons'
      ]
    },
    'TV, Visual and Audio Systems': {
      main: (productName: string) => `high-end product photography of ${productName}, entertainment setup, vibrant colors, immersive experience`,
      views: [
        'front view showing screen content',
        'side view showing slim design',
        'angled view for home integration',
        'close-up of ports and connections'
      ]
    },
    'White Goods': {
      main: (productName: string) => `clean product photography of ${productName}, kitchen setting, stainless steel, modern appliances`,
      views: [
        'front view showing door and controls',
        'side view showing size and depth',
        'angled view for kitchen integration',
        'close-up of interior features'
      ]
    },
    'Air Conditioners and Heaters': {
      main: (productName: string) => `product shot of ${productName}, room environment, energy efficient, comfort`,
      views: [
        'front view showing control panel',
        'side view showing slim profile',
        'angled view for room integration',
        'close-up of air vents and filters'
      ]
    },
    'Electrical Appliances': {
      main: (productName: string) => `studio product shot of ${productName}, household use, ease of use, practical`,
      views: [
        'front view showing main features',
        'side view showing attachments',
        'angled view for handle and controls',
        'close-up of special functions'
      ]
    },
    'Photo and Camera': {
      main: (productName: string) => `product photography of ${productName}, outdoor or studio setting, capturing moments, high resolution`,
      views: [
        'front view showing lens and controls',
        'side view showing grip and ports',
        'angled view for ergonomic design',
        'close-up of lens and sensor details'
      ]
    },
    'Cleaning Products': {
      main: (productName: string) => `4k product photography of ${productName} on white background, studio lighting, commercial product shot, no people`,
      views: [
        'front view showing label',
        'side view showing container',
        'close-up of dispenser',
        'product details view'
      ]
    },
    'Diaper and Wet Wipes': {
      main: (productName: string) => `product photography of ${productName}, baby care, gentle, safe`,
      views: [
        'front view showing packaging',
        'angled view showing contents',
        'close-up of material and texture',
        'contextual view in a baby care setting'
      ]
    },
    'Paper Products': {
      main: (productName: string) => `4k product photography of ${productName} on white background, studio lighting, commercial product shot, no people`,
      views: [
        'front view showing packaging',
        'side view showing thickness',
        'close-up of texture',
        'multiple pack display'
      ]
    },
    'Drinks': {
      main: (productName: string) => `product photography of ${productName}, refreshment, tasty, variety`,
      views: [
        'front view showing bottle or can',
        'angled view showing drink pouring',
        'close-up of liquid texture',
        'contextual view in a social setting'
      ]
    },
    'Food Products': {
      main: (productName: string) => `product shot of ${productName}, delicious, nutritious, quality`,
      views: [
        'front view showing packaging',
        'angled view showing food preparation',
        'close-up of ingredients and texture',
        'contextual view in a meal setting'
      ]
    },
    'Petshop': {
      main: (productName: string) => `product photography of ${productName}, pet care, health, happiness`,
      views: [
        'front view showing packaging',
        'angled view showing product in use',
        'close-up of ingredients or features',
        'contextual view with a pet'
      ]
    },
    'Household Consumables': {
      main: (productName: string) => `product shot of ${productName}, household essentials, practical, economical`,
      views: [
        'front view showing packaging',
        'angled view showing usage',
        'close-up of features and details',
        'contextual view in a household setting'
      ]
    },
    'Womens Clothing': {
      main: (productName: string) => `fashion product photography of ${productName}, stylish, trendy, high fashion`,
      views: [
        'front view showing full outfit',
        'side view showing silhouette',
        'angled view showcasing design',
        'close-up of fabric and details'
      ]
    },
    'Womens Accessories and Jewelry': {
      main: (productName: string) => `elegant product shot of ${productName}, stylish, sophisticated, delicate`,
      views: [
        'front view showing overall design',
        'side view showing depth and detail',
        'angled view showcasing sparkle',
        'close-up of gems and craftsmanship'
      ]
    },
    'Mens Clothing': {
      main: (productName: string) => `fashion product photography of ${productName}, stylish, modern, tailored`,
      views: [
        'front view showing full outfit',
        'side view showing fit and cut',
        'angled view showcasing style',
        'close-up of fabric and details'
      ]
    },
    'Mens Accessories and Jewelry': {
      main: (productName: string) => `elegant product shot of ${productName}, stylish, sophisticated, masculine`,
      views: [
        'front view showing overall design',
        'side view showing construction and detail',
        'angled view showcasing texture',
        'close-up of materials and craftsmanship'
      ]
    },
    'Womens Shoes and Bags': {
      main: (productName: string) => `stylish product photography of ${productName}, elegant, trendy, fashionable`,
      views: [
        'front view showing overall design',
        'side view showing shape and height',
        'angled view showcasing texture',
        'close-up of materials and stitching'
      ]
    },
    'Mens Shoes and Bags': {
      main: (productName: string) => `stylish product photography of ${productName}, trendy, modern, functional`,
      views: [
        'front view showing design and closure',
        'side view showing capacity and shape',
        'angled view showcasing materials',
        'close-up of details and features'
      ]
    },
    'Kids': {
      main: (productName: string) => `product photography of ${productName}, playful, colorful, durable`,
      views: [
        'front view showing design and features',
        'side view showing comfort and size',
        'angled view showcasing details',
        'contextual view with a child'
      ]
    },
    'Smart Home Devices': {
      main: (productName: string) => `product photography of ${productName}, connected, innovative, smart`,
      views: [
        'front view showing device interface',
        'side view showing size and integration',
        'angled view showcasing design',
        'contextual view in a home setting'
      ]
    },
    'Gaming Equipment': {
      main: (productName: string) => `professional product shot of ${productName}, gaming peripheral, dramatic lighting, matte finish, high-end commercial photography`,
      views: [
        'front view with RGB lighting effects',
        'side profile showing ergonomic design',
        'top-down view of all buttons and features',
        'detail shot of special features'
      ]
    },
    'Musical Instruments': {
      main: (productName: string) => `artistic product photography of ${productName}, classic, resonant, craftsmanship`,
      views: [
        'front view showing instrument body',
        'side view showing shape and form',
        'angled view showcasing details',
        'close-up of strings or keys'
      ]
    },  
    'Office Supplies': {
      main: (productName: string) => `clean product photography of ${productName}, organized, efficient, essential`,
      views: [
        'front view showing item set',
        'angled view showing functionality',
        'close-up of features and details',
        'contextual view on a desk'
      ]
    },
    'Sports Equipment': {
      main: (productName: string) => `dynamic product photography of ${productName}, active, durable, high performance`,
      views: [
        'front view showing key features',
        'side view showing design and shape',
        'angled view showcasing material',
        'action shot in a sports setting'
      ]
    },
    'Beauty and Personal Care': {
      main: (productName: string) => `elegant product photography of ${productName}, beauty, self-care, radiant`,
      views: [
        'front view showing packaging and product',
        'angled view showcasing texture and color',
        'close-up of ingredients and details',
        'contextual view in a self-care setting'
      ]
    },
    'Home Decor': {
      main: (productName: string) => `stylish product photography of ${productName}, interior design, comfort, ambiance`,
      views: [
        'front view showing overall design',
        'angled view showcasing texture and color',
        'contextual view in a home setting',
        'detail shot of unique features'
      ]
    },
    'Garden Tools': {
      main: (productName: string) => `clean product photography of ${productName}, gardening, outdoor, durable`,
      views: [
        'front view showing tool head',
        'side view showing handle and length',
        'angled view showcasing features',
        'contextual view in a garden setting'
      ]
    },
    'Automotive Accessories': {
      main: (productName: string) => `dynamic product photography of ${productName}, automotive, style, performance`,
      views: [
        'front view showing accessory features',
        'side view showing fit and integration',
        'angled view showcasing design',
        'contextual view on a car'
      ]
    },
    'Books and Stationery': {
      main: (productName: string) => `classic product photography of ${productName}, reading, writing, education`,
      views: [
        'front view showing cover and title',
        'side view showing spine and thickness',
        'angled view showcasing texture',
        'close-up of pages and details'
      ]
    },
    'Bakery Products': {
      main: (productName: string) => `enticing product photography of ${productName}, delicious, fresh, artisanal`,
      views: [
        'front view showing product detail',
        'angled view showcasing texture and presentation',
        'close-up of ingredients and toppings',
        'contextual view in a bakery setting'
      ]
    },
    'Frozen Foods': {
      main: (productName: string) => `clean product photography of ${productName}, convenience, tasty, preserved`,
      views: [
        'front view showing packaging and contents',
        'angled view showcasing ingredients',
        'close-up of texture and preparation',
        'contextual view in a freezer setting'
      ]
    },
    'Dairy Products': {
      main: (productName: string) => `clean product photography of ${productName}, fresh, nutritious, healthy`,
      views: [
        'front view showing packaging and product',
        'angled view showcasing texture and consistency',
        'close-up of details and benefits',
        'contextual view in a breakfast setting'
      ]
    },
    'Organic Foods': {
      main: (productName: string) => `natural product photography of ${productName}, organic, healthy, sustainable`,
      views: [
        'front view showing packaging and certifications',
        'angled view showcasing ingredients and texture',
        'close-up of labels and benefits',
        'contextual view in a farm setting'
      ]
    },
    'Pet Accessories': {
      main: (productName: string) => `playful product photography of ${productName}, pet care, fun, durable`,
      views: [
        'front view showing accessory features',
        'angled view showcasing design and usage',
        'close-up of materials and details',
        'contextual view with a pet'
      ]
    },
    'Fresh Produce': {
      main: (productName: string) => `vibrant product photography of ${productName}, fresh, organic, natural`,
      views: [
        'front view showing produce texture',
        'angled view showcasing color and shape',
        'close-up of details and freshness',
        'contextual view in a market setting'
      ]
    },
    'Beverages': {
      main: (productName: string) => `refreshing product photography of ${productName}, tasty, cooling, variety`,
      views: [
        'front view showing bottle or can',
        'angled view showcasing liquid texture',
        'close-up of bubbles and condensation',
        'contextual view in a social setting'
      ]
    },
    'Snacks and Confectionery': {
      main: (productName: string) => `enticing product photography of ${productName}, delicious, sweet, tempting`,
      views: [
        'front view showing snack features',
        'angled view showcasing texture and toppings',
        'close-up of ingredients and details',
        'contextual view in a relaxing setting'
      ]
    },
    'Mobile Accessories': {
      main: (productName: string) => `modern product photography of ${productName}, stylish, functional, tech`,
      views: [
        'front view showing accessory features',
        'side view showing compatibility and fit',
        'angled view showcasing design',
        'contextual view with a mobile phone'
      ]
    },
    'Computer Components': {
      main: (productName: string) => `technical product photography of ${productName}, high-performance, innovative, detailed`,
      views: [
        'front view showing component layout',
        'side view showing heat sinks and ports',
        'angled view showcasing craftsmanship',
        'close-up of circuit boards and connections'
      ]
    },
    'Networking Equipment': {
      main: (productName: string) => `clean product photography of ${productName}, connected, efficient, reliable`,
      views: [
        'front view showing device ports',
        'side view showing size and shape',
        'angled view showcasing antennas',
        'contextual view in a home or office setting'
      ]
    },
    'Storage Devices': {
      main: (productName: string) => `modern product photography of ${productName}, efficient, secure, portable`,
      views: [
        'front view showing device label',
        'side view showing size and port',
        'angled view showcasing design',
        'contextual view with a laptop'
      ]
    },
    'Wearable Technology': {
      main: (productName: string) => `dynamic product photography of ${productName}, active, connected, stylish`,
      views: [
        'front view showing device display',
        'side view showing band and sensors',
        'angled view showcasing design',
        'contextual view on a wrist'
      ]
    },
    'Audio Equipment': {
      main: (productName: string) => `artistic product photography of ${productName}, immersive, clear, resonant`,
      views: [
        'front view showing device design',
        'side view showing earcups or speakers',
        'angled view showcasing details',
        'contextual view in a listening setting'
      ]
    },
    'Kids Fashion': {
      main: (productName: string) => `playful product photography of ${productName}, cute, stylish, comfortable`,
      views: [
        'front view showing garment detail',
        'side view showing fit and shape',
        'angled view showcasing color and pattern',
        'contextual view on a child'
      ]
    },
    'Maternity Wear': {
      main: (productName: string) => `comfortable product photography of ${productName}, supportive, stylish, nurturing`,
      views: [
        'front view showing garment detail',
        'side view showing fit and comfort',
        'angled view showcasing design',
        'contextual view on a pregnant woman'
      ]
    },
    'Sportswear': {
      main: (productName: string) => `dynamic product photography of ${productName}, active, breathable, durable`,
      views: [
        'front view showing garment features',
        'side view showing fit and mobility',
        'angled view showcasing material',
        'action shot in a sports setting'
      ]
    },
    'Underwear and Lingerie': {
      main: (productName: string) => `elegant product photography of ${productName}, comfortable, stylish, delicate`,
      views: [
        'front view showing garment detail',
        'side view showing fit and shape',
        'angled view showcasing lace and details',
        'contextual view on a mannequin'
      ]
    },
    'Seasonal Fashion': {
      main: (productName: string) => `trendy product photography of ${productName}, stylish, current, fashionable`,
      views: [
        'front view showing garment detail',
        'side view showing silhouette and trends',
        'angled view showcasing season-specific details',
        'contextual view in a fashion setting'
      ]
    },
    'Luxury Fashion': {
      main: (productName: string) => `high-end product photography of ${productName}, exclusive, elegant, sophisticated`,
      views: [
        'front view showing garment detail',
        'side view showing tailoring and shape',
        'angled view showcasing luxury materials',
        'contextual view in a high-fashion setting'
      ]
    },
    'Professional Workwear': {
      main: (productName: string) => `professional product photography of ${productName}, corporate, durable, stylish`,
      views: [
        'front view showing garment fit',
        'side view showing tailoring and design',
        'angled view showcasing materials',
        'contextual view in an office setting'
      ]
    },
    'Traditional Wear': {
      main: (productName: string) => `cultural product photography of ${productName}, traditional, unique, authentic`,
      views: [
        'front view showing garment detail',
        'side view showing silhouette and fit',
        'angled view showcasing cultural details',
        'contextual view in a cultural setting'
      ]
    },
    'Fashion Accessories': {
      main: (productName: string) => `stylish product photography of ${productName}, fashionable, trendy, chic`,
      views: [
        'front view showing accessory detail',
        'side view showing design and shape',
        'angled view showcasing unique features',
        'contextual view with a fashion model'
      ]
    },
    'Outdoor Clothing': {
      main: (productName: string) => `dynamic product photography of ${productName}, durable, comfortable, weather-resistant`,
      views: [
        'front view showing garment features',
        'side view showing fit and mobility',
        'angled view showcasing material',
        'action shot in an outdoor setting'
      ]
    },
    'Kitchen Appliances': {
      main: (productName: string) => `clean product photography of ${productName}, efficient, reliable, modern`,
      views: [
        'front view showing device panel',
        'side view showing size and integration',
        'angled view showcasing design',
        'contextual view in a kitchen setting'
      ]
    },
    'Personal Care Appliances': {
      main: (productName: string) => `stylish product photography of ${productName}, grooming, personal, hygienic`,
      views: [
        'front view showing device features',
        'side view showing size and handle',
        'angled view showcasing design',
        'contextual view in a bathroom setting'
      ]
    },
    'Home Cleaning Appliances': {
      main: (productName: string) => `clean product photography of ${productName}, efficient, powerful, hygienic`,
      views: [
        'front view showing device head',
        'side view showing size and reach',
        'angled view showcasing features',
        'contextual view in a cleaning setting'
      ]
    },
    'Home Security Devices': {
      main: (productName: string) => `modern product photography of ${productName}, secure, connected, reliable`,
      views: [
        'front view showing device interface',
        'side view showing size and integration',
        'angled view showcasing design',
        'contextual view protecting a home'
      ]
    },
    'Smart Wearables': {
      main: (productName: string) => `dynamic product photography of ${productName}, active, connected, stylish`,
      views: [
        'front view showing device display',
        'side view showing band and sensors',
        'angled view showcasing design',
        'contextual view on a wrist in action'
      ]
    },
    'Pet Food': {
      main: (productName: string) => `natural product photography of ${productName}, healthy, nutritious, tasty`,
      views: [
        'front view showing packaging details',
        'angled view showcasing texture and ingredients',
        'close-up of nutritional information',
        'contextual view near a pet'
      ]
    },
    'Pet Care Products': {
      main: (productName: string) => `playful product photography of ${productName}, caring, essential, reliable`,
      views: [
        'front view showing product features',
        'angled view showcasing design and usage',
        'close-up of materials and instructions',
        'contextual view with a pet owner'
      ]
    },
    'Organic Beverages': {
      main: (productName: string) => `natural product photography of ${productName}, refreshing, healthy, organic`,
      views: [
        'front view showing bottle or can',
        'angled view showcasing liquid clarity',
        'close-up of labels and benefits',
        'contextual view in a health-conscious setting'
      ]
    },
    'Organic Snacks': {
      main: (productName: string) => `natural product photography of ${productName}, tasty, guilt-free, organic`,
      views: [
        'front view showing snack details',
        'angled view showcasing texture and ingredients',
        'close-up of nutritional information',
        'contextual view in a snack setting'
      ]
    },
    'Luxury Bags': {
      main: (productName: string) => `high-end product photography of ${productName}, exclusive, elegant, fashionable`,
      views: [
        'front view showing bag features',
        'side view showing shape and dimensions',
        'angled view showcasing material quality',
        'contextual view with a luxury outfit'
      ]
    },
    'Luxury Shoes': {
      main: (productName: string) => `high-end product photography of ${productName}, exclusive, stylish, sophisticated`,
      views: [
        'front view showing shoe design',
        'side view showing heel height and shape',
        'angled view showcasing material elegance',
        'contextual view with a designer outfit'
      ]
    },
    'Luxury Watches': {
      main: (productName: string) => `high-end product photography of ${productName}, timeless, precise, exquisite`,
      views: [
        'front view showing dial and hands',
        'side view showing case and band',
        'angled view showcasing craftsmanship',
        'close-up of gears and face details'
      ]
    },
    'Luxury Jewelry': {
      main: (productName: string) => `high-end product photography of ${productName}, sparkling, elegant, precious`,
      views: [
        'front view showing jewelry detail',
        'side view showing clasp and setting',
        'angled view showcasing gemstone brilliance',
        'contextual view on a model'
      ]
    },
    'Designer Clothing': {
      main: (productName: string) => `artistic product photography of ${productName}, innovative, stylish, iconic`,
      views: [
        'front view showing garment design',
        'side view showing cut and silhouette',
        'angled view showcasing fabric texture',
        'contextual view in a fashion shoot'
      ]
    },
    'Designer Accessories': {
      main: (productName: string) => `artistic product photography of ${productName}, innovative, stylish, unique`,
      views: [
        'front view showing accessory design',
        'side view showing shape and function',
        'angled view showcasing material texture',
        'contextual view with a designer outfit'
      ]
    },
    'Designer Shoes': {
      main: (productName: string) => `artistic product photography of ${productName}, avant-garde, stylish, luxurious`,
      views: [
        'front view showing shoe design',
        'side view showing construction and shape',
        'angled view showcasing unique details',
        'contextual view with a fashion ensemble'
      ]
    },
    'Designer Bags': {
      main: (productName: string) => `artistic product photography of ${productName}, innovative, functional, chic`,
      views: [
        'front view showing bag features',
        'side view showing shape and dimensions',
        'angled view showcasing material and hardware',
        'contextual view in an urban setting'
      ]
    },
    'Designer Jewelry': {
      main: (productName: string) => `artistic product photography of ${productName}, contemporary, elegant, precious`,
      views: [
        'front view showing jewelry design',
        'side view showing clasp and setting',
        'angled view showcasing craftsmanship',
        'contextual view on a model'
      ]
    },
    'Luxury Home Decor': {
      main: (productName: string) => `refined product photography of ${productName}, luxurious, stylish, elegant`,
      views: [
        'front view showing decor detail',
        'angled view showcasing material quality',
        'contextual view in a luxury home',
        'detail shot highlighting craftsmanship'
      ]
    },
    'Luxury Beauty Products': {
      main: (productName: string) => `elegant product photography of ${productName}, radiant, youthful, indulgent`,
      views: [
        'front view showing product packaging',
        'angled view showcasing textures and colors',
        'close-up of ingredients and benefits',
        'contextual view in a beauty setting'
      ]
    },
    'Luxury Personal Care': {
      main: (productName: string) => `refined product photography of ${productName}, comforting, indulgent, quality`,
      views: [
        'front view showing product features',
        'angled view showcasing textures and aromas',
        'close-up of ingredients and benefits',
        'contextual view in a spa setting'
      ]
    },
    'Luxury Food Products': {
      main: (productName: string) => `refined product photography of ${productName}, gourmet, exclusive, delightful`,
      views: [
        'front view showing product presentation',
        'angled view showcasing ingredients',
        'close-up of textures and aromas',
        'contextual view in a fine dining setting'
      ]
    },
    'Luxury Drinks': {
      main: (productName: string) => `refined product photography of ${productName}, premium, refreshing, sophisticated`,
      views: [
        'front view showing bottle or glass',
        'angled view showcasing liquid texture',
        'close-up of bubbles and presentation',
        'contextual view in a social setting'
      ]
    },
    'Luxury Snacks': {
      main: (productName: string) => `refined product photography of ${productName}, delectable, indulgent, exquisite`,
      views: [
        'front view showing snack presentation',
        'angled view showcasing textures and flavors',
        'close-up of ingredients and toppings',
        'contextual view in an elegant setting'
      ]
    },
    'Luxury Kitchen Appliances': {
      main: (productName: string) => `high-end product photography of ${productName}, efficient, stylish, state-of-the-art`,
      views: [
        'front view showing device panel',
        'side view showing size and integration',
        'angled view showcasing design',
        'contextual view in a luxury kitchen'
      ]
    },
    'Luxury Home Appliances': {
      main: (productName: string) => `high-end product photography of ${productName}, efficient, powerful, whisper-quiet`,
      views: [
        'front view showing appliance features',
        'side view showing size and efficiency',
        'angled view showcasing materials',
        'contextual view in a luxury home'
      ]
    },
    'Luxury Electronics': {
      main: (productName: string) => `high-end product photography of ${productName}, cutting-edge, immersive, sleek`,
      views: [
        'front view showing device screen',
        'side view showing design and ports',
        'angled view showcasing craftsmanship',
        'contextual view in an entertainment setting'
      ]
    },
    'Luxury Wearables': {
      main: (productName: string) => `high-end product photography of ${productName}, sophisticated, connected, stylish`,
      views: [
        'front view showing watch face',
        'side view showing band and sensors',
        'angled view showcasing materials',
        'contextual view on a wrist'
      ]
    },
    'Luxury Smart Home Devices': {
      main: (productName: string) => `high-end product photography of ${productName}, automated, connected, secure`,
      views: [
        'front view showing device interface',
        'side view showing size and elegance',
        'angled view showcasing design',
        'contextual view in a smart home setting'
      ]
    },
    default: {
      main: (productName: string) => `4k product photography of ${productName} on white background, studio lighting, commercial product shot, no people`,
      views: [
        'front view',
        'side view',
        '45-degree angle view',
        'close-up of main features'
      ]
    }
  } as const;

  export type CategoryPrompt = {     main: (productName: string) => string;     views: readonly string[]; };

  export type CategoryKey = keyof typeof basePrompts;
  
  export const generateProductPrompt = (productName: string, category: string) => { 
        if (!category) {    
           return {   
                main: `4k product photography of ${productName} on white background, studio lighting, commercial product shot, no people`,views: []  
              };   
            }
        };