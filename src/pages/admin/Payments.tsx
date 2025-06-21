import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const AdminPayments = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Gestion des paiements</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tous les paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Paiement</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Exemple de ligne */}
              <TableRow>
                <TableCell>PAY-123456</TableCell>
                <TableCell>200.00 MAD</TableCell>
                <TableCell>COMPLETED</TableCell>
                <TableCell>
                  <Button variant="link">Détails</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments; 