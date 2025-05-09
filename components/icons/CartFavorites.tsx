import React from 'react'

interface CartFavoritesProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  // fill prop'u mask kullandığı için doğrudan SVG'ye uygulanamaz, gerekirse mask içindeki path'lere uygulanabilir.
}

export default function CartFavorites({ className, width = 32, height = 32 }: CartFavoritesProps) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="mask0_456_976" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="1" y="3" width="30" height="26">
        <path d="M25.9999 21.3333H8.66659L5.33325 8H29.3333L25.9999 21.3333Z" fill="#555555"/>
        <path d="M2 4H4.33333L5.33333 8M5.33333 8L8.66667 21.3333H26L29.3333 8H5.33333Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.66675 28C9.77132 28 10.6667 27.1046 10.6667 26C10.6667 24.8954 9.77132 24 8.66675 24C7.56218 24 6.66675 24.8954 6.66675 26C6.66675 27.1046 7.56218 28 8.66675 28Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M26 28C27.1046 28 28 27.1046 28 26C28 24.8954 27.1046 24 26 24C24.8954 24 24 24.8954 24 26C24 27.1046 24.8954 28 26 28Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14.6667 14.6667H20.0001M17.3334 17.3333V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </mask>
      <g mask="url(#mask0_456_976)">
        <path d="M0 0H32V32H0V0Z" fill="black"/>
      </g>
    </svg>
  )
}
