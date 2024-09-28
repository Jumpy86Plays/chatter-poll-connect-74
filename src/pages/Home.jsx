import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Welcome to Chatter Poll Connect</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Chat with Others</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Join our vibrant community and engage in real-time conversations with users from around the world.</p>
            <Link to="/chat">
              <Button className="w-full">Go to Chat</Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Participate in Polls</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Make your voice heard! Vote on exciting topics and see real-time results of community opinions.</p>
            <Link to="/poll">
              <Button className="w-full">Go to Polls</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      {currentUser && (
        <p className="mt-8 text-center text-xl">
          Welcome back, <span className="font-semibold">{currentUser.email}</span>!
        </p>
      )}
    </div>
  );
};

export default Home;