import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard Admin</h1>
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Statistiques globales</h2>
        <ul className="space-y-2">
          <li>Total utilisateurs : ...</li>
          <li>Total réservations : ...</li>
          <li>Total paiements : ...</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard; 