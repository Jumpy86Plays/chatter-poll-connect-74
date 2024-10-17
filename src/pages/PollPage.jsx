import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Poll from '../components/Poll';
import AddPoll from '../components/AddPoll';
import { getPolls, createPoll } from '../services/pollService';
import { useToast } from "@/components/ui/use-toast";

const PollPage = () => {
  const [polls, setPolls] = useState([]);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const fetchedPolls = await getPolls();
      setPolls(fetchedPolls);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load polls. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddPoll = async (pollData) => {
    try {
      await createPoll(pollData);
      fetchPolls();
      toast({
        title: "Success",
        description: "New poll created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new poll. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVote = (pollId, updatedVotes) => {
    setPolls(polls.map(poll => 
      poll.id === pollId ? { ...poll, votes: updatedVotes } : poll
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Polls</h2>
      <div className="mb-8">
        <AddPoll onAddPoll={handleAddPoll} />
      </div>
      {polls && polls.length > 0 ? (
        polls.map((poll) => (
          <div key={poll.id} className="mb-8">
            <Poll
              poll={poll}
              onVote={handleVote}
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