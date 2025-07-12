import { createFileRoute } from '@tanstack/react-router';
import { OrderingRulesManagement } from '@/features/ordering/components/ordering-rules-management';

export const Route = createFileRoute('/_layout/ordering-rules')({
  component: OrderingRulesPage,
  meta: {
    label: 'Regras de Ordenação',
  },
});

function OrderingRulesPage() {
  return <OrderingRulesManagement />;
}