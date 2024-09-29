import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserIcon, UserCheckIcon, BarChartIcon } from 'lucide-react';

const Dashboard = () => {
  const { loggedInUsers, voters, polls } = useAuth();

  if (!loggedInUsers || !voters || !polls) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const totalVotes = polls.reduce((sum, poll) => sum + poll.totalVotes, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-8">
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChartIcon className="mr-2" />
              Total Votes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-center">{totalVotes}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;