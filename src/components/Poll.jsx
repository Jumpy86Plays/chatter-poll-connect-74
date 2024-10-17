import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VoteIcon, ChartBarIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { votePoll } from '../services/pollService';
import { useToast } from "@/components/ui/use-toast";

const Poll = ({ poll, onVote }) => {
  const [userVote, setUserVote] = useState('');
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const handleVote = async (e) => {
    e.preventDefault();
    if (userVote) {
      try {
        const updatedVotes = await votePoll(poll.id, userVote, currentUser.uid);
        onVote(poll.id, updatedVotes);
        toast({
          title: "Vote Submitted",
          description: "Your vote has been recorded successfully.",
        });
        setUserVote('');
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit your vote. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const totalVotes = Object.values(poll.votes || {}).reduce((a, b) => a + b.length, 0);

  const chartData = poll.options.map(option => ({
    name: option,
    votes: (poll.votes && poll.votes[option]) ? poll.votes[option].length : 0
  }));

  return (
    <Card className="max-w-2xl mx-auto bg-black text-yellow-300 border border-yellow-600 shadow-lg shadow-yellow-500/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-yellow-400 flex items-center">
          <VoteIcon className="mr-2" />
          {poll.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleVote} className="space-y-4">
          <RadioGroup value={userVote} onValueChange={setUserVote}>
            {poll.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="text-yellow-200">{option}</Label>
              </div>
            ))}
          </RadioGroup>
          <Button type="submit" disabled={!userVote} className="w-full bg-yellow-600 text-black hover:bg-yellow-700 transition-colors duration-300">
            Cast Your Vote
          </Button>
        </form>
        <div className="space-y-4">
          {poll.options.map((option) => (
            <div key={option} className="space-y-1">
              <div className="flex justify-between text-sm font-medium text-yellow-300">
                <span>{option}</span>
                <span>{(poll.votes && poll.votes[option]) ? poll.votes[option].length : 0} votes</span>
              </div>
              <Progress value={totalVotes > 0 ? ((poll.votes && poll.votes[option]) ? poll.votes[option].length / totalVotes * 100 : 0) : 0} className="h-2 bg-gray-700" indicatorClassName="bg-yellow-400" />
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-yellow-800">
          <h3 className="text-lg font-semibold mb-4 text-yellow-400 flex items-center">
            <ChartBarIcon className="mr-2" />
            Force Alignment Chart
          </h3>
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
      </CardContent>
    </Card>
  );
};

export default Poll;