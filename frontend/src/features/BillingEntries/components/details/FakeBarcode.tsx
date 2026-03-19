export function FakeBarcode({ code }: { code: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col">
      <div
        className="h-14 w-90 rounded-md bg-white flex items-center justify-center px-3"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, #111827 0px, #111827 2px, transparent 2px, transparent 4px)',
        }}
        aria-hidden
      />
      <div className="mt-2 text-sm font-mono text-gray-600 break-all">{code}</div>
    </div>
  )
}

