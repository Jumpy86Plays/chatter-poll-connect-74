import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserIcon, UserCheckIcon } from 'lucide-react';

const Dashboard = () => {
  const { loggedInUsers, voters } = useAuth();

  if (!loggedInUsers || !voters) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserIcon className="mr-2" />
              Logged In Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {loggedInUsers.map((user, index) => (
                <li key={index} className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2 text-primary" />
                  {user}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheckIcon className="mr-2" />
              Voters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {voters.map((voter, index) => (
                <li key={index} className="flex items-center">
                  <UserCheckIcon className="h-4 w-4 mr-2 text-primary" />
                  {voter}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;