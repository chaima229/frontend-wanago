import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const AdminUsers = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">Gestion des utilisateurs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tous les utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Exemple de ligne */}
              <TableRow>
                <TableCell>Admin</TableCell>
                <TableCell>admin@email.com</TableCell>
                <TableCell>admin</TableCell>
                <TableCell>
                  <Button variant="link">Modifier</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers; 