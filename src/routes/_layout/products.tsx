import { createFileRoute } from '@tanstack/react-router';
import { ProductsManagement } from '@/features/products/components/products-management';

export const Route = createFileRoute('/_layout/products')({
  component: ProductsPage,
  meta: {
    label: 'Produtos',
  },
});

function ProductsPage() {
  return <ProductsManagement />;
}