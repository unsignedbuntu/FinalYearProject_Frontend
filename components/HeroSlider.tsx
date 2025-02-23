"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'

const slides = [
  {
    id: 1,
    image: '/slider/1000_F_46594969_DDZUkjGFtkv0jDMG7676blspQlgOkf1n .jpg',
    title: 'Slide 1'
  },
  {
    id: 2,
    image: '/slider/1000_F_139838537_ahJnL2GCKQviBW9JWjpUq4q8GlgRcwU3.jpg',
    title: 'Slide 2'
  },
  {
    id: 3,
    image: '/slider/1000_F_191323402_W2ATUPr8dGHALHrvyX4WVlEDz4qXmmd9.jpg',
    title: 'Slide 3'
  },
  {
    id: 4,
    image: '/slider/AdobeStock_110243449_Preview.jpg',
    title: 'Slide 4'
  },
  {
    id: 5,
    image: '/slider/air-conditioner-6605973_1280.jpg',
    title: 'Slide 5'
  },
  {
    id: 6,
    image: '/slider/arunas-naujokas-EEnJpGHkU4k-unsplash.jpg',
    title: 'Slide 6'
  },
  {
    id: 7,
    image: '/slider/audio_visual.jpg',
    title: 'Slide 7'
  },
  {
    id: 8,
    image: '/slider/autumn-winter-warm-drinks-hot-chocolate-pumpkin-latte-caramel-peanut-coffee-latte-mulled-wine_136595-4228 2.jpg',
    title: 'Slide 8'
  },
  {
    id: 9,
    image: '/slider/brooke-lark-HjWzkqW1dgI-unsplash.jpg',
    title: 'Slide 9'
  },
  {
    id: 10,
    image: '/slider/daiga-ellaby-uooMllXe6gE-unsplash.jpg',
    title: 'Slide 10'
  },
  {
    id: 11,
    image: '/slider/denisse-leon-OVEWbIgffDk-unsplash.jpg',
    title: 'Slide 11'
  },
  {
    id: 12,
    image: '/slider/domino-studio-164_6wVEHfI-unsplash.jpg',
    title: 'Slide 12'
  },
  {
    id: 13,
    image: '/slider/engin-akyurt-CGnoRQZGWmw-unsplash.jpg',
    title: 'Slide 13'
  },
  {
    id: 14,
    image: '/slider/gettyimages-1308382930-2048x2048.jpg',
    title: 'Slide 14'
  },
  {
    id: 15,
    image: '/slider/House-Hold-Goods.jpg',
    title: 'Slide 15'
  },
  {
    id: 16,
    image: '/slider/ian-dooley-8HqPXTToMn0-unsplash.jpg',
    title: 'Slide 16'
  },
  {
    id: 17,
    image: '/slider/istockphoto-940320814-2048x2048.jpg',
    title: 'Slide 17'
  },
  {
    id: 18,
    image: '/slider/istockphoto-1196974664-2048x2048.jpg',
    title: 'Slide 18'
  },
  {
    id: 19,
    image: '/slider/istockphoto-1454589703-2048x2048.jpg',
    title: 'Slide 19'
  },
  {
    id: 20,
    image: '/slider/kari-shea-1SAnrIxw5OY-unsplash.jpg',
    title: 'Slide 20'
  },
  {
    id: 21,
    image: '/slider/kris-atomic-axyT3gifbSU-unsplash.jpg',
    title: 'Slide 21'
  },
  {
    id: 22,
    image: '/slider/lauren-mancke-qc3sE5lGLbA-unsplash.jpg',
    title: 'Slide 22'
  },
  {
    id: 23,
    image: '/slider/leisara-studio-396JySTQiqA-unsplash.jpg',
    title: 'Slide 23'
  },
  {
    id: 24,
    image: '/slider/math-lfRlv3nuf78-unsplash.jpg',
    title: 'Slide 24'
  },
  {
    id: 25,
    image: '/slider/mohammad-metri-E-0ON3VGrBc-unsplash.jpg',
    title: 'Slide 25'
  },
  {
    id: 26,
    image: '/slider/Names-Of-Household-Appliances-In-English.jpg',
    title: 'Slide 26'
  },
  {
    id: 27,
    image: '/slider/natracare-aMca3BHUvmU-unsplash.jpg',
    title: 'Slide 27'
  },
  {
    id: 28,
    image: '/slider/Offer Banner.jpg',
    title: 'Slide 28'
  },
  {
    id: 29,
    image: '/slider/roll-cash-register-tape-isolated-soft-gray_73683-1158.jpg',
    title: 'Slide 29'
  },
  {
    id: 30,
    image: '/slider/sarah-dorweiler-QeVmJxZOv3k-unsplash.jpg',
    title: 'Slide 30'
  },
  {
    id: 31,
    image: '/slider/signature-june-K4t4HLjpYzg-unsplash.jpg',
    title: 'Slide 31'
  },
  {
    id: 32,
    image: '/slider/the-average-tech-guy-DsmDqiYduaU-unsplash.jpg',
    title: 'Slide 32'
  },
  {
    id: 33,
    image: '/slider/the-best-picture-quality-tv-in-2023-and-tips-for-better-picture-quality.jpg',
    title: 'Slide 33'
  },
  {
    id: 34,
    image: '/slider/top-view-bunch-food-provisions-donation_23-2148733832.jpg',
    title: 'Slide 34'
  },
  {
    id: 35,
    image: '/slider/tran-mau-tri-tam-3xFwO_wTrkg-unsplash.jpg',
    title: 'Slide 35'
  },
  {
    id: 36,
    image: '/slider/view-table-with-articles-food-family_1398-5025.jpg',
    title: 'Slide 36'
  }
]

export default function HeroSlider() {
  const getRandomStartPage = () => {
    const randomNum = Math.floor(Math.random() % 36) + 1 //We got 36 slides thats why we use % 36
    return randomNum % slides.length
  }

  const [currentSlide, setCurrentSlide] = useState(getRandomStartPage)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  
  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative h-[400px] w-full">
      <div className="relative h-full w-full overflow-hidden rounded-lg">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 p-2 text-white rounded-full hover:bg-black/50"
        onClick={prevSlide}
      >
        ❮
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 p-2 text-white rounded-full hover:bg-black/50"
        onClick={nextSlide}
      >
        ❯
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}