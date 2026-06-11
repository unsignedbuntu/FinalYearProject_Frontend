import React from 'react'

interface SVGIconProps {
  width?: number;
  height?: number;
}

export default function Cart({width = 63, height = 42}: Readonly<SVGIconProps>) {
  return (
    <svg width={width} height={height} viewBox="0 0 63 42" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26.9062 35.5211C29.4433 35.5211 31.5 34.1635 31.5 32.4888C31.5 30.8141 29.4433 29.4565 26.9062 29.4565C24.3692 29.4565 22.3125 30.8141 22.3125 32.4888C22.3125 34.1635 24.3692 35.5211 26.9062 35.5211Z" fill="#792AE8"/>
<path d="M41.3438 35.5211C43.8808 35.5211 45.9375 34.1635 45.9375 32.4888C45.9375 30.8141 43.8808 29.4565 41.3438 29.4565C38.8067 29.4565 36.75 30.8141
36.75 32.4888C36.75 34.1635 38.8067 35.5211 41.3438 35.5211Z" fill="#792AE8"/>
    </svg>
  )
}
