import React from 'react'

interface AddressProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function Address({ width = 64, height = 64, color = "#000000" }: AddressProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M32 3C19.85 3 10 12.85 10 25C10 41.25 32 61 32 61C32 61 54 41.25 54 25C54 12.85 44.15 3 32 3ZM32 33C27.6 33 24 29.4 24 25C24 20.6 27.6 17 32 17C36.4 17 40 20.6 40 25C40 29.4 36.4 33 32 33Z" 
        fill={color}
      />
    </svg>
  )
}
