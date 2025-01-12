import React from 'react'

interface Props {
  className?: string;
  width?: number;
  height?: number;
}

export default function Ticket({ className = "", width = 380, height = 180 }: Props) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 380 180" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M0 20C0 8.95431 8.95431 0 20 0H360C371.046 0 380 8.95431 380 20V160C380 171.046 371.046 180 360 180H20C8.95431 180 0 171.046 0 160V20Z" 
        fill="#FF9D00"
      />
    </svg>
  )
}

