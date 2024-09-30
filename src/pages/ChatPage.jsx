import React from 'react';
import Chat from '../components/Chat';
import Notification from '../components/Notification';
import { useAuth } from '../contexts/AuthContext';

const ChatPage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>
      {currentUser.isAdmin && (
        <Notification />
      )}
      <Chat />
    </div>
  );
};

export default ChatPage;