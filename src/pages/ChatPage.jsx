import React from 'react';
import Chat from '../components/Chat';
import { useAuth } from '../contexts/AuthContext';

const ChatPage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Live Chat</h2>
      {currentUser ? (
        <Chat />
      ) : (
        <p>Please log in to access the chat.</p>
      )}
    </div>
  );
};

export default ChatPage;