"use client"

interface FavoritesHeaderProps {
  productCount: number;
}

export default function FavoritesHeader({ productCount }: FavoritesHeaderProps) {
  return (
    <div className="w-[500px] h-[80px] bg-[#D9D9D9] flex items-center px-6 rounded-lg">
      <h1 className="font-inter text-[48px] font-normal">
        My favorites
        <span className="ml-4 text-[20px]">
          {productCount} product{productCount !== 1 ? 's' : ''}
        </span>
      </h1>
    </div>
  )
} 