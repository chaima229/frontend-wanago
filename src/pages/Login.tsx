
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        toast({
          title: 'Connexion réussie',
          description: 'Bienvenue !',
        });
        navigate('/');
      } else {
        toast({
          title: 'Erreur',
          description: 'Email ou mot de passe incorrect.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const success = await loginWithGoogle();
      if (success) {
        toast({
          title: 'Connexion réussie',
          description: 'Bienvenue !',
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

  /* const handleFacebookLogin = async () => {
    try {
      const success = await loginWithFacebook();
      if (success) {
        toast({
          title: 'Connexion réussie',
          description: 'Bienvenue !',
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
  }; */

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
              Se connecter
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              {loading ? 'Chargement...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/auth"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pas encore de compte ? Créez-en un
            </Link>
          </div>

          <div className="mt-8 text-center">
            <div className="text-sm text-muted-foreground mb-4">OU</div>
            <div className="space-y-3">
              <Button
                type="button"
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full bg-card text-foreground border-border hover:bg-accent h-12 flex items-center justify-center gap-3"
              >
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">G</div>
                Se connecter avec Google
              </Button>
              {/* <Button
                type="button"
                onClick={handleFacebookLogin}
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

export default Login;
