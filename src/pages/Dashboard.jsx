import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold mr-4">Chatter Poll Connect</span>
              <Link to="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link to="/chat" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Chat</Link>
              <Link to="/poll" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Poll</Link>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Logged in as: {currentUser?.email} {currentUser?.isAdmin ? '(Admin)' : ''}</span>
              <Button onClick={handleLogout} variant="destructive">Log Out</Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;