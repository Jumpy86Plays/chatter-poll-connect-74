import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircleIcon, MinusCircleIcon } from 'lucide-react';

const Poll = () => {
  const [poll, setPoll] = useState({ question: 'Favorite color?', options: ['Red', 'Blue', 'Green'] });
  const [votes, setVotes] = useState({ Red: 0, Blue: 0, Green: 0 });
  const [userVote, setUserVote] = useState('');
  const { currentUser, socket, addVoter } = useAuth();
  const [newOption, setNewOption] = useState('');

  useEffect(() => {
    if (socket) {
      socket.on('poll update', (updatedVotes) => {
        setVotes(updatedVotes);
      });
    }
    return () => {
      if (socket) {
        socket.off('poll update');
      }
    };
  }, [socket]);

  const handleVote = (e) => {
    e.preventDefault();
    if (userVote && socket) {
      socket.emit('poll vote', { option: userVote, user: currentUser.email });
      addVoter(currentUser.email);
      setVotes(prevVotes => ({
        ...prevVotes,
        [userVote]: prevVotes[userVote] + 1
      }));
      setUserVote('');
    }
  };

  const handleAddOption = () => {
    if (newOption && !poll.options.includes(newOption)) {
      setPoll(prevPoll => ({
        ...prevPoll,
        options: [...prevPoll.options, newOption]
      }));
      setVotes(prevVotes => ({
        ...prevVotes,
        [newOption]: 0
      }));
      setNewOption('');
    }
  };

  const handleRemoveOption = (optionToRemove) => {
    setPoll(prevPoll => ({
      ...prevPoll,
      options: prevPoll.options.filter(option => option !== optionToRemove)
    }));
    setVotes(prevVotes => {
      const { [optionToRemove]: removed, ...rest } = prevVotes;
      return rest;
    });
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

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
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
          <Button type="submit" disabled={!userVote}>Vote</Button>
        </form>
        <div className="space-y-4">
          {Object.entries(votes).map(([option, count]) => (
            <div key={option} className="space-y-1">
              <div className="flex justify-between text-sm font-medium">
                <span>{option}</span>
                <span>{count} votes</span>
              </div>
              <Progress value={(count / totalVotes) * 100} className="h-2" />
            </div>
          ))}
        </div>
        {currentUser.isAdmin && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">Admin Controls</h3>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="New option"
              />
              <Button onClick={handleAddOption}>
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {poll.options.map((option) => (
                <div key={option} className="flex justify-between items-center">
                  <span>{option}</span>
                  <Button onClick={() => handleRemoveOption(option)} variant="destructive" size="sm">
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