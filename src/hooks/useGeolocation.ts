import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prevState => ({
        ...prevState,
        error: 'La géolocalisation n\'est pas supportée par votre navigateur.',
        loading: false,
      }));
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      let errorMessage = 'Impossible de récupérer la position.';
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Vous avez refusé la demande de géolocalisation.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Les informations de localisation ne sont pas disponibles.";
          break;
        case error.TIMEOUT:
          errorMessage = "La demande de géolocalisation a expiré.";
          break;
      }
      setState(prevState => ({
        ...prevState,
        error: errorMessage,
        loading: false,
      }));
    };

    // Demande la position
    navigator.geolocation.getCurrentPosition(onSuccess, onError);

  }, []); // Se lance une seule fois au montage du composant

  return state;
}; 