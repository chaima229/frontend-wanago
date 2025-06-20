import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EventService } from '@/services/eventService';

const eventImage = '/lovable-uploads/2aa0cf26-fb8b-4c05-b09c-7a7aa4d64ea4.png';

const Events = () => {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    EventService.getAllEvents()
      .then((data) => setEvents(data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const handleValidatePromo = () => {
    console.log('Validating promo code:', promoCode);
  };

  const handleReserve = () => {
    setShowPayment(true);
  };

  if (showPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Event Summary */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Récapitulation de la réservation</h3>
              
              <div className="flex items-start space-x-4 mb-6">
                <img
                  src={selectedEvent?.image}
                  alt={selectedEvent?.title}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div>
                  <h4 className="text-lg font-bold text-white">{selectedEvent?.title}</h4>
                  <div className="flex items-center text-gray-300 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{selectedEvent?.venue}</span>
                  </div>
                  <div className="flex items-center text-gray-300 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="text-sm">{selectedEvent?.date}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-white">
                  <span>P.U : {selectedEvent?.ticketPrice}.00 MAD</span>
                  <span>{selectedEvent?.ticketPrice}.00 MAD</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Total des tickets</span>
                  <span>{selectedEvent?.ticketPrice}.00 MAD</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Réduction</span>
                  <span>0.00 MAD</span>
                </div>
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>TOTAL À PAYER</span>
                    <span>{selectedEvent?.ticketPrice}.00 MAD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6">Coordonnées</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Adresse e-mail
                    </label>
                    <Input
                      type="email"
                      placeholder="email*"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Numéro de mobile
                    </label>
                    <div className="flex">
                      <div className="bg-gray-800 border border-gray-600 rounded-l-md px-3 py-2 text-white text-sm">
                        MA +212
                      </div>
                      <Input
                        type="tel"
                        placeholder="Numéro de téléphone *"
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 rounded-l-none border-l-0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mode de paiement
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        defaultChecked
                        className="mr-3"
                      />
                      <span className="text-white">carte bancaire</span>
                      <div className="ml-auto">
                        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">CIH</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center text-white">
                    <input type="checkbox" className="mr-3" />
                    <span className="text-sm">j'ai lu les conditions de vente et j'y adhère sans réserve</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200"
                >
                  passer la commande
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Événements</h1>
        
        {loading ? (
          <div className="text-white">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={event.image || eventImage}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    13
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-300">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.venue}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-400">{event.ticketPrice}.00 MAD</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="saisir votre code promo"
                        className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                      />
                      <Button
                        onClick={handleValidatePromo}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Valider
                      </Button>
                    </div>

                    <Button
                      onClick={() => {
                        setSelectedEvent(event);
                        handleReserve();
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                    >
                      Réserver
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
