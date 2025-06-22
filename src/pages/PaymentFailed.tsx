import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Home, RefreshCw, HelpCircle, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentFailed() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [searchParams] = useSearchParams();
    
    const reservationId = searchParams.get('reservationId');
    const amount = searchParams.get('amount');
    const type = searchParams.get('type'); // 'restaurant' ou 'event'
    const error = searchParams.get('error');

    const handleRetryPayment = () => {
        // Rediriger vers la page de paiement avec les mêmes paramètres
        const params = new URLSearchParams();
        if (reservationId) params.append('reservationId', reservationId);
        if (amount) params.append('amount', amount);
        if (type) params.append('type', type);
        
        navigate(`/payment?${params.toString()}`);
    };

    const handleContactSupport = () => {
        // Rediriger vers la page de contact
        navigate('/contact');
    };

    const getErrorMessage = (errorCode: string | null) => {
        switch (errorCode) {
            case 'insufficient_funds':
                return 'Fonds insuffisants sur votre compte';
            case 'card_declined':
                return 'Carte refusée par votre banque';
            case 'expired_card':
                return 'Carte expirée';
            case 'invalid_card':
                return 'Numéro de carte invalide';
            case 'network_error':
                return 'Erreur de réseau, veuillez réessayer';
            default:
                return 'Une erreur est survenue lors du traitement de votre paiement';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950/50 dark:to-gray-950/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                        <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                        Paiement Échoué
                    </CardTitle>
                    <CardDescription className="text-orange-600 dark:text-orange-300">
                        {getErrorMessage(error)}
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                    <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Numéro de réservation:</span>
                            <span className="text-sm font-bold text-orange-800 dark:text-orange-200">#{reservationId}</span>
                        </div>
                        {amount && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Montant:</span>
                                <span className="text-sm font-bold text-orange-800 dark:text-orange-200">{amount} MAD</span>
                            </div>
                        )}
                        {type && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Type:</span>
                                <span className="text-sm font-bold text-orange-800 dark:text-orange-200 capitalize">
                                    {type === 'restaurant' ? 'Restaurant' : 'Événement'}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                            <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Vérifiez vos informations</p>
                                <p className="text-xs text-blue-600 dark:text-blue-300">
                                    Assurez-vous que vos informations de paiement sont correctes
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                            <HelpCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Besoin d'aide ?</p>
                                <p className="text-xs text-amber-600 dark:text-amber-300">
                                    Notre équipe support est là pour vous aider
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <Button 
                            onClick={handleRetryPayment}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Réessayer le paiement
                        </Button>
                        
                        <Button 
                            onClick={handleContactSupport}
                            variant="outline" 
                            className="w-full"
                        >
                            <HelpCircle className="h-4 w-4 mr-2" />
                            Contacter le support
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

                    <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Si le problème persiste, veuillez contacter votre banque ou notre équipe support
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 