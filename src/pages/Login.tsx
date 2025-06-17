
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
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
          backgroundImage: `url('/lovable-uploads/restaurant-bg.jpg')`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 flex items-start justify-center pt-8">
          <div className="text-white text-2xl font-bold flex items-center">
            <span className="text-red-500 mr-1">📍</span>
            VanGo
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 bg-gray-900 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Log In
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                E-mail Address
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="anass.akker@vnov.com"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 h-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Akan2002"
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 h-12 rounded-lg font-semibold transition-all duration-200"
            >
              {loading ? 'Loading...' : 'Log In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/auth"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Don't have an account? Create Account
            </Link>
          </div>

          <div className="mt-8 text-center">
            <div className="text-sm text-gray-400 mb-4">OR</div>
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-white text-gray-900 border-gray-300 hover:bg-gray-50 h-12 flex items-center justify-center gap-3"
              >
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">G</div>
                Sign in with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full bg-blue-600 text-white border-blue-600 hover:bg-blue-700 h-12 flex items-center justify-center gap-3"
              >
                <div className="w-5 h-5 bg-white rounded text-blue-600 flex items-center justify-center text-xs font-bold">f</div>
                Sign in with Facebook
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
