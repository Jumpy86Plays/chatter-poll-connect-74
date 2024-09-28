import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Chatter Poll Connect</h1>
      <p className="text-xl">
        {currentUser
          ? `Hello, ${currentUser.email}! Navigate through the app using the menu above.`
          : 'Please log in to access all features.'}
      </p>
    </div>
  );
};

export default Home;