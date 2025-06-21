import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LayoutGrid, UsersRound, CalendarCheck2, Wallet, UtensilsCrossed, Calendar } from 'lucide-react';

const baseLinkClasses = "flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8";
const activeLinkClasses = "text-primary";
const inactiveLinkClasses = "text-muted-foreground hover:text-primary";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <aside className="fixed top-14 left-0 z-10 hidden w-14 flex-col bg-background sm:flex h-full">
        <nav className="flex flex-col items-center justify-center flex-1 gap-4 px-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink to="/admin" end className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
                    <LayoutGrid className="h-5 w-5" />
                    <span className="sr-only">Dashboard</span>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right">Dashboard</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink to="/admin/users" end className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
                    <UsersRound className="h-5 w-5" />
                    <span className="sr-only">Utilisateurs</span>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right">Utilisateurs</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink to="/admin/reservations" end className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
                    <CalendarCheck2 className="h-5 w-5" />
                    <span className="sr-only">Réservations</span>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right">Réservations</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink to="/admin/payments" end className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
                    <Wallet className="h-5 w-5" />
                    <span className="sr-only">Paiements</span>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right">Paiements</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink to="/admin/restaurants" end className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
                    <UtensilsCrossed className="h-5 w-5" />
                    <span className="sr-only">Restaurants</span>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right">Restaurants</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavLink to="/admin/events" end className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
                    <Calendar className="h-5 w-5" />
                    <span className="sr-only">Événements</span>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right">Événements</TooltipContent>
              </Tooltip>
            </TooltipProvider>
        </nav>
      </aside>
      <main className="flex-1 p-8 sm:ml-14">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 