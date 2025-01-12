import React from 'react';

interface BackProps {
  className?: string;
}

export default function Back({ className = "" }: BackProps) {
  return (
    
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_513_2952" style={{maskType: "luminance"}} maskUnits="userSpaceOnUse" x="1" y="1" width="30" height="30">
    <path d="M15.9998 29.3333C23.3638 29.3333 29.3332 23.364 29.3332 16C29.3332 8.63599 23.3638 2.66666 15.9998 2.66666C8.63584 2.66666 2.6665 8.63599 2.6665 16C2.6665 23.364 8.63584 29.3333 15.9998 29.3333Z" fill="#555555" stroke="white" stroke-width="2" stroke-linejoin="round"/>
    <path d="M18 22L12 16L18 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </mask>
    <g mask="url(#mask0_513_2952)">
    <path d="M0 0H32V32H0V0Z" fill="black"/>
    </g>
    </svg>
    
  );
}
