import React from 'react';
import Poll from '../components/Poll';

const PollPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Poll</h2>
      <Poll />
    </div>
  );
};

export default PollPage;