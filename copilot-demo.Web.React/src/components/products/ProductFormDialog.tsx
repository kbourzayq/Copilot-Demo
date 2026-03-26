import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ProductDto } from '@/api/types'

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0.01, {
      message: 'Price must be at least $0.01',
    }),
})

type FormValues = z.infer<typeof schema>

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (name: string, price: number) => void
  isLoading?: boolean
  product?: ProductDto | null
}

export function ProductFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  product,
}: ProductFormDialogProps) {
  const isEdit = !!product

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', price: '' },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: product?.name ?? '',
        price: product ? String(product.price) : '',
      })
    }
  }, [open, product, reset])

  function onValid(values: FormValues) {
    onSubmit(values.name, Number(values.price))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Product' : 'Add Product'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the product details below.' : 'Fill in the details to add a new product.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onValid)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" placeholder="e.g. Wireless Headphones" {...register('name')} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="price">Price ($)</Label>
            <Input id="price" type="number" step="0.01" placeholder="0.00" {...register('price')} />
            {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (isEdit ? 'Saving…' : 'Adding…') : isEdit ? 'Save Changes' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
