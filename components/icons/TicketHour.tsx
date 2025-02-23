import React from 'react'

interface Props {
  width?: number;
  height?: number;
  className?: string;
}

const TicketHour: React.FC<Props> = ({ width = 12, height = 20, className = "" }) => {
  return (
    <svg 
      width={width}
      height={height}
      viewBox="0 0 12 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M12 20H0V14L4 10L0 6V0H12V6L8 10L12 14M2 5.5L6 9.5L10 5.5V2H2M6 10.5L2 14.5V18H10V14.5M8 16H4V15.2L6 13.2L8 15.2V16Z" fill="currentColor"/>
    </svg>
  )
}

export default TicketHour