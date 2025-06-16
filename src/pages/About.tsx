
import React from 'react';
import { Star, Users, Award, Clock } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, label: 'Restaurants partenaires', value: '500+' },
    { icon: Star, label: 'Avis clients', value: '4.8/5' },
    { icon: Award, label: 'Années d\'expérience', value: '10+' },
    { icon: Clock, label: 'Réservations traitées', value: '50,000+' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">À propos de RestaurantGo</h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Nous facilitons vos réservations de restaurants depuis plus de 10 ans, 
            en vous connectant aux meilleurs établissements du Maroc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Notre Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-purple-400 mb-4">Pour les clients</h3>
              <p className="text-gray-300 leading-relaxed">
                Nous simplifions le processus de réservation en vous offrant une plateforme 
                intuitive pour découvrir et réserver dans les meilleurs restaurants. 
                Gagnez du temps et découvrez de nouvelles expériences culinaires.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-4">Pour les restaurants</h3>
              <p className="text-gray-300 leading-relaxed">
                Nous aidons les restaurants à optimiser leur gestion des réservations 
                et à attirer de nouveaux clients grâce à notre plateforme de réservation 
                moderne et efficace.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Rejoignez-nous</h2>
          <p className="text-xl text-gray-300 mb-8">
            Découvrez pourquoi des milliers de personnes nous font confiance pour leurs réservations.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold">
              Commencer maintenant
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
