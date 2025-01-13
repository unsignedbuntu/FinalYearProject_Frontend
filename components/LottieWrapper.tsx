"use client"
import Lottie from 'lottie-react'
import { useMemo } from 'react'

export default function LottieWrapper({ animationData }: { animationData: any }) {
 
  const processedData = useMemo(() => {
    const processed = JSON.parse(JSON.stringify(animationData))
    const convertKeys = (obj: any) => {
      if (obj?.shapes?.[0]?.it) {
        obj.shapes[0].it.forEach((item: any) => {
          if (item?.ty === 'sh') {
            if (item?.ks?.k?.i?.[0]?.['fillRule']) {
              item.ks.k.i[0]['fillRule'] = item.ks.k.i[0]['fillRule']
              delete item.ks.k.i[0]['fillRule']
            }
            if (item?.ks?.k?.i?.[0]?.['clipRule']) {
              item.ks.k.i[0]['clipRule'] = item.ks.k.i[0]['clipRule']
              delete item.ks.k.i[0]['clipRule']
            }
          }
        })
      }
      return obj
    }
    return convertKeys(processed)
  }, [animationData])

  return (
    <Lottie
      animationData={processedData}
      loop={true}
      style={{ width: '100%', height: '100%' }}
    />
  )
} 