import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { NotificationService, Notification } from '@/services/notificationService';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BellRing } from 'lucide-react';
import { format } from 'date-fns';

const NotificationsPage = () => {
  const { user } = useAuth();
  const { data: notifications, isLoading, error } = useQuery<Notification[]>({
    queryKey: ['notifications', user?._id],
    queryFn: () => NotificationService.getMyNotifications(),
    enabled: !!user,
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Vos Notifications</h1>
      <Card>
        <CardHeader>
          <CardTitle>Historique des notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-destructive text-center py-10">
              Erreur lors du chargement des notifications.
            </div>
          ) : notifications && notifications.length > 0 ? (
            <ul className="space-y-4">
              {notifications.map((notif) => (
                <li key={notif._id} className="flex items-start space-x-4 p-4 rounded-lg border">
                  <div className="flex-shrink-0">
                    <BellRing className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(notif.createdAt), "dd/MM/yyyy 'à' HH:mm")}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notif.message}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10">
              <p>Vous n'avez aucune notification pour le moment.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage; 