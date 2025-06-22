import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EventService, Event } from '@/services/eventService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { uploadImage } from '@/services/storageService';
import { Label } from "@/components/ui/label"

const MOROCCAN_LOCATIONS = [
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

const eventSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères."),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères."),
  dateStart: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Date de début invalide.",
    }),
  dateEnd: z.string().optional(),
  price: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : parseFloat(String(val).replace(",", "."))),
    z.number().min(0, "Le prix doit être un nombre positif.").optional()
  ),
  capacity: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : parseInt(String(val), 10)),
    z.number().int().min(0, "La capacité doit être un nombre entier positif.").optional()
  ),
  category: z.string().min(1, "La catégorie est requise."),
  location: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([
      z.preprocess((val) => val ? parseFloat(String(val)) : 0, z.number()),
      z.preprocess((val) => val ? parseFloat(String(val)) : 0, z.number()),
    ]),
  }),
  photos: z.any().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

type EventFormData = z.infer<typeof eventSchema>;

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);
  const [uploadType, setUploadType] = useState('upload');

  const { data: eventData, isLoading: isLoadingEvent } = useQuery<Event>({
    queryKey: ['event', id],
    queryFn: () => EventService.getEventById(id!),
    enabled: isEditMode,
  });

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
    title: '',
    description: '',
    dateStart: '',
    dateEnd: '',
    price: 0,
    capacity: 0,
      category: '',
      location: { type: 'Point', coordinates: [0, 0] },
      photos: [],
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (isEditMode && eventData) {
      const { coordinates } = eventData.location as { type: 'Point', coordinates: [number, number]};
      
      let imageUrl = '';
      if (eventData.photos && eventData.photos.length > 0) {
        if(!eventData.photos[0].includes('firebasestorage.googleapis.com')) {
          setUploadType('url');
          imageUrl = eventData.photos[0];
        }
      }
      
      const sanitizedData = {
        title: eventData.title || '',
        description: eventData.description || '',
        dateStart: eventData.dateStart ? new Date(eventData.dateStart).toISOString().substring(0, 16) : '',
        dateEnd: eventData.dateEnd ? new Date(eventData.dateEnd).toISOString().substring(0, 16) : '',
        price: eventData.price ?? 0,
        capacity: eventData.capacity ?? 0,
        category: eventData.category || '',
        location: { 
          type: 'Point' as const, 
          coordinates: [
            coordinates[0] ?? 0,
            coordinates[1] ?? 0
          ]
        },
        imageUrl: imageUrl || '',
        photos: eventData.photos || []
      };

      form.reset(sanitizedData);
    }
  }, [eventData, isEditMode, form]);

  const mutation = useMutation({
    mutationFn: async (data: EventFormData) => {
        let finalImageUrl = '';

        if (uploadType === 'upload' && data.photos && data.photos[0] instanceof File) {
            finalImageUrl = await uploadImage(data.photos[0], 'events');
        } else if (uploadType === 'url' && data.imageUrl) {
            finalImageUrl = data.imageUrl;
        } else if (isEditMode && eventData?.photos?.length) {
            finalImageUrl = eventData.photos[0];
        }

        const payload = {
            ...data,
            photos: finalImageUrl ? [finalImageUrl] : [],
            dateStart: new Date(data.dateStart).toISOString(),
            dateEnd: (data.dateEnd && data.dateEnd.length > 0) ? new Date(data.dateEnd).toISOString() : undefined,
        };
      return isEditMode ? EventService.updateEvent(id!, payload as Partial<Event>) : EventService.createEvent(payload as Partial<Event>);
    },
    onSuccess: () => {
      toast({
        title: `Événement ${isEditMode ? 'mis à jour' : 'créé'} avec succès`,
      });
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      navigate('/admin/events');
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: error.message || `Une erreur est survenue.`,
        variant: 'destructive',
      });
    }
  });

  const onSubmit = (data: EventFormData) => {
    mutation.mutate(data);
  };

  // Log validation errors to the console for debugging
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("Validation Errors:", form.formState.errors);
    }
  }, [form.formState.errors]);

  if (isEditMode && isLoadingEvent) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditMode ? 'Modifier l\'événement' : 'Créer un nouvel événement'}</CardTitle>
          <CardDescription>
            {isEditMode ? 'Modifiez les informations de l\'événement.' : 'Remplissez le formulaire pour créer un événement.'}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {form.formState.errors && Object.keys(form.formState.errors).length > 0 && (
                <div className="p-4 mb-4 text-sm text-destructive-foreground bg-destructive rounded-lg" role="alert">
                  <span className="font-bold">Erreur de validation.</span> Veuillez corriger les champs en surbrillance.
      </div>
              )}

               <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Titre de l'événement"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
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
                    <FormControl>
                      <Textarea
                        placeholder="Description de l'événement"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="dateStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de début</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de fin (optionnel)</FormLabel>
                      <FormControl>
                <Input
                          type="datetime-local"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Prix (MAD)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="ex: 100"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Capacité</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="ex: 50"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                  <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                      </FormControl>
                  <SelectContent>
                        <SelectItem value="Concert">Concert</SelectItem>
                        <SelectItem value="Festival">Festival</SelectItem>
                        <SelectItem value="Sport">Sport</SelectItem>
                        <SelectItem value="Art">Art</SelectItem>
                        <SelectItem value="Conférence">Conférence</SelectItem>
                  </SelectContent>
                </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Source de l'image</FormLabel>
                <RadioGroup
                  value={uploadType}
                  onValueChange={(value) => setUploadType(value)}
                  className="flex items-center space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <RadioGroupItem value="upload" id="upload" />
                    <Label htmlFor="upload">Télécharger</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <RadioGroupItem value="url" id="url" />
                    <Label htmlFor="url">URL</Label>
                  </FormItem>
                </RadioGroup>
              </FormItem>

              {uploadType === 'upload' ? (
                <FormField
                  control={form.control}
                  name="photos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image de l'événement</FormLabel>
                      <FormControl>
                        <Input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de l'image</FormLabel>
                      <FormControl>
                <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormItem>
                <FormLabel>Emplacement</FormLabel>
                <Select
                  onValueChange={(locationName) => {
                    const selectedLocation = MOROCCAN_LOCATIONS.find(loc => loc.name === locationName);
                    if (selectedLocation) {
                      form.setValue('location.coordinates', [selectedLocation.lat, selectedLocation.lon]);
                    }
                  }}
                >
                  <FormControl>
                  <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un emplacement" />
                  </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MOROCCAN_LOCATIONS.map((loc) => (
                      <SelectItem key={loc.name} value={loc.name}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>

            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditMode ? 'Mettre à jour' : 'Créer')}
                </Button>
            </CardFooter>
          </form>
        </Form>
        </Card>
    </div>
  );
};

export default EventForm; 