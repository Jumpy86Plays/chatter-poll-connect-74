import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/chat" className="hover:text-gray-300">Chat</Link>
          <Link to="/poll" className="hover:text-gray-300">Poll</Link>
          {currentUser && currentUser.isAdmin && (
            <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <span>{currentUser.email}</span>
              <Button onClick={handleLogout} variant="destructive">Logout</Button>
            </>
          ) : (
            <Link to="/login" className="hover:text-gray-300">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;