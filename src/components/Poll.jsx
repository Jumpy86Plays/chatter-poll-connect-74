import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircleIcon, MinusCircleIcon } from 'lucide-react';

const Poll = ({ poll, onVote, onAddOption, onRemoveOption }) => {
  const [userVote, setUserVote] = useState('');
  const { currentUser } = useAuth();

  const handleVote = (e) => {
    e.preventDefault();
    if (userVote && !currentUser.isAdmin) {
      onVote(userVote);
      setUserVote('');
    }
  };

  const totalVotes = Object.values(poll.votes).reduce((a, b) => a + b, 0);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{poll.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleVote} className="space-y-4">
          <RadioGroup value={userVote} onValueChange={setUserVote}>
            {poll.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} disabled={currentUser.isAdmin} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
          <Button type="submit" disabled={!userVote || currentUser.isAdmin}>
            {currentUser.isAdmin ? "Admins can't vote" : "Vote"}
          </Button>
        </form>
        <div className="space-y-4">
          {poll.options.map((option) => (
            <div key={option} className="space-y-1">
              <div className="flex justify-between text-sm font-medium">
                <span>{option}</span>
                <span>{poll.votes[option] || 0} votes</span>
              </div>
              <Progress value={(poll.votes[option] || 0) / totalVotes * 100} className="h-2" />
            </div>
          ))}
        </div>
        {currentUser.isAdmin && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">Admin Controls</h3>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="New option"
                onChange={(e) => setNewOption(e.target.value)}
              />
              <Button onClick={() => onAddOption(newOption)}>
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {poll.options.map((option) => (
                <div key={option} className="flex justify-between items-center">
                  <span>{option}</span>
                  <Button onClick={() => onRemoveOption(option)} variant="destructive" size="sm">
                    <MinusCircleIcon className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Poll;