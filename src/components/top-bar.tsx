import { Menu, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSidebar } from './sidebar-provider';
import { CreateSessionDialog } from '@/features/sessions/components/create-session-dialog';
import { ThemeToggle } from './theme-toggle';
import { UserMenu } from '@/components/auth/user-menu';

export function TopBar() {
  const { toggle, isCollapsed } = useSidebar();

  return (
    <header className={cn(
      "flex h-16 items-center justify-between border-b border-beer-medium/20 bg-white/50 backdrop-blur-sm px-4 md:px-6 transition-all duration-300",
      // Add left margin when sidebar is collapsed on desktop
      "layout-transition"
    )}>
      <div className="flex items-center gap-4">
        {/* Unified sidebar toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="text-beer-dark hover:bg-beer-light/50"
          aria-label="Alternar menu lateral"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}