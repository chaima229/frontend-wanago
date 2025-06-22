import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home, Receipt, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [searchParams] = useSearchParams();
    
    const reservationId = searchParams.get('reservationId');
    const amount = searchParams.get('amount');
    const type = searchParams.get('type'); // 'restaurant' ou 'event'

    const handleLeaveReview = () => {
        if (isAuthenticated) {
            navigate('/leave-review');
        } else {
            navigate('/login');
        }
    };

    const handleViewReservations = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950/50 dark:to-blue-950/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                        Paiement Réussi !
                    </CardTitle>
                    <CardDescription className="text-blue-600 dark:text-blue-300">
                        Votre réservation a été confirmée avec succès
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Numéro de réservation:</span>
                            <span className="text-sm font-bold text-blue-800 dark:text-blue-200">#{reservationId}</span>
                        </div>
                        {amount && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Montant payé:</span>
                                <span className="text-sm font-bold text-blue-800 dark:text-blue-200">{amount} MAD</span>
                            </div>
                        )}
                        {type && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Type:</span>
                                <span className="text-sm font-bold text-blue-800 dark:text-blue-200 capitalize">
                                    {type === 'restaurant' ? 'Restaurant' : 'Événement'}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                            <Receipt className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Confirmation envoyée</p>
                                <p className="text-xs text-blue-600 dark:text-blue-300">
                                    Un email de confirmation a été envoyé à votre adresse email
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                            <Star className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Partagez votre expérience</p>
                                <p className="text-xs text-amber-600 dark:text-amber-300">
                                    Laissez un avis pour aider d'autres utilisateurs
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <Button 
                            onClick={handleLeaveReview}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600"
                        >
                            <Star className="h-4 w-4 mr-2" />
                            Laisser un avis
                        </Button>
                        
                        <Button 
                            onClick={handleViewReservations}
                            variant="outline" 
                            className="w-full"
                        >
                            <Receipt className="h-4 w-4 mr-2" />
                            Voir mes réservations
                        </Button>
                        
                        <Button 
                            asChild
                            variant="ghost" 
                            className="w-full"
                        >
                            <Link to="/">
                                <Home className="h-4 w-4 mr-2" />
                                Retour à l'accueil
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 