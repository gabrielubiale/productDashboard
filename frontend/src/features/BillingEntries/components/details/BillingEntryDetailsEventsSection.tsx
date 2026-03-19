import type { BillingEntryEvent } from '../../../../services/billingEntriesService'
import { SectionHeader } from '../../../../shared/components/SectionHeader'
import { DynamicTable } from '../../../../shared/components/DynamicTable/DynamicTable'
import { formatDateTime } from '../../../../shared/utils/formatDateTime'

function renderDescricaoEventoWithHighlight(descricao: string) {
  if (!descricao) return null

  const match = descricao.match(/\$([\d.,]+)/)
  if (!match) {
    return descricao.split('\n').map((line, index) => (
      <span key={index} className="block">
        {line}
      </span>
    ))
  }

  const rawAmount = match[1]
  const amountNumber = Number(rawAmount.replace(/\./g, '').replace(',', '.'))

  const formattedAmount = Number.isFinite(amountNumber)
    ? amountNumber.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
    : rawAmount

  const before = descricao.slice(0, match.index)
  const after = descricao.slice((match.index ?? 0) + match[0].length)

  return (
    <>
      {before && <span className="block whitespace-pre-line">{before}</span>}
      <span className="block font-semibold text-emerald-700">{formattedAmount}</span>
      {after && <span className="block whitespace-pre-line">{after}</span>}
    </>
  )
}

export function BillingEntryDetailsEventsSection({ events }: { events: BillingEntryEvent[] }) {
  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <SectionHeader title="Eventos" />
      <div className="p-0">
        <div className="border-t border-gray-200 px-3 py-3">
          <DynamicTable<BillingEntryEvent>
            data={events}
            keyExtractor={(_item: BillingEntryEvent, index: number) => String(index)}
            minWidth="600px"
            emptyMessage="Nenhum evento encontrado para este lançamento."
            columns={[
              {
                id: 'data',
                header: 'Data e hora',
                render: (item) => formatDateTime(item.data),
              },
              {
                id: 'tipoEvento',
                header: 'Tipo do evento',
                render: (item) => item.tipoEvento,
              },
              {
                id: 'descricaoEvento',
                header: 'Descrição',
                render: (item) => (
                  <div className="text-sm text-gray-700">
                    {renderDescricaoEventoWithHighlight(item.descricaoEvento)}
                  </div>
                ),
              },
              {
                id: 'usuario',
                header: 'Usuário',
                render: (item) => item.usuario,
              },
            ]}
          />
        </div>
      </div>
    </section>
  )
}

