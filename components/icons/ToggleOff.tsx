import React from 'react';

interface ToggleOffProps {
  className?: string;
}

export default function ToggleOff({ className = "" }: ToggleOffProps) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
<path d="M10.5 27C8 27 5.875 26.125 4.125 24.375C2.375 22.625 1.5 20.5 1.5 18C1.5 15.5 2.375 13.375 4.125 11.625C5.875 9.875 8 9 10.5 9H25.5C28 9 30.125 9.875 31.875 11.625C33.625 13.375 34.5 15.5 34.5 18C34.5 20.5 33.625 22.625 31.875 24.375C30.125 26.125 28 27 25.5 27H10.5ZM10.5 22.5C11.75 22.5 12.8125 22.0625 13.6875 21.1875C14.5625 20.3125 15 19.25 15 18C15 16.75 14.5625 15.6875 13.6875 14.8125C12.8125 13.9375 11.75 13.5 10.5 13.5C9.25 13.5 8.1875 13.9375 7.3125 14.8125C6.4375 15.6875 6 16.75 6 18C6 19.25 6.4375 20.3125 7.3125 21.1875C8.1875 22.0625 9.25 22.5 10.5 22.5Z" fill="black"/>
    </svg>
  )
}