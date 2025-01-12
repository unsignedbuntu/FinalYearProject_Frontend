import HeroSlider from '@/components/HeroSlider'
import BestSeller from '@/components/BestSeller'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <main className="flex flex-col justify-center px-4 mt-[160px]">
        <div className="flex-1 max-w-[1200px] mx-auto">
          <HeroSlider />
          <BestSeller />
        </div>
      </main>
      <Footer />
    </>
  )
}

