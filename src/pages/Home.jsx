import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MessageCircleIcon, BarChartIcon } from 'lucide-react';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <h1 className="text-5xl font-bold mb-8 text-center text-primary dark:text-primary-foreground">
        Welcome to Chatter Poll Connect
      </h1>
      {currentUser && (
        <p className="text-center text-xl mb-8">
          Welcome back, <span className="font-semibold">{currentUser.email}</span>!
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <MessageCircleIcon className="mr-2" />
              Chat with Others
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Join our vibrant community and engage in real-time conversations with users from around the world.</p>
            <Link to="/chat">
              <Button className="w-full">Go to Chat</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <BarChartIcon className="mr-2" />
              Participate in Polls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Make your voice heard! Vote on exciting topics and see real-time results of community opinions.</p>
            <Link to="/poll">
              <Button className="w-full">Go to Polls</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;