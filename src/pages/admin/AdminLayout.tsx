import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <aside className="w-64 bg-gray-800 p-6 text-white flex flex-col space-y-4">
        <h2 className="text-2xl font-bold mb-6">Admin</h2>
        <nav className="flex flex-col space-y-2">
          <Link to="/admin" className="hover:text-purple-400">Dashboard</Link>
          <Link to="/admin/users" className="hover:text-purple-400">Utilisateurs</Link>
          <Link to="/admin/reservations" className="hover:text-purple-400">Réservations</Link>
          <Link to="/admin/payments" className="hover:text-purple-400">Paiements</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout; 