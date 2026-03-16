import { PageTitle } from '../shared/components/PageTitle/PageTitle'
import { DynamicTable } from '../shared/components/DynamicTable/DynamicTable'

type BillingEntry = {
  id: string
}

const columns = [
  {
    id: 'id',
    header: 'ID do lançamento',
    render: (item: BillingEntry) => item.id,
  },
]

export function BillingEntriesPage() {
  const data: BillingEntry[] = []

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageTitle
        title="Consulta de lançamentos"
        description="Tela de consulta de lançamentos financeiros/tributários."
      />

      <DynamicTable
        data={data}
        columns={columns}
        keyExtractor={(item) => item.id}
        emptyMessage="Nenhum lançamento encontrado. Ajuste os filtros ou importe lançamentos."
        minWidth="600px"
      />
    </div>
  )
}

