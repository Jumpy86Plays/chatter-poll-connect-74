import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Chat from '../components/Chat';
import Poll from '../components/Poll';
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
              <span className="text-xl font-semibold mr-4">Dashboard</span>
              <Link to="/dashboard" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link to="/dashboard/chat" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Chat</Link>
              <Link to="/dashboard/poll" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Poll</Link>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Logged in as: {currentUser?.email} {currentUser?.isAdmin ? '(Admin)' : ''}</span>
              <Button onClick={handleLogout} variant="destructive">Log Out</Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Chat</h2>
                <Chat />
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Poll</h2>
                <Poll />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;