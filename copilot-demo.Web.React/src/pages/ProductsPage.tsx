import { Package } from 'lucide-react'
import { ProductsTable } from '@/components/products/ProductsTable'

export function ProductsPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
          <Package className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">Manage your product catalog</p>
        </div>
      </div>
      <ProductsTable />
    </div>
  )
}
