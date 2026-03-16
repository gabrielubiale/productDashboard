import { CaretDown, CaretUp } from 'phosphor-react'

type FormHeaderProps = {
  title: string
  isExpanded: boolean
  onToggle: () => void
}

export function FormHeader({ title, isExpanded, onToggle }: FormHeaderProps) {
  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-2 rounded-md cursor-pointer"
        style={{ backgroundColor: '#0F5132' }}
        onClick={onToggle}
      >
        <span className="font-semibold text-left text-[18px] text-white">
          {title}
        </span>
        <span aria-hidden="true" className="ml-2 text-white ">
          {isExpanded ? <CaretUp size={20} /> : <CaretDown size={20} />}
        </span>
      </button>
    </div>
  )
}

