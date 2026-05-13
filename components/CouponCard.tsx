import React from 'react'
import Ticket from './icons/Ticket'
import TicketHour from './icons/TicketHour'
import TicketLine from './icons/TicketLine'

interface CouponCardProps {
  amount: number;
  minimumLimit: number;
  validUntil: string;
  supplier: string;
}

const CouponCard: React.FC<CouponCardProps> = ({
  amount,
  minimumLimit,
  validUntil,
  supplier
}) => {
  return (
    <div className="relative w-[380px]">
      <Ticket className="w-full" />
      <div className="absolute inset-0 p-6">
        <div className="flex items-baseline gap-2">
          <span className="font-inter text-[24px] font-normal">{amount}</span>
          <span className="font-inter text-[24px] font-normal">TL discount</span>
        </div>

        <div className="font-inter text-[16px] font-normal text-[#5C5C5C] opacity-40 mt-1">
          Minimum limit : {minimumLimit} TL
        </div>

        <div className="flex items-center gap-2 mt-2">
          <TicketHour width={12} height={20} />
          <span className="font-inter text-[16px] font-normal">
            Valid until {validUntil}
          </span>
        </div>

        <div className="flex justify-center mt-2">
          <TicketLine className="w-full" />
        </div>

        <div className="flex gap-1 mt-2">
          <span className="font-raleway text-[14px] font-normal">
            Valid for all products from supplier
          </span>
          <span className="font-raleway text-[20px] font-normal text-[#00FFB7]">
            {supplier}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CouponCard 