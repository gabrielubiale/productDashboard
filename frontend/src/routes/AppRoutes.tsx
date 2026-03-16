import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '../shared/components/Layout/AppLayout'
import { LandingPage } from '../pages/LandingPage'
import { Products } from '../pages/Products'
import { ProductsListPage } from '../pages/ProductsListPage'
import { BillingEntriesPage } from '../pages/BillingEntriesPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AppLayout />}>
        <Route path="/products" element={<Products />} />
        <Route path="/lista" element={<ProductsListPage />} />
        <Route path="/cobranca/lancamentos" element={<BillingEntriesPage />} />
        <Route path="/products/new" element={<Products />} />
        <Route path="/products/:id/edit" element={<Products />} />
      </Route>
    </Routes>
  )
}

