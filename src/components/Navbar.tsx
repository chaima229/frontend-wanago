import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { useRole } from '@/hooks/use-role';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User as UserIcon, Sun, Moon, Menu, Bell, CreditCard } from 'lucide-react';
import { NotificationService, Notification } from '@/services/notificationService';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, logout, user } = useAuth();
  const { isAdmin } = useRole();
  const { theme, setTheme } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?._id],
    queryFn: () => NotificationService.getMyNotifications(),
    enabled: !!user,
  });

  const markAsReadMutation = useMutation({
    mutationFn: () => NotificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Restaurants', path: '/restaurants' },
    { name: 'Events', path: '/events' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  
  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  const handlePopoverOpenChange = (open: boolean) => {
    setIsPopoverOpen(open);
    if (open && unreadCount > 0) {
      markAsReadMutation.mutate();
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.type.startsWith('reservation') || notification.type.startsWith('payment')) {
      navigate('/dashboard');
    }
    setIsPopoverOpen(false);
  };

  return (
    <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-foreground font-bold text-xl">
              <img
                src="/WanaGo.png"
                alt="WanaGO"
                className="w-32 h-10"
              />
            </Link>
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative h-9 w-9">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="absolute top-1 right-1 h-4 w-4 justify-center rounded-full p-0 text-xs"
                          >
                            {unreadCount}
                          </Badge>
                        )}
                        <span className="sr-only">Ouvrir les notifications</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <div className="p-2">
                        <h4 className="font-medium leading-none px-2 py-1.5">Notifications</h4>
                        <div className="mt-2 grid gap-1">
                          {notifications.length > 0 ? (
                            notifications.slice(0, 5).map(notif => (
                              <div 
                                key={notif._id} 
                                className="grid grid-cols-[25px_1fr] items-start p-2 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                onClick={() => handleNotificationClick(notif)}
                              >
                                <span className={`flex h-2 w-2 translate-y-1 rounded-full ${!notif.isRead ? 'bg-sky-500' : 'bg-transparent'}`} />
                                <div className="space-y-1">
                                  <p className="text-sm font-medium leading-none">{notif.title}</p>
                                  <p className="text-sm text-muted-foreground">{notif.message}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="p-2 text-sm text-muted-foreground">Vous n'avez aucune notification.</p>
                          )}
                        </div>
                        <Button 
                          variant="link" 
                          className="w-full mt-2"
                          onClick={() => {
                            navigate('/notifications');
                            setIsPopoverOpen(false);
                          }}
                        >
                          Voir toutes les notifications
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" alt={user?.fullName} />
                          <AvatarFallback>
                            {user?.fullName ? getInitials(user.fullName) : <UserIcon size={20} />}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/profile">Profil</Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin">Admin</Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            <div className="md:hidden">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Ouvrir le menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <div className="flex flex-col space-y-4 py-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={handleLinkClick}
                                    className={`px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                                    location.pathname === item.path
                                        ? 'text-primary bg-muted'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="border-t pt-4">
                                {isAuthenticated ? (
                                    <div className="flex flex-col space-y-2">
                                        <Link to="/dashboard" onClick={handleLinkClick} className="px-3 py-2 text-muted-foreground hover:text-foreground">Dashboard</Link>
                                        <Link to="/profile" onClick={handleLinkClick} className="px-3 py-2 text-muted-foreground hover:text-foreground">Profil</Link>
                                        {isAdmin && <Link to="/admin" onClick={handleLinkClick} className="px-3 py-2 text-muted-foreground hover:text-foreground">Admin</Link>}
                                        <Button variant="outline" onClick={() => { logout(); handleLinkClick(); }}>Logout</Button>
                                    </div>
                                ) : (
                                    <Link to="/login" onClick={handleLinkClick}>
                                        <Button variant="outline" className="w-full">Sign In</Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
