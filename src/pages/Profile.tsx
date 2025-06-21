import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserService } from '../services/userService';
import { FirebaseAuthService } from '../services/firebaseAuthService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const Profile = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors }, watch, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setValue('fullName', user.fullName);
      setValue('email', user.email);
      // You can add other fields like phone, address etc.
    }
  }, [user, setValue]);

  const onSubmit = async (data: any) => {
    if (!user || !user._id) return;
    setIsSubmitting(true);
    try {
      // The update function needs the user's database ID (_id), not the firebase uid
      // We assume the user object from AuthContext contains the database _id
      const updatedUser = await UserService.updateUser(user._id, {
        fullName: data.fullName,
        // add other fields
      });
      
      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations ont été mises à jour avec succès.',
      });

      // You might need to update the user in the AuthContext as well
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la mise à jour.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPasswordChangeSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await FirebaseAuthService.changePassword(data.currentPassword, data.newPassword);
      toast({
        title: 'Mot de passe mis à jour',
        description: 'Votre mot de passe a été changé avec succès.',
      });
      reset();
      setIsPasswordDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Profil</CardTitle>
            <CardDescription className="text-muted-foreground">Gérez les informations de votre profil.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nom complet</label>
                <Input {...register('fullName', { required: 'Le nom est requis' })} className="bg-card border-border text-foreground"/>
                {errors.fullName && <p className="text-destructive text-sm mt-1">{errors.fullName.message as string}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input {...register('email')} disabled className="bg-muted border-border text-muted-foreground cursor-not-allowed"/>
              </div>

              {/* Add other fields like phone number here */}

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Mise à jour...' : 'Sauvegarder les modifications'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Sécurité</CardTitle>
            <CardDescription className="text-muted-foreground">Gérez les paramètres de sécurité de votre compte.</CardDescription>
          </CardHeader>
          <CardContent>
             <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Changer de mot de passe</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
                <DialogHeader>
                  <DialogTitle>Changer de mot de passe</DialogTitle>
                  <DialogDescription>
                    Entrez votre mot de passe actuel et le nouveau mot de passe.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitPassword(onPasswordChangeSubmit)} className="space-y-4 py-4">
                  <div>
                    <label className="text-foreground">Mot de passe actuel</label>
                    <Input type="password" {...registerPassword('currentPassword', { required: 'Mot de passe actuel requis' })} className="bg-card border-border text-foreground"/>
                    {passwordErrors.currentPassword && <p className="text-destructive text-sm mt-1">{passwordErrors.currentPassword.message as string}</p>}
                  </div>
                  <div>
                    <label className="text-foreground">Nouveau mot de passe</label>
                    <Input type="password" {...registerPassword('newPassword', { required: 'Nouveau mot de passe requis', minLength: { value: 6, message: '6 caractères minimum' } })} className="bg-card border-border text-foreground"/>
                    {passwordErrors.newPassword && <p className="text-destructive text-sm mt-1">{passwordErrors.newPassword.message as string}</p>}
                  </div>
                  <div>
                    <label className="text-foreground">Confirmer le nouveau mot de passe</label>
                    <Input type="password" {...registerPassword('confirmPassword', {
                      required: 'Confirmation requise',
                      validate: value => value === watch('newPassword') || 'Les mots de passe ne correspondent pas'
                    })} className="bg-card border-border text-foreground"/>
                    {passwordErrors.confirmPassword && <p className="text-destructive text-sm mt-1">{passwordErrors.confirmPassword.message as string}</p>}
                  </div>
                   <DialogFooter>
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? 'Mise à jour...' : 'Sauvegarder'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile; 