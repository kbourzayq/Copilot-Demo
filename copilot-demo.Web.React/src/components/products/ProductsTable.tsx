import { useState } from 'react'
import { Pencil, Trash2, Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/hooks/useProducts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProductFormDialog } from './ProductFormDialog'
import { DeleteProductDialog } from './DeleteProductDialog'
import type { ProductDto } from '@/api/types'

export function ProductsTable() {
  const { data: products, isLoading, isError } = useProducts()
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()

  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<ProductDto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ProductDto | null>(null)

  const filtered = (products ?? []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  function handleAdd() {
    setEditProduct(null)
    setFormOpen(true)
  }

  function handleEdit(product: ProductDto) {
    setEditProduct(product)
    setFormOpen(true)
  }

  async function handleFormSubmit(name: string, price: number) {
    try {
      if (editProduct) {
        await updateMutation.mutateAsync({ id: editProduct.id, data: { name, price } })
        toast.success('Product updated successfully')
      } else {
        await createMutation.mutateAsync({ name, price })
        toast.success('Product added successfully')
      }
      setFormOpen(false)
    } catch {
      toast.error(editProduct ? 'Failed to update product' : 'Failed to add product')
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      toast.success(`"${deleteTarget.name}" deleted`)
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete product')
    }
  }

  const isMutating = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        {isError && (
          <div className="px-6 py-4 text-sm text-red-600 bg-red-50 border-b border-red-100">
            Failed to load products. Please try again.
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 bg-gray-100 rounded animate-pulse w-40" /></TableCell>
                  <TableCell><div className="h-4 bg-gray-100 rounded animate-pulse w-20" /></TableCell>
                  <TableCell><div className="h-4 bg-gray-100 rounded animate-pulse w-28" /></TableCell>
                  <TableCell><div className="h-4 bg-gray-100 rounded animate-pulse w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-gray-400">
                  {search ? 'No products match your search.' : 'No products yet. Add one to get started.'}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      ${product.price.toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {new Date(product.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                        title="Edit product"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteTarget(product)}
                        title="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {!isLoading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400">
            Showing {filtered.length} of {products?.length ?? 0} product{products?.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        isLoading={isMutating}
        product={editProduct}
      />

      <DeleteProductDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        productName={deleteTarget?.name ?? ''}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
