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

const eventSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères.'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères.'),
  dateStart: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Date de début invalide." }),
  dateEnd: z.string().optional(),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().min(0, "Le prix doit être un nombre positif.").optional()
  ),
  capacity: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().min(0, "La capacité doit être un nombre positif.").optional()
  ),
  category: z.string().min(1, "La catégorie est requise."),
  location: z.object({
      type: z.literal('Point'),
      coordinates: z.array(z.number()).length(2)
  }),
  photos: z.any().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
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
        // If the photo seems to be a Firebase Storage URL, we assume it's a URL type
        if(eventData.photos[0].includes('firebasestorage.googleapis.com')) {
          setUploadType('upload'); // Keep it as upload to show it can be replaced
        } else {
          setUploadType('url');
          imageUrl = eventData.photos[0];
        }
      }
      
      form.reset({
        title: eventData.title,
        description: eventData.description,
        dateStart: new Date(eventData.dateStart).toISOString().substring(0, 16),
        dateEnd: eventData.dateEnd ? new Date(eventData.dateEnd).toISOString().substring(0, 16) : '',
        price: eventData.price,
        capacity: eventData.capacity,
        category: eventData.category,
        location: { type: 'Point', coordinates: coordinates },
        imageUrl: imageUrl,
        photos: eventData.photos
      });
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
            dateEnd: data.dateEnd ? new Date(data.dateEnd).toISOString() : undefined
        };
      return isEditMode ? EventService.updateEvent(id!, payload) : EventService.createEvent(payload);
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
               <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl><Input placeholder="Titre de l'événement" {...field} /></FormControl>
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
                    <FormControl><Textarea placeholder="Description de l'événement" {...field} /></FormControl>
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
                      <FormControl><Input type="datetime-local" {...field} /></FormControl>
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
                      <FormControl><Input type="datetime-local" {...field} /></FormControl>
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
                        <FormControl><Input type="number" step="0.01" placeholder="ex: 100" {...field} /></FormControl>
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
                        <FormControl><Input type="number" placeholder="ex: 50" {...field} /></FormControl>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  defaultValue={uploadType}
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
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="location.coordinates.0"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl><Input type="number" step="any" placeholder="ex: 33.5731" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location.coordinates.1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl><Input type="number" step="any" placeholder="ex: -7.5898" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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