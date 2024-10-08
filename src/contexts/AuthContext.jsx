import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loggedInUsers, setLoggedInUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [polls, setPolls] = useState([]);
  const [userVotes, setUserVotes] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
      updateLoggedInUsers(user.email);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      const newSocket = io('http://localhost:3000');
      setSocket(newSocket);
      newSocket.emit('user_connected', currentUser.email);

      newSocket.on('update_online_users', (users) => {
        setOnlineUsers(users);
      });

      return () => {
        newSocket.emit('user_disconnected', currentUser.email);
        newSocket.close();
      };
    }
  }, [currentUser]);

  const updateLoggedInUsers = (email) => {
    setLoggedInUsers(prev => {
      if (!prev.includes(email)) {
        return [...prev, email];
      }
      return prev;
    });
  };

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@gmail.com' && password === 'admin123') {
          const user = { email, isAdmin: true };
          setCurrentUser(user);
          updateLoggedInUsers(email);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        } else if (email && password) {
          const user = { email, isAdmin: false };
          setCurrentUser(user);
          updateLoggedInUsers(email);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  };

  const signIn = login; // Use the same function for sign-in

  const logout = () => {
    return new Promise((resolve) => {
      if (currentUser) {
        setLoggedInUsers(prev => prev.filter(user => user !== currentUser.email));
      }
      setCurrentUser(null);
      localStorage.removeItem('user');
      if (socket) {
        socket.emit('user_disconnected', currentUser.email);
        socket.close();
        setSocket(null);
      }
      resolve();
    });
  };

  const removeUser = (email) => {
    setLoggedInUsers(prev => prev.filter(user => user !== email));
    setOnlineUsers(prev => prev.filter(user => user !== email));
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
    setPolls(prevPolls => [...prevPolls, { ...newPoll, id: Date.now().toString() }]);
  };

  const vote = (pollId, option) => {
    setPolls(prevPolls => prevPolls.map(poll => 
      poll.id === pollId 
        ? { ...poll, votes: { ...poll.votes, [option]: (poll.votes[option] || 0) + 1 } }
        : poll
    ));
    setUserVotes(prevVotes => ({
      ...prevVotes,
      [pollId]: { ...prevVotes[pollId], [currentUser.email]: option }
    }));
    // Emit vote to server
    if (socket) {
      socket.emit('vote', { pollId, option, user: currentUser.email });
    }
  };

  const addOption = (pollId, newOption) => {
    setPolls(prevPolls => prevPolls.map(poll => 
      poll.id === pollId 
        ? { ...poll, options: [...poll.options, newOption] }
        : poll
    ));
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
  };

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

  const value = {
    currentUser,
    login,
    signIn,
    logout,
    removeUser,
    loggedInUsers,
    onlineUsers,
    messages,
    sendMessage,
    sendAnnouncement,
    polls,
    addPoll,
    vote,
    addOption,
    removeOption,
    userVotes,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
