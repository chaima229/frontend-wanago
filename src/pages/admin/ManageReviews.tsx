import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReviewService, AdminReview } from '@/services/reviewService';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, Star } from 'lucide-react';

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex">
        {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
        ))}
    </div>
);

const ManageReviews = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: reviews, isLoading, isError } = useQuery({
        queryKey: ['adminReviews'],
        queryFn: ReviewService.getAllReviewsForAdmin,
    });

    const deleteMutation = useMutation({
        mutationFn: (reviewId: string) => ReviewService.deleteReview(reviewId),
        onSuccess: () => {
            toast({ title: 'Succès', description: 'Avis supprimé avec succès.' });
            queryClient.invalidateQueries({ queryKey: ['adminReviews'] });
        },
        onError: (error) => {
            toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
        },
    });

    const confirmDelete = (reviewId: string) => {
        deleteMutation.mutate(reviewId);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (isError) {
        return <div className="text-red-500 text-center py-10">Erreur lors du chargement des avis.</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Gestion des Avis</h1>
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Utilisateur</TableHead>
                            <TableHead>Note</TableHead>
                            <TableHead>Commentaire</TableHead>
                            <TableHead>Cible</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews?.map((review) => (
                            <TableRow key={review._id}>
                                <TableCell>
                                    <div className="font-medium">{review.userName || 'N/A'}</div>
                                    <div className="text-sm text-muted-foreground">{review.userEmail}</div>
                                </TableCell>
                                <TableCell><StarRating rating={review.rating} /></TableCell>
                                <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                                <TableCell>
                                    <div className="font-medium">{review.entityType}</div>
                                    <div className="text-sm text-muted-foreground">{review.entityId}</div>
                                </TableCell>
                                <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Cette action est irréversible et supprimera définitivement l'avis.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => confirmDelete(review._id)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                    disabled={deleteMutation.isPending}
                                                >
                                                    {deleteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Supprimer'}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ManageReviews; 