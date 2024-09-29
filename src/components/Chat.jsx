import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SendIcon } from 'lucide-react';

const Chat = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { currentUser, socket } = useAuth();
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (socket) {
      socket.on('chat message', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
        if (currentUser.isAdmin && msg.user !== currentUser.email) {
          socket.emit('new notification', { sender: msg.user, message: msg.text });
        }
      });
    }
    return () => {
      if (socket) {
        socket.off('chat message');
      }
    };
  }, [socket, currentUser]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const messageObj = {
        user: currentUser.email,
        text: newMessage,
        isAdmin: currentUser.isAdmin,
        recipient: currentUser.isAdmin ? selectedUser : 'admin'
      };
      socket.emit('chat message', messageObj);
      setMessages((prevMessages) => [...prevMessages, messageObj]);
      setNewMessage('');
    }
  };

  const filteredMessages = currentUser.isAdmin
    ? messages.filter(msg => msg.user === selectedUser || msg.recipient === selectedUser)
    : messages.filter(msg => msg.user === currentUser.email || msg.recipient === currentUser.email);

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
                  msg.user === currentUser.email
                    ? 'bg-primary text-white self-end'
                    : 'bg-gray-100 text-gray-800 self-start'
                } ${msg.isAdmin ? 'font-bold' : ''}`}
              >
                <strong>{msg.user}:</strong> {msg.text}
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
      </CardContent>
    </Card>
  );
};

export default Chat;