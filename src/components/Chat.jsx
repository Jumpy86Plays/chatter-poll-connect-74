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
  const { currentUser, messages = [], sendMessage, sendAnnouncement, socket } = useAuth();
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      socket.on('receive_announcement', (announcement) => {
        setMessages(prev => [...prev, announcement]);
      });

      return () => {
        socket.off('receive_message');
        socket.off('receive_announcement');
      };
    }
  }, [socket]);

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

  return (
    <Card className="h-[600px] flex flex-col bg-gradient-to-br from-gradient-start via-gradient-mid to-gradient-end">
      <CardHeader className="bg-primary text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center">
          <UserIcon className="mr-2" />
          Group Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-0">
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <p className="text-center text-white text-opacity-70">No messages yet. Start a conversation!</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg max-w-[70%] ${
                  msg.from === currentUser?.email
                    ? 'bg-primary text-white self-end ml-auto'
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 self-start'
                } ${msg.isAdmin ? 'font-semibold' : ''} ${msg.isAnnouncement ? 'bg-yellow-500 text-white w-full max-w-full' : ''} shadow-lg`}
              >
                <div className="text-xs opacity-75 mb-1">{msg.from}</div>
                <div>{msg.text}</div>
              </div>
            ))
          )}
        </ScrollArea>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-b-lg">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-primary transition-all duration-200"
            />
            <Button type="submit" className="bg-primary hover:bg-primary-dark transition-colors duration-200">
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
                className="flex-grow bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
              />
              <Button type="submit" variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white transition-colors duration-200">
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