import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from './ui/button';

interface SessionTimeoutModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onLogout: () => void;
  countdown: number;
}

const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({ isOpen, onContinue, onLogout, countdown }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Votre session est sur le point d'expirer</AlertDialogTitle>
          <AlertDialogDescription>
            Pour des raisons de sécurité, vous serez déconnecté dans {countdown} secondes.
            Voulez-vous continuer votre session ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onLogout}>
            Se déconnecter
          </Button>
          <AlertDialogAction onClick={onContinue}>
            Rester connecté
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SessionTimeoutModal; 