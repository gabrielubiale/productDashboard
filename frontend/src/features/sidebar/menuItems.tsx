import {
  House,
  Package,
  SquaresFour,
  ChartPie,
  ChartBar,
  ChartLine,
  CurrencyDollar,
  ChartBarHorizontal,
  TrendUp,
  CurrencyCircleDollar,
} from 'phosphor-react'
import type { MenuItem } from './types'

const ICON_SIZE_ITEM = 28
const ICON_SIZE_SUBITEM = 22

export const menuItems: MenuItem[] = [
  {
    label: 'Início',
    path: '/',
    icon: <House size={ICON_SIZE_ITEM} />,
  },
  {
    label: 'Dashboard',
    path: '/products',
    icon: <SquaresFour size={ICON_SIZE_ITEM} />,
    subItems: [
      {
        label: 'Produtos mais vendidos',
        anchor: '#chart-products-most-sold',
        icon: <ChartBar size={ICON_SIZE_SUBITEM} />,
      },
      {
        label: 'Produtos que mais faturaram',
        anchor: '#chart-products-most-revenue',
        icon: <CurrencyDollar size={ICON_SIZE_SUBITEM} />,
      },
      {
        label: 'Faturamento por mês',
        anchor: '#chart-revenue-by-month',
        icon: <ChartLine size={ICON_SIZE_SUBITEM} />,
      },
      {
        label: 'Vendas por mês',
        anchor: '#chart-sales-count-by-month',
        icon: <ChartBarHorizontal size={ICON_SIZE_SUBITEM} />,
      },
      {
        label: 'Participação no faturamento',
        anchor: '#chart-revenue-share',
        icon: <ChartPie size={ICON_SIZE_SUBITEM} />,
      },
      {
        label: 'Ticket médio por mês',
        anchor: '#chart-average-ticket',
        icon: <ChartLine size={ICON_SIZE_SUBITEM} />,
      },
      {
        label: 'Produto de maior faturamento por mês',
        anchor: '#chart-top-product-sales-by-month',
        icon: <TrendUp size={ICON_SIZE_SUBITEM} />,
      },
      {
        label: 'Vendas por categoria',
        anchor: '#chart-sales-by-category',
        icon: <ChartPie size={ICON_SIZE_SUBITEM} />,
      },
    ],
  },
  {
    label: 'Cobrança',
    path: '/cobranca/lancamentos',
    icon: <CurrencyCircleDollar size={ICON_SIZE_ITEM} />,
    subItems: [
      {
        label: 'Consulta de lançamentos',
        anchor: '#',
        icon: <CurrencyDollar size={ICON_SIZE_SUBITEM} />,
      },
    ],
  },
  {
    label: 'Produtos',
    path: '/lista',
    icon: <Package size={ICON_SIZE_ITEM} />,
  },
]
