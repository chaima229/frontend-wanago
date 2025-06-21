import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaymentService } from '@/services/paymentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationPrevious, 
  PaginationLink, 
  PaginationNext 
} from '@/components/ui/pagination';

// Based on backend data structure
interface Payment {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  user: {
    fullName: string;
    email: string;
  };
  reservation: {
    _id: string;
    itemType: string;
  };
  createdAt: string;
}

const ITEMS_PER_PAGE = 4;

const AdminPayments = () => {
  const { data: payments, isLoading, error } = useQuery<Payment[]>({
    queryKey: ['adminPayments'],
    queryFn: PaymentService.getAllPayments,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = payments ? Math.ceil(payments.length / ITEMS_PER_PAGE) : 0;
  const paginatedPayments = payments?.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">Gestion des paiements</h1>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Tous les paiements</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-destructive text-center py-10">
                Erreur lors du chargement des paiements.
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPayments?.map(payment => (
                      <TableRow key={payment._id}>
                        <TableCell>{payment.user?.fullName || 'N/A'}</TableCell>
                        <TableCell>{payment.amount} {payment.currency}</TableCell>
                        <TableCell>{payment.status}</TableCell>
                        <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          isActive={i + 1 === currentPage}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPayments; 