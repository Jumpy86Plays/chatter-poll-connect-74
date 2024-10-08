import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SendIcon, MegaphoneIcon, UserIcon } from 'lucide-react';

const Chat = () => {
  const [newMessage, setNewMessage] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const { currentUser, messages = [], sendMessage, sendAnnouncement } = useAuth();
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage, 'all');
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

  const latestAnnouncement = messages.filter(msg => msg.isAnnouncement).pop();

  return (
    <Card className="h-[600px] flex flex-col bg-gradient-to-br from-yellow-900 via-yellow-800 to-yellow-700 text-yellow-100">
      <CardHeader className="bg-yellow-600 text-black rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center">
          <UserIcon className="mr-2" />
          Galactic Chat Room
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-0">
        {latestAnnouncement && (
          <div className="bg-red-900 p-3 border-b border-red-700 animate-pulse">
            <MegaphoneIcon className="inline mr-2 text-red-400" />
            <strong className="text-lg text-red-200">Imperial Announcement:</strong>
            <span className="ml-2 text-red-100">{latestAnnouncement.text}</span>
          </div>
        )}
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <p className="text-center text-yellow-200 text-opacity-70">No messages yet. May the Force be with you!</p>
          ) : (
            messages.filter(msg => !msg.isAnnouncement).map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg max-w-[70%] ${
                  msg.from === currentUser?.email
                    ? 'bg-yellow-600 text-black self-end ml-auto'
                    : 'bg-gray-800 text-yellow-100 self-start'
                } ${msg.isAdmin ? 'border-2 border-red-500' : ''} shadow-lg`}
              >
                <div className="text-xs opacity-75 mb-1">{msg.from}</div>
                <div>{msg.text}</div>
              </div>
            ))
          )}
        </ScrollArea>
        <div className="p-4 bg-gray-900 rounded-b-lg">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow bg-gray-800 text-yellow-100 focus:ring-2 focus:ring-yellow-500"
            />
            <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-black">
              <SendIcon className="h-4 w-4" />
            </Button>
          </form>
          {currentUser?.isAdmin && (
            <form onSubmit={handleAnnouncement} className="flex gap-2 mt-2">
              <Input
                type="text"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Type an announcement..."
                className="flex-grow bg-gray-800 text-yellow-100 focus:ring-2 focus:ring-red-500"
              />
              <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                <MegaphoneIcon className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Chat;