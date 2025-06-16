
import React, { createContext, useContext, useState } from 'react';

interface Restaurant {
  id: string;
  name: string;
  image: string;
  description: string;
  location: string;
  price: number;
}

interface ReservationData {
  restaurant?: Restaurant;
  date?: string;
  time?: string;
  guests?: number;
  city?: string;
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
  const [reservationData, setReservationData] = useState<ReservationData>({});
  const [currentStep, setCurrentStep] = useState(1);

  const updateReservation = (data: Partial<ReservationData>) => {
    setReservationData(prev => ({ ...prev, ...data }));
  };

  const clearReservation = () => {
    setReservationData({});
    setCurrentStep(1);
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
