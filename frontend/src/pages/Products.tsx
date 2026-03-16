import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProductsStore } from '../store/productsStore'
import { useSalesStore } from '../store/salesStore'
import { ProductsCharts } from '../features/products/components/dashboard/ProductsCharts'
import { StatsCardsProductsDashboard } from '../features/products/components/dashboard/StatsCards'
import { ProductForm } from '../features/products/components/form/ProductForm'
import { Loader } from '../shared/components/Loader/Loader'
import { ErrorMessage } from '../shared/components/ErrorMessage/ErrorMessage'
import { EmptyState } from '../shared/components/EmptyState/EmptyState'
import { PageTitle } from '../shared/components/PageTitle/PageTitle'

export function Products() {
  const [searchParams] = useSearchParams()
  const { products, isLoading, error, loadProducts, setFilters } = useProductsStore()
  const { loadSales } = useSalesStore()

  const isFormMode = Boolean(searchParams.get('mode') === 'form')

  useEffect(() => {
    const search = searchParams.get('search') ?? undefined
    const status = (searchParams.get('status') as 'active' | 'inactive' | null) ?? undefined

    setFilters({ search, status })
    void loadProducts()
    void loadSales()
  }, [loadProducts, loadSales, searchParams, setFilters])

  useEffect(() => {
    if (isFormMode || isLoading || error || products.length === 0) return
    const hash = window.location.hash
    if (!hash) return
    const scrollToAnchor = () => {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    const t = setTimeout(scrollToAnchor, 100)
    return () => clearTimeout(t)
  }, [isFormMode, isLoading, error, products.length])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {!isFormMode && (
        <PageTitle
          title="Dashboard"
          description="Visão estratégica de produtos e vendas."
          action={
            <a
              href="/products?mode=form"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Novo produto
            </a>
          }
        />
      )}

      {isFormMode ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <ProductForm />
        </div>
      ) : (
        <>
          {isLoading && <Loader />}

          {!isLoading && !!error && (
            <ErrorMessage message={error} onRetry={loadProducts} />
          )}

          {!isLoading && !error && products.length === 0 && (
            <EmptyState
              title="Nenhum produto encontrado"
              description="Crie seu primeiro produto para visualizar o dashboard."
              actionLabel="Criar produto"
              onAction={() => (window.location.href = '/products?mode=form')}
            />
          )}

          {!isLoading && !error && products.length > 0 && (
            <>
              <StatsCardsProductsDashboard />
              <hr className="my-8 border-gray-200" />
              <ProductsCharts />
            </>
          )}
        </>
      )}
    </div>
  )
}
