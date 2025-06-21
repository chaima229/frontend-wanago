import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import axios from "axios";

const Auth = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, loginWithFacebook } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await register(formData.fullName, formData.email, formData.password);

      if (success) {
        toast({
          title: 'Vérification requise',
          description: 'Un code de validation a été envoyé à votre adresse email',
        });
        navigate('/validation');

        const user = getAuth().currentUser;
        if (user) {
          const idToken = await user.getIdToken();
          console.log("idToken:", idToken);
          await axios.post("http://localhost:5000/api/users", {
            uid: user.uid,
            email: user.email,
            fullName: formData.fullName,
            // autres infos
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
            },
          });
        }
        
      } else {
        toast({
          title: 'Erreur',
          description: 'Erreur lors de la création du compte.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        toast({
          title: "Email déjà utilisé",
          description: "Cet email est déjà associé à un compte. Veuillez vous connecter.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Erreur lors de la création du compte.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const success = await loginWithGoogle();
      if (success) {
        toast({
          title: 'Compte créé',
          description: 'Votre compte a été créé avec succès',
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur de connexion avec Google.',
        variant: 'destructive',
      });
    }
  };

  const handleFacebookSignup = async () => {
    try {
      const success = await loginWithFacebook();
      if (success) {
        toast({
          title: 'Compte créé',
          description: 'Votre compte a été créé avec succès',
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur de connexion avec Facebook.',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function registerUser(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const idToken = await user.getIdToken();

    // Appel backend pour créer l'utilisateur dans MongoDB
    await axios.post("http://localhost:5000/api/users", {
      uid: user.uid,
      email: user.email,
      fullName: formData.fullName,
      // autres infos si besoin
    }, {
      headers: { Authorization: `Bearer ${idToken}` }
    });
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Restaurant image */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: `url('/wanaGOO.jpg')`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Créer un compte
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Nom complet
              </label>
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Nom complet"
                required
                className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Adresse e-mail
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@example.com"
                required
                className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="********"
                  required
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 h-12 rounded-lg font-semibold transition-all duration-200"
            >
              {loading ? 'Chargement...' : 'Créer le compte'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Vous avez déjà un compte ? Connectez-vous
            </Link>
          </div>

          <div className="mt-8 text-center">
            <div className="text-sm text-muted-foreground mb-4">OU</div>
            <div className="space-y-3">
              <Button
                type="button"
                onClick={handleGoogleSignup}
                variant="outline"
                className="w-full bg-card text-foreground border-border hover:bg-accent h-12 flex items-center justify-center gap-3"
              >
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">G</div>
                Se connecter avec Google
              </Button>
              {/* <Button
                type="button"
                onClick={handleFacebookSignup}
                variant="outline"
                className="w-full bg-blue-600 text-white border-blue-600 hover:bg-blue-700 h-12 flex items-center justify-center gap-3"
              >
                <div className="w-5 h-5 bg-white rounded text-blue-600 flex items-center justify-center text-xs font-bold">f</div>
                Se connecter avec Facebook
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
