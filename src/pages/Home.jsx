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
      <h1 className="text-4xl font-bold mb-8 text-center text-primary dark:text-primary-foreground text-shadow">Welcome to Chatter Poll Connect</h1>
      {currentUser && (
        <p className="text-center text-xl mb-8 text-content">
          Welcome back, <span className="font-semibold text-primary dark:text-primary-foreground">{currentUser.email}</span>!
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="shadow-lg transform hover:scale-105 transition-all duration-300 border-gradient">
          <CardHeader className="gradient-bg text-white">
            <CardTitle className="text-2xl flex items-center">
              <MessageCircleIcon className="mr-2" />
              Chat with Others
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 glass-effect">
            <p className="mb-4 text-content">Join our vibrant community and engage in real-time conversations with users from around the world.</p>
            <Link to="/chat">
              <Button className="w-full hover:shadow-lg transition-shadow duration-200">Go to Chat</Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="shadow-lg transform hover:scale-105 transition-all duration-300 border-gradient">
          <CardHeader className="gradient-bg text-white">
            <CardTitle className="text-2xl flex items-center">
              <BarChartIcon className="mr-2" />
              Participate in Polls
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 glass-effect">
            <p className="mb-4 text-content">Make your voice heard! Vote on exciting topics and see real-time results of community opinions.</p>
            <Link to="/poll">
              <Button className="w-full hover:shadow-lg transition-shadow duration-200">Go to Polls</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;