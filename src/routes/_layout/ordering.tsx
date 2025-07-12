import { createFileRoute } from '@tanstack/react-router';
import { OrderingManagement } from '@/features/ordering/components/ordering-management';

export const Route = createFileRoute('/_layout/ordering')({
  component: OrderingPage,
  meta: {
    label: 'Ordenação',
  },
});

function OrderingPage() {
  return <OrderingManagement />;
}