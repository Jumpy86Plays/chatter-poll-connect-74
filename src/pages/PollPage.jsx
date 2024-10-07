import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Poll from '../components/Poll';
import AddPoll from '../components/AddPoll';

const PollPage = () => {
  const { currentUser, polls, vote, addOption, removeOption } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Polls</h2>
      {currentUser?.isAdmin && (
        <div className="mb-8">
          <AddPoll />
        </div>
      )}
      {polls && polls.length > 0 ? (
        polls.map((poll) => (
          <div key={poll.id} className="mb-8">
            <Poll
              poll={poll}
              onVote={(option) => vote(poll.id, option)}
              onAddOption={(option) => addOption(poll.id, option)}
              onRemoveOption={(option) => removeOption(poll.id, option)}
            />
          </div>
        ))
      ) : (
        <p>No polls available at the moment.</p>
      )}
    </div>
  );
};

export default PollPage;