import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProductsStore } from '../store/productsStore'
import { useSalesStore } from '../store/salesStore'
import { ProductsFilters } from '../features/products/components/list/ProductsFilters'
import { ProductsTable } from '../features/products/components/list/ProductsTable'
import { ProductCreateModal } from '../features/products/components/modals/ProductCreateModal'
import { ProductEditModal } from '../features/products/components/modals/ProductEditModal'
import { ProductDeleteModal } from '../features/products/components/modals/ProductDeleteModal'
import { PageTitle } from '../shared/components/PageTitle/PageTitle'
import { Loader } from '../shared/components/Loader/Loader'
import { ErrorMessage } from '../shared/components/ErrorMessage/ErrorMessage'
import { EmptyState } from '../shared/components/EmptyState/EmptyState'

export function ProductsListPage() {
  const [searchParams] = useSearchParams()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editProductId, setEditProductId] = useState<string | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<{ id: string; name: string } | null>(null)

  const { products, isLoading, error, loadProducts, removeProduct, setFilters } = useProductsStore()
  const { loadSales } = useSalesStore()

  useEffect(() => {
    const search = searchParams.get('search') ?? undefined
    const status = (searchParams.get('status') as 'active' | 'inactive' | null) ?? undefined

    setFilters({ search, status })
    void loadProducts()
    void loadSales()
  }, [loadProducts, loadSales, searchParams, setFilters])

  async function handleDeleteConfirm() {
    if (deleteProduct) {
      await removeProduct(deleteProduct.id)
      setDeleteProduct(null)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageTitle
        title="Gerenciamento de produtos"
        description="Gerencie o catálogo de produtos."
        action={
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Novo produto
          </button>
        }
      />

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <ProductsFilters isLoading={isLoading} />
      </div>

      {isLoading && <Loader />}

      {!isLoading && !!error && (
        <ErrorMessage message={error} onRetry={loadProducts} />
      )}

      {!isLoading && !error && products.length === 0 && (
        <EmptyState
          title="Nenhum produto encontrado"
          description="Tente ajustar os filtros ou criar um novo produto."
          actionLabel="Criar produto"
          onAction={() => setCreateModalOpen(true)}
        />
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <ProductsTable
            products={products}
            onEdit={(p) => setEditProductId(p.id)}
            onDelete={(p) => setDeleteProduct({ id: p.id, name: p.name })}
          />
        </div>
      )}

      <ProductCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={loadProducts}
      />

      <ProductEditModal
        isOpen={editProductId !== null}
        onClose={() => setEditProductId(null)}
        productId={editProductId}
        onSuccess={loadProducts}
      />

      <ProductDeleteModal
        isOpen={deleteProduct !== null}
        onClose={() => setDeleteProduct(null)}
        productId={deleteProduct?.id ?? null}
        productName={deleteProduct?.name}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
