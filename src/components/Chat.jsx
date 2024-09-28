import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { currentUser, socket } = useAuth();
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (socket) {
      socket.on('chat message', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
    }
    return () => {
      if (socket) {
        socket.off('chat message');
      }
    };
  }, [socket]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const messageObj = { user: currentUser.email, text: newMessage, isAdmin: currentUser.isAdmin };
      socket.emit('chat message', messageObj);
      setMessages((prevMessages) => [...prevMessages, messageObj]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-md">
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.isAdmin ? 'font-bold' : ''}`}>
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};

export default Chat;