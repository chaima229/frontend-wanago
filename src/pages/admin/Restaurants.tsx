import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { RestaurantService, Restaurant } from '@/services/restaurantService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, FilePenLine } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext
} from '@/components/ui/pagination';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 5;

const AdminRestaurants = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: restaurants = [], isLoading, error } = useQuery<Restaurant[]>({
    queryKey: ['adminRestaurants'],
    queryFn: () => RestaurantService.getAllRestaurants(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => RestaurantService.deleteRestaurant(id),
    onSuccess: () => {
      toast.success("Restaurant supprimé avec succès !");
      queryClient.invalidateQueries({ queryKey: ['adminRestaurants'] });
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression : " + error.message);
    }
  });

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = restaurants ? Math.ceil(restaurants.length / ITEMS_PER_PAGE) : 0;
  const paginatedRestaurants = restaurants?.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Gestion des restaurants</h1>
          <Button onClick={() => navigate('/admin/restaurants/new')}>Ajouter un restaurant</Button>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Tous les restaurants</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-destructive text-center py-10">
                Erreur lors du chargement des restaurants.
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Ville</TableHead>
                      <TableHead>Adresse</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRestaurants?.map((restaurant, index) => (
                      <TableRow key={restaurant._id || `${restaurant.name}-${restaurant.ville}-${index}`}>
                        <TableCell>{restaurant.name}</TableCell>
                        <TableCell>{restaurant.ville}</TableCell>
                        <TableCell>{restaurant.address}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/restaurants/edit/${restaurant._id}`)}>
                                    <FilePenLine className="h-4 w-4" />
                                    <span className="sr-only">Modifier</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Modifier</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => deleteMutation.mutate(restaurant._id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Supprimer</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Supprimer</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* ✅ Pagination avec clés uniques */}
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <PaginationItem key={`pagination-${pageNumber}`}>
                          <PaginationLink
                            isActive={pageNumber === currentPage}
                            onClick={() => handlePageChange(pageNumber)}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

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

export default AdminRestaurants;
