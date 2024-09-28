import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { loggedInUsers, voters } = useAuth();

  if (!loggedInUsers || !voters) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Logged In Users</h3>
        <ul className="list-disc pl-5">
          {loggedInUsers.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Voters</h3>
        <ul className="list-disc pl-5">
          {voters.map((voter, index) => (
            <li key={index}>{voter}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;