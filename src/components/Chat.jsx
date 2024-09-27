import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Form, ListGroup } from 'react-bootstrap';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { currentUser, socket } = useAuth();

  useEffect(() => {
    if (socket) {
      socket.on('chat message', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
    }
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      socket.emit('chat message', { user: currentUser.email, text: newMessage });
      setNewMessage('');
    }
  };

  return (
    <div className="mt-4">
      <h2>Chat</h2>
      <ListGroup className="mb-3" style={{ height: '300px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <ListGroup.Item key={index}>
            <strong>{msg.user}:</strong> {msg.text}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
        </Form.Group>
        <Button type="submit">Send</Button>
      </Form>
    </div>
  );
};

export default Chat;