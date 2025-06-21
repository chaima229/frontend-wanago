import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const AdminReservations = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Gestion des réservations</h1>
      <Card>
        <CardHeader>
          <CardTitle>Toutes les réservations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Exemple de ligne */}
              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell>2025-06-20</TableCell>
                <TableCell>confirmée</TableCell>
                <TableCell>
                  <Button variant="link">Voir</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReservations; 