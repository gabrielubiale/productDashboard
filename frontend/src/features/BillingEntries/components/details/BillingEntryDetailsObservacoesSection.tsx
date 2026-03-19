import { SectionHeader } from '../../../../shared/components/SectionHeader'

type ObservacaoItem = { label: string; value: string }

export function BillingEntryDetailsObservacoesSection({
  items,
}: {
  items: ObservacaoItem[]
}) {
  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <SectionHeader title="Observações" />
      <div className="border-t border-gray-200 px-4 py-4">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {items.map((item, index) => (
            <div key={`obs-${index}`} className="flex flex-col gap-0.5">
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

