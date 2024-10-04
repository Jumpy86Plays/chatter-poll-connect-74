import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserIcon, UserXIcon, WifiIcon } from 'lucide-react';

const Dashboard = () => {
  const { loggedInUsers, polls, onlineUsers, removeUser } = useAuth();

  if (!loggedInUsers || !polls || !onlineUsers) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const handleRemoveUser = (email) => {
    if (window.confirm(`Are you sure you want to remove ${email}?`)) {
      removeUser(email);
    }
  };

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
                <li key={index} className="flex items-center justify-between">
                  <span className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-primary" />
                    {user}
                  </span>
                  <Button
                    onClick={() => handleRemoveUser(user)}
                    variant="destructive"
                    size="sm"
                  >
                    <UserXIcon className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <WifiIcon className="mr-2" />
              Online Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {onlineUsers.map((user, index) => (
                <li key={index} className="flex items-center">
                  <WifiIcon className="h-4 w-4 mr-2 text-green-500" />
                  {user}
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