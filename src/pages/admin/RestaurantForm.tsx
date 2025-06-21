import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { RestaurantService, Restaurant } from '@/services/restaurantService';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  description: z.string().optional(),
  address: z.string().min(5, { message: "L'adresse doit contenir au moins 5 caractères." }),
  ville: z.string().min(2, { message: "La ville doit contenir au moins 2 caractères." }),
  cuisineType: z.string().min(2, { message: "Le type de cuisine doit contenir au moins 2 caractères." }),
  price: z.coerce.number().min(0, { message: "Le prix doit être un nombre positif." }),
  priceRange: z.enum(['Abordable', 'Moyen', 'Haut de gamme']),
  location: z.string().min(1, { message: "Veuillez sélectionner un emplacement." }),
  openingHours: z.string().optional(),
  photos: z.string().optional(),
  videos: z.string().optional(),
  dateStart: z.string().optional(),
  dateEnd: z.string().optional(),
});

type RestaurantFormData = z.infer<typeof formSchema>;

const RestaurantForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  // Emplacements prédéfinis pour les grandes villes du Maroc
  const locations = [
    // Casablanca
    { name: "Casablanca - Centre-ville", lat: 33.5731, lon: -7.5898 },
    { name: "Casablanca - Ain Diab", lat: 33.5952, lon: -7.6324 },
    { name: "Casablanca - Corniche", lat: 33.6089, lon: -7.6328 },
    { name: "Casablanca - Derb Sultan", lat: 33.5589, lon: -7.6324 },
    { name: "Casablanca - Maârif", lat: 33.5952, lon: -7.6324 },
    { name: "Casablanca - Sidi Belyout", lat: 33.6089, lon: -7.6328 },
    { name: "Casablanca - Hassan", lat: 33.5589, lon: -7.6324 },
    { name: "Casablanca - Roches Noires", lat: 33.5952, lon: -7.6324 },
    { name: "Casablanca - Ain Sebaa", lat: 33.6089, lon: -7.6328 },
    { name: "Casablanca - Sidi Moumen", lat: 33.5589, lon: -7.6324 },
    
    // Rabat
    { name: "Rabat - Agdal", lat: 34.0209, lon: -6.8416 },
    { name: "Rabat - Hassan", lat: 34.0224, lon: -6.8341 },
    { name: "Rabat - Souissi", lat: 34.0089, lon: -6.8516 },
    { name: "Rabat - Hay Riad", lat: 34.0089, lon: -6.8516 },
    { name: "Rabat - Yacoub El Mansour", lat: 34.0089, lon: -6.8516 },
    { name: "Rabat - Salé", lat: 34.0333, lon: -6.8167 },
    { name: "Rabat - Temara", lat: 33.9167, lon: -6.9167 },
    { name: "Rabat - Skhirat", lat: 33.8500, lon: -7.0333 },
    
    // Salé
    { name: "Salé - Médina", lat: 34.0333, lon: -6.8167 },
    { name: "Salé - Bettana", lat: 34.0333, lon: -6.8167 },
    { name: "Salé - Tabriquet", lat: 34.0333, lon: -6.8167 },
    { name: "Salé - Hay Salam", lat: 34.0333, lon: -6.8167 },
    { name: "Salé - Sidi Moussa", lat: 34.0333, lon: -6.8167 },
    
    // Marrakech
    { name: "Marrakech - Médina", lat: 31.6295, lon: -7.9811 },
    { name: "Marrakech - Gueliz", lat: 31.6343, lon: -8.0084 },
    { name: "Marrakech - Palmeraie", lat: 31.6531, lon: -8.0122 },
    { name: "Marrakech - Hivernage", lat: 31.6405, lon: -7.9996 },
    { name: "Marrakech - Majorelle", lat: 31.6339, lon: -8.0060 },
    { name: "Marrakech - Kasbah", lat: 31.6274, lon: -7.9855 },
    { name: "Marrakech - Agdal", lat: 31.6452, lon: -7.9960 },
    { name: "Marrakech - Mellah", lat: 31.6319, lon: -7.9776 },
    { name: "Marrakech - Riad Zitoun", lat: 31.6292, lon: -7.9823 },
    { name: "Marrakech - Targa", lat: 31.6410, lon: -8.0200 },
    
    // Agadir
    { name: "Agadir - Centre-ville", lat: 30.4278, lon: -9.5981 },
    { name: "Agadir - Talborjt", lat: 30.4278, lon: -9.5981 },
    { name: "Agadir - Founty", lat: 30.4278, lon: -9.5981 },
    { name: "Agadir - Hay Hassani", lat: 30.4278, lon: -9.5981 },
    { name: "Agadir - Anza", lat: 30.4278, lon: -9.5981 },
    { name: "Agadir - Tikiouine", lat: 30.4278, lon: -9.5981 },
    { name: "Agadir - Al Houda", lat: 30.4278, lon: -9.5981 },
    { name: "Agadir - Dakhla", lat: 30.4278, lon: -9.5981 },
    { name: "Agadir - Cité Dakhla", lat: 30.4278, lon: -9.5981 },
    
    // Fès
    { name: "Fès - Médina", lat: 34.0181, lon: -5.0078 },
    { name: "Fès - Jdid", lat: 34.0181, lon: -5.0078 },
    { name: "Fès - Ville Nouvelle", lat: 34.0181, lon: -5.0078 },
    { name: "Fès - Agdal", lat: 34.0181, lon: -5.0078 },
    { name: "Fès - Saiss", lat: 34.0181, lon: -5.0078 },
    { name: "Fès - Ain Chkef", lat: 34.0181, lon: -5.0078 },
    
    // Tanger
    { name: "Tanger - Médina", lat: 35.7595, lon: -5.8340 },
    { name: "Tanger - Ville Nouvelle", lat: 35.7595, lon: -5.8340 },
    { name: "Tanger - Malabata", lat: 35.7595, lon: -5.8340 },
    { name: "Tanger - Marshan", lat: 35.7595, lon: -5.8340 },
    { name: "Tanger - Charf", lat: 35.7595, lon: -5.8340 },
    { name: "Tanger - Beni Makada", lat: 35.7595, lon: -5.8340 },
    
    // Meknès
    { name: "Meknès - Médina", lat: 33.8935, lon: -5.5473 },
    { name: "Meknès - Ville Nouvelle", lat: 33.8935, lon: -5.5473 },
    { name: "Meknès - Agdal", lat: 33.8935, lon: -5.5473 },
    { name: "Meknès - Hay Salam", lat: 33.8935, lon: -5.5473 },
    { name: "Meknès - Al Bassatine", lat: 33.8935, lon: -5.5473 },
    
    // Oujda
    { name: "Oujda - Centre-ville", lat: 34.6814, lon: -1.9086 },
    { name: "Oujda - Médina", lat: 34.6814, lon: -1.9086 },
    { name: "Oujda - Ville Nouvelle", lat: 34.6814, lon: -1.9086 },
    { name: "Oujda - Al Qods", lat: 34.6814, lon: -1.9086 },
    
    // Tétouan
    { name: "Tétouan - Médina", lat: 35.5711, lon: -5.3724 },
    { name: "Tétouan - Ville Nouvelle", lat: 35.5711, lon: -5.3724 },
    { name: "Tétouan - Malaliyine", lat: 35.5711, lon: -5.3724 },
    { name: "Tétouan - M'diq", lat: 35.5711, lon: -5.3724 },
    
    // Safi
    { name: "Safi - Médina", lat: 32.2833, lon: -9.2333 },
    { name: "Safi - Ville Nouvelle", lat: 32.2833, lon: -9.2333 },
    { name: "Safi - Jorf Lasfar", lat: 32.2833, lon: -9.2333 },
    
    // El Jadida
    { name: "El Jadida - Médina", lat: 33.2333, lon: -8.5000 },
    { name: "El Jadida - Ville Nouvelle", lat: 33.2333, lon: -8.5000 },
    { name: "El Jadida - Haouzia", lat: 33.2333, lon: -8.5000 },
    
    // Essaouira
    { name: "Essaouira - Médina", lat: 31.5085, lon: -9.7595 },
    { name: "Essaouira - Ville Nouvelle", lat: 31.5085, lon: -9.7595 },
    { name: "Essaouira - Diabat", lat: 31.5085, lon: -9.7595 },
    
    // Chefchaouen
    { name: "Chefchaouen - Médina", lat: 35.1714, lon: -5.2697 },
    { name: "Chefchaouen - Ville Nouvelle", lat: 35.1714, lon: -5.2697 },
    { name: "Chefchaouen - Ras El Maa", lat: 35.1714, lon: -5.2697 },
  ];

  const { data: restaurantData, isLoading: isLoadingRestaurant, isError } = useQuery<Restaurant>({
    queryKey: ['adminRestaurant', id],
    queryFn: () => {
      if (!id) throw new Error("ID de restaurant invalide");
      return RestaurantService.getRestaurantById(id);
    },
    enabled: !!id,
  });

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      ville: '',
      cuisineType: '',
      price: 0,
      priceRange: 'Moyen',
      location: '',
      openingHours: '10:00-22:00',
      photos: '',
      videos: '',
      dateStart: new Date().toISOString().split('T')[0],
      dateEnd: new Date().toISOString().split('T')[0],
    },
  });

  React.useEffect(() => {
    if (isEditMode && restaurantData) {
      // Trouver l'emplacement correspondant aux coordonnées existantes
      let selectedLocation = '';
      if (restaurantData.location && typeof restaurantData.location === 'object' && 'coordinates' in restaurantData.location) {
        const [lon, lat] = restaurantData.location.coordinates;
        const foundLocation = locations.find(loc => 
          Math.abs(loc.lat - lat) < 0.001 && Math.abs(loc.lon - lon) < 0.001
        );
        if (foundLocation) {
          selectedLocation = foundLocation.name;
        }
      }

      form.reset({
        name: restaurantData.name || '',
        description: restaurantData.description || '',
        address: restaurantData.address || '',
        ville: restaurantData.ville || '',
        cuisineType: restaurantData.cuisineType || '',
        price: restaurantData.price || 0,
        priceRange: restaurantData.priceRange as any || 'Moyen',
        location: selectedLocation,
        openingHours: restaurantData.openingHours || '10:00-22:00',
        photos: Array.isArray(restaurantData.photos) ? restaurantData.photos.join(', ') : '',
        videos: Array.isArray(restaurantData.videos) ? restaurantData.videos.join(', ') : '',
        dateStart: restaurantData.dateStart ? new Date(restaurantData.dateStart).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        dateEnd: restaurantData.dateEnd ? new Date(restaurantData.dateEnd).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    }
  }, [restaurantData, isEditMode, form]);

  const mutation = useMutation({
    mutationFn: (data: Partial<Restaurant>) => 
      isEditMode 
        ? RestaurantService.updateRestaurant(id!, data)
        : RestaurantService.createRestaurant(data),
    onSuccess: () => {
      toast.success(`Restaurant ${isEditMode ? 'mis à jour' : 'créé'} avec succès !`);
      queryClient.invalidateQueries({ queryKey: ['adminRestaurants'] });
      navigate('/admin/restaurants');
    },
    onError: (error) => {
      toast.error("Une erreur est survenue : " + error.message);
    }
  });

  const onSubmit = (data: RestaurantFormData) => {
    // Trouver les coordonnées de l'emplacement sélectionné
    const selectedLocation = locations.find(loc => loc.name === data.location);
    
    const submissionData: Partial<Restaurant> = {
      name: data.name,
      description: data.description,
      address: data.address,
      ville: data.ville,
      cuisineType: data.cuisineType,
      price: data.price,
      priceRange: data.priceRange,
      location: selectedLocation ? {
        type: 'Point',
        coordinates: [selectedLocation.lon, selectedLocation.lat]
      } : {
        type: 'Point',
        coordinates: [0, 0]
      },
      openingHours: data.openingHours,
      photos: data.photos?.split(',').map(item => item.trim()).filter(Boolean) || [],
      videos: data.videos?.split(',').map(item => item.trim()).filter(Boolean) || [],
      dateStart: data.dateStart ? new Date(data.dateStart) : new Date(),
      dateEnd: data.dateEnd ? new Date(data.dateEnd) : new Date(),
    };
    mutation.mutate(submissionData);
  };
  
  if (isLoadingRestaurant) return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (isError) return <div className="text-destructive text-center py-10">Erreur lors du chargement des données du restaurant.</div>;

  return (
    <div className="flex justify-center items-start w-full py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/restaurants')}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="flex-1 text-center">{isEditMode ? 'Modifier le restaurant' : 'Ajouter un nouveau restaurant'}</CardTitle>
            <div className="w-10"></div> {/* Spacer to center the title */}
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl><Input placeholder="Nom du restaurant" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea placeholder="Description..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl><Input placeholder="Adresse complète" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ville"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl><Input placeholder="Ville" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cuisineType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de cuisine</FormLabel>
                    <FormControl><Input placeholder="Italienne, Marocaine, ..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix moyen par personne</FormLabel>
                      <FormControl><Input type="number" placeholder="Prix" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priceRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gamme de prix</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une gamme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Abordable">Abordable</SelectItem>
                          <SelectItem value="Moyen">Moyen</SelectItem>
                          <SelectItem value="Haut de gamme">Haut de gamme</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emplacement</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un emplacement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.name} value={location.name}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="openingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horaires d'ouverture</FormLabel>
                    <FormControl><Input placeholder="Ex: 10:00-22:00" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="photos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photos (URLs séparées par des virgules)</FormLabel>
                    <FormControl><Textarea placeholder="https://url1.com, https://url2.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="videos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vidéos (URLs séparées par des virgules)</FormLabel>
                    <FormControl><Textarea placeholder="https://vid1.com, https://vid2.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dateStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de début</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de fin</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <CardFooter className="px-0 pt-6">
                 <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isEditMode ? 'Sauvegarder les modifications' : 'Créer le restaurant'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantForm; 