import React from 'react';
    
interface Props {
  width: number;
  height: number;
  className?: string;
  onClick?: () => void;
}

export default function TrashIcon({ width, height, className = '', onClick }: Props) {
    return (
<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_495_1720)">
<path d="M4 7.44444H24M11.5 11.8889V18.5556M16.5 11.8889V18.5556M5.25 7.44444L6.5 20.7778C6.5 21.3671 6.76339 21.9324 7.23223 22.3491C7.70107 22.7659 8.33696 23 9 23H19C19.663 23 20.2989 22.7659 20.7678 22.3491C21.2366 21.9324 21.5 21.3671 21.5 20.7778L22.75 7.44444M10.25 7.44444V4.11111C10.25 3.81643 10.3817 3.53381 10.6161 3.32544C10.8505 3.11706 11.1685 3 11.5 3H16.5C16.8315 3 17.1495 3.11706 17.3839 3.32544C17.6183 3.53381 17.75 3.81643 17.75 4.11111V7.44444" stroke="#FFF700" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_495_1720">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
        )
}