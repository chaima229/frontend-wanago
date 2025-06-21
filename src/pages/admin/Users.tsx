import React from 'react';

const AdminUsers = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Gestion des utilisateurs</h1>
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Nom</th>
              <th className="text-left">Email</th>
              <th className="text-left">Rôle</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Exemple de ligne */}
            <tr>
              <td>Admin</td>
              <td>admin@email.com</td>
              <td>admin</td>
              <td><button className="text-blue-400">Modifier</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers; 