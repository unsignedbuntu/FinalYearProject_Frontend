interface CheckboxProps {
  checked: boolean;
  size?: number;
}

export default function Checkbox({ checked, size = 25 }: CheckboxProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 25 25" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect 
        x="0.5" 
        y="0.5" 
        width="24" 
        height="24" 
        rx="4" 
        fill={checked ? "#4CAF50" : "white"} 
        stroke="#000000"
      />
      {checked && (
        <path 
          d="M20 6L9 17L4 12" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
} 