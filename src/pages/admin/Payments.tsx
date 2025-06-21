import React from 'react';

const AdminPayments = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Gestion des paiements</h1>
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">ID Paiement</th>
              <th className="text-left">Montant</th>
              <th className="text-left">Statut</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Exemple de ligne */}
            <tr>
              <td>PAY-123456</td>
              <td>200.00 MAD</td>
              <td>COMPLETED</td>
              <td><button className="text-blue-400">Détails</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments; 