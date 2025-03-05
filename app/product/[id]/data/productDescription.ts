// Ortak başlık tanımı
export const productDescriptions = {
  defaultDescriptionTitle: {
    title: "Product Description"
  }
};

export const productSpecifications = {
  defaultSpecificationTitle: {
    title: "Product Specification"
  }
};

export const productDetails = {
    // Ortak başlık
    defaultDescriptionTitle: {
          title: "Product Description",
          content: "No description available for this product."
    },

    defaultSpecification: {
      title: "Specifications",
      content: "No specifications available for this product."
    },
  
    'ASUS ROG Zephyrus G14': {
      description: {
        title: productDescriptions.defaultDescriptionTitle.title,
        content: "Unleash portable gaming power with the ASUS ROG Zephyrus G14. Featuring an AMD Ryzen processor and NVIDIA GeForce RTX graphics, this laptop delivers exceptional performance for gaming and content creation. Its compact design houses a vibrant display with fast refresh rates, ensuring immersive visuals. Enjoy long battery life and a sleek profile, making it the ultimate companion for gamers on the move."
      },
      specifications: {
        title: "Specifications",
        content: "AMD Ryzen 9 5900HS, NVIDIA GeForce RTX 3060, 16GB RAM, 1TB SSD, 14-inch 144Hz Display."
      }
    },
    'MSI Katana GF66': {
      description: {
        title: productDescriptions.defaultDescriptionTitle.title,
        content: "Forge your path to victory with the MSI Katana GF66. This gaming laptop combines an Intel Core processor and NVIDIA GeForce RTX graphics for immersive gameplay. Its fast refresh rate display and optimized cooling system provide a competitive edge, while its sleek design makes a statement. Ready to take on any challenge, the Katana GF66 is your gateway to gaming excellence."
      },
      specifications: {
        title: "Specifications",
        content: "Intel Core i7-11800H, NVIDIA GeForce RTX 3050 Ti, 16GB RAM, 512GB SSD, 15.6-inch 144Hz Display."
      }
    },
    'Acer Predator Helios 300': {
      description: {
        title: productDescriptions.defaultDescriptionTitle.title,
        content: "Enter the realm of elite gaming with the Acer Predator Helios 300. This gaming laptop boasts an Intel Core processor and NVIDIA GeForce RTX graphics for seamless performance in demanding titles. Its high refresh rate display, advanced cooling system, and customizable RGB keyboard create an immersive gaming experience. Prepare to conquer any virtual battlefield with the Predator Helios 300."
      }, 
        specifications: {
        title: "Specifications",
        content: "Intel Core i9-11900H, NVIDIA GeForce RTX 3070, 32GB RAM, 1TB SSD, 15.6-inch 165Hz Display."
      }
    },
    'Lenovo Legion 5 Pro': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience gaming without compromise with the Lenovo Legion 5 Pro. This gaming laptop features an AMD Ryzen processor and NVIDIA GeForce RTX graphics for exceptional power and performance. Its high refresh rate display, ergonomic keyboard, and advanced cooling system provide a competitive advantage, while its sleek design makes a statement. Dominate the competition with the Legion 5 Pro."
      },     
       specifications: {
        title: "Specifications",
        content: "AMD Ryzen 7 5800H, NVIDIA GeForce RTX 3070, 16GB RAM, 1TB SSD, 16-inch 165Hz Display."
      }
    },
    'HP Omen 15': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Unleash your gaming potential with the HP Omen 15. This gaming laptop combines an Intel Core processor and NVIDIA GeForce RTX graphics for smooth and immersive gameplay. Its fast refresh rate display, optimized cooling system, and customizable RGB keyboard create a personalized gaming experience. Prepare for victory with the HP Omen 15."
      },  
       specifications: {
      title: "Specifications",
      content: "Intel Core i7-11800H, NVIDIA GeForce RTX 3060, 16GB RAM, 512GB SSD, 15.6-inch 144Hz Display."
    }
    },
    'Dell G15 Gaming Laptop': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Step into the world of gaming with the Dell G15 Gaming Laptop. This laptop features an Intel Core processor and NVIDIA GeForce RTX graphics for enhanced performance in modern titles. Its optimized cooling system, immersive display, and comfortable keyboard provide an enjoyable gaming experience. Experience the power of gaming with the Dell G15."
      },
      specifications: {
        title: "Specifications",
        content: "Intel Core i5-11400H, NVIDIA GeForce RTX 3050, 8GB RAM, 256GB SSD, 15.6-inch 120Hz Display."
      }
    },
    'Razer Blade 15': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience ultimate gaming performance with the Razer Blade 15. Powered by an Intel Core processor and NVIDIA GeForce RTX graphics, this laptop delivers exceptional speed and stunning visuals. Its thin and light design houses a high refresh rate display and advanced cooling system, ensuring immersive gaming on the go. Elevate your gaming experience with the Razer Blade 15."
      },
      specifications: {
        title: "Specifications",
        content: "Intel Core i7-11800H, NVIDIA GeForce RTX 3070, 16GB RAM, 1TB SSD, 15.6-inch 240Hz Display."
      }
    },
    'Gigabyte AORUS 15G': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Dominate the gaming arena with the Gigabyte AORUS 15G. This gaming laptop features an Intel Core processor and NVIDIA GeForce RTX graphics for unparalleled performance. Its high refresh rate display, advanced cooling system, and mechanical keyboard provide a competitive edge. Experience the ultimate in gaming with the Gigabyte AORUS 15G."
      },
      specifications: {
        title: "Specifications",
        content: "Intel Core i9-11980HK, NVIDIA GeForce RTX 3080, 32GB RAM, 1TB SSD, 15.6-inch 240Hz Display."
      }
    },
    'Alienware x15 R2': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience the pinnacle of gaming performance with the Alienware x15 R2. This gaming laptop boasts an Intel Core processor and NVIDIA GeForce RTX graphics for unmatched power and speed. Its thin and light design houses a high refresh rate display and advanced cooling system, ensuring an immersive and comfortable gaming experience. Elevate your gaming with the Alienware x15 R2."
      },
      specifications: {
        title: "Specifications",
        content: "Intel Core i9-12900H, NVIDIA GeForce RTX 3080 Ti, 32GB RAM, 1TB SSD, 15.6-inch 240Hz Display."
      }
    },
    'ASUS TUF Gaming F15': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience rugged gaming performance with the ASUS TUF Gaming F15. This gaming laptop features an Intel Core processor and NVIDIA GeForce RTX graphics for reliable and immersive gameplay. Its durable design, optimized cooling system, and immersive display make it the perfect choice for gamers on the go. Game with confidence with the ASUS TUF Gaming F15."
      },
      specifications: {
        title: "Specifications",
        content: "Intel Core i5-11300H, NVIDIA GeForce RTX 3050, 8GB RAM, 512GB SSD, 15.6-inch 144Hz Display."
      }
    },
    'HP Smart Tank 515 Wireless Printer': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience efficient and cost-effective printing with the HP Smart Tank 515 Wireless Printer. This printer features a high-capacity ink tank system for low-cost printing, wireless connectivity for easy sharing, and mobile printing capabilities for on-the-go convenience. Perfect for home or small office use, the HP Smart Tank 515 delivers reliable performance and exceptional value."
      },
      specifications: {
        title: "Specifications",
        content: "Print speed up to 11 ppm (black), up to 5 ppm (color), Resolution up to 4800 x 1200 dpi, Wireless, Mobile printing, High-capacity ink tank."
      }
    },
    'Canon PIXMA G2020 Wireless Printer': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Enjoy high-quality and affordable printing with the Canon PIXMA G2020 Wireless Printer. This printer features a refillable ink tank system for low-cost printing, wireless connectivity for easy sharing, and mobile printing capabilities for added convenience. Perfect for home or small office use, the Canon PIXMA G2020 delivers sharp text and vibrant photos."
      },
      specifications: {
        title: "Specifications",
        content: "Print speed up to 9.1 ipm (black), up to 5 ipm (color), Resolution up to 4800 x 1200 dpi, Wireless, Mobile printing, Refillable ink tanks."
      }
    },
    'Epson EcoTank L3250 Wireless Printer': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience hassle-free and economical printing with the Epson EcoTank L3250 Wireless Printer. This printer features a refillable ink tank system for low-cost printing, wireless connectivity for easy sharing, and mobile printing capabilities for added convenience. Perfect for home or small office use, the Epson EcoTank L3250 delivers sharp text and vivid colors with exceptional reliability."
      },
      specifications: {
        title: "Specifications",
        content: "Print speed up to 10 ppm (black), up to 5 ppm (color), Resolution up to 5760 x 1440 dpi, Wireless, Mobile printing, Refillable ink tanks."
      }
    },
    'Brother DCP-T426W Wireless Printer': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience reliable and efficient printing with the Brother DCP-T426W Wireless Printer. This printer features a refillable ink tank system for low-cost printing, wireless connectivity for easy sharing, and mobile printing capabilities for added convenience. Perfect for home or small office use, the Brother DCP-T426W delivers sharp text and vibrant photos with exceptional ease of use."
      },
      specifications: {
        title: "Specifications",
        content: "Print speed up to 9 ipm (black), up to 6 ipm (color), Resolution up to 1200 x 6000 dpi, Wireless, Mobile printing, Refillable ink tanks."
      }
    },
    'Samsung Xpress M2070FW Wireless Printer': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Enjoy fast and efficient monochrome printing with the Samsung Xpress M2070FW Wireless Printer. This printer features wireless connectivity for easy sharing, mobile printing capabilities for added convenience, and a compact design for space-saving efficiency. Perfect for home or small office use, the Samsung Xpress M2070FW delivers sharp text and reliable performance."
      },
      specifications: {
        title: "Specifications",
        content: "Print speed up to 20 ppm (black), Resolution up to 1200 x 1200 dpi, Wireless, Mobile printing, Compact design."
      }
    },
    'Apple iPhone 14 Pro': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience the cutting edge of mobile technology with the Apple iPhone 14 Pro. This smartphone features a powerful A16 Bionic chip for exceptional performance, a stunning Super Retina XDR display for vibrant visuals, and a pro-level camera system for capturing incredible photos and videos. Elevate your mobile experience with the iPhone 14 Pro."
      },
      specifications: {
        title: "Specifications",
        content: "A16 Bionic chip, 6.1-inch Super Retina XDR display, 48MP Pro camera system, 5G connectivity, Ceramic Shield front cover."
      }
    },
    'Samsung Galaxy S23 Ultra': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Push the boundaries of mobile technology with the Samsung Galaxy S23 Ultra. This smartphone features a powerful Snapdragon processor for blazing-fast performance, a stunning Dynamic AMOLED display for immersive visuals, and a revolutionary camera system for capturing professional-quality photos and videos. Experience the future of mobile with the Galaxy S23 Ultra."
      },
      specifications: {
        title: "Specifications",
        content: "Snapdragon 8 Gen 2 for Galaxy processor, 6.8-inch Dynamic AMOLED 2X display, 200MP camera system, 5G connectivity, IP68 water resistance."
      }
    },
    'Google Pixel 8 Pro': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience the best of Android with the Google Pixel 8 Pro. This smartphone features a powerful Tensor G3 chip for exceptional performance, a stunning OLED display for vibrant visuals, and an advanced camera system for capturing incredible photos and videos. Enjoy a seamless and intuitive user experience with the Pixel 8 Pro."
      },
      specifications: {
        title: "Specifications",
        content: "Google Tensor G3 chip, 6.7-inch OLED display, 50MP camera system, 5G connectivity, IP68 water resistance."
      }
    },
    'OnePlus 11 5G': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience lightning-fast performance and stunning visuals with the OnePlus 11 5G. This smartphone features a powerful Snapdragon processor for blazing-fast performance, a vibrant AMOLED display for immersive visuals, and a versatile camera system for capturing exceptional photos and videos. Elevate your mobile experience with the OnePlus 11 5G."
      },
      specifications: {
        title: "Specifications",
        content: "Snapdragon 8 Gen 2 processor, 6.7-inch AMOLED display, 50MP camera system, 5G connectivity, 100W SuperVOOC charging."
      }
    },
    'Xiaomi 13 Pro': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience exceptional performance and stunning design with the Xiaomi 13 Pro. This smartphone features a powerful Snapdragon processor for blazing-fast performance, a vibrant AMOLED display for immersive visuals, and a versatile camera system for capturing exceptional photos and videos. Elevate your mobile experience with the Xiaomi 13 Pro."
      },
      specifications: {
        title: "Specifications",
        content: "Snapdragon 8 Gen 2 processor, 6.73-inch AMOLED display, 50MP camera system, 5G connectivity, 120W HyperCharge charging."
      }
    },
    'Sony Xperia 1 V': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Capture stunning photos and videos with the Sony Xperia 1 V. This smartphone features a high-resolution camera, a high-quality display, and a unique design. Its durable build, optimized cooling system, and water resistance make it the perfect choice for photographers on the go. Game with confidence with the Sony Xperia 1 V."
      },
      specifications: {
        title: "Specifications",
        content: "Snapdragon 8 Gen 2 processor, 6.5-inch 21:9 OLED display, 12MP triple lens camera, 5G connectivity, IP65/68 water resistance."
      }
    },
    'Huawei P60 Pro': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience lightning-fast performance and stunning visuals with the Huawei P60 Pro. This smartphone features a powerful Snapdragon processor, a vibrant AMOLED display for immersive visuals, and a versatile camera system for capturing exceptional photos and videos. Elevate your mobile experience with the Huawei P60 Pro."
      },
      specifications: {
        title: "Specifications",
        content: "Snapdragon 8+ Gen 1 processor, 6.67-inch OLED display, 48MP triple lens camera, 4G connectivity, IP68 water resistance."
      }
    },
    'Realme GT 3': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience seamless gaming with the Realme GT 3. This smartphone features a Snapdragon processor, a vibrant AMOLED display, and a unique design. Enjoy long battery life and a unique design, making it the ultimate companion for gamers on the go."
      },
      specifications: {
        title: "Specifications",
        content: "Snapdragon 8 Gen 2 processor, 6.74-inch AMOLED display, 50MP triple lens camera, 5G connectivity, 240W SuperVOOC charging."
      
    },
    'Asus ROG Phone 7': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Level up your gaming experience with the Asus ROG Phone 7. This smartphone features a Snapdragon processor, a vibrant AMOLED display, and a unique design. Game like a Pro."
      },
      specifications: {
        title: "Specifications",
        content: "Snapdragon 8 Gen 2 processor, 6.78-inch AMOLED display, 50MP triple lens camera, 5G connectivity, 6000mAh battery."
      }
    },
    'Motorola Edge 40 Pro': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Capture lightning-fast performance and stunning visuals with the Motorola Edge 40 Pro. This smartphone features a powerful Snapdragon processor, a vibrant AMOLED display, and a versatile camera system."
      },
      specifications: {
        title: "Specifications",
        content: "Snapdragon 8 Gen 2 processor, 6.67-inch OLED display, 50MP triple lens camera, 5G connectivity, 125W TurboPower charging."
      }
    },
    'Samsung LED TV 42 inch': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience the Samsung LED TV 42 inch. This TV brings vibrant colors to your living room. With vibrant visuals, and crystal clear sound, it also saves on energy."
      },
      specifications: {
        title: "Specifications",
        content: "42-inch LED display, 1920x1080 resolution, HDMI port, USB port, Energy Star certified."
      }
    },
    'LG LED TV 42 inch': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Bring your content to life on the LG LED TV 42 inch. This TV combines exceptional speed and stunning visuals."
      },
      specifications: {
        title: "Specifications",
        content: "42-inch LED display, 1920x1080 resolution, HDMI port, USB port, webOS smart platform."
      }
    },
    'Sony Bravia LED TV 42 inch': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience Sony's reliability with the Sony Bravia LED TV 42 inch. This TV makes you feel like a Pro."
      },
      specifications: {
        title: "Specifications",
        content: "42-inch LED display, 1920x1080 resolution, HDMI port, USB port, Android TV smart platform."
      }
    },
    'Philips LED TV 42 inch': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Transform your living space with the Philips LED TV 42 inch. This TV combines enhanced performance and excellent quality."
      },
      specifications: {
        title: "Specifications",
        content: "42-inch LED display, 1920x1080 resolution, HDMI port, USB port, Saphi smart platform."
      }
    },
    'Toshiba LED TV 42 inch': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Embrace the convenience with the Toshiba LED TV 42 inch. This TV features multiple input options, allowing you to connect all your devices. "
      },
      specifications: {
        title: "Specifications",
        content: "42-inch LED display, 1920x1080 resolution, HDMI port, USB port, Fire TV smart platform."
      }
    },
    'Air Conditioner Samsung 1.5 Ton': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Stay cool and calm with the Air Conditioner Samsung 1.5 Ton. This air conditioner includes smart cooling technology and excellent portability."
      },
      specifications: {
        title: "Specifications",
        content: "1.5 Ton capacity, Inverter technology, Smart cooling mode, Sleep mode, Remote control."
      }
    },
    'Air Conditioner LG 1.5 Ton': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Transform your experience with the Air Conditioner LG 1.5 Ton. This air conditioner includes smart cooling technology and excellent portability."
      },
      specifications: {
        title: "Specifications",
        content: "1.5 Ton capacity, Inverter technology, Dual Inverter Compressor, AI Cool mode, Remote control."
      }
    },
    'Air Conditioner Daikin 1.5 Ton': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience reliability with the Air Conditioner Daikin 1.5 Ton. This air conditioner includes smart cooling technology and excellent portability."
      },
      specifications: {
        title: "Specifications",
        content: "1.5 Ton capacity, Inverter technology, Neo Swing Compressor, Power Chill operation, Remote control."
      }
    },
    'Air Conditioner Panasonic 1.5 Ton': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "This Panasonic Air conditioner includes smart cooling technology and excellent portability. Its energy effeciency is amazing."
      },
      specifications: {
        title: "Specifications",
        content: "1.5 Ton capacity, Inverter technology, ECONAVI, iAuto-X, Remote control."
      }
    },
    'Air Conditioner Mitsubishi 1.5 Ton': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Enhance your cooling experience with the Air Conditioner Mitsubishi 1.5 Ton. This air conditioner includes smart cooling technology and excellent portability."
      },
      specifications: {
        title: "Specifications",
        content: "1.5 Ton capacity, Inverter technology, Dual Barrier Coating, Plasma Clean filter, Remote control."
      },
    },
    'Canon EOS 1500D Digital Camera': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Capture your world with the Canon EOS 1500D Digital Camera. This DSLR camera delivers high quality images."
      },
      specifications: {
        title: "Specifications",
        content: "24.1MP APS-C CMOS sensor, DIGIC 4+ processor, 9-point autofocus, Full HD video recording, Wi-Fi connectivity."
      }
    },
    'Nikon D3500 Digital Camera': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience Nikon's world with the Nikon D3500 Digital Camera. This DSLR camera gives you all you need in its hand."
      },
      specifications: {
        title: "Specifications",
        content: "24.2MP DX-Format CMOS sensor, EXPEED 4 processor, 11-point autofocus, Full HD video recording, Guide Mode."
      }
    },
    'Sony Alpha a6000 Digital Camera': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Shoot like a pro with the Sony Alpha a6000 Digital Camera. This DSLR camera comes with state of the art features for best quality photos."
      },
      specifications: {
        title: "Specifications",
        content: "24.3MP APS-C CMOS sensor, BIONZ X processor, 179-point autofocus, Full HD video recording, Wi-Fi/NFC connectivity."
      }
    },
    'Fujifilm X-T200 Digital Camera': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Enter the world of film with the Fujifilm X-T200 Digital Camera. This DSLR camera combines the classical film look with new technology."
      },
      specifications: {
        title: "Specifications",
        content: "24.2MP APS-C CMOS sensor, UHD 4K video recording, 3.5-inch touchscreen LCD, Face/Eye detection AF, Film Simulation modes."
      }
    },
    'Panasonic Lumix G7 Digital Camera': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Shoot and record with the Panasonic Lumix G7 Digital Camera. This DSLR camera comes with video recording and picture mode. Great for every occasion."
      },
      specifications: {
        title: "Specifications",
        content: "16MP Live MOS sensor, Venus Engine 9 processor, 4K UHD video recording, 4K Photo mode, 3-inch touchscreen LCD."
      }
    },
    'Samsung Smart Washing Machine': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience smarter laundry days with the Samsung Smart Washing Machine. This washing machine connects to Samsung smart things so you can save time and track your progress."
      },
      specifications: {
        title: "Specifications",
        content: "9.0 kg capacity, Inverter motor, EcoBubble technology, AddWash door, SmartThings App support."
      }
    },
    'LG Smart Washing Machine': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Make laundry easy with the LG Smart Washing Machine. This washing machine connects to LG smart things so you can save time and track your progress."
      },
      specifications: {
        title: "Specifications",
        content: "10.5 kg capacity, AI Direct Drive, TurboWash™360°, Steam™ technology, SmartThinQ App support."
      }
    },
    'Bosch Smart Washing Machine': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "The Bosch Smart Washing Machine is great for easy laundry days. This washing machine connects to Bosch smart things so you can save time and track your progress."
      },
      specifications: {
        title: "Specifications",
        content: "9.0 kg capacity, EcoSilence Drive™, ActiveWater Plus, AntiVibration Design, Home Connect App support."
      }
    },
    'JBL Bluetooth Speaker': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Immerse yourself in high-quality audio with the JBL Bluetooth Speaker. This speaker comes with an aux input so you can play your music and enjoy the music."
      },
      specifications: {
        title: "Specifications",
        content: "Bluetooth 5.0, 10 hours battery life, IPX7 waterproof, Built-in microphone, Compact and portable design."
      }
    },
    'Sony Bluetooth Speaker': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Get immersed with this Sony Bluetooth Speaker. Sony brings you audio quality and a classic experience to enjoy to the fullest."
      },
      specifications: {
        title: "Specifications",
        content: "Bluetooth 5.0, 12 hours battery life, Extra Bass, Speakerphone function, Compact design."
      }
    },
    'Bose Bluetooth Speaker': {
      description: {
        title: "Product Description",
        content: "This Bose Bluetooth Speaker brings quality audio with clear crystal lows and perfect highs. There are multiple options for EQ which you can change to fit you best!"
      },
      specifications: {
        title: "Specifications",
        content: "Bluetooth 5.1, 12 hours battery life, Voice control, SimpleSync technology, Premium design."
      }
    },
    'Summer Dress Floral': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "The Summer Dress Floral dress is perfect for going to the beach or going out! With its quality material and colorful design you cant go wrong."
      },
      specifications: {
        title: "Specifications",
        content: "Material: Cotton, Sizes: S, M, L, XL, Colors: Floral print, Care instructions: Machine wash cold."
      }
    },
    'Summer Dress Striped': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "With the new Summer Dress Striped collection, bring your summer look to a whole new level with the amazing colorful design and high quality material!"
      },
      specifications: {
        title: "Specifications",
        content: "Material: Rayon, Sizes: XS, S, M, L, Colors: Striped pattern, Care instructions: Hand wash only."
      }
    },
    'Summer Dress Polka Dots': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Bring your summer to life with the Summer Dress Polka Dots collection! The summer dress is great and made from quality materials that can withstand the water!"
      },
      specifications: {
        title: "Specifications",
        content: "Material: Linen, Sizes: S, M, L, XL, Colors: Polka dot pattern, Care instructions: Dry clean only."
      }
    },
    'Gucci Leather Handbag': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "The Gucci Leather Handbag will bring your fit to another level with its smooth leather and elegant design. It's perfect for all types of summer occasions."
      },
      specifications: {
        title: "Specifications",
        content: "Material: Genuine leather, Dimensions: 12 x 8 x 4 inches, Closure: Zipper, Interior pockets: 2, Exterior pocket: 1."
      }
    },
    'Prada Leather Handbag': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Bring out your persona with the Prada Leather Handbag, which is the perfect accessory for any occasion. This bag is very stylish and comes in many different designs that look amazing!"
      },
      specifications: {
        title: "Specifications",
        content: "Material: Saffiano leather, Dimensions: 10 x 7 x 3 inches, Closure: Snap, Interior pockets: 3, Shoulder strap: Adjustable."
      }
    },
    'Louis Vuitton Leather Handbag': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "This Louis Vuitton Leather Handbag brings your look out of its shell. Perfect bag for any occasion with its high quality material."
      },
      specifications: {
        title: "Specifications",
        content: "Material: Monogram canvas, Dimensions: 11 x 8 x 5 inches, Closure: Drawstring, Interior pockets: 1, Handle drop: 9 inches."
      }
    },
    'Mens Casual Shirt - Blue': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Bring in a new look with Mens Casual Shirt - Blue! You can never go wrong with blue on any occasion."
      },
      specifications: {
        title: "Specifications",
        content: "Material: Cotton, Sizes: S, M, L, XL, Fit: Slim fit, Sleeve length: Short sleeve."
      }
    },
    'Mens Casual Shirt - Red': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Be a boss with the Mens Casual Shirt - Red. You can never go wrong with Red to catch someones eye!"
      },
      specifications: {
        title: "Specifications",
        content: "Material: Linen, Sizes: S, M, L, XL, Fit: Regular fit, Sleeve length: Long sleeve."
      }
    },
    'Mens Casual Shirt - Green': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Stand out with the Mens Casual Shirt - Green collection. The green collection is amazing and perfect for business meetings and gatherings!"
      },
      specifications: {
        title: "Specifications",
        content: "Material: Cotton blend, Sizes: S, M, L, XL, Fit: Modern fit, Sleeve length: Short sleeve."
      }
    },
    'Womens Heels - Black': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Find your unique style with Womens Heels - Black. The black heel fits perfectly with all kinds of clothes for parties or gatherings."
      },
      specifications: {
        title: "Specifications",
        content: "Material: Leather, Heel height: 4 inches, Sizes: 5-10, Closure: Buckle, Style: Stiletto."
      }
    },
    'Womens Heels - Red': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Turn heads with Womens Heels - Red. There is never any wrong when it comes to the color red on any type of clothing."
      },
      specifications: {
        title: "Specifications",
        content: "Material: Suede, Heel height: 3.5 inches, Sizes: 5-10, Closure: Slip-on, Style: Pumps."
      }
    },
    'Mens Formal Shoes - Black Leather': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Be a gentleman with the Mens Formal Shoes - Black Leather. You can never go wrong with black in the business world."
      },
      specifications: {
        title: "Specifications",
        content: "Material: Genuine leather, Sizes: 7-12, Style: Oxford, Closure: Lace-up, Color: Black."
      }
    },
    'Mens Formal Shoes - Brown Leather': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Be down to earth with Mens Formal Shoes - Brown Leather. The brown look goes well and makes a great addition to your closet."
      },
      specifications: {
        title: "Specifications",
        content: "Material: Genuine leather, Sizes: 7-12, Style: Loafer, Closure: Slip-on, Color: Brown."
      }
    },
    'Mens Formal Shoes - Oxford Style': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "You can look clean and put together with Mens Formal Shoes - Oxford Style, which is great to stand out."
      },
      specifications: {
        title: "Specifications",
        content: "Material: Patent leather, Sizes: 7-12, Style: Oxford, Closure: Lace-up, Color: Black."
      }
    },
    'Kids Winter Jacket - Blue': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Let your kids explore the outdoors with Kids Winter Jacket - Blue! The thick quality design keeps them comfortable while looking great."
      },
      specifications: {
        title: "Specifications",
        content: "Material: Polyester, Sizes: 4-16, Closure: Zipper, Hood: Detachable, Color: Blue."
      }
    },
    'Kids Winter Jacket - Red': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "The Kids Winter Jacket - Red is a necessity for your kids for the winter with its waterproof quality to the thick high quality design!"
      },
      specifications: {
        title: "Specifications",
        content: "Material: Nylon, Sizes: 4-16, Closure: Zipper, Hood: Attached, Color: Red."
      }
    },
    'Kids Winter Jacket - Green': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "The Kids Winter Jacket - Green is a great addition for your child this winter season with its waterproof design!"
      },
      specifications: {
        title: "Specifications",
        content: "Material: Fleece, Sizes: 4-16, Closure: Snap button, Hood: Attached, Color: Green."
      }
    },
    'Mens Wallet - Black Leather': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Classy and sophisticated Mens Wallet - Black Leather keeps all your essentials organized!"
      },
      specifications: {
        title: "Specifications",
        content: "Material: Genuine leather, Dimensions: 4.5 x 3.5 inches, Card slots: 8, Bill compartment: 1, Color: Black."
      }
    },
    'Mens Wallet - Brown Leather': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "The Mens Wallet - Brown Leather goes well with any outfit and is a great addition to your pocket."
      },
      specifications: {
        title: "Specifications",
        content: "Material: Genuine leather, Dimensions: 4 x 3 inches, Card slots: 6, Bill compartment: 1, Color: Brown."
      }
    },
    'Mens Wallet - Slim Fit': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "The Mens Wallet - Slim Fit ensures all your money can fit while looking small and sleek."
      },
      specifications: {
        title: "Specifications",
        content: "Material: Faux leather, Dimensions: 4 x 3 inches, Card slots: 4, Bill compartment: 1, Color: Black."
      }
    },
    'Tide Laundry Detergent': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "The Tide Laundry Detergent keeps your clothes smelling amazing with the stain protection that keeps your fit smelling the best!"
      },
      specifications: {
        title: "Specifications",
        content: "Volume: 150 oz, Scent: Original, Formula: Liquid, Machine type: HE, Loads: 96."
      }
    },
    'Ariel Laundry Detergent': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "The Ariel Laundry Detergent will help your clothes keep their texture and color with its effective stain removal formula!"
      },
      specifications: {
        title: "Specifications",
        content: "Weight: 8 lbs, Scent: Fresh, Formula: Powder, Machine type: Top load, Loads: 100."
      }
    },
    'Huggies Baby Diapers Pack': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Your baby deserves the best which can happen with the Huggies Baby Diapers Pack! These diapers are soft, strong, and prevent any messes."
      },
      specifications: {
        title: "Specifications",
        content: "Size: Newborn, Quantity: 84 diapers, Weight range: Up to 10 lbs, Feature: GentleAbsorb Liner, Hypoallergenic."
      }
    },
    'Pampers Baby Diapers Pack': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Give your baby the best and make a smart desicion with the Pampers Baby Diapers Pack! The diaper has enhanced water absorption to help with the biggest messes!"
      },
      specifications: {
        title: "Specifications",
        content: "Size: Size 1, Quantity: 192 diapers, Weight range: 8-14 lbs, Feature: Swaddlers, Breathable."
      }
    },
    'Paper Towels 6-pack': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "The new and improved Paper Towels 6-pack come super absorbent and are great for any and all occasions!"
      },
      specifications: {
        title: "Specifications",
        content: "Quantity: 6 rolls, Ply: 2-ply, Sheet count: 140 sheets per roll, Material: Paper, Absorbency: High."
      }
    },
    'Cola 2L': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "There is never a wrong time to drink the Cola 2L, which keeps the thirst away and brings the party to life!"
      },
      specifications: {
        title: "Specifications",
        content: "Volume: 2 liters, Flavor: Cola, Calories: 100 per serving, Sugar content: High, Packaging: Bottle."
      }
    },
    'Organic Pasta - Spaghetti': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "The Organic Pasta - Spaghetti is great for all types of occasions with its rich natural flavor from organic farms."
      },
      specifications: {
        title: "Specifications",
        content: "Weight: 16 oz, Type: Spaghetti, Ingredients: Organic durum wheat, Cooking time: 9-11 minutes, Certification: USDA Organic."
      }
    },
    'Organic Pasta - Penne': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "The new Organic Pasta - Penne is natural and contains all of the nutrients and flavor that you can use for all occasions!"
      },
      specifications: {
        title: "Specifications",
        content: "Weight: 16 oz, Type: Penne, Ingredients: Organic durum wheat, Cooking time: 10-12 minutes, Certification: USDA Organic."
      }
    },
    'Organic Pasta - Fusilli': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Get your meal on the table today and get the Organic Pasta - Fusilli which is great for all types of recipes while containing all the natural organic flavor!"
      },
      specifications: {
        title: "Specifications",
        content: "Weight: 16 oz, Type: Fusilli, Ingredients: Organic durum wheat, Cooking time: 8-10 minutes, Certification: USDA Organic."
      }
    },
    'Dog Food 10kg': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Your dog deserves the best, which can happen with the Dog Food 10kg! The 10kg of food can last months while offering premium nutrients that keep your dog the happiest!"
      },
      specifications: {
        title: "Specifications",
        content: "Weight: 10 kg, Breed size: All breeds, Life stage: Adult, Main ingredient: Chicken, Features: Grain-free."
      }
    },
    'Air Freshener - Lavender': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Lavender can bring ease of mind, which is why Air Freshener - Lavender is perfect for your home to be cleaned with the scent of pure heaven."
      },
      specifications: {
        title: "Specifications",
        content: "Scent: Lavender, Volume: 8 oz, Type: Spray, Longevity: Up to 60 days, Use: Home or office."
      }
    },
    'Air Freshener - Citrus': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Keep your home smelling brand new with Air Freshener - Citrus! The citrus can bring the best of all worlds and keep your home smelling the best!"
      },
      specifications: {
        title: "Specifications",
        content: "Scent: Citrus, Volume: 8 oz, Type: Spray, Longevity: Up to 60 days, Use: Home or office."
      }
    },
    'Tablet Pro 10.5 - Silver Edition': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience a new look with the Tablet Pro 10.5 - Silver Edition! With its lightweight and premium design you cant go wrong for any and all occasions."
      },
      specifications: {
        title: "Specifications",
        content: "Display size: 10.5 inches, Storage: 64GB, RAM: 4GB, Operating system: Android, Color: Silver."
      }
    },
    'Tablet Pro 10.5 - Gold Edition': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Bring gold to a whole new level with the Tablet Pro 10.5 - Gold Edition. This sleek tablet looks and feels premium."
      },
      specifications: {
        title: "Specifications",
        content: "Display size: 10.5 inches, Storage: 64GB, RAM: 4GB, Operating system: Android, Color: Gold."
      }
    },
    'Tablet Pro 10.5 - Space Gray': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "A sleek modern look with the Tablet Pro 10.5 - Space Gray! This tablet has a unique grey color that looks and feels great!"
      },
      specifications: {
        title: "Specifications",
        content: "Display size: 10.5 inches, Storage: 64GB, RAM: 4GB, Operating system: Android, Color: Space Gray."
      }
    },
    'Tablet Pro 10.5 - Rose Gold': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Express your style and grace with the Tablet Pro 10.5 - Rose Gold! This tablet is great for any type of occasion and blends with all types of styles."
      },
      specifications: {
        title: "Specifications",
        content: "Display size: 10.5 inches, Storage: 64GB, RAM: 4GB, Operating system: Android, Color: Rose Gold."
      }
    },
    'Home Projector': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Transform your home into a cinematic experience with the Home Projector. Its HD display allows you to watch movies."
      }
    },
    'Smartphone Case': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Bring the best of your phone with the Smartphone Case! Great and lightweight, you will not even feel the difference with the extra protection it brings."
      }
    },
    '4K Ultra HD TV 55 inch': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Transform your whole living room with the 4K Ultra HD TV 55 inch! With HDR its picture quality allows for the best and vivid colors."
      }
    },
    'Energy Efficient Heater': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Stay warm while saving money with the Energy Efficient Heater! Its high quality design allows for you to keep the heat while minimizing costs!"
      }
    },
    'Professional DSLR Camera': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "With Professional DSLR Camera you will be taking the highest quality photos while being able to record videos!"
      }
    },
    'Smart Refrigerator': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Connect your home and life with the Smart Refrigerator! You will be able to view all kinds of food."
      }
    },
    'Noise-Canceling Headphones': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Focus on the greatest songs in the world with Noise-Canceling Headphones! You will be able to listen for days."
      }
    },
    'Wireless Keyboard - Logitech K380': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience seamless typing across multiple devices with the Logitech K380 Multi-Device Bluetooth Keyboard. This compact and portable keyboard connects wirelessly to your computer, tablet, and smartphone, allowing you to switch between devices with the touch of a button. Its comfortable keys and long battery life make it ideal for home, work, or on-the-go productivity."
      }
    },
    'Wireless Keyboard - Apple Magic Keyboard': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Unlock a superior typing experience with the Apple Magic Keyboard. This sleek and minimalist keyboard connects wirelessly to your Mac, iPad, or iPhone, providing a comfortable and responsive typing experience. Its rechargeable battery and automatic pairing make it a seamless addition to your Apple ecosystem."
      }
    },
    'Wireless Keyboard - Microsoft Surface Keyboard': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience comfortable and precise typing with the Microsoft Surface Keyboard. This wireless keyboard features a slim and elegant design, responsive keys, and a long battery life. Perfect for home or office use, the Surface Keyboard enhances your productivity and adds a touch of style to your workspace."
      }
    },
    'Wireless Keyboard - Razer BlackWidow V3': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Dominate the battlefield with the Razer BlackWidow V3. This mechanical gaming keyboard features Razer's signature mechanical switches for tactile feedback and lightning-fast response times. Its customizable RGB lighting, durable construction, and programmable keys provide a competitive edge for gamers."
      }
    },
    'Wireless Keyboard - Corsair K83': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience versatile control with the Corsair K83 Wireless Entertainment Keyboard. This keyboard combines a compact design, comfortable keys, and a built-in touchpad for seamless navigation. Its Bluetooth connectivity and long battery life make it perfect for home theater enthusiasts and media streamers."
      }
    },
    'Wireless Keyboard - Logitech MX Keys': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience premium typing comfort with the Logitech MX Keys. This wireless keyboard features a sleek and minimalist design, comfortable keys, and smart backlighting that adjusts to your environment. Its multi-device connectivity and long battery life make it perfect for professionals seeking a superior typing experience."
      }
    },
    'Wireless Keyboard - SteelSeries Apex Pro': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience revolutionary performance with the SteelSeries Apex Pro. This mechanical gaming keyboard features adjustable mechanical switches for customizable key sensitivity. Its OLED smart display, customizable RGB lighting, and durable construction provide a competitive edge for gamers."
      }
    },
    'Wireless Keyboard - Keychron K6': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience versatile typing with the Keychron K6. This keyboard features wireless or wired connectivity for use with any device, and with its high quality design. Great for any occasion. "
      }
    },
    'Bluetooth Earbuds - Bose SoundSport': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience premium wireless audio with the Bose SoundSport Wireless Earbuds. These earbuds feature a comfortable and secure fit, sweat and weather resistance, and high-quality sound for workouts and everyday use."
      }
    },
    'Bluetooth Earbuds - Sony WF-1000XM3': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience industry-leading noise cancellation with the Sony WF-1000XM3 Wireless Earbuds. These earbuds feature a comfortable and secure fit, high-quality sound, and long battery life for immersive listening on the go."
      }
    },
    'Bluetooth Earbuds - Apple AirPods Pro': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience magical audio with the Apple AirPods Pro. These wireless earbuds feature active noise cancellation, adaptive EQ, and a customizable fit for immersive listening and all-day comfort. Seamlessly connect to your Apple devices and enjoy high-quality audio wherever you go."
      }
    },
    'Bluetooth Earbuds - Jabra Elite 75t': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience superior sound and comfort with the Jabra Elite 75t Wireless Earbuds. These earbuds feature a compact and ergonomic design, active noise cancellation, and long battery life for immersive listening on the go. Enjoy clear calls and powerful bass with the Jabra Elite 75t."
      }
    },
    'Bluetooth Earbuds - Samsung Galaxy Buds+': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Experience long-lasting power and immersive audio with the Samsung Galaxy Buds+. These wireless earbuds feature a comfortable fit, AKG-tuned sound, and up to 22 hours of battery life. Perfect for music lovers and busy professionals, the Galaxy Buds+ offer exceptional value and performance."
      }
    },
    'Portable Power Bank - Anker PowerCore 10000': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Stay powered up on the go with the Anker PowerCore 10000 Portable Charger. This compact and lightweight power bank delivers high-speed charging for your smartphone, tablet, and other USB devices. Perfect for travel, commutes, and outdoor adventures, the PowerCore 10000 ensures you never run out of battery."
      }
    },
    'Portable Power Bank - RAVPower 20000mAh': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Keep your devices powered up for days with the RAVPower 20000mAh Portable Charger. This high-capacity power bank delivers multiple charges for your smartphone, tablet, and other USB devices. Featuring fast charging technology and multiple USB ports, the RAVPower 20000mAh is perfect for long trips, camping, and power outages."
      }
    },
    'Portable Power Bank - Aukey 10000mAh': {
      description: {
        ...productDescriptions.defaultDescriptionTitle,
        content: "Never run out of battery on the go with the Aukey 10000mAh Portable Charger. This compact and lightweight power bank delivers fast and reliable charging for your smartphone, tablet",
      }
    },
      'Compact Microwave Oven': {
      description: {
        title: productDescriptions.defaultDescriptionTitle.title,
        content: "Enjoy quick and convenient cooking with the Compact Microwave Oven. Its compact size fits easily on any countertop, while its multiple power levels and defrost settings make it perfect for reheating leftovers, cooking frozen meals, and more. A must-have for small kitchens and busy lifestyles."
        }
      },
    'Digital Alarm Clock': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Wake up refreshed with the Digital Alarm Clock. This clock features a clear LED display, adjustable brightness, and a snooze function for those extra minutes of sleep. Perfect for bedrooms, dorm rooms, and travel, the Digital Alarm Clock ensures you never miss an important appointment."
    }
  },
  'Home Security Camera': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Protect your home with the Home Security Camera. This camera features high-definition video recording, motion detection, and night vision for comprehensive surveillance. Access live footage from your smartphone or tablet and receive alerts when motion is detected. Keep your home safe and secure with the Home Security Camera."
    }
  },
  'Fitness Smartwatch - Garmin Forerunner 45': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Track your fitness goals with the Garmin Forerunner 45. This smartwatch features GPS tracking, heart rate monitoring, and personalized training plans for runners and fitness enthusiasts. Monitor your progress, set goals, and stay motivated with the Garmin Forerunner 45."
    }
  },
  'Fitness Smartwatch - Fitbit Charge 4': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Take control of your health with the Fitbit Charge 4. This fitness tracker features GPS tracking, heart rate monitoring, and sleep tracking for comprehensive health insights. Track your activity levels, set goals, and stay motivated with the Fitbit Charge 4."
    }
  },
  'Fitness Smartwatch - Apple Watch Series 6': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Experience the future of fitness with the Apple Watch Series 6. This smartwatch features GPS tracking, heart rate monitoring, blood oxygen monitoring, and an always-on Retina display. Track your activity levels, monitor your health, and stay connected with the Apple Watch Series 6."
    }
  },
  'Electric Kettle': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Boil water quickly and easily with the Electric Kettle. This kettle features a powerful heating element, automatic shutoff, and a durable design. Perfect for making tea, coffee, and instant meals, the Electric Kettle is a convenient addition to any kitchen."
    }
  },
  'WiFi Router': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Stay connected with the WiFi Router. This router features fast and reliable wireless connectivity, multiple Ethernet ports, and easy setup. Perfect for homes and small offices, the WiFi Router delivers seamless internet access for all your devices."
    }
  },
  'Electric Shaver': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Achieve a smooth and comfortable shave with the Electric Shaver. This shaver features sharp blades, a flexible head, and a long-lasting battery. Perfect for daily grooming, the Electric Shaver delivers a clean and close shave with ease."
    }
  },
  'Laptop Cooling Pad': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Protect your laptop from overheating with the Laptop Cooling Pad. This pad features multiple fans, adjustable height settings, and a USB power connection. Perfect for gamers, students, and professionals, the Laptop Cooling Pad keeps your laptop running cool and efficient."
    }
  },
  'All-in-One Printer': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Streamline your printing tasks with the All-in-One Printer. This printer features printing, scanning, and copying capabilities, wireless connectivity, and mobile printing support. Perfect for home or small office use, the All-in-One Printer delivers reliable performance and exceptional value."
    }
  },
  'VR Headset': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Experience virtual reality with the VR Headset. This headset features high-resolution displays, built-in headphones, and motion tracking for immersive gaming and entertainment. Explore new worlds and experience the future of entertainment with the VR Headset."
    }
  },
  'Electric Rice Cooker': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Cook perfect rice every time with the Electric Rice Cooker. This cooker features automatic cooking settings, a non-stick pot, and a keep-warm function. Perfect for busy families and rice lovers, the Electric Rice Cooker makes meal preparation quick and easy."
    }
  },
  'Electric Toothbrush': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Achieve a healthier smile with the Electric Toothbrush. This toothbrush features multiple brushing modes, a built-in timer, and a pressure sensor for optimal oral care. Improve your dental hygiene and achieve a brighter smile with the Electric Toothbrush."
    }
  },
  'HDMI Cable 2m': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Connect your devices with the HDMI Cable 2m. This high-quality cable delivers crystal-clear audio and video signals for an immersive entertainment experience. Perfect for connecting TVs, Blu-ray players, gaming consoles, and more, the HDMI Cable ensures a reliable and high-performance connection."
    }
  },
  'Graphics Card 8GB - NVIDIA GeForce RTX 3080': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Unleash the ultimate in gaming performance with the NVIDIA GeForce RTX 3080 8GB graphics card. Powered by NVIDIA's Ampere architecture, this graphics card delivers exceptional speed, stunning visuals, and advanced features like ray tracing and DLSS. Experience the next generation of gaming with the RTX 3080."
    }
  },
  'Graphics Card 8GB - AMD Radeon RX 6800': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Experience high-performance gaming with the AMD Radeon RX 6800 8GB graphics card. Built on AMD's RDNA 2 architecture, this graphics card delivers exceptional speed, stunning visuals, and advanced features like ray tracing and Smart Access Memory. Take your gaming to the next level with the RX 6800."
    },
    specifications: {
      title: "Specifications",
      content: "Memory: 8GB GDDR6, Architecture: AMD RDNA 2, Boost Clock: Up to 2105 MHz, Ports: HDMI, DisplayPort."
    }
  },
  'Graphics Card 8GB - NVIDIA GeForce GTX 1070': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Experience enhanced gaming with the NVIDIA GeForce GTX 1070 8GB graphics card. Powered by NVIDIA's Pascal architecture, this graphics card delivers smooth and immersive gameplay in modern titles. Its efficient design, advanced features, and affordable price make it a great choice for budget-conscious gamers."
    },
    specifications: {
      title: "Specifications",
      content: "Memory: 8GB GDDR5, Architecture: NVIDIA Pascal, Boost Clock: Up to 1683 MHz, Ports: HDMI, DisplayPort, DVI."
    }
  },
  'Graphics Card 8GB - AMD Radeon RX 5700 XT': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Step up your gaming performance with the AMD Radeon RX 5700 XT 8GB graphics card. Built on AMD's RDNA architecture, this graphics card delivers high frame rates, stunning visuals, and advanced features like FidelityFX. Enjoy smooth and immersive gameplay in the latest titles with the RX 5700 XT."
    },
    specifications: {
      title: "Specifications",
      content: "Memory: 8GB GDDR6, Architecture: AMD RDNA, Boost Clock: Up to 1905 MHz, Ports: HDMI, DisplayPort."
    }
  },
  'Graphics Card 8GB - NVIDIA GeForce RTX 2070': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Experience the power of ray tracing with the NVIDIA GeForce RTX 2070 8GB graphics card. Powered by NVIDIA's Turing architecture, this graphics card delivers exceptional performance, stunning visuals, and advanced features like DLSS and ray tracing. Enjoy the next generation of gaming with the RTX 2070."
    },
    specifications: {
      title: "Specifications",
      content: "Memory: 8GB GDDR6, Architecture: NVIDIA Turing, Boost Clock: Up to 1710 MHz, Ports: HDMI, DisplayPort, USB-C."
    }
  },
  'Graphics Card 8GB - AMD Radeon RX 6700 XT': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Experience high-performance gaming with the AMD Radeon RX 6700 XT 8GB graphics card. Built on AMD's RDNA 2 architecture, this graphics card delivers high frame rates, stunning visuals, and advanced features like ray tracing and Smart Access Memory. Take your gaming to the next level with the RX 6700 XT."
    },
    specifications: {
      title: "Specifications",
      content: "Memory: 12GB GDDR6, Architecture: AMD RDNA 2, Boost Clock: Up to 2581 MHz, Ports: HDMI, DisplayPort."
    }
  },
  'USB Flash Drive 128GB': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Store and transfer your files with the USB Flash Drive 128GB. This compact and portable flash drive delivers fast data transfer speeds and ample storage capacity for your photos, videos, documents, and more. A must-have for students, professionals, and anyone on the go."
    },
    specifications: {
      title: "Specifications",
      content: "Capacity: 128GB, Interface: USB 3.0, Read speed: Up to 100 MB/s, Write speed: Up to 30 MB/s, Form factor: Compact."
    }
  },
  'External Hard Drive 1TB': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Back up your data and expand your storage with the External Hard Drive 1TB. This portable hard drive delivers fast data transfer speeds and ample storage capacity for your photos, videos, documents, and more. Perfect for home, office, and travel, the External Hard Drive ensures your data is safe and secure."
    },
    specifications: {
      title: "Specifications",
      content: "Capacity: 1TB, Interface: USB 3.0, Read speed: Up to 120 MB/s, Write speed: Up to 100 MB/s, Form factor: Portable."
    }
  },
  'Electric Fan': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Stay cool and comfortable with the Electric Fan. This fan features multiple speed settings, adjustable tilt, and a quiet operation. Perfect for homes, offices, and dorm rooms, the Electric Fan provides refreshing air circulation in any space."
    },
    specifications: {
      title: "Specifications",
      content: "Type: Tower fan, Speed settings: 3, Height: 36 inches, Oscillation: Yes, Remote control: Yes."
    }
  },
  'Portable Bluetooth Speaker': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Enjoy music on the go with the Portable Bluetooth Speaker. This speaker features wireless connectivity, long battery life, and high-quality sound. Perfect for outdoor adventures, picnics, and parties, the Portable Bluetooth Speaker delivers immersive audio wherever you go."
    },
    specifications: {
      title: "Specifications",
      content: "Connectivity: Bluetooth 5.0, Battery life: Up to 12 hours, Water resistance: IPX7, Driver size: 40mm, Power output: 10W."
    }
  },
  'Home Theater System': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Transform your living room into a home theater with the Home Theater System. This system features a powerful receiver, surround sound speakers, and a subwoofer for immersive audio. Enjoy a cinematic experience with the Home Theater System."
    },
    specifications: {
      title: "Specifications",
      content: "Channels: 5.1, Receiver power: 100W per channel, Speakers: 5 satellite speakers, Subwoofer: 10-inch, Connectivity: HDMI, Bluetooth."
    }
  },
  'Womens Blouse - Floral Print': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Add a touch of style to your outfit with the Womens Blouse - Floral Print. This stylish blouse features a vibrant floral print, lightweight fabric, and a comfortable fit. Perfect for spring and summer, the Womens Blouse - Floral Print adds a touch of elegance to any wardrobe."
    },
    specifications: {
      title: "Specifications",
      content: "Material: 100% Cotton, Sizes: S, M, L, XL, Sleeve Length: Short, Neckline: Round."
    }
  },
  'Womens Blouse - Polka Dot': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Step in the past with the Womens Blouse - Polka Dot, its a classic."
    },
    specifications: {
      title: "Specifications",
      content: "Material: 100% Polyester, Sizes: S, M, L, XL, Sleeve Length: Long, Neckline: V-neck."
    }
  },
  'Womens Blouse - Striped': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "With the Womens Blouse - Striped its a statement!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Rayon blend, Sizes: S, M, L, XL, Sleeve Length: 3/4, Neckline: Boat neck."
    }
  },
  'Womens Blouse - Solid Color': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "With Womens Blouse - Solid Color you can not go wrong with the classy look!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Silk, Sizes: S, M, L, XL, Sleeve Length: Sleeveless, Neckline: Cowl neck."
    }
  },
  'Evening Clutch Bag': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "The Evening Clutch Bag will be there for you on special nights, making you feel special"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Satin, Dimensions: 8 x 4 x 2 inches, Closure: Clasp, Strap: Chain, Embellishment: Rhinestones."
    }
  },
  'Mens Denim Jacket': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "The Mens Denim Jacket is for the man who knows and likes to look fresh!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Denim, Sizes: S, M, L, XL, Fit: Regular, Closure: Button, Pockets: 4."
    }
  },
  'Womens Flats': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Perfect for walking around with or anything the new Women's Flats will make any and all occasion better!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Leather, Sizes: 5-10, Style: Ballet flats, Toe shape: Round, Closure: Slip-on."
    }
  },
  'Mens Sports Shoes - Nike Air Max': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Get ready for working out or going out with the new  Mens Sports Shoes - Nike Air Max!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Mesh, Sizes: 7-13, Technology: Air Max, Closure: Lace-up, Cushioning: Max Air unit."
    }
  },
  'Mens Sports Shoes - Adidas Ultraboost': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "If you have arch support problems the Mens Sports Shoes - Adidas Ultraboost can assist with that due to its sole."
    },
    specifications: {
      title: "Specifications",
      content: "Material: Primeknit, Sizes: 7-13, Technology: Boost, Closure: Lace-up, Cushioning: Boost midsole."
    }
  },
  'Mens Sports Shoes - Puma RS-X': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "You can stay running and be comfortable with Mens Sports Shoes - Puma RS-X! This is perfect for getting your summer body out there."
    },
    specifications: {
      title: "Specifications",
      content: "Material: Leather, Sizes: 7-13, Technology: RS, Closure: Lace-up, Cushioning: IMEVA midsole."
    }
  },
  'Mens Belt - Leather Black': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "The  Mens Belt - Leather Black makes any outfit be 10x better and put together!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Genuine leather, Width: 1.5 inches, Length: 30-44 inches, Buckle style: Classic, Color: Black."
    }
  },
  'Mens Belt - Leather Brown': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "With Mens Belt - Leather Brown the earth nature will resonate!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Genuine leather, Width: 1.5 inches, Length: 30-44 inches, Buckle style: Classic, Color: Brown."
    }
  },
  'Womens Skirt - A-Line': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Express yourself in another form with  Womens Skirt - A-Line!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Cotton, Sizes: XS, S, M, L, Length: Knee-length, Waist style: High-waisted, Pattern: Solid."
    }
  },
  'Womens Skirt - Pleated': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "If you want an elegant touch get the Womens Skirt - Pleated! Be who you wanna be!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Polyester, Sizes: XS, S, M, L, Length: Midi, Waist style: Elastic, Pattern: Solid."
    }
  },
  'Pearl Necklace': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Add a elegant touch with Pearl Necklace!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Cultured pearls, Pearl size: 8mm, Length: 18 inches, Clasp: Sterling silver, Strand count: Single."
    }
  },
  'Mens Polo T-shirt': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Look fresh while being comfortable with Mens Polo T-shirt! You will not regret."
    },
    specifications: {
      title: "Specifications",
      content: "Material: Pima cotton, Sizes: S, M, L, XL, Fit: Slim fit, Sleeve length: Short, Collar style: Polo."
    }
  },
  'Womens High Heels - Red Stiletto': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "When in doubt go with red, the Womens High Heels - Red Stiletto are a beauty"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Suede, Sizes: 5-10, Heel height: 4 inches, Style: Stiletto, Closure: Ankle strap."
    }
  },
  'Womens High Heels - Black Pumps': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "You can never go wrong with Black, so with Womens High Heels - Black Pumps make sure to look beautiful."
    },
    specifications: {
      title: "Specifications",
      content: "Material: Suede, Sizes: 5-10, Heel height: 4 inches, Style: Stiletto, Closure: Ankle strap."
    }
  },
  'Womens High Heels - Nude Wedge': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Perfect for the summer Womens High Heels - Nude Wedge can make your attire pop more with the natural tones!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Synthetic, Sizes: 5-10, Heel height: 2.5 inches, Style: Wedge, Closure: Buckle."
    }
  },
  'Mens Loafers': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Go around town comfortably with  Mens Loafers! Its high quality and comfortable."
    },
    specifications: {
      title: "Specifications",
      content: "Material: Leather, Sizes: 7-13, Style: Loafer, Closure: Slip-on, Color: Brown."
    }
  },
  'Kids Raincoat - Yellow': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Rain or shine let you child have fun with Kids Raincoat - Yellow. The new designs are amazing and durable."
    },
    specifications: {
      title: "Specifications",
      content: "Material: Polyester, Sizes: 4-12, Closure: Zipper, Hood: Attached, Color: Yellow."
    }
  },
  'Kids Raincoat - Blue': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Make your child the cutest with the  Kids Raincoat - Blue! Rain wont stop them with there bright colorful designs."
    },
    specifications: {
      title: "Specifications",
      content: "Material: Waterproof fabric, Sizes: 4-12, Closure: Snap buttons, Hood: Detachable, Color: Blue."
    }
  },
  'Womens Scarf': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Get your grandma a gift with the Women's Scarf!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Silk, Dimensions: 70 x 20 inches, Pattern: Floral, Fringe: Yes, Care: Hand wash."
    }
  },
  'Mens Jeans - Slim Fit': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Want a fit that snugs you while being comfortable get Mens Jeans - Slim Fit."
    },
    specifications: {
      title: "Specifications",
      content: "Material: Denim, Sizes: 28-40, Fit: Slim fit, Leg style: Tapered, Closure: Zipper fly."
    }
  },
  'Mens Jeans - Regular Fit': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "You cant never go wrong with the Mens Jeans - Regular Fit"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Denim, Sizes: 28-40, Fit: Regular fit, Leg style: Straight, Closure: Button fly."
    }
  },
  'Womens Sunglasses': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Keep your eyes protected with Women's Sunglasses, that bring you quality."
    },
    specifications: {
      title: "Specifications",
      content: "Frame material: Acetate, Lens material: Polycarbonate, UV protection: 100%, Shape: Cat-eye, Color: Black."
    }
  },
  'Mens Watch': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Keep track of time with Mens Watch which provides the best quality time!"
    },
    specifications: {
      title: "Specifications",
      content: "Movement: Quartz, Case material: Stainless steel, Band material: Leather, Dial color: Black, Water resistance: 50m."
    }
  },
  'Womens Hat - Sun Hat': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Protect yourself from the sun with Womens Hat - Sun Hat"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Straw, Size: One size fits all, Brim width: 5 inches, Crown style: Wide, Sun protection: UPF 50+."
    }
  },
  'Womens Hat - Beanie': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "With the best wool protect yourself with Womens Hat - Beanie"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Wool, Size: One size fits all, Style: Cable knit, Lining: Fleece, Color: Gray."
    }
  },
  'Kids Pajamas': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Make your kids have the best sleep ever with the new Kids Pajamas!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Cotton, Sizes: 2T-10, Fit: Snug, Pattern: Cartoon characters, Closure: Elastic waistband."
    }
  },
  'Womens Leather Jacket': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "With Womens Leather Jacket protect yourself while looking cool! Its worth its cost."
    },
    specifications: {
      title: "Specifications",
      content: "Material: Genuine leather, Sizes: XS-XL, Lining: Polyester, Style: Motorcycle, Closure: Zipper."
    }
  },
  'Mens Dress Pants': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "With Mens Dress Pants you will be professional!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Wool blend, Sizes: 28-40, Fit: Slim fit, Style: Flat front, Closure: Zipper hook-and-eye."
    }
  },
  'Womens Blazer': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "The Womens Blazer is here to stay! Enjoy the best blazer to fit you perfectly!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Polyester blend, Sizes: XS-XL, Lining: Satin, Style: Single-breasted, Closure: Button."
    }
  },
  'Mens Vest': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "There is never a wrong time to impress, so get the Mens Vest today!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Wool, Sizes: S-XL, Fit: Slim fit, Closure: Button, Pockets: 2."
    }
  },
  'Womens Boots - Ankle Boots': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Be at your style with the Womens Boots - Ankle Boots"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Suede, Sizes: 5-10, Heel height: 3 inches, Style: Ankle boots, Closure: Zipper."
    }
  },
  'Womens Boots - Knee High Boots': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Want something long, so it protects then get Womens Boots - Knee High Boots which makes you feel better!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Leather, Sizes: 5-10, Shaft height: 16 inches, Heel height: 2 inches, Closure: Zipper."
    }
  },
  'Mens Tie - Silk Red': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "As they say nothing can go wrong with red, so make a power move and get Mens Tie - Silk Red!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Silk, Length: 58 inches, Width: 3 inches, Pattern: Solid, Color: Red."
    }
  },
  'Mens Tie - Silk Blue': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Make you be the best to be with Mens Tie - Silk Blue!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Silk, Length: 58 inches, Width: 3 inches, Pattern: Polka dot, Color: Blue."
    }
  },
  'Kids Mittens': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Let you kid have the best time while being protected with the Kids Mittens."
    },
    specifications: {
      title: "Specifications",
      content: "Material: Fleece, Sizes: S, M, L, Waterproof: Yes, Lining: Thermal."
    }
  },
  'Womens Tights': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "You cant go wrong when it comes to the best the Womens Tights which are the best out there!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Nylon blend, Denier: 20, Sizes: S, M, L, Color: Black, Opacity: Sheer."
    }
  },
  'Mens Leather Shoes': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Bring back the good times with the Mens Leather Shoes that bring you back!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Genuine leather, Sizes: 7-13, Style: Oxford, Closure: Lace-up, Color: Brown."
    }
  },
  'Womens Earrings': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Make the best of your time with Womens Earrings, which enhance your beauty! "
    },
    specifications: {
      title: "Specifications",
      content: "Material: Sterling silver, Stone: Cubic zirconia, Closure: Butterfly clasp, Style: Stud."
    }
  },
  'Kids Hat': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Make the best with the new Kids Hat, which brings amazing designs!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Cotton, Sizes: One size fits all, Style: Baseball cap, Closure: Snapback, Color: Blue."
    }
  },
  'All-Purpose Cleaner': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Make everything fresh again with All-Purpose Cleaner!"
    },
    specifications: {
      title: "Specifications",
      content: "Volume: 32 oz, Scent: Lemon, Formula: Liquid, Surfaces: Multi-surface, Antibacterial: Yes."
    }
  },
  'Baby Wipes': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Want you baby clean as ever get the Baby Wipes!"
    },
    specifications: {
      title: "Specifications",
      content: "Quantity: 72 wipes, Scent: Unscented, Material: Aloe vera, Hypoallergenic: Yes, Alcohol-free: Yes."
    }
  },
  'Tissue Paper 3-pack': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "If you are running out of supplies then get the new Tissue Paper 3-pack! You wont regret this!"
    },
    specifications: {
      title: "Specifications",
      content: "Quantity: 3 rolls, Ply: 2-ply, Sheet count: 160 sheets per roll, Material: Recycled paper, Scent: Unscented."
    }
  },
  'Orange Juice 1L': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "The new Orange Juice 1L has the best fresh ingredients and taste!"
    },
    specifications: {
      title: "Specifications",
      content: "Volume: 1 liter, Type: 100% orange juice, Added sugar: No, Ingredients: Oranges, Vitamin C fortified: Yes."
    }
  },
  'Organic Rice': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "If you are feeling natural get Organic Rice to live the healthiest lifestyle ever!"
    },
    specifications: {
      title: "Specifications",
      content: "Weight: 5 lbs, Type: Long grain, Ingredients: Organic white rice, Certification: USDA Organic, Gluten-free: Yes."
    }
  },
  'Cat Food 5kg': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Treat your cat as the best today and make them feel loved with the Cat Food 5kg!"
    },
    specifications: {
      title: "Specifications",
      content: "Weight: 5 kg, Breed size: All breeds, Life stage: Adult, Main ingredient: Chicken, Features: Grain-free."
    }
  },
  'Dishwashing Liquid': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Make sure the kitchen is spotless with Dishwashing Liquid that always brings you greatness."
    },
    specifications: {
      title: "Specifications",
      content: "Volume: 25 oz, Scent: Lemon, Formula: Concentrated, Antibacterial: Yes, Grease-cutting: Yes."
    }
  },
  'Vegetable Oil 1L': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "With the Vegetable Oil 1L its great for any occasion and will provide to your food good nutrients!"
    },
    specifications: {
      title: "Specifications",
      content: "Volume: 1 liter, Type: Canola oil, Ingredients: Canola oil, Cholesterol-free: Yes, Trans fat-free: Yes."
    }
  },
  'Dog Collar': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Want you dog secure but stylish then Dog Collar you shall get!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Nylon, Sizes: S, M, L, Width: 1 inch, Closure: Buckle, Color: Blue."
    }
  },
  'Soft Drink 500ml': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "There is never a wrong time to get the Soft Drink 500ml. Perfect for those days that you feel down or up, its delicious!"
    },
    specifications: {
      title: "Specifications",
      content: "Volume: 500 ml, Flavor: Cola, Calories: 200 per serving, Sugar content: High, Packaging: Bottle."
    }
  },
  'Canned Tuna': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Running out of ideas with your diet then get the Canned Tuna to bring you a healthier lifestyle!"
    },
    specifications: {
      title: "Specifications",
      content: "Weight: 5 oz, Style: Chunk light, Pack style: In water, Ingredients: Tuna, water, salt, Protein content: 22g."
    }
  },
  'Pet Shampoo': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Your pet deserves the best and with Pet Shampoo they can get cleaned properly!"
    },
    specifications: {
      title: "Specifications",
      content: "Volume: 16 oz, Scent: Oatmeal, Formula: Tear-free, Ingredients: Aloe vera, Hypoallergenic: Yes."
    }
  },
  'Bathroom Cleaner': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "For a brand new and fresh smell get  Bathroom Cleaner, which is great for all those occasions."
    },
    specifications: {
      title: "Specifications",
      content: "Volume: 28 oz, Scent: Citrus, Formula: Spray, Surfaces: Multi-surface, Antibacterial: Yes."
    }
  },
  'Cereal Box': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Your kid will be forever with the new  Cereal Box, it's a classic."
    },
    specifications: {
      title: "Specifications",
      content: "Weight: 12 oz, Type: Corn flakes, Ingredients: Corn, sugar, salt, Vitamins: Added, Gluten-free: No."
    }
  },
  'Milk 1L': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Get your bones strong with the new Milk 1L which is best for your health!"
    },
    specifications: {
      title: "Specifications",
      content: "Volume: 1 liter, Type: Whole milk, Fat content: 3.25%, Calories: 150 per serving, Ingredients: Milk, Vitamin D fortified: Yes."
    }
  },
  'Dog Toy': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Dog Toys are here to stay so get them and make your friend feel special!"
    },
    specifications: {
      title: "Specifications",
      content: "Material: Rubber, Size: Medium, Style: Ball, Feature: Squeaky, Durability: High."
    }
  },
  'Kitchen Towels': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "The new Kitchen Towels ensure that you will be protected by all the mess!"
    },
    specifications: {
      title: "Specifications",
      content: "Quantity: 2 towels, Material: Cotton, Size: 16x28 inches, Ply: Single-ply, Absorbency: High."
    }
  },
  'Pasta Sauce Jar': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Want a meal today then you can make it easier with Pasta Sauce Jar!"
    },
    specifications: {
      title: "Specifications",
      content: "Weight: 24 oz, Flavor: Marinara, Ingredients: Tomatoes, onions, garlic, Basil: Yes, Added sugar: No."
    }
  },
  'Fish Food': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Your Fish will thank you with this Fish Food!"
    },
    specifications: {
      title: "Specifications",
      content: "Weight: 2 oz, Type: Flakes, Fish type: Tropical, Ingredients: Fish meal, spirulina, Vitamins: Added."
    }
  },
  'Glass Cleaner': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Make everything clear today with the Glass Cleaner which keeps the dust at bay!"
    },
    specifications: {
      title: "Specifications",
      content: "Volume: 26 oz, Scent: Ammonia-free, Formula: Spray, Surfaces: Glass, Mirrors, Streak-free: Yes."
    }
  },
  'Pack of Biscuits': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "For those days with you family get a Pack of Biscuits!"
    },
    specifications: {
      title: "Specifications",
      content: "Weight: 14 oz, Type: Cookies, Flavor: Chocolate chip, Ingredients: Flour, sugar, butter, Calories per serving: 150."
    }
  },
  'Hamster Cage': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "The Hamster Cage is premium made and provides great protection!"
    },
    specifications: {
      title: "Specifications",
      content: "Dimensions: 24 x 12 x 12 inches, Material: Wire, Base material: Plastic, Accessories: Wheel, water bottle, food dish."
    }
  },
  'Dog Chew Sticks': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "The Dog Chew Sticks are necessary to making your dog the happiest around"
    },
    specifications: {
      title: "Specifications",
      content: "Quantity: 20 sticks, Flavor: Beef, Ingredients: Beefhide, Protein content: 80%, Grain-free: Yes."
    }
  },
  'Pack of Sugar': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Make all the meal taste brand new with a Pack of Sugar!"
    },
    specifications: {
      title: "Specifications",
      content: "Weight: 4 lbs, Type: Granulated, Ingredients: Cane sugar, Calories per serving: 15, Granulation: Fine."
    }
  },
  'Bottle of Ketchup': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "For you best dishes or meals make it pop with the Bottle of Ketchup!"
    },
    specifications: {
      title: "Specifications",
      content: "Volume: 20 oz, Flavor: Original, Ingredients: Tomatoes, vinegar, sugar, Calories per serving: 20, Packaging: Squeeze bottle."
    }
  },
  'Pack of Chips': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "If you have friends over with some beers than you will like the Pack of Chips!"
    },
    specifications: {
      title: "Specifications",
      content: "Weight: 8 oz, Flavor: Potato chips, Ingredients: Potatoes, oil, salt, Calories per serving: 160, Packaging: Bag."
    }
  },
  'Pet Water Bowl': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Your pet deserves the best of water, so lets give them the Pet Water Bowl to make it look the best."
    },
    specifications: {
      title: "Specifications",
      content: "Material: Stainless steel, Capacity: 32 oz, Size: Medium, Design: Non-slip base, Dishwasher safe: Yes."
    }
  },
  'Fabric Softener': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "For your clothes to be extra safe there is Fabric Softener!"
    },
    specifications: {
      title: "Specifications",
      content: "Volume: 64 oz, Scent: Lavender, Formula: Liquid, Machine type: HE, Loads: 80."
    }
  },
  'Fruit Jam Jar': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Make your morning worth it and add some Fruit Jam Jar to bring you new vibes."
    },
    specifications: {
      title: "Specifications",
      content: "Weight: 12 oz, Flavor: Strawberry, Ingredients: Strawberries, sugar, pectin, Calories per serving: 50, Certification: Organic."
    }
  },
  'Pack of Cheese': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Get all the nutrients you can with a Pack of Cheese!"
    },
    specifications: {
      title: "Specifications",
      content: "Weight: 8 oz, Type: Cheddar, Milk type: Cow's milk, Fat content: Reduced fat, Packaging: Slices."
    }
  },
  '4K Gaming Monitor': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "With a 4K Gaming Monitor you will be enjoying the great content that the industry brings! The vivid images will make your soul go crazy."
    },
   
    specifications: {
      title: "Specifications",
      content: "Display Size: 27 inches, Resolution: 3840x2160 (4K UHD), Refresh Rate: 144Hz, Response Time: 1ms, Panel Type: IPS, HDR Support: Yes."
    }
  },
  'Mechanical Gaming Keyboard': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "This is only for gamers who know what they are doing! The Mechanical Gaming Keyboard is the best and will help you dominate the gaming scene."
    },
      specifications: {
        title: "Specifications",
        content: "Switch Type: Cherry MX Red, Key Count: 104, Lighting: RGB, Programmable Keys: Yes, Connectivity: USB Wired."
      }
  },
  'Logitech G502 HERO': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Want a mouse that does it all, well this is the one for you to get Logitech G502 HERO!"
    },
    specifications: {
      title: "Specifications",
      content: "Sensor: HERO 25K, DPI Range: 100 - 25,600 DPI, Programmable Buttons: 11, Weight: 121g, Connectivity: USB Wired."
    }
  },
  'Razer DeathAdder Elite': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Razer makes quality products and this does the same, Razer DeathAdder Elite can make you go crazy! With its great design."
    },
    specifications: {
      title: "Specifications",
      content: "Sensor: 16,000 DPI Optical Sensor, Acceleration: 450 IPS/50 G, Programmable Buttons: 7, Connectivity: USB Wired."
    }
  },
  'SteelSeries Rival 600': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "If you want precision the SteelSeries Rival 600 is a great choice!"
    },
    specifications: {
      title: "Specifications",
      content: "Sensor: TrueMove 3, DPI Range: 100 - 12,000 DPI, Programmable Buttons: 7, Weight: 96g-129g, Connectivity: USB Wired."
    }
  },
  'Corsair Dark Core RGB/SE': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "If you like the RGB this  Corsair Dark Core RGB/SE is a great choice that will make your setup pop!"
    },
    specifications: {
      title: "Specifications",
      content: "Sensor: 16,000 DPI Optical, Programmable Buttons: 8, Connectivity: Wireless/Wired, Battery Life: Up to 50 hours (Bluetooth), Charging: Qi Wireless."
    }
  },
  'Desktop PC Tower': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "This Desktop PC Tower if for those who only have a desk. It has the premium performance like a computer."
    },
    specifications: {
      title: "Specifications",
      content: "CPU: Intel Core i7-11700K, GPU: NVIDIA GeForce RTX 3070, RAM: 16GB DDR4, Storage: 1TB NVMe SSD, Operating System: Windows 10."
    }
  },
  'Color Laser Printer': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Want to print everything in color than the Color Laser Printer is your solution, easy and simple."
    },
    specifications: {
      title: "Specifications",
      content: "Print Speed: Up to 22 ppm, Resolution: 600 x 600 dpi, Paper Capacity: 250 sheets, Connectivity: USB, Ethernet, Wi-Fi."
    }
  },
  '3D Printer': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Want the best of all worlds this brand new 3D Printer lets your dreams come true."
    },
    specifications: {
      title: "Specifications",
      content: "Print Volume: 220 x 220 x 250mm, Layer Resolution: 0.1mm, Filament Diameter: 1.75mm, Nozzle Diameter: 0.4mm, Print Speed: 100mm/s."
    }
  },
  'Scanner': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "To get your paperwork straight then get a new scanner. The Scanner can all do it for you easy!"
    },
    specifications: {
      title: "Specifications",
      content: "Scan Resolution: 4800 x 9600 dpi, Scan Speed: 8 seconds per page, Document Size: 8.5 x 11.7 inches, Connectivity: USB."
    }
  },
  'iPhone 14 Pro': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Bring in an iphone that last for more then a year get Iphone 14 Pro. The newest I phone ever!"
    },
    specifications: {
      title: "Specifications",
      content: "Display: 6.1-inch Super Retina XDR, Processor: A16 Bionic chip, Storage: 128GB/256GB/512GB/1TB, Camera: 48MP Main/12MP Ultra Wide/12MP Telephoto."
    }
  },
  'Samsung Galaxy S23': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "If your an android fan then the Samsung Galaxy S23 is everything you will ever need."
    },
    specifications: {
      title: "Specifications",
      content: "Display: 6.1-inch Dynamic AMOLED 2X, Processor: Snapdragon 8 Gen 2 for Galaxy, Storage: 128GB/256GB, Camera: 50MP Wide/12MP Ultra Wide/10MP Telephoto."
    }
  },
  'Phone Charging Station': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Do you have multiple phones, if so than get a Phone Charging Station"
    },
    specifications: {
      title: "Specifications",
      content: "Ports: USB, USB-C, Lightning, Output: 5V/2.4A, Compatibility: Smartphones, tablets, Material: ABS plastic."
    }
  },
  '85-inch OLED TV': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "The big boy here 85-inch OLED TV! This ensures the best with family. There is never a day that its bad"
    },
    specifications: {
      title: "Specifications",
      content: "Display Size: 85 inches, Resolution: 3840 x 2160 (4K UHD), Panel Type: OLED, HDR Support: Yes, Smart TV: Yes."
    }
  },
  'Soundbar System': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Want you home theeter experience to be amazing, the  Soundbar System can get your setup complete."
    },
    specifications: {
      title: "Specifications",
      content: "Channels: 2.1, Power Output: 300W, Subwoofer: Wireless, Connectivity: HDMI, Bluetooth, Optical."
    }
  },
  'Smart TV Box': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "The Smart TV Box is the newest and will enhance to the best of its ability, it's here to stay."
    },
    specifications: {
      title: "Specifications",
      content: "Operating System: Android TV, RAM: 2GB, Storage: 16GB, Resolution Support: 4K UHD, Connectivity: HDMI, Wi-Fi, Ethernet."
    }
  },
  'Dishwasher': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Dont have much time then get this Dishwasher"
    },
    specifications: {
      title: "Specifications",
      content: "Capacity: 14 place settings, Wash Cycles: 6, Energy Star Certified: Yes, Noise Level: 45 dB, Features: Stainless Steel Tub."
    }
  },
  'Robot Vacuum Cleaner': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "Cleaning just go a lot simpler with Robot Vacuum Cleaner! You can sit down and reax with the best of clean at its best!"
    },
    specifications: {
      title: "Specifications",
      content: "Suction Power: 2000Pa, Battery Life: 120 minutes, Navigation: Laser, Features: App Control, Automatic Recharge."
    }
  },
  'Smart Oven': {
    description: {
      title: productDescriptions.defaultDescriptionTitle.title,
      content: "The future is now with a  Smart Oven you can cook anywhere and not worry."
    },
    specifications: {
      title: "Specifications",
      content: "Capacity: 1.5 cu. ft, Temperature Range: 100-450°F, Connectivity: Wi-Fi, Features: App Control, Voice Control."
    }
  },
  'Portable AC': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Make a smart decision with Portable AC to carry with ease and not worry."
        },
        specifications: {
          title: "Specifications",
          content: "Cooling Capacity: 12,000 BTU, Room Size: Up to 400 sq. ft, Noise Level: 52 dB, Features: Remote Control, Timer."
        }
      },
      'Air Purifier': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "The air that you breath deserves the best, so get this new Air Purifier!"
        },
        specifications: {
          title: "Specifications",
          content: "Filter Type: HEPA, Room Size: Up to 500 sq. ft, CADR Rating: 300 CFM, Features: Activated Carbon Filter, Smart Sensors."
        }
      },
      'Dehumidifier': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "If your place has to much moisture then be smart and fix it today with a new  Dehumidifier."
        },
        specifications: {
          title: "Specifications",
          content: "Capacity: 50 pints, Room Size: Up to 2500 sq. ft, Features: Adjustable Humidistat, Auto Shut-Off, Continuous Drain Option."
        }
      },
      'Action Camera': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Always have a friend while you record you adventures by getting a Action Camera today."
        },
        specifications: {
          title: "Specifications",
          content: "Resolution: 4K/60fps, Waterproof: Up to 33 ft, Stabilization: Electronic Image Stabilization (EIS), Display: Touchscreen, Features: Voice Control."
        }
      },
      'Camera Tripod': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Want more stability for pictures, get you self Camera Tripod"
        },
        specifications: {
          title: "Specifications",
          content: "Maximum Height: 60 inches, Load Capacity: 8 lbs, Material: Aluminum, Head Type: Ball Head, Leg Sections: 4."
        }
      },
      'Camera Lens Kit': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "If you wanna be serious about the camera game then the Camera Lens Kit is a need and will do you great."
        },
        specifications: {
          title: "Specifications",
          content: "Lens Mount: Canon EF, Focal Lengths: 18-55mm, 50mm, Aperture Range: f/3.5-5.6, f/1.8, Features: Image Stabilization (IS)."
        }
      },
      'Designer Evening Gown': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Look elegant and make someones night the best day with the Designer Evening Gown!"
        },
        specifications: {
          title: "Specifications",
          content: "Material: Silk, Sizes: XS-XL, Color: Black, Length: Floor-length, Features: Sequined bodice, Sleeveless."
        }
      },
      'Silk Blouse': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "The best of you will be out with Silk Blouse which is great for that special time."
        },
        specifications: {
          title: "Specifications",
          content: "Material: 100% Silk, Sizes: XS-XL, Sleeve Length: Long, Pattern: Solid, Neckline: V-neck."
        }
      },
      'Cashmere Sweater': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Get warmth back with this Cashmere Sweater during those chilly nights. Perfect for all."
        },
        specifications: {
          title: "Specifications",
          content: "Material: 100% Cashmere, Sizes: S-XL, Fit: Regular, Color: Gray, Knit style: Crewneck."
        }
      },
      'Diamond Necklace': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Shine the night with your very own Diamond Necklace!"
        },
        specifications: {
          title: "Specifications",
          content: "Metal: 14k Gold, Stone: Diamond, Carat Weight: 1.0 ct, Clarity: SI1, Color: G."
        }
      },
      'Gold Bracelet': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "All types of occasions get the Gold Bracelet. There is no time to not get this amazing jewelry!"
        },
        specifications: {
          title: "Specifications",
          content: "Material: 18k Gold, Weight: 10 grams, Closure: Lobster claw, Length: 7 inches, Style: Chain."
        }
      },
      'Silver Ring Set': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Silver is here with the new Silver Ring Set. There is no time to wait and express your style."
        },
        specifications: {
          title: "Specifications",
          content: "Material: Sterling Silver, Stone: Cubic Zirconia, Sizes: 5-9, Style: Stackable, Finish: Polished."
        }
      },
      'Business Suit': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "The business world requires respect, and to have that you need a Business Suit. You will look sharp!"
        },
        specifications: {
          title: "Specifications",
          content: "Material: Wool blend, Sizes: 36-46, Fit: Slim fit, Closure: Two-button, Pockets: 3."
        }
      },
      'Leather Jacket': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "You can never go wrong with black. With that in mind the Leather Jacket is here for the long haul."
        },
        specifications: {
          title: "Specifications",
          content: "Material: Genuine leather, Sizes: S-XL, Lining: Quilted, Style: Motorcycle, Closure: Zipper."
        }
      },
      'Designer Tie Set': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "With great power comes great responsibility. So with the new Designer Tie Set that happens."
        },
        specifications: {
          title: "Specifications",
          content: "Material: Silk, Length: 58 inches, Width: 3 inches, Patterns: Assorted, Closure: Self-tie."
        }
      },
      'Designer Clutch': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "At that high class party don't feel out of place because Designer Clutch will make you the best! The quality says it all."
        },
        specifications: {
          title: "Specifications",
          content: "Material: Leather, Dimensions: 8 x 5 x 2 inches, Closure: Clasp, Strap: Chain, Embellishment: Crystals."
        }
      },
      'Travel Backpack': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Have you next adventure start with Travel Backpack that has the best features out there."
        },
        specifications: {
          title: "Specifications",
          content: "Capacity: 45L, Material: Nylon, Dimensions: 22 x 14 x 9 inches, Pockets: Multiple, Features: Water-resistant."
        }
      },
      'Premium Dog Food 20kg': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Have you next adventure start with Travel Backpack that has the best features out there."
        },
        specifications: {
          title: "Specifications",
          content: "Weight: 20 kg, Breed Size: All, Life Stage: Adult, Main Ingredient: Chicken, Features: Grain-free."
        }
      },
      'Cat Tree House': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Make you cat live there live with Cat Tree House. This will allow for you cat to feel safe in new places."
        },
        specifications: {
          title: "Specifications",
          content: "Height: 6 feet, Material: Plush, Features: Scratching posts, condo, perches, Color: Beige."
        }
      },
      'Pet Grooming Kit': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Make sure you dog/cat is clean with the Pet Grooming Kit!"
        },
        specifications: {
          title: "Specifications",
          content: "Includes: Brush, comb, nail clippers, shampoo, towels, Species: Dog, Cat."
        }
      },
      'Organic Coffee Beans': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Give you days that extra boost with a great Organic Coffee Beans that give the best smell. Comes in packs of one pound!"
        },
        specifications: {
          title: "Specifications",
          content: "Weight: 1 lb, Roast: Medium, Flavor Profile: Chocolate, Nutty, Certification: USDA Organic, Region: Ethiopia."
        }
      },
      'Gourmet Chocolate Box': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "If you friends need that special treat, with there birthday then look no further! This has quality written all over it Gourmet Chocolate Box"
        },
        specifications: {
          title: "Specifications",
          content: "Weight: 16 oz, Flavors: Assorted truffles, Ingredients: Cocoa, sugar, butter, Filling: Cream, nuts."
        }
      },
      'Premium Wine Bottle': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "You can't go wrong with a great Premium Wine Bottle for those special occasions. The red will give you all types of feelings"
        },
        specifications: {
          title: "Specifications",
          content: "Type: Red, Grape Variety: Cabernet Sauvignon, Vintage: 2018, Region: Napa Valley, Alcohol Content: 14.5%."
        }
      },
      'Gaming Headset Pro': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "The great audio and mic quality is worth it with Gaming Headset Pro! No you will know where those campers at to get that Victory Royal"
        },
        specifications: {
          title: "Specifications",
          content: "Frequency Response: 20Hz - 20kHz, Impedance: 32 Ohms, Driver Size: 50mm, Connectivity: Wireless, Microphone: Noise-canceling."
        }
      },
      'RTX 4080 Graphics Card': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "The most intense gamers and designers can be the happiest with RTX 4080 Graphics Card. For those high quality games that want more."
        },
        specifications: {
          title: "Specifications",
          content: "Memory: 16GB GDDR6X, Architecture: NVIDIA Ada Lovelace, Boost Clock: 2.5 GHz, Ports: HDMI 2.1, DisplayPort 1.4a."
        }
      },
      'SSD 2TB': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "The biggest storage that will last years to come with  SSD 2TB, that can be here with you! Make sure your get it to enjoy this!"
        },
        specifications: {
          title: "Specifications",
          content: "Capacity: 2TB, Interface: NVMe PCIe Gen4, Read Speed: Up to 7000 MB/s, Write Speed: Up to 5300 MB/s, Form Factor: M.2 2280."
        }
      },
      'Multifunction Printer': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "For a new generation of printer the Multifunction Printer lets you print in different colors, and also lets you scan easy!"
        },   
        specifications: {
          title: "Specifications",
          content: "Print speed: 22ppm (Black), 18ppm (Color), Resolution: 4800 x 1200 dpi, Functionalities: Print, Scan, Copy, Connectivity: Wi-Fi, USB."
        }
      },
      'Label Printer': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "The power of labels is here with the Label Printer. Make you items organized and simple for the world to see!"
        },
        specifications: {
          title: "Specifications",
          content: "Print width: 4 inches, Print speed: 5 inches/sec, Resolution: 203 dpi, Connectivity: USB, Bluetooth."
        }
      },
      'Photo Printer': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Photos that will last lifetime is here and will get created by Photo Printer. Relive those moments at all times!"
        },
        specifications: {
          title: "Specifications",
          content: "Print size: 4x6 inches, Resolution: 4800 x 1200 dpi, Print Speed: 45 seconds per photo, Connectivity: Wi-Fi, USB."
        }
      },
      '5G Router': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "The future is here with 5G Router! Never deal with lag again and enhance the speed of your internet in one simple click."
        }
      },
      'Phone Gimbal': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Have you ever wanted a steady camera to look professional the Phone Gimbal solves all your problems! Easy to install."
        }
      },
      'Phone Protection Case': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "I will be safe and protected by Phone Protection Case. Your Phone is safe and the cases also add all kinds of flavors!"
        }
      },
      'Curved Gaming Monitor': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "The future will be in your hand with  Curved Gaming Monitor you will see all kinds of new angles! Great quality and smooth refresh rate."
        }
      },
      'Projector Screen': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "With Projector Screen you can make any and all movies come to life like a new experience for you family to see! Get it today to never be bored."
        }
      },
      'Smart Speaker': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "The speaker that will know you the best Smart Speaker is here to stay and make it the smartest yet. You say the word and its done."
        }
      },
      'Wine Cooler': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "The premium feel and quality is to good with Wine Cooler so get yours today! Perfect for a gift or event."
        }
      },
      'Food Processor': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Want to get you cooking ready for your brand then get Food Processor. You will have to grind those foods anymore!"
        }
      },
      'Coffee Maker': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Enjoy your days to the fullest with a Coffee Maker. You can also add all types of flavor for a variety to make you days shine. Great gift or personal."
        }
      },
      'Split AC 2 Ton': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "If you need something strong then the Split AC 2 Ton, is all you need. It's strong but efficient with its energy."
        }
      },
      'Smart Thermostat': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Stay in comfort with all type of seasons with Smart Thermostat. You can change from your phone and all the best."
        }
      },
      'Ceiling Fan': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Save energy and feel good with Ceiling Fan. Its quite while not taking to much to cause sounds."
        }
      },
      'Mirrorless Camera': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Mirrorless Camera can bring the best out of you that makes you feel good about taking pictures!"
        }
      },
      'Camera Flash': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Don't let lighting be a problem with Camera Flash which can solve that and make each photos look brand new!"
        }
      },
      'Camera Backpack': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "You camera will be protected and ready for its adventures with Camera Backpack"
        }
      },
      'Designer Jeans': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Be in the meta and be the freshest with Designer Jeans, you won't find any other Jeans out there that make it better. Be you be ready!"
        }
      },
      'Wool Coat': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Let nature flow within you with  Wool Coat you will stand out while keeping your body feeling amazing!"
        }
      },
      'Cocktail Dress': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Every dress that you had or tried means nothing because there is new dress that has arrived! The Cocktail Dress is here for you."
        }
      },
      'Sapphire Earrings': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Shine for ever with  Sapphire Earrings! Let you dreams and beauty be there with these new earrings!"
        }
      },
      'Designer Watch': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Know what style should be! This will make everything good with Designer Watch. Have you seen the future. "
        }
      },
      'Pearl Set': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Make a bold a statement with Pearl Set you wont never look back. With this everything gets even more beautiful. "
        }
      },
      'Winter Jacket': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "If the winter gets rough just know the Winter Jacket got you with its premium protection from the winds and water"
        }
      },
      'Dress Shirt Set': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Why only get one when this premium Dress Shirt Set has you here the best there ever was!"
        }
      },
      'Wool Sweater': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "What is a great look when all things and done. Its quality all the way with Wool Sweater what more could you ever dream."
        }
      },
      'Crossbody Bag': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "What it take to be is something you will love and know is that Crossbody Bag this bag that saves all!"
        }
      },
      'Weekend Bag': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "All trips have a need and thats the new and improved Weekend Bag, so make sure to keep it great with you"
        }
      },
      'Designer Sunglasses': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "For style that the best you can now have here is Designer Sunglasses! Be the best of the best today and love what you see out there."
        }
      },
      'Aquarium Set': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Want that aquarium, then look more further the Aquarium Set is ready for all occasions!"
        }
      },
      'Bird Cage Large': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Your Bird deserves the best, and best they shall have with Bird Cage Large which has all types of space."
        }
      },
      'Pet Bed Luxury': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Want you animals to be happy and smile get the Pet Bed Luxury and make them feel right back at home, now they will know love!"
        }
      },
      'Premium Tea Set': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "There is no wrong time to get that brand new Premium Tea Set, this brings all the tea and love in all directions to every one."
        }
      },
      'Olive Oil Extra Virgin': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "All meals that you put into the oven will thank you with a touch of Olive Oil Extra Virgin for the best taste of you life."
        }
      },
      'Craft Beer Pack': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "For those friend to have and make sure all things is equal bring a Craft Beer Pack today to make their days brand new. Cheers!"
        }
      },
      'Paper Products Bundle': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "With the family and friend that come over you will never run out with a Paper Products Bundle! Keep this in your mind because it's cheap."
        }
      },
      'Cleaning Supplies Set': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Keep you home running new and great by adding Cleaning Supplies Set. It will keep the house brand new!"
        }
      },
      'Baby Care Package': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "It takes a lot to be parent well i suggest that you get this amazing Baby Care Package with all types of care to make your baby the best."
        }
      },
      'Smart Watch Pro': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "For you health with all time classic get the Smart Watch Pro that measures all the aspects to life."
        }
      },
      'Wireless Mouse': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Cut all the cords today and with the new Wireless Mouse that is great for all occasion you can not go wrong. High response times too."
        }
      },
      'USB-C Hub': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "With so many devices and cables the best for you will be USB-C Hub. It makes all the difference in quality of life. Make it be know."
        }
      },
      'Document Scanner': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Want you documents to be perfect with a push of the button, get Document Scanner here for you to see. "
        }
      },
      'Ink Tank Printer': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "It's simple just and print what more do we really need. Get the Ink Tank Printer."
        }
      },
      '5G Smartphone': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "It will be here with the best you know who and that is a 5G Smartphone with its next features. Get it to understand all about."
        },
        specifications: {
          title: "Specifications",
          content: "Display size: 6.7 inches, Processor: Snapdragon 8 Gen 2, RAM: 8GB, Storage: 128GB, Camera: 50MP triple lens."
        }
      },
      'Bluetooth Earphones': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Connect to the soul and peace with the Bluetooth Earphones. You can also hear it and the quality is amazing."
        },
        specifications: {
          title: "Specifications",
          content: "Connectivity: Bluetooth 5.0, Battery life: 8 hours, Water resistance: IPX5, Driver size: 10mm, Frequency response: 20Hz - 20kHz."
        }
      },
      'Smart Display': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Here the best that can get and know is that the Smart Display is coming and you best be ready for this moment today! "
        },
        specifications: {
          title: "Specifications",
          content: "Display size: 10 inches, Resolution: 1280 x 800, Operating system: Google Assistant, Connectivity: Wi-Fi, Bluetooth."
        }
      },
      'Stand Mixer': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Enjoy making meal now without needing to stand up because Stand Mixer. Its for you and all will have a taste."
        },
        specifications: {
          title: "Specifications",
          content: "Capacity: 5 quarts, Power: 500W, Speed settings: 10, Attachments: Dough hook, wire whip, flat beater."
        }
      },
      'Tower Fan': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "What it makes to you happy is what you will love with a Tower Fan to get you going to see it!"
        },
        specifications: {
          title: "Specifications",
          content: "Height: 40 inches, Speed settings: 3, Oscillation: Yes, Remote control: Yes, Timer: Yes."
        }
      },
      'Security Camera Set': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "If you want you house to protected and give you a peice of mind then Security Camera Set gives all that you wanted!"
        },
        specifications: {
          title: "Specifications",
          content: "Resolution: 1080p HD, Viewing angle: 110 degrees, Night vision range: 65 feet, Connectivity: Wireless, Weather resistance: IP66."
        }
      },
      'Summer Collection Dress': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Your body is what you see so you look like it and wear the all types of brand new  Summer Collection Dress there was ever in store now!"
        },
        specifications: {
          title: "Specifications",
          content: "Material: Cotton, Sizes: XS-XL, Color: Floral Print, Length: Knee length, Closure: Zipper."
        }
      },
      'Designer Belt': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "What it mean is more important so there is never a Designer Belt to feel something new!"
        },
        specifications: {
          title: "Specifications",
          content: "Material: Leather, Width: 1.5 inches, Length: Adjustable, Buckle Material: Stainless steel, Color: Black."
        }
      },
      'Luxury Scarf': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Is more about then whats going on in the Luxury Scarf so let that stay by!"
        },
        specifications: {
          title: "Specifications",
          content: "Material: Silk, Dimensions: 70 x 20 inches, Pattern: Paisley, Fringe: Yes, Care instructions: Dry clean only."
        }
      },
      'Gold Plated Bracelet': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "The best moments come and always stay back when there is high quality and for that time it was not in time so Gold Plated Bracelet, do!"
        },
        specifications: {
          title: "Specifications",
          content: "Material: Gold plated, Length: 7 inches, Clasp Type: Lobster claw, Style: Chain, Finish: Polished."
        }
      },
      'Formal Suit Set': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "What means more it all so it will make more with what you can and there is that name for to do so Formal Suit Set."
        },
        specifications: {
          title: "Specifications",
          content: "Material: Wool blend, Sizes: 36-46, Fit: Slim fit, Includes: Jacket, Pants, Closure: Button."
        }
      },
      'Designer Wallet': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "What it makes is for you to make time all for the better with Designer Wallet with all the love!"
        },
        specifications: {
          title: "Specifications",
          content: "Material: Leather, Dimensions: 4.5 x 3.5 inches, Card Slots: 8, Bill Compartment: 1, RFID Protection: Yes."
        }
      },
      'Organic Food Bundle': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "For those that are ready to enjoy life the best and the only that makes the most is Organic Food Bundle! Take and see!"
        },
        specifications: {
          title: "Specifications",
          content: "Includes: Organic fruits, vegetables, grains, dairy products, Weight: 10 lbs, Certification: USDA Organic."
        }
      },
      'Pet Grooming Service Kit': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "What has came to it all with a beat there was never there to stay and with this Pet Grooming Service Kit! Never been more better"
        },
        specifications: {
          title: "Specifications",
          content: "Includes: Brush, comb, nail clippers, shampoo, towel, Species: Dog, Cat, Safe: safe for skin."
        }
      },
      'Premium Snack Box': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "For you and all the friend make it that there is so many great parts with Premium Snack Box! What is more"
        },
        specifications: {
          title: "Specifications",
          content: "Includes: Chocolates, cookies, nuts, dried fruits, Weight: 2 lbs, Packaging: Gift box, Assortment: Mixed."
        }
      },
      'Home Cleaning Bundle': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "See what you can and get ready for the good life with Home Cleaning Bundle all the stuff that you need and only want. Get it with love!"
        },
        specifications: {
          title: "Specifications",
          content: "Includes: All-purpose cleaner, glass cleaner, bathroom cleaner, furniture polish, floor cleaner, Volume: 32 oz each."
        }
      },
      'Baby Essential Pack': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "For all those long days with the kids make sure they are all the best that life can make with Baby Essential Pack!"
        },
        specifications: {
          title: "Specifications",
          content: "Includes: Diapers, wipes, baby wash, lotion, rash cream, Sizes: Newborn - 3 months, Quantity: 50 items."
        }
      },
      'Gourmet Food Basket': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "With the friend and all the rest bring joy to them with Gourmet Food Basket with the best there has ever been with it. "
        },
        specifications: {
          title: "Specifications",
          content: "Includes: Cheese, crackers, sausage, olives, wine, nuts, Weight: 3 lbs, Packaging: Basket, Theme: Italian."
        }
      },
      'Pet Travel Kit': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "To the long road with the new Pet Travel Kit your friends can travel better for the most to see and be. Love"
        },
        specifications: {
          title: "Specifications",
          content: "Includes: Food bowl, water bowl, leash, waste bags, first-aid kit, Species: Dog, Cat, Travel, Safe To take to the Air Port."
        }
      },
      'Household Essentials Pack': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "Always at the core to keep you on track is household stuff so with a new great quality then get Household Essentials Pack!"
        },
        specifications: {
          title: "Specifications",
          content: "Includes: Paper towels, toilet paper, dish soap, laundry detergent, trash bags, Quantity: Assorted, Usefulness."
        }
      },
      'Premium Coffee Set': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "What you love more then that new scent of coffer then get the Premium Coffee Set today and enjoy the aroma!"
        },
        specifications: {
          title: "Specifications",
          content: "Includes: Coffee beans, grinder, French press, mugs, spoon, Weight: 1.5 lbs, Region: Columbia, Size: All."
        }
      },
      'Pet Healthcare Bundle': {
        description: {
          title: productDescriptions.defaultDescriptionTitle.title,
          content: "The world for you friend means a thing you will love and see all with Pet Healthcare Bundle great and for the pets!"
        },
        specifications: {
          title: "Specifications",
          content: "Includes: Nutritional supplements, grooming supplies, and a first-aid guide, Species: Cat, Dog, and birds"
        }
      }
    }
};


