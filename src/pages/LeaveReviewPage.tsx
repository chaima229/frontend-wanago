import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Star } from 'lucide-react';
import { ReviewService, ReviewData } from '@/services/reviewService';
import { RestaurantService, Restaurant } from '@/services/restaurantService';
import { EventService, Event } from '@/services/eventService';
import { getAuth } from 'firebase/auth';

const reviewSchema = z.object({
    entityType: z.enum(['restaurant', 'event'], {
        required_error: "Vous devez sélectionner un type.",
    }),
    entityId: z.string().min(1, "Vous devez sélectionner un élément à évaluer."),
    rating: z.number().min(1, "La note est requise.").max(5),
    comment: z.string().min(10, 'Votre avis doit contenir au moins 10 caractères.'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const LeaveReviewPage = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [restaurantData, eventData] = await Promise.all([
                    RestaurantService.getAllRestaurants(),
                    EventService.getAllEvents()
                ]);
                setRestaurants(restaurantData);
                setEvents(eventData);
            } catch (error) {
                toast({ title: 'Erreur', description: "Impossible de charger les restaurants et les événements.", variant: 'destructive' });
            }
        };
        fetchData();
    }, [toast]);

    const form = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            comment: '',
            rating: 0,
            entityId: '',
        },
    });

    const entityType = form.watch('entityType');

    const { mutate, isPending } = useMutation({
        mutationFn: (data: ReviewData) => ReviewService.submitReview(data),
        onSuccess: () => {
            toast({ title: 'Avis envoyé', description: 'Merci pour votre retour !' });
            form.reset();
        },
        onError: (error) => {
            toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
        }
    });

    const onSubmit = async (data: ReviewFormData) => {
        const auth = getAuth();
        const firebaseUser = auth.currentUser;

        if (!firebaseUser) {
            toast({
                title: 'Erreur d\'authentification',
                description: "Utilisateur non trouvé. Veuillez vous reconnecter.",
                variant: 'destructive',
            });
            return;
        }

        try {
            await firebaseUser.getIdToken(true); // Force token refresh
            mutate(data);
        } catch (error) {
            toast({
                title: 'Erreur de session',
                description: "Impossible de vérifier votre session. Veuillez vous reconnecter.",
                variant: 'destructive',
            });
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto py-10 text-center">
                <p>Veuillez vous connecter pour laisser un avis.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Donnez votre avis</CardTitle>
                    <CardDescription>
                        Vos retours nous sont précieux pour nous améliorer.
                    </CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="entityType"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Qu'est-ce que vous évaluez ?</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col space-y-1"
                                            >
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="restaurant" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">Restaurant</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="event" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">Événement</FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {entityType && (
                                <FormField
                                    control={form.control}
                                    name="entityId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{entityType === 'restaurant' ? 'Choisissez un restaurant' : 'Choisissez un événement'}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={`Sélectionnez un ${entityType === 'restaurant' ? 'restaurant' : 'événement'}`} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {(entityType === 'restaurant' ? restaurants : events).map((item) => (
                                                        <SelectItem key={item._id} value={item._id}>
                                                            {item.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            
                            <FormField
                                control={form.control}
                                name="rating"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Note</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center space-x-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`cursor-pointer h-7 w-7 ${
                                                            (hoverRating || field.value) >= star
                                                            ? 'text-yellow-400 fill-yellow-400'
                                                            : 'text-gray-300'
                                                        }`}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        onClick={() => field.onChange(star)}
                                                    />
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Votre avis</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Écrivez ce que vous pensez..."
                                                rows={6}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Envoyer mon avis'}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default LeaveReviewPage;