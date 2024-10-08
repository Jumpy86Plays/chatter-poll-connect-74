import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircleIcon, MinusCircleIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Poll = ({ poll, onVote, onAddOption, onRemoveOption }) => {
  const [userVote, setUserVote] = useState('');
  const [newOption, setNewOption] = useState('');
  const { currentUser, userVotes, socket } = useAuth();

  useEffect(() => {
    if (socket) {
      socket.on('vote_update', (updatedPoll) => {
        if (updatedPoll.id === poll.id) {
          onVote(updatedPoll.id, updatedPoll.lastVote, updatedPoll.votes);
        }
      });
    }
    return () => {
      if (socket) {
        socket.off('vote_update');
      }
    };
  }, [socket, poll.id, onVote]);

  const handleVote = (e) => {
    e.preventDefault();
    if (userVote && !currentUser.isAdmin) {
      onVote(poll.id, userVote);
      setUserVote('');
      if (socket) {
        socket.emit('vote', { pollId: poll.id, option: userVote, user: currentUser.email });
      }
    }
  };

  const totalVotes = Object.values(poll.votes || {}).reduce((a, b) => a + b, 0);

  const chartData = poll.options.map(option => ({
    name: option,
    votes: (poll.votes && poll.votes[option]) || 0
  }));

  const pollUserVotes = userVotes[poll.id] || {};

  return (
    <Card className="max-w-2xl mx-auto dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold dark:text-white">{poll.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleVote} className="space-y-4">
          <RadioGroup value={userVote} onValueChange={setUserVote}>
            {poll.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} disabled={currentUser.isAdmin} />
                <Label htmlFor={option} className="dark:text-gray-300">{option}</Label>
              </div>
            ))}
          </RadioGroup>
          <Button type="submit" disabled={!userVote || currentUser.isAdmin} className="w-full">
            {currentUser.isAdmin ? "Admins can't vote" : "Vote"}
          </Button>
        </form>
        <div className="space-y-4">
          {poll.options.map((option) => (
            <div key={option} className="space-y-1">
              <div className="flex justify-between text-sm font-medium dark:text-gray-300">
                <span>{option}</span>
                <span>{(poll.votes && poll.votes[option]) || 0} votes</span>
              </div>
              <Progress value={totalVotes > 0 ? ((poll.votes && poll.votes[option]) || 0) / totalVotes * 100 : 0} className="h-2" />
            </div>
          ))}
        </div>
        {currentUser.isAdmin && (
          <>
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold dark:text-white">Admin Controls</h3>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="New option"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className="dark:bg-gray-700 dark:text-white"
                />
                <Button onClick={() => {
                  if (newOption.trim()) {
                    onAddOption(poll.id, newOption.trim());
                    setNewOption('');
                  }
                }}>
                  <PlusCircleIcon className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
              <div className="space-y-2">
                {poll.options.map((option) => (
                  <div key={option} className="flex justify-between items-center">
                    <span className="dark:text-gray-300">{option}</span>
                    <Button onClick={() => onRemoveOption(poll.id, option)} variant="destructive" size="sm">
                      <MinusCircleIcon className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">User Votes</h3>
              <ul className="space-y-2">
                {Object.entries(pollUserVotes).map(([user, vote]) => (
                  <li key={user} className="flex justify-between items-center">
                    <span className="dark:text-gray-300">{user}</span>
                    <span className="font-semibold dark:text-white">{vote}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Vote Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="votes" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Poll;