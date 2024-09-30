import React, { useState } from 'react';
import Chat from '../components/Chat';
import Notification from '../components/Notification';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ChatPage = () => {
  const { currentUser, loggedInUsers } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);

  const handleNotificationClick = (notification) => {
    setSelectedUser(notification.sender);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>
      {currentUser.isAdmin && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Select User</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleUserSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a user to chat with" />
              </SelectTrigger>
              <SelectContent>
                {loggedInUsers.filter(user => user !== currentUser.email).map((user) => (
                  <SelectItem key={user} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}
      {currentUser.isAdmin && (
        <Notification onNotificationClick={handleNotificationClick} />
      )}
      {selectedUser && (
        <p className="mb-4">
          Chatting with: <strong>{selectedUser}</strong>
        </p>
      )}
      <Chat selectedUser={selectedUser} />
    </div>
  );
};

export default ChatPage;