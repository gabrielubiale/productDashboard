import { SectionHeader } from '../../../../shared/components/SectionHeader'

type HistoricoItem = { label: string; value: string }

export function BillingEntryDetailsHistoricoSection({ items }: { items: HistoricoItem[] }) {
  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <SectionHeader title="Histórico de lançamentos" />
      <div className="border-t border-gray-200 px-4 py-4">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {items.map((item, index) => (
            <div key={`hist-${index}`} className="flex flex-col gap-0.5">
              {item.label && (
                <span className="text-sm font-medium uppercase tracking-wide text-gray-500">
                  {item.label}
                </span>
              )}
              <span className="whitespace-pre-line text-sm font-medium text-gray-900">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

