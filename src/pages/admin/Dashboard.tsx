import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserService } from '@/services/userService';
import { ReservationService, Reservation } from '@/services/reservationService';
import { PaymentService } from '@/services/paymentService'; // Assurez-vous que le type Payment est exporté si nécessaire
import { Loader2, Users, CreditCard, Bookmark, Ban, CheckCircle, Clock } from 'lucide-react';
import { format, subDays } from 'date-fns';

interface Payment {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: UserService.getAllUsers,
  });

  const { data: reservations, isLoading: isLoadingReservations } = useQuery<Reservation[]>({
    queryKey: ['adminReservations'],
    queryFn: ReservationService.getAllReservations,
  });

  const { data: payments, isLoading: isLoadingPayments } = useQuery<Payment[]>({
    queryKey: ['adminPayments'],
    queryFn: PaymentService.getAllPayments,
  });

  const stats = React.useMemo(() => {
    if (!reservations) return null;
    return {
      total: reservations.length,
      confirmed: reservations.filter(r => r.status === 'confirmed').length,
      pending: reservations.filter(r => r.status === 'pending').length,
      cancelled: reservations.filter(r => r.status === 'cancelled').length,
    };
  }, [reservations]);

  const chartData = React.useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
    
    return last7Days.map(day => {
      const dayString = format(day, 'yyyy-MM-dd');
      const formattedDay = format(day, 'MMM d');

      const dailyReservations = reservations?.filter(r => format(new Date(r.createdAt), 'yyyy-MM-dd') === dayString).length || 0;
      const dailyPayments = payments?.filter(p => format(new Date(p.createdAt), 'yyyy-MM-dd') === dayString).length || 0;
      
      return {
        name: formattedDay,
        reservations: dailyReservations,
        payments: dailyPayments,
      };
    });
  }, [reservations, payments]);


  const isLoading = isLoadingUsers || isLoadingReservations || isLoadingPayments;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Dashboard Admin</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations Confirmées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats?.confirmed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations en Attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats?.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations Annulées</CardTitle>
            <Ban className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats?.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activité des 7 derniers jours</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'rgba(20, 20, 20, 0.8)', 
                  borderColor: '#8857b5',
                  borderRadius: '0.5rem' 
                }}
              />
              <Legend />
              <Bar dataKey="reservations" fill="#8857b5" name="Réservations" radius={[4, 4, 0, 0]} />
              <Bar dataKey="payments" fill="#82ca9d" name="Paiements" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard; 