"use client"
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Star, Users, Award, Clock, Loader2 } from 'lucide-react';
import { ApiService } from '@/services/api';

interface Stats {
  restaurantCount: number;
  averageRating: number;
  yearsOfExperience: number;
  reservationCount: number;
}

const fetchStats = async (): Promise<Stats> => {
    return ApiService.get('/stats');
}

const StatCard = ({ icon: Icon, label, value, isLoading }) => (
    <div className="bg-background rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-lg transform hover:scale-105 transition-transform duration-300">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-3 mb-4">
            <Icon className="h-8 w-8 text-white" />
        </div>
        {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        ) : (
            <h3 className="text-4xl font-bold text-foreground">{value}</h3>
        )}
        <p className="text-muted-foreground mt-2">{label}</p>
    </div>
);

const About = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  });

  const handleGetStartedClick = () => {
    if (isAuthenticated) {
      navigate('/leave-review');
    } else {
      navigate('/login');
    }
  };

  const statsList = [
    { icon: Users, label: 'Restaurants partenaires', value: `${stats?.restaurantCount || 0}+` },
    { icon: Star, label: 'Avis clients', value: `${stats ? stats.averageRating.toFixed(1) : 0}/5` },
    { icon: Award, label: 'Années d\'expérience', value: `${stats?.yearsOfExperience || 0}+` },
    { icon: Clock, label: 'Réservations traitées', value: `${(stats?.reservationCount || 0).toLocaleString()}+` }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">À propos de WanaGO</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Nous facilitons vos réservations de WanaGO, 
            en vous connectant aux meilleurs établissements du Maroc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {statsList.map((stat, index) => (
            <StatCard key={index} icon={stat.icon} label={stat.label} value={stat.value} isLoading={isLoading} />
          ))}
        </div>

        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Notre Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">Pour les clients</h3>
              <p className="text-muted-foreground leading-relaxed">
                Nous simplifions le processus de réservation en vous offrant une plateforme 
                intuitive pour découvrir et réserver dans les meilleurs restaurants et les événements. 
                Gagnez du temps et découvrez de nouvelles expériences culinaires.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-4">Pour les restaurants et les événements</h3>
              <p className="text-muted-foreground leading-relaxed">
                Nous aidons les restaurants et les gestionnaire des événements à optimiser leur gestion des réservations 
                et à attirer de nouveaux clients grâce à notre plateforme de réservation 
                moderne et efficace.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Rejoignez-nous</h2>
          <p className="text-xl text-muted-foreground mb-8">
            {isAuthenticated ? "Partagez votre expérience avec nous." : "Découvrez pourquoi des milliers de personnes nous font confiance pour leurs réservations."}
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold">
              <Button onClick={handleGetStartedClick}>
                {isAuthenticated ? "Donner mon avis" : "Commencer maintenant"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
