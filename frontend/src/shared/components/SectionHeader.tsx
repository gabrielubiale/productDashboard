type SectionHeaderProps = {
  title: string
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between p-4 text-left bg-gray-100 rounded-t-lg">
      <span className="text-[16px] font-semibold tracking-wide text-gray-700 uppercase">
        {title}
      </span>
    </div>
  )
}

