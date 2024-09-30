import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SendIcon, MegaphoneIcon } from 'lucide-react';

const Chat = ({ selectedUser }) => {
  const [newMessage, setNewMessage] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const { currentUser, socket, messages, sendMessage, sendAnnouncement } = useAuth();
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage, selectedUser);
      setNewMessage('');
    }
  };

  const handleAnnouncement = (e) => {
    e.preventDefault();
    if (announcement.trim()) {
      sendAnnouncement(announcement);
      setAnnouncement('');
    }
  };

  const filteredMessages = currentUser.isAdmin
    ? messages.filter(msg => msg.from === selectedUser || msg.to === selectedUser || msg.isAnnouncement)
    : messages.filter(msg => msg.from === currentUser.email || msg.to === currentUser.email || msg.isAnnouncement);

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Chat Room {selectedUser && `- Chatting with ${selectedUser}`}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
          {filteredMessages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet. Start a conversation!</p>
          ) : (
            filteredMessages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  msg.isAnnouncement
                    ? 'bg-yellow-100 text-yellow-800'
                    : msg.from === currentUser.email
                    ? 'bg-primary text-white self-end'
                    : 'bg-gray-100 text-gray-800 self-start'
                } ${msg.isAdmin ? 'font-bold' : ''}`}
              >
                {msg.isAnnouncement ? (
                  <>
                    <MegaphoneIcon className="inline mr-2" />
                    <strong>Announcement:</strong> {msg.text}
                  </>
                ) : (
                  <>
                    <strong>{msg.from}:</strong> {msg.text}
                  </>
                )}
              </div>
            ))
          )}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow"
          />
          <Button type="submit">
            <SendIcon className="h-4 w-4 mr-2" />
            Send
          </Button>
        </form>
        {currentUser.isAdmin && (
          <form onSubmit={handleAnnouncement} className="flex gap-2 mt-2">
            <Input
              type="text"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Type an announcement..."
              className="flex-grow"
            />
            <Button type="submit" variant="secondary">
              <MegaphoneIcon className="h-4 w-4 mr-2" />
              Announce
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default Chat;