import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Form, ProgressBar } from 'react-bootstrap';

const Poll = () => {
  const [poll, setPoll] = useState({ question: 'Favorite color?', options: ['Red', 'Blue', 'Green'] });
  const [votes, setVotes] = useState({ Red: 0, Blue: 0, Green: 0 });
  const [userVote, setUserVote] = useState('');
  const { socket } = useAuth();

  useEffect(() => {
    if (socket) {
      socket.on('poll update', (updatedVotes) => {
        setVotes(updatedVotes);
      });
    }
  }, [socket]);

  const handleVote = (e) => {
    e.preventDefault();
    if (userVote && socket) {
      socket.emit('poll vote', userVote);
      setUserVote('');
    }
  };

  return (
    <div className="mt-4">
      <h2>Live Poll: {poll.question}</h2>
      <Form onSubmit={handleVote}>
        {poll.options.map((option) => (
          <Form.Check
            key={option}
            type="radio"
            label={option}
            name="pollOption"
            value={option}
            onChange={(e) => setUserVote(e.target.value)}
            checked={userVote === option}
          />
        ))}
        <Button type="submit" className="mt-2">Vote</Button>
      </Form>
      <div className="mt-3">
        {Object.entries(votes).map(([option, count]) => (
          <div key={option}>
            <p>{option}</p>
            <ProgressBar now={(count / Object.values(votes).reduce((a, b) => a + b, 0)) * 100} label={`${count}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Poll;