import React from 'react'

interface ArrowdownProps {
  className?: string;
}

export default function Arrowdown({ className }: ArrowdownProps) {
  return (
    <svg 
      width="13" 
      height="8" 
      viewBox="0 0 13 8" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M1 1L6.5 6L12 1" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  )
}