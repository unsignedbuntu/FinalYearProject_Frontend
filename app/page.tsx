'use client';

import { useEffect, useState } from 'react';
import HeroSlider from '@/components/HeroSlider'
import BestSeller from '@/components/BestSeller'
import Footer from '@/components/Footer'
import CategoryMenu from '@/components/CategoryMenu';

export default function Home() {
  return (
    <>
      <main className="flex flex-col justify-center px-4 mt-[160px]">
        <div className="flex-1 max-w-[1200px] mx-auto">
          <div className="mb-6">
            <CategoryMenu />
          </div>
          <HeroSlider />
          <BestSeller />
          <div className="flex flex-col gap-4">
            {/* Kategoriler burada listelenebilir */}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

