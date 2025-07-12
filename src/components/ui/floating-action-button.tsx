import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  Beer, 
  FlaskConical, 
  Users, 
  Package,
  X,
  Zap
} from 'lucide-react';
import { CreateSessionDialog } from '@/features/sessions/components/create-session-dialog';
import { Link } from '@tanstack/react-router';

interface FABAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  href?: string;
  color?: string;
}

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const actions: FABAction[] = [
    {
      id: 'create-session',
      label: 'Nova Sessão',
      icon: Beer,
      action: () => {
        setShowCreateDialog(true);
        setIsOpen(false);
      },
      color: 'bg-beer-medium hover:bg-beer-dark'
    },
    {
      id: 'quick-sample',
      label: 'Buscar Amostras',
      icon: FlaskConical,
      href: '/samples',
      action: () => setIsOpen(false),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'add-taster',
      label: 'Gerenciar Degustadores',
      icon: Users,
      href: '/tasters',
      action: () => setIsOpen(false),
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 'add-product',
      label: 'Gerenciar Produtos',
      icon: Package,
      href: '/products',
      action: () => setIsOpen(false),
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      id: 'ordering',
      label: 'Configurar Ordenação',
      icon: Zap,
      href: '/ordering',
      action: () => setIsOpen(false),
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const renderActionButton = (action: FABAction, index: number) => {
    const buttonContent = (
      <Button
        size="icon"
        className={cn(
          "h-12 w-12 rounded-full shadow-lg transition-all duration-300 transform",
          action.color || "bg-gray-600 hover:bg-gray-700",
          "hover:scale-110 hover:shadow-xl",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}
        style={{
          transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
        }}
        onClick={action.action}
      >
        <action.icon className="h-5 w-5 text-white" />
      </Button>
    );

    const wrappedButton = (
      <TooltipProvider key={action.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            {action.href ? (
              <Link to={action.href} onClick={action.action}>
                {buttonContent}
              </Link>
            ) : (
              buttonContent
            )}
          </TooltipTrigger>
          <TooltipContent side="left" className="mr-2">
            <p>{action.label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    return (
      <div
        key={action.id}
        className={cn(
          "transition-all duration-300",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {wrappedButton}
      </div>
    );
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
        {/* Action Buttons */}
        <div className="flex flex-col items-end space-y-3">
          {actions.map((action, index) => renderActionButton(action, index))}
        </div>

        {/* Main FAB Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={toggleMenu}
                className={cn(
                  "h-14 w-14 rounded-full shadow-xl transition-all duration-300 transform",
                  "bg-beer-medium hover:bg-beer-dark text-white",
                  "hover:scale-110 hover:shadow-2xl",
                  "focus:outline-none focus:ring-2 focus:ring-beer-medium focus:ring-offset-2",
                  isOpen && "rotate-45"
                )}
                aria-label={isOpen ? "Fechar menu de ações" : "Abrir menu de ações"}
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Plus className="h-6 w-6" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="mr-2">
              <p>{isOpen ? "Fechar menu" : "Ações rápidas"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Create Session Dialog */}
      {showCreateDialog && (
        <CreateSessionDialog onClose={() => setShowCreateDialog(false)} />
      )}
    </>
  );
}