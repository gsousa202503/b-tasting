import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginForm } from '@/components/auth/login-form';

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    // If user is already authenticated, redirect to dashboard
    if (context.auth?.isAuthenticated) {
      throw redirect({
        to: '/painel',
      });
    }
  },
  component: LoginPage,
  meta: {
    label: 'Entrar',
  },
});

function LoginPage() {
  return <LoginForm />;
}