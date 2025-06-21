import React from 'react';

const AdminReservations = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Gestion des réservations</h1>
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Client</th>
              <th className="text-left">Date</th>
              <th className="text-left">Statut</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Exemple de ligne */}
            <tr>
              <td>John Doe</td>
              <td>2025-06-20</td>
              <td>confirmée</td>
              <td><button className="text-blue-400">Voir</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReservations; 