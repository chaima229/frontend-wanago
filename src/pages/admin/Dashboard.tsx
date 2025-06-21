import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Dashboard Admin</h1>
      <Card>
        <CardHeader>
          <CardTitle>Statistiques globales</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-2">
              <li>Total utilisateurs : ...</li>
              <li>Total réservations : ...</li>
              <li>Total paiements : ...</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard; 