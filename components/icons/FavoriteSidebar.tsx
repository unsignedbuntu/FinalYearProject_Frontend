import React from 'react'

interface SVGIconProps {
  width?: number;
  height?: number;
}

export default function FavoriteSiderbar({ width = 37, height = 37 }: SVGIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.5017 6.98148C22.1231 3.73083 27.7193 3.83875 31.2075 7.33426C34.6958 10.8298 34.8156 16.3987 31.5713 20.0309L18.5 33.1227L5.42895 20.0309C2.18478 16.3987 2.30605 10.821 5.79276 7.33426C9.28341 3.84361 14.8698 3.72601 18.5017 6.98148Z" fill="black"/>
    </svg>
  )
}
