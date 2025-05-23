import React from 'react'

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

const Information: React.FC<Props> = ({ className = "", style }) => {
  return (
    <svg 
      width="48" 
      height="48" 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path 
        d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM26 34H22V22H26V34ZM26 18H22V14H26V18Z" 
        fill="#5365BF"
      />
    </svg>
  )
}

export default Information