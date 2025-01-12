import React from 'react'

interface Props {
  className?: string;
  onClick?: () => void;
}

export default function Exit({ className = "", onClick }: Props) {
  return (
    <svg 
      width="37" 
      height="37" 
      viewBox="0 0 37 37" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      <g clip-path="url(#clip0_867_366)">
        <path d="M2.3125 0H34.6875C35.9647 0 37 0.828282 37 1.85V35.15C37 36.1718 35.9647 37 34.6875 37H2.3125C1.03535 37 0 36.1718 0 35.15V1.85C0 0.828282 1.03535 0 2.3125 0ZM11.5625 16.65V11.1L0 18.5L11.5625 25.9V20.35H25.4375V16.65H11.5625Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="clip0_867_366">
          <rect width="37" height="37" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  )
}
