import { useProducts } from '@/hooks/useProducts'
import { Package, TrendingUp, DollarSign, AlertCircle } from 'lucide-react'

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
}: {
  title: string
  value: string | number
  icon: React.ElementType
  color: string
  subtitle?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
    </div>
  )
}

export function HomePage() {
  const { data: products, isLoading, isError } = useProducts()

  const totalProducts = products?.length ?? 0
  const avgPrice =
    products && products.length > 0
      ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)
      : '0.00'
  const totalValue =
    products?.reduce((sum, p) => sum + p.price, 0).toFixed(2) ?? '0.00'

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome to Product Hub — your product management console.</p>
      </div>

      {isError && (
        <div className="mb-6 flex items-center gap-3 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          Could not connect to the API. Make sure the API service is running.
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
              <div className="h-8 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={Package}
            color="bg-indigo-500"
            subtitle="in the catalog"
          />
          <StatCard
            title="Average Price"
            value={`$${avgPrice}`}
            icon={TrendingUp}
            color="bg-emerald-500"
            subtitle="across all products"
          />
          <StatCard
            title="Total Catalog Value"
            value={`$${totalValue}`}
            icon={DollarSign}
            color="bg-violet-500"
            subtitle="combined product prices"
          />
        </div>
      )}

      <div className="mt-8 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Quick Start</h2>
        <p className="text-sm text-gray-500">
          Navigate to <strong>Products</strong> in the sidebar to manage your catalog — add new products, update
          prices, or remove items.
        </p>
      </div>
    </div>
  )
}
