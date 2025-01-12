import React from 'react'

interface Props {
  className?: string;
}

const TicketLine: React.FC<Props> = ({ className = "" }) => {
  return (
    <svg 
      width="340" 
      height="2" 
      viewBox="0 0 340 2" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M0 1H340" 
        stroke="black" 
        strokeWidth="2"
        strokeDasharray="4 4"
      />
    </svg>
  )
}

export default TicketLine