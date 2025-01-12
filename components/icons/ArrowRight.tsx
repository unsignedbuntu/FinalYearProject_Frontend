import React from 'react'

interface Props {
  width?: number
  height?: number
  className?: string
}

export default function ArrowRight({ width = 32, height = 32, className = '' }: Props) {
  return (
    <svg 
      width={width} 
      height={height} 
      className={className}
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M12 24L20 16L12 8" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}