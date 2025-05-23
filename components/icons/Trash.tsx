import React from 'react';

interface TrashIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function Trash({ className, width = 27, height = 30 }: TrashIconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 27 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M1 7.02899H25.8619M10.3232 13.058V22.1014M16.5387 13.058V22.1014M2.55387 7.02899L4.10773 25.1159C4.10773 25.9154 4.43516 26.6822 5.01797 27.2475C5.60078 27.8128 6.39125 28.1304 7.21547 28.1304H19.6464C20.4706 28.1304 21.2611 27.8128 21.8439 27.2475C22.4267 26.6822 22.7541 25.9154 22.7541 25.1159L24.308 7.02899M8.76934 7.02899V2.50725C8.76934 2.1075 8.93305 1.72413 9.22445 1.44146C9.51586 1.1588 9.91109 1 10.3232 1H16.5387C16.9508 1 17.346 1.1588 17.6374 1.44146C17.9288 1.72413 18.0925 2.1075 18.0925 2.50725V7.02899" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}