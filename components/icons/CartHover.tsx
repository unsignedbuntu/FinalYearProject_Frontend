import React from 'react'

interface CartHoverProps {
  width?: number;
  height?: number;
  fill?: string;
}

  export default function CartHover({ width = 39, height = 36, fill = "#792AE8" }: Readonly<CartHoverProps>){

  return (
    <svg  width={width} height={height} viewBox="0 0 39 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.9373 30.75C16.6286 30.75 17.9998 29.5747 17.9998 28.125C17.9998 26.6753 16.6286 25.5 14.9373 25.5C13.2459 25.5 11.8748 26.6753 11.8748 28.125C11.8748 29.5747 13.2459 30.75 14.9373 30.75Z" fill={fill}/>
    <path d="M24.5623 30.75C26.2536 30.75 27.6248 29.5747 27.6248 28.125C27.6248 26.6753 26.2536 25.5 24.5623 25.5C22.8709 25.5 21.4998 26.6753 21.4998 28.125C21.4998 ２９.５７４７ ２２．８７０９ ３０．７５ ２４ ．５６２３ ３０．７５Ｚ" fill={fill}/>
    <path fillRule="evenodd" clipRule="evenodd" d="M9.91475// 8.25H29.9148L27.9148 22.5H11.9148L9.91475 8.25ZM29.9148 6.75C30.4971 6.75 30.9998 7.25269 30.9998 7.83599L31 7.83599V7.83599C31 8.4183 30.4971 8.921 29.9148 8.921H9.91475C9.33243 8.921 8.82975 8.4183 8.82975 7.83599L8.82975 7.83599C8.82975 7.25269 9.33243 6.75 9.91475 6.75H29.9148Z" fill={fill}/>
    </svg>
  )
  }   