import React from 'react'

interface SVGIconProps {
  width?: number;
  height?: number;
}

export default function Vector({ width = 73, height = 46 }: SVGIconProps) {
  return (
    <svg width="73" height="46" viewBox="0 0 73 46" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.08146 29.4125H16.1629V40.6896H64.6516V4.60267H16.1629V15.8798H8.08146V2.34723C8.08146 1.1016 9.89057 0.0917969 12.1222 0.0917969H68.6924C70.9241 0.0917969 72.7331 1.1016 72.7331 2.34723V42.9451C72.7331 44.1907 70.9241 45.2005 68.6924 45.2005H12.1222C9.89057 45.2005 8.08146 44.1907 8.08146 42.9451V29.4125ZM32.3258 20.3907V13.6244L52.5295 22.6461L32.3258 31.6679V24.9016H0V20.3907H32.3258Z" fill="black"/>
    </svg>
  )
}
