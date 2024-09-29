import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Poll from '../components/Poll';
import AddPoll from '../components/AddPoll';

const PollPage = () => {
  const { currentUser, polls, addPoll, vote, addOption, removeOption } = useAuth();

  const handleAddPoll = (newPoll) => {
    addPoll(newPoll);
  };

  const handleVote = (pollId, option) => {
    vote(pollId, option);
  };

  const handleAddOption = (pollId, option) => {
    addOption(pollId, option);
  };

  const handleRemoveOption = (pollId, option) => {
    removeOption(pollId, option);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Polls</h2>
      {currentUser.isAdmin && (
        <div className="mb-8">
          <AddPoll onAddPoll={handleAddPoll} />
        </div>
      )}
      {polls.map((poll) => (
        <div key={poll.id} className="mb-8">
          <Poll
            poll={poll}
            onVote={(option) => handleVote(poll.id, option)}
            onAddOption={(option) => handleAddOption(poll.id, option)}
            onRemoveOption={(option) => handleRemoveOption(poll.id, option)}
          />
        </div>
      ))}
    </div>
  );
};

export default PollPage;