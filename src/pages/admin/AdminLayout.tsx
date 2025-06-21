import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutDashboard, Users, BookMarked, CreditCard } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const AdminLayout = () => {
  const { theme } = useTheme();

  const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center p-3 rounded-lg",
      isActive
        ? "bg-active-link text-active-link-foreground"
        : theme === 'dark' ? 'hover:bg-white/20' : 'hover:bg-gray-200'
    );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          "w-20 p-4 flex flex-col items-center space-y-4",
          theme === 'dark'
            ? "bg-black text-white rounded-r-2xl"
            : "bg-white text-foreground"
        )}
      >
        <nav className="flex flex-col space-y-2 mt-8">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink to="/admin" end className={getLinkClassName}>
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Dashboard</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink to="/admin/users" className={getLinkClassName}>
                  <Users className="h-5 w-5" />
                  <span className="sr-only">Utilisateurs</span>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Utilisateurs</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink to="/admin/reservations" className={getLinkClassName}>
                  <BookMarked className="h-5 w-5" />
                  <span className="sr-only">Réservations</span>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Réservations</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink to="/admin/payments" className={getLinkClassName}>
                  <CreditCard className="h-5 w-5" />
                  <span className="sr-only">Paiements</span>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Paiements</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 