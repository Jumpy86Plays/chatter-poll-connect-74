import React, { useState } from 'react';
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
  const { currentUser, userVotes } = useAuth();

  const handleVote = (e) => {
    e.preventDefault();
    if (userVote && !currentUser.isAdmin) {
      onVote(poll.id, userVote);
      setUserVote('');
    }
  };

  const totalVotes = Object.values(poll.votes || {}).reduce((a, b) => a + b, 0);

  const chartData = poll.options.map(option => ({
    name: option,
    votes: (poll.votes && poll.votes[option]) || 0
  }));

  const pollUserVotes = userVotes[poll.id] || {};

  return (
    <Card className="max-w-2xl mx-auto bg-gray-900 text-yellow-100 border border-yellow-600">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-yellow-400">{poll.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleVote} className="space-y-4">
          <RadioGroup value={userVote} onValueChange={setUserVote}>
            {poll.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} disabled={currentUser.isAdmin} />
                <Label htmlFor={option} className="text-yellow-200">{option}</Label>
              </div>
            ))}
          </RadioGroup>
          <Button type="submit" disabled={!userVote || currentUser.isAdmin} className="w-full bg-yellow-600 text-black hover:bg-yellow-700">
            {currentUser.isAdmin ? "Jedi Masters can't vote" : "Cast Your Vote"}
          </Button>
        </form>
        <div className="space-y-4">
          {poll.options.map((option) => (
            <div key={option} className="space-y-1">
              <div className="flex justify-between text-sm font-medium text-yellow-300">
                <span>{option}</span>
                <span>{(poll.votes && poll.votes[option]) || 0} votes</span>
              </div>
              <Progress value={totalVotes > 0 ? ((poll.votes && poll.votes[option]) || 0) / totalVotes * 100 : 0} className="h-2 bg-gray-700" indicatorClassName="bg-yellow-400" />
            </div>
          ))}
        </div>
        {currentUser.isAdmin && (
          <>
            <div className="space-y-4 pt-4 border-t border-yellow-800">
              <h3 className="text-lg font-semibold text-yellow-400">Jedi Council Controls</h3>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="New option"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className="bg-gray-800 text-yellow-100 border-yellow-600"
                />
                <Button onClick={() => {
                  if (newOption.trim()) {
                    onAddOption(poll.id, newOption.trim());
                    setNewOption('');
                  }
                }} className="bg-green-600 hover:bg-green-700 text-black">
                  <PlusCircleIcon className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
              <div className="space-y-2">
                {poll.options.map((option) => (
                  <div key={option} className="flex justify-between items-center">
                    <span className="text-yellow-200">{option}</span>
                    <Button onClick={() => onRemoveOption(poll.id, option)} variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                      <MinusCircleIcon className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-yellow-800">
              <h3 className="text-lg font-semibold mb-4 text-yellow-400">Force Alignment Chart</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#ffd700" />
                  <YAxis stroke="#ffd700" />
                  <Tooltip contentStyle={{ backgroundColor: '#333', border: '1px solid #ffd700' }} />
                  <Legend />
                  <Bar dataKey="votes" fill="#ffd700" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="pt-4 border-t border-yellow-800">
              <h3 className="text-lg font-semibold mb-4 text-yellow-400">Jedi Archives - User Votes</h3>
              <ul className="space-y-2">
                {Object.entries(pollUserVotes).map(([user, vote]) => (
                  <li key={user} className="flex justify-between items-center">
                    <span className="text-yellow-200">{user}</span>
                    <span className="font-semibold text-yellow-400">{vote}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Poll;