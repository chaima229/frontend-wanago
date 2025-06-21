import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { eventService } from '@/services/eventService';

// Emplacements prédéfinis du Maroc pour les événements
const MOROCCAN_LOCATIONS = [
  // Casablanca
  { name: "Casablanca - Centre-ville", lat: 33.5731, lon: -7.5898 },
  { name: "Casablanca - Ain Diab", lat: 33.5958, lon: -7.6328 },
  { name: "Casablanca - Maarif", lat: 33.5958, lon: -7.6328 },
  { name: "Casablanca - Sidi Belyout", lat: 33.5958, lon: -7.6328 },
  { name: "Casablanca - Anfa", lat: 33.5958, lon: -7.6328 },
  { name: "Casablanca - Ain Sebaa", lat: 33.5958, lon: -7.6328 },
  { name: "Casablanca - Sidi Moumen", lat: 33.5958, lon: -7.6328 },
  { name: "Casablanca - Hay Hassani", lat: 33.5958, lon: -7.6328 },
  { name: "Casablanca - Moulay Rachid", lat: 33.5958, lon: -7.6328 },
  { name: "Casablanca - Ben M'Sik", lat: 33.5958, lon: -7.6328 },
  
  // Rabat
  { name: "Rabat - Centre-ville", lat: 34.0209, lon: -6.8416 },
  { name: "Rabat - Agdal", lat: 34.0209, lon: -6.8416 },
  { name: "Rabat - Hassan", lat: 34.0209, lon: -6.8416 },
  { name: "Rabat - Souissi", lat: 34.0209, lon: -6.8416 },
  { name: "Rabat - Yacoub El Mansour", lat: 34.0209, lon: -6.8416 },
  { name: "Rabat - Youssoufia", lat: 34.0209, lon: -6.8416 },
  { name: "Rabat - Akkari", lat: 34.0209, lon: -6.8416 },
  { name: "Rabat - Mabella", lat: 34.0209, lon: -6.8416 },
  { name: "Rabat - Douar El Ghaba", lat: 34.0209, lon: -6.8416 },
  { name: "Rabat - El Youssoufia", lat: 34.0209, lon: -6.8416 },
  
  // Salé
  { name: "Salé - Centre-ville", lat: 34.0333, lon: -6.8167 },
  { name: "Salé - Bettana", lat: 34.0333, lon: -6.8167 },
  { name: "Salé - Tabriquet", lat: 34.0333, lon: -6.8167 },
  { name: "Salé - Hssaine", lat: 34.0333, lon: -6.8167 },
  { name: "Salé - Layayda", lat: 34.0333, lon: -6.8167 },
  { name: "Salé - Sidi Moussa", lat: 34.0333, lon: -6.8167 },
  { name: "Salé - Ain El Aouda", lat: 34.0333, lon: -6.8167 },
  { name: "Salé - Sidi Yahya Zaer", lat: 34.0333, lon: -6.8167 },
  { name: "Salé - Tamesna", lat: 34.0333, lon: -6.8167 },
  { name: "Salé - Sidi Bouknadel", lat: 34.0333, lon: -6.8167 },
  
  // Marrakech
  { name: "Marrakech - Médina", lat: 31.6295, lon: -7.9811 },
  { name: "Marrakech - Gueliz", lat: 31.6295, lon: -7.9811 },
  { name: "Marrakech - Hivernage", lat: 31.6295, lon: -7.9811 },
  { name: "Marrakech - Palmeraie", lat: 31.6295, lon: -7.9811 },
  { name: "Marrakech - Agdal", lat: 31.6295, lon: -7.9811 },
  { name: "Marrakech - Daoudiate", lat: 31.6295, lon: -7.9811 },
  { name: "Marrakech - Sidi Youssef Ben Ali", lat: 31.6295, lon: -7.9811 },
  { name: "Marrakech - Al Massira", lat: 31.6295, lon: -7.9811 },
  { name: "Marrakech - M'Hamid", lat: 31.6295, lon: -7.9811 },
  { name: "Marrakech - Sidi Ghanem", lat: 31.6295, lon: -7.9811 },
  
  // Agadir
  { name: "Agadir - Centre-ville", lat: 30.4278, lon: -9.5981 },
  { name: "Agadir - Talborjt", lat: 30.4278, lon: -9.5981 },
  { name: "Agadir - Founty", lat: 30.4278, lon: -9.5981 },
  { name: "Agadir - Hay Hassani", lat: 30.4278, lon: -9.5981 },
  { name: "Agadir - Al Inara", lat: 30.4278, lon: -9.5981 },
  { name: "Agadir - Dcheira", lat: 30.4278, lon: -9.5981 },
  { name: "Agadir - Tikiouine", lat: 30.4278, lon: -9.5981 },
  { name: "Agadir - Anza", lat: 30.4278, lon: -9.5981 },
  { name: "Agadir - Aourir", lat: 30.4278, lon: -9.5981 },
  { name: "Agadir - Taghazout", lat: 30.4278, lon: -9.5981 },
  
  // Fès
  { name: "Fès - Médina", lat: 34.0181, lon: -5.0078 },
  { name: "Fès - Ville Nouvelle", lat: 34.0181, lon: -5.0078 },
  { name: "Fès - Jnan El Ward", lat: 34.0181, lon: -5.0078 },
  { name: "Fès - Saiss", lat: 34.0181, lon: -5.0078 },
  { name: "Fès - Agdal", lat: 34.0181, lon: -5.0078 },
  { name: "Fès - Hay Riad", lat: 34.0181, lon: -5.0078 },
  { name: "Fès - Ain Chkef", lat: 34.0181, lon: -5.0078 },
  { name: "Fès - Sidi Harazem", lat: 34.0181, lon: -5.0078 },
  { name: "Fès - Moulay Yacoub", lat: 34.0181, lon: -5.0078 },
  { name: "Fès - Ain Nokbi", lat: 34.0181, lon: -5.0078 },
  
  // Tanger
  { name: "Tanger - Médina", lat: 35.7595, lon: -5.8340 },
  { name: "Tanger - Ville Nouvelle", lat: 35.7595, lon: -5.8340 },
  { name: "Tanger - Malabata", lat: 35.7595, lon: -5.8340 },
  { name: "Tanger - Marshan", lat: 35.7595, lon: -5.8340 },
  { name: "Tanger - Boukhalef", lat: 35.7595, lon: -5.8340 },
  { name: "Tanger - Charf", lat: 35.7595, lon: -5.8340 },
  { name: "Tanger - Beni Makada", lat: 35.7595, lon: -5.8340 },
  { name: "Tanger - Asilah", lat: 35.7595, lon: -5.8340 },
  { name: "Tanger - Larache", lat: 35.7595, lon: -5.8340 },
  { name: "Tanger - Ksar El Kebir", lat: 35.7595, lon: -5.8340 },
  
  // Meknès
  { name: "Meknès - Médina", lat: 33.8935, lon: -5.5473 },
  { name: "Meknès - Ville Nouvelle", lat: 33.8935, lon: -5.5473 },
  { name: "Meknès - Agdal", lat: 33.8935, lon: -5.5473 },
  { name: "Meknès - Hay El Wifaq", lat: 33.8935, lon: -5.5473 },
  { name: "Meknès - Al Bassatine", lat: 33.8935, lon: -5.5473 },
  { name: "Meknès - Sidi Amar", lat: 33.8935, lon: -5.5473 },
  { name: "Meknès - Toulal", lat: 33.8935, lon: -5.5473 },
  { name: "Meknès - Ouislane", lat: 33.8935, lon: -5.5473 },
  { name: "Meknès - Al Ismaïlia", lat: 33.8935, lon: -5.5473 },
  { name: "Meknès - Marjane", lat: 33.8935, lon: -5.5473 },
  
  // Oujda
  { name: "Oujda - Centre-ville", lat: 34.6814, lon: -1.9086 },
  { name: "Oujda - Al Qods", lat: 34.6814, lon: -1.9086 },
  { name: "Oujda - Al Hamri", lat: 34.6814, lon: -1.9086 },
  { name: "Oujda - Sidi Yahya", lat: 34.6814, lon: -1.9086 },
  { name: "Oujda - Al Aouamra", lat: 34.6814, lon: -1.9086 },
  { name: "Oujda - Al Kifane", lat: 34.6814, lon: -1.9086 },
  { name: "Oujda - Al Moustakbal", lat: 34.6814, lon: -1.9086 },
  { name: "Oujda - Al Massira", lat: 34.6814, lon: -1.9086 },
  { name: "Oujda - Al Wahda", lat: 34.6814, lon: -1.9086 },
  { name: "Oujda - Al Fath", lat: 34.6814, lon: -1.9086 },
  
  // Tétouan
  { name: "Tétouan - Médina", lat: 35.5711, lon: -5.3724 },
  { name: "Tétouan - Ville Nouvelle", lat: 35.5711, lon: -5.3724 },
  { name: "Tétouan - Malaliyine", lat: 35.5711, lon: -5.3724 },
  { name: "Tétouan - Al Wahda", lat: 35.5711, lon: -5.3724 },
  { name: "Tétouan - Al Massira", lat: 35.5711, lon: -5.3724 },
  { name: "Tétouan - Al Moustakbal", lat: 35.5711, lon: -5.3724 },
  { name: "Tétouan - Al Hamri", lat: 35.5711, lon: -5.3724 },
  { name: "Tétouan - Al Qods", lat: 35.5711, lon: -5.3724 },
  { name: "Tétouan - Al Fath", lat: 35.5711, lon: -5.3724 },
  { name: "Tétouan - Al Aouamra", lat: 35.5711, lon: -5.3724 },
  
  // Safi
  { name: "Safi - Centre-ville", lat: 32.2833, lon: -9.2333 },
  { name: "Safi - Al Hamri", lat: 32.2833, lon: -9.2333 },
  { name: "Safi - Al Massira", lat: 32.2833, lon: -9.2333 },
  { name: "Safi - Al Wahda", lat: 32.2833, lon: -9.2333 },
  { name: "Safi - Al Moustakbal", lat: 32.2833, lon: -9.2333 },
  { name: "Safi - Al Qods", lat: 32.2833, lon: -9.2333 },
  { name: "Safi - Al Fath", lat: 32.2833, lon: -9.2333 },
  { name: "Safi - Al Aouamra", lat: 32.2833, lon: -9.2333 },
  { name: "Safi - Al Kifane", lat: 32.2833, lon: -9.2333 },
  { name: "Safi - Al Ismaïlia", lat: 32.2833, lon: -9.2333 },
  
  // El Jadida
  { name: "El Jadida - Centre-ville", lat: 33.2569, lon: -8.5083 },
  { name: "El Jadida - Al Hamri", lat: 33.2569, lon: -8.5083 },
  { name: "El Jadida - Al Massira", lat: 33.2569, lon: -8.5083 },
  { name: "El Jadida - Al Wahda", lat: 33.2569, lon: -8.5083 },
  { name: "El Jadida - Al Moustakbal", lat: 33.2569, lon: -8.5083 },
  { name: "El Jadida - Al Qods", lat: 33.2569, lon: -8.5083 },
  { name: "El Jadida - Al Fath", lat: 33.2569, lon: -8.5083 },
  { name: "El Jadida - Al Aouamra", lat: 33.2569, lon: -8.5083 },
  { name: "El Jadida - Al Kifane", lat: 33.2569, lon: -8.5083 },
  { name: "El Jadida - Al Ismaïlia", lat: 33.2569, lon: -8.5083 },
  
  // Essaouira
  { name: "Essaouira - Médina", lat: 31.5085, lon: -9.7595 },
  { name: "Essaouira - Ville Nouvelle", lat: 31.5085, lon: -9.7595 },
  { name: "Essaouira - Al Hamri", lat: 31.5085, lon: -9.7595 },
  { name: "Essaouira - Al Massira", lat: 31.5085, lon: -9.7595 },
  { name: "Essaouira - Al Wahda", lat: 31.5085, lon: -9.7595 },
  { name: "Essaouira - Al Moustakbal", lat: 31.5085, lon: -9.7595 },
  { name: "Essaouira - Al Qods", lat: 31.5085, lon: -9.7595 },
  { name: "Essaouira - Al Fath", lat: 31.5085, lon: -9.7595 },
  { name: "Essaouira - Al Aouamra", lat: 31.5085, lon: -9.7595 },
  { name: "Essaouira - Al Kifane", lat: 31.5085, lon: -9.7595 },
  
  // Chefchaouen
  { name: "Chefchaouen - Médina", lat: 35.1714, lon: -5.2696 },
  { name: "Chefchaouen - Ville Nouvelle", lat: 35.1714, lon: -5.2696 },
  { name: "Chefchaouen - Al Hamri", lat: 35.1714, lon: -5.2696 },
  { name: "Chefchaouen - Al Massira", lat: 35.1714, lon: -5.2696 },
  { name: "Chefchaouen - Al Wahda", lat: 35.1714, lon: -5.2696 },
  { name: "Chefchaouen - Al Moustakbal", lat: 35.1714, lon: -5.2696 },
  { name: "Chefchaouen - Al Qods", lat: 35.1714, lon: -5.2696 },
  { name: "Chefchaouen - Al Fath", lat: 35.1714, lon: -5.2696 },
  { name: "Chefchaouen - Al Aouamra", lat: 35.1714, lon: -5.2696 },
  { name: "Chefchaouen - Al Kifane", lat: 35.1714, lon: -5.2696 }
];

// Catégories d'événements
const EVENT_CATEGORIES = [
  "Concert",
  "Festival",
  "Conférence",
  "Exposition",
  "Théâtre",
  "Cinéma",
  "Sport",
  "Gastronomie",
  "Art",
  "Musique",
  "Danse",
  "Littérature",
  "Technologie",
  "Business",
  "Éducation",
  "Santé",
  "Environnement",
  "Social",
  "Autre"
];

// Équipements disponibles
const AVAILABLE_AMENITIES = [
  "Parking",
  "Wi-Fi",
  "Accessibilité handicapés",
  "Restaurant",
  "Bar",
  "Toilettes",
  "Vestiaires",
  "Éclairage",
  "Sonorisation",
  "Écran/Projection",
  "Scène",
  "Sièges",
  "Climatisation",
  "Chauffage",
  "Sécurité",
  "Premiers soins",
  "Boutique",
  "Garde d'enfants"
];

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [newAmenity, setNewAmenity] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    address: '',
    location: { lat: 0, lon: 0 },
    photos: [],
    videos: [],
    dateStart: '',
    dateEnd: '',
    price: 0,
    capacity: 0,
    amenities: [],
    organizerId: '',
    accessibilityInfo: '',
    cancellationPolicy: '',
    isFeatured: false,
    isTrending: false
  });

  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEventById(id);
      const event = response.event;
      
      setFormData({
        title: event.title || '',
        description: event.description || '',
        category: event.category || '',
        address: event.address || '',
        location: event.location?.coordinates ? {
          lat: event.location.coordinates[1],
          lon: event.location.coordinates[0]
        } : { lat: 0, lon: 0 },
        photos: event.photos || [],
        videos: event.videos || [],
        dateStart: event.dateStart ? new Date(event.dateStart).toISOString().slice(0, 16) : '',
        dateEnd: event.dateEnd ? new Date(event.dateEnd).toISOString().slice(0, 16) : '',
        price: event.price || 0,
        capacity: event.capacity || 0,
        amenities: event.amenities || [],
        organizerId: event.organizerId || '',
        accessibilityInfo: event.accessibilityInfo || '',
        cancellationPolicy: event.cancellationPolicy || '',
        isFeatured: event.isFeatured || false,
        isTrending: event.isTrending || false
      });

      // Définir l'emplacement sélectionné
      if (event.location?.coordinates) {
        const lat = event.location.coordinates[1];
        const lon = event.location.coordinates[0];
        const location = MOROCCAN_LOCATIONS.find(loc => 
          Math.abs(loc.lat - lat) < 0.01 && Math.abs(loc.lon - lon) < 0.01
        );
        if (location) {
          setSelectedLocation(location.name);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'événement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'événement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (locationName: string) => {
    setSelectedLocation(locationName);
    const location = MOROCCAN_LOCATIONS.find(loc => loc.name === locationName);
    if (location) {
      setFormData(prev => ({
        ...prev,
        location: { lat: location.lat, lon: location.lon },
        address: locationName
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.dateStart) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      const eventData = {
        ...formData,
        organizerId: formData.organizerId || 'admin', // ID par défaut pour l'admin
        dateStart: new Date(formData.dateStart).toISOString(),
        dateEnd: formData.dateEnd ? new Date(formData.dateEnd).toISOString() : undefined
      };

      if (id) {
        await eventService.updateEvent(id, eventData);
        toast({
          title: "Succès",
          description: "Événement mis à jour avec succès"
        });
      } else {
        await eventService.createEvent(eventData);
        toast({
          title: "Succès",
          description: "Événement créé avec succès"
        });
      }
      
      navigate('/admin/events');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde de l'événement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const addPresetAmenity = (amenity: string) => {
    if (!formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }));
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {id ? 'Modifier l\'événement' : 'Ajouter un événement'}
        </h1>
        <Button variant="outline" onClick={() => navigate('/admin/events')}>
          Annuler
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre de l'événement"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description détaillée de l'événement"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Adresse de l'événement"
                />
              </div>
            </CardContent>
          </Card>

          {/* Localisation */}
          <Card>
            <CardHeader>
              <CardTitle>Localisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="location">Emplacement *</Label>
                <Select value={selectedLocation} onValueChange={handleLocationChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un emplacement" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOROCCAN_LOCATIONS.map(location => (
                      <SelectItem key={location.name} value={location.name}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    value={formData.location.lat}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, lat: parseFloat(e.target.value) || 0 }
                    }))}
                    placeholder="Latitude"
                  />
                </div>
                <div>
                  <Label htmlFor="lon">Longitude</Label>
                  <Input
                    id="lon"
                    type="number"
                    step="any"
                    value={formData.location.lon}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, lon: parseFloat(e.target.value) || 0 }
                    }))}
                    placeholder="Longitude"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dates et prix */}
          <Card>
            <CardHeader>
              <CardTitle>Dates et prix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="dateStart">Date de début *</Label>
                <Input
                  id="dateStart"
                  type="datetime-local"
                  value={formData.dateStart}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateStart: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="dateEnd">Date de fin</Label>
                <Input
                  id="dateEnd"
                  type="datetime-local"
                  value={formData.dateEnd}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateEnd: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="price">Prix (MAD)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="capacity">Capacité</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="0"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                  placeholder="Nombre de places"
                />
              </div>
            </CardContent>
          </Card>

          {/* Équipements */}
          <Card>
            <CardHeader>
              <CardTitle>Équipements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Équipements disponibles</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {AVAILABLE_AMENITIES.map(amenity => (
                    <Badge
                      key={amenity}
                      variant={formData.amenities.includes(amenity) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => addPresetAmenity(amenity)}
                    >
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Équipements sélectionnés</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.amenities.map(amenity => (
                    <Badge key={amenity} variant="secondary">
                      {amenity}
                      <X
                        className="ml-1 h-3 w-3 cursor-pointer"
                        onClick={() => removeAmenity(amenity)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Ajouter un équipement personnalisé"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                />
                <Button type="button" onClick={addAmenity} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informations supplémentaires */}
        <Card>
          <CardHeader>
            <CardTitle>Informations supplémentaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="accessibilityInfo">Informations d'accessibilité</Label>
              <Textarea
                id="accessibilityInfo"
                value={formData.accessibilityInfo}
                onChange={(e) => setFormData(prev => ({ ...prev, accessibilityInfo: e.target.value }))}
                placeholder="Informations sur l'accessibilité pour les personnes handicapées"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="cancellationPolicy">Politique d'annulation</Label>
              <Textarea
                id="cancellationPolicy"
                value={formData.cancellationPolicy}
                onChange={(e) => setFormData(prev => ({ ...prev, cancellationPolicy: e.target.value }))}
                placeholder="Politique d'annulation et de remboursement"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                />
                <Label htmlFor="isFeatured">Événement en vedette</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isTrending"
                  checked={formData.isTrending}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isTrending: checked }))}
                />
                <Label htmlFor="isTrending">Événement tendance</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/events')}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Sauvegarde...' : (id ? 'Mettre à jour' : 'Créer')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventForm; 