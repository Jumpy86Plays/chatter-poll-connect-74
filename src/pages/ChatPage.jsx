import React, { useState } from 'react';
import Chat from '../components/Chat';
import Notification from '../components/Notification';
import { useAuth } from '../contexts/AuthContext';

const ChatPage = () => {
  const { currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);

  const handleNotificationClick = (notification) => {
    setSelectedUser(notification.sender);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>
      {currentUser.isAdmin && (
        <Notification onNotificationClick={handleNotificationClick} />
      )}
      {selectedUser && (
        <p className="mb-4">
          Chatting with: <strong>{selectedUser}</strong>
        </p>
      )}
      <Chat />
    </div>
  );
};

export default ChatPage;