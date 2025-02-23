"use client"
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

interface AnimationBannerProps {
  side: 'left' | 'right'
}

export default function AnimationBanner({ side }: AnimationBannerProps) {
  const animationData = side === 'left' 
    ? require('../public/left.json')
    : require('../public/right.json')

  return (
    <div className="w-[240px] h-[500px] bg-[#D9D9D9] rounded-lg overflow-hidden">
      <Lottie
        animationData={animationData}
        loop={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
