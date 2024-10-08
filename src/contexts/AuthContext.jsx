import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [polls, setPolls] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      const newSocket = io('http://localhost:3000');
      setSocket(newSocket);

      newSocket.on('receive_message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      newSocket.on('receive_announcement', (announcement) => {
        setMessages(prev => [...prev, announcement]);
      });

      newSocket.on('vote_update', (updatedPoll) => {
        setPolls(prev => prev.map(poll => 
          poll.id === updatedPoll.id ? updatedPoll : poll
        ));
      });

      newSocket.on('online_users', (users) => {
        setOnlineUsers(users);
      });

      return () => {
        newSocket.close();
      };
    }
  }, [currentUser]);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@gmail.com' && password === 'admin123') {
          const user = { email, isAdmin: true };
          setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        } else if (email && password) {
          const user = { email, isAdmin: false };
          setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    return new Promise((resolve) => {
      setCurrentUser(null);
      localStorage.removeItem('user');
      if (socket) {
        socket.close();
        setSocket(null);
      }
      resolve();
    });
  };

  const sendMessage = (text, to) => {
    const newMessage = { from: currentUser.email, to, text, isAdmin: currentUser.isAdmin };
    setMessages(prev => [...prev, newMessage]);
    if (socket) {
      socket.emit('new_message', newMessage);
    }
  };

  const sendAnnouncement = (text) => {
    const newAnnouncement = { from: currentUser.email, text, isAnnouncement: true };
    setMessages(prev => [...prev, newAnnouncement]);
    if (socket) {
      socket.emit('new_announcement', newAnnouncement);
    }
  };

  const addPoll = (newPoll) => {
    const pollWithId = { ...newPoll, id: Date.now().toString(), votes: {} };
    setPolls(prevPolls => [...prevPolls, pollWithId]);
    if (socket) {
      socket.emit('new_poll', pollWithId);
    }
  };

  const vote = (pollId, option) => {
    setPolls(prevPolls => prevPolls.map(poll => {
      if (poll.id === pollId) {
        const updatedVotes = { ...poll.votes, [option]: (poll.votes[option] || 0) + 1 };
        const updatedPoll = { ...poll, votes: updatedVotes };
        if (socket) {
          socket.emit('vote', { pollId, option, user: currentUser.email });
        }
        return updatedPoll;
      }
      return poll;
    }));
  };

  const addOption = (pollId, newOption) => {
    setPolls(prevPolls => prevPolls.map(poll => 
      poll.id === pollId 
        ? { ...poll, options: [...poll.options, newOption], votes: { ...poll.votes, [newOption]: 0 } }
        : poll
    ));
    if (socket) {
      socket.emit('add_option', { pollId, newOption });
    }
  };

  const removeOption = (pollId, optionToRemove) => {
    setPolls(prevPolls => prevPolls.map(poll => 
      poll.id === pollId 
        ? { 
            ...poll, 
            options: poll.options.filter(option => option !== optionToRemove),
            votes: Object.fromEntries(Object.entries(poll.votes).filter(([key]) => key !== optionToRemove))
          }
        : poll
    ));
    if (socket) {
      socket.emit('remove_option', { pollId, optionToRemove });
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    messages,
    sendMessage,
    sendAnnouncement,
    polls,
    addPoll,
    vote,
    addOption,
    removeOption,
    userVotes,
    socket,
    onlineUsers,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}