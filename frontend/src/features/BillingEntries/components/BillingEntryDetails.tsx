import { CaretDown, CaretUp } from 'phosphor-react'
import { useState } from 'react'
import type { BillingEntry } from '../../../services/billingEntriesService'
import { formatDocument } from '../../../shared/utils/formatDocument'

type BillingEntryDetailsProps = {
  entry: BillingEntry
}

type SectionId =
  | 'identificacao'
  | 'contribuinte'
  | 'credito'
  | 'valores'
  | 'divida'
  | 'identificacaoCredito'

export function BillingEntryDetails({ entry }: BillingEntryDetailsProps) {
  const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>({
    identificacao: true,
    contribuinte: true,
    credito: true,
    valores: true,
    divida: false,
    identificacaoCredito: false,
  })

  function toggle(section: SectionId) {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="flex flex-col gap-3 text-sm text-gray-700">
      {/* Bloco 1 - Informações de origem do lançamento */}
      <div className="px-3 py-3 space-y-4">
          {/* Linha 1: Nome + CPF/CNPJ centralizados ocupando 100% */}
          <div className="flex flex-row flex-wrap items-center justify-center text-center gap-2">
            <span className="font-semibold text-gray-900 text-base">
              {entry.nome} - {formatDocument(entry.documentoRFB)}
            </span>
          </div>

          {/* Linha 2: duas metades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Metade esquerda: situação em destaque + origem */}
            <div className="flex flex-col gap-3 border rounded justify-center items-center p-3">
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm text-gray-500 align-middle">Situação</span>
                <span className="font-semibold text-gray-900 text-lg">
                  {entry.situacaoLancamentoVirtualDescricao || entry.situacaoLancamentoDescricao}
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-sm text-gray-500">Origem</span>
                <span className="font-semibold text-gray-900 text-base">
                  {entry.tipoCreditoDescricaoResumida || entry.tipoCreditoDescricao}
                </span>
              </div>
            </div>

            {/* Metade direita: demais infos chave/valor com space-between */}
            <div className="flex flex-col justify-around gap-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-500">Data do fato gerador</span>
                <span className="font-semibold text-gray-900 text-base">
                  {entry as any && (entry as any).dataFatoGerador
                    ? new Date((entry as any).dataFatoGerador).toLocaleDateString('pt-BR')
                    : '-'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-500">Data de vencimento</span>
                <span className="font-semibold text-gray-900 text-base">
                  {new Date(entry.dataVencimento).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-500">N° lançamento</span>
                <span className="font-semibold text-gray-900 text-base">
                  {entry.numeroLancamento}
                </span>
              </div>
            </div>
          </div>
      </div>

      {/* Bloco 2 - Valores */}
      <section className="flex flex-col rounded-lg border border-gray-200">
        <button
          type="button"
          onClick={() => toggle('valores')}
          className="flex w-full items-center justify-between px-3 py-2 text-left cursor-pointer bg-blue-100"
        >
          <span className="text-[11px] font-semibold tracking-wide text-gray-700 uppercase">
            Valores do lançamento
          </span>
          {openSections.valores ? (
            <CaretUp size={16} className="text-gray-500" />
          ) : (
            <CaretDown size={16} className="text-gray-500" />
          )}
        </button>
        {openSections.valores && (
          <div className="flex flex-row gap-4 border-t border-gray-200 px-3 py-3">

            {/* esquerda */}
            <div className='w-full flex flex-col gap-2'>
              <div className='flex flex-row items-center justify-between gap-1'>
                <span className="text-sm text-gray-600">Valor original</span>
                <span className=" text-green-900 text-base">
                  R$ {entry.valorOriginal}
                </span>
              </div>
              <div className='flex flex-row items-center justify-between gap-1'>
                <span className="text-[14px] text-gray-600">Juros</span>
                <span className="text-[14px]">
                  R$ {entry.valorJurosTotal}
                </span>
              </div>
              <div className='flex flex-row items-center justify-between gap-1'>
                <span className="text-[14px] text-gray-600">Multa</span>
                <span className="text-[14px]">
                  R$ {entry.valorMultaTotal}
                </span>
              </div>
              <div className='flex flex-row items-center justify-between gap-1'>
                <span className="text-[14px] text-gray-600">Correção monetária</span>
                <span className="text-[14px]">
                  R$ {entry.valorCorrecaoMonetariaTotal}
                </span>
              </div>
              <div className='flex flex-row items-center justify-between gap-1'>
                <span className="text-sm font-bold text-gray-600">Valor Total</span>
                <span className="font-bold text-green-900 text-base">
                  R$ {entry.valorTotal}
                </span>
              </div>
            </div>

            {/* direita */}
            <div className='w-full flex flex-col gap-2'>
              <div className='flex flex-row items-center justify-between gap-1'>
                <span className="text-sm text-gray-600">Valor Principal Liquidado</span>
                <span className=" text-green-900 text-base">
                  R$ {(entry.valorJurosRecebido + entry.valorMultaRecebida + entry.valorCorrecaoMonetariaRecebida).toFixed(2)}
                </span>
              </div>

              <div className='flex flex-row items-center justify-between gap-1'>
                <span className="text-[14px] text-gray-600">Juros</span>
                <span className="text-[14px]">
                  R$ {entry.valorJurosRecebido}
                </span>
              </div>

              <div className='flex flex-row items-center justify-between gap-1'>
                <span className="text-[14px] text-gray-600">Multa</span>
                <span className="text-[14px]">
                  R$ {entry.valorMultaRecebida}
                </span>
              </div>

              <div className='flex flex-row items-center justify-between gap-1'>
                <span className="text-[14px] text-gray-600">Correção monetária</span>
                <span className="text-[14px]">
                  R$ {entry.valorCorrecaoMonetariaRecebida}
                </span>
              </div>

              <div className='flex flex-row items-center justify-between gap-1'>
                <span className="text-sm font-bold text-gray-600">Valor Liquidado</span>
                <span className="font-bold text-green-900 text-base">
                  R$ {(entry.valorJurosRecebido + entry.valorMultaRecebida + entry.valorCorrecaoMonetariaRecebida).toFixed(2)}
                </span>
              </div>

            </div>
          </div>
        )}
      </section>

      {/* Bloco 3 - Histórico de lançamentos */}
      <section className="flex flex-col rounded-lg border border-gray-200">
        <button
          type="button"
          onClick={() => toggle('divida')}
          className="flex w-full items-center justify-between px-3 py-2 text-left cursor-pointer bg-gray-50"
        >
          <span className="text-[11px] font-semibold tracking-wide text-gray-700 uppercase">
            Histórico de lançamentos
          </span>
          {openSections.divida ? (
            <CaretUp size={16} className="text-gray-500" />
          ) : (
            <CaretDown size={16} className="text-gray-500" />
          )}
        </button>
        {openSections.divida && (
          <div className="border-t border-gray-200 px-3 py-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">Em dívida ativa</span>
                <span className="font-semibold text-gray-900 text-base">
                  {entry.dividaAtiva ? 'Sim' : 'Não'}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">Com CDA</span>
                <span className="font-semibold text-gray-900 text-base">
                  {entry.dividaAtivaComCDA ? 'Sim' : 'Não'}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">N° DAT</span>
                <span className="font-semibold text-gray-900 text-base">
                  {entry.numeroDAT || '-'}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">N° CDA</span>
                <span className="font-semibold text-gray-900 text-base">
                  {entry.numeroCDA || '-'}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">Parcelado</span>
                <span className="font-semibold text-gray-900 text-base">
                  {entry.parcelado ? 'Sim' : 'Não'}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">N° parcelamento</span>
                <span className="font-semibold text-gray-900 text-base">
                  {entry.numeroParcelamento || '-'}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Bloco 4 - Eventos */}
      <section className="flex flex-col rounded-lg border border-gray-200">
        <button
          type="button"
          onClick={() => toggle('identificacaoCredito')}
          className="flex w-full items-center justify-between px-3 py-2 text-left cursor-pointer bg-gray-50"
        >
          <span className="text-[11px] font-semibold tracking-wide text-gray-700 uppercase">
            Eventos
          </span>
          {openSections.identificacaoCredito ? (
            <CaretUp size={16} className="text-gray-500" />
          ) : (
            <CaretDown size={16} className="text-gray-500" />
          )}
        </button>
        {openSections.identificacaoCredito && (
          <div className="border-t border-gray-200 px-3 py-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm text-gray-500">Descrição crédito</span>
                <span className="font-semibold text-gray-900 text-base">
                  {entry.identificacaoCreditoDescricao}
                </span>
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm text-gray-500">Descrição resumida</span>
                <span className="font-semibold text-gray-900 text-base">
                  {entry.identificacaoCreditoDescricaoResumida}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">Identificação</span>
                <span className="font-semibold text-gray-900 text-base">
                  {entry.identificacaoDescricao}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">Valor identificação</span>
                <span className="font-semibold text-gray-900 text-base">
                  {entry.identificacaoValor}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

