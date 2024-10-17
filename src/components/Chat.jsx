import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SendIcon, UserIcon } from 'lucide-react';
import { sendMessage, subscribeToChat, unsubscribeFromChat } from '../services/chatService';
import { useToast } from "@/components/ui/use-toast";

const Chat = () => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { currentUser } = useAuth();
  const scrollAreaRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    subscribeToChat((updatedMessages) => {
      setMessages(updatedMessages);
    });

    return () => {
      unsubscribeFromChat();
    };
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(currentUser, newMessage.trim());
      setNewMessage('');
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    }
  };

  return (
    <Card className="h-[600px] flex flex-col bg-gradient-to-br from-yellow-900 via-yellow-800 to-yellow-700 text-yellow-100">
      <CardHeader className="bg-yellow-600 text-black rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center">
          <UserIcon className="mr-2" />
          Live Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-0">
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <p className="text-center text-yellow-200 text-opacity-70">No messages yet. Start the conversation!</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 p-2 rounded-lg max-w-[70%] ${
                  msg.user === currentUser.email
                    ? 'bg-yellow-600 text-black self-end ml-auto'
                    : 'bg-gray-800 text-yellow-100 self-start'
                } shadow-lg`}
              >
                <div className="text-xs opacity-75 mb-1">{msg.user}</div>
                <div>{msg.message}</div>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default Chat;