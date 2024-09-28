import React from 'react';
import Chat from '../components/Chat';

const ChatPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>
      <Chat />
    </div>
  );
};

export default ChatPage;