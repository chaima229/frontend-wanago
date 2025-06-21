import React, { createContext, useContext, useState, useEffect } from 'react';

interface Restaurant {
  id: string;
  name: string;
  image: string;
  description: string;
  address: string;
  ville: string;
  location: any;
  price: number;
  priceRange?: string;
}

interface ReservationData {
  restaurant?: Restaurant;
  date?: string;
  time?: string;
  guests?: number;
  ville?: string;
  reservationId?: string;
  price?: number;
  totalAmount?: number;
  customerInfo?: {
    fullName: string;
    email: string;
    phone: string;
  };
}

interface ReservationContextType {
  reservationData: ReservationData;
  updateReservation: (data: Partial<ReservationData>) => void;
  clearReservation: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};

export const ReservationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialData = (): ReservationData => {
    try {
      const saved = localStorage.getItem('reservationData');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error loading reservation data from localStorage:', error);
      return {};
    }
  };

  const [reservationData, setReservationData] = useState<ReservationData>(getInitialData);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    try {
      localStorage.setItem('reservationData', JSON.stringify(reservationData));
    } catch (error) {
      console.error('Error saving reservation data to localStorage:', error);
    }
  }, [reservationData]);

  const updateReservation = (data: Partial<ReservationData>) => {
    setReservationData(prev => ({ ...prev, ...data }));
  };

  const clearReservation = () => {
    setReservationData({});
    setCurrentStep(1);
    localStorage.removeItem('reservationData');
  };

  const value = {
    reservationData,
    updateReservation,
    clearReservation,
    currentStep,
    setCurrentStep,
  };

  return <ReservationContext.Provider value={value}>{children}</ReservationContext.Provider>;
};
