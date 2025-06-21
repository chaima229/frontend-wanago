import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ReservationService, Reservation } from '@/services/reservationService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationPrevious, 
  PaginationLink, 
  PaginationNext 
} from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 4;

const AdminReservations = () => {
  const { data: reservations, isLoading, error } = useQuery<Reservation[]>({
    queryKey: ['adminReservations'],
    queryFn: ReservationService.getAllReservations,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = reservations ? Math.ceil(reservations.length / ITEMS_PER_PAGE) : 0;
  const paginatedReservations = reservations?.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">Gestion des réservations</h1>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Toutes les réservations</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-destructive text-center py-10">
                Erreur lors du chargement des réservations.
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Événement</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedReservations?.map(reservation => (
                      <TableRow key={reservation._id}>
                        <TableCell>{reservation.event?.title || 'N/A'}</TableCell>
                        <TableCell>{reservation.customerInfo.fullName || 'N/A'}</TableCell>
                        <TableCell>{new Date(reservation.date).toLocaleDateString()}</TableCell>
                        <TableCell>{reservation.status}</TableCell>
                        <TableCell>
                          <Button variant="link">Détails</Button>
                        </TableCell>
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

export default AdminReservations; 