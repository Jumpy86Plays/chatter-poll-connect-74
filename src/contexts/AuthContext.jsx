import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [loggedInUsers, setLoggedInUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [voters, setVoters] = useState([]);
  const [polls, setPolls] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userVotes, setUserVotes] = useState({});

  useEffect(() => {
    if (currentUser) {
      const newSocket = io('http://localhost:3000');
      setSocket(newSocket);
      newSocket.emit('user_connected', currentUser.email);
      return () => {
        newSocket.emit('user_disconnected', currentUser.email);
        newSocket.close();
      };
    }
  }, [currentUser]);

  useEffect(() => {
    if (socket) {
      socket.on('chat message', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
      socket.on('update_online_users', (users) => {
        setOnlineUsers(users);
      });
    }
    return () => {
      if (socket) {
        socket.off('chat message');
        socket.off('update_online_users');
      }
    };
  }, [socket]);

  const updateLoggedInUsers = (email) => {
    setLoggedInUsers(prev => {
      if (!prev.includes(email)) {
        return [...prev, email];
      }
      return prev;
    });
  }

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@gmail.com' && password === 'admin123') {
          const user = { email, isAdmin: true };
          setCurrentUser(user);
          updateLoggedInUsers(email);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        } else if (email === 'user@example.com' && password === 'password') {
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
  }

  const signIn = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = { email, isAdmin: false };
        setCurrentUser(user);
        updateLoggedInUsers(email);
        localStorage.setItem('user', JSON.stringify(user));
        resolve(user);
      }, 1000);
    });
  }

  const logout = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (currentUser) {
          setLoggedInUsers(prev => prev.filter(user => user !== currentUser.email));
        }
        setCurrentUser(null);
        localStorage.removeItem('user');
        if (socket) {
          socket.close();
          setSocket(null);
        }
        resolve();
      }, 1000);
    });
  }

  const removeUser = (email) => {
    setLoggedInUsers(prev => prev.filter(user => user !== email));
    setOnlineUsers(prev => prev.filter(user => user !== email));
  };

  const addVoter = (voter) => {
    setVoters(prev => [...prev, voter]);
  };

  const addOption = (pollId, option) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId) {
        return { ...poll, options: [...poll.options, option] };
      }
      return poll;
    }));
  };

  const removeOption = (pollId, option) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id === pollId) {
        const updatedOptions = poll.options.filter(o => o !== option);
        const { [option]: removedVotes, ...updatedVotes } = poll.votes;
        return { 
          ...poll, 
          options: updatedOptions, 
          votes: updatedVotes,
          totalVotes: poll.totalVotes - (removedVotes || 0)
        };
      }
      return poll;
    }));
  };

  const sendMessage = (text, to) => {
    const newMessage = {
      from: currentUser.email,
      to,
      text,
      isAdmin: currentUser.isAdmin,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
    if (socket) {
      socket.emit('chat message', newMessage);
    }
  };

  const sendAnnouncement = (text) => {
    const newAnnouncement = {
      from: currentUser.email,
      text,
      isAnnouncement: true,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newAnnouncement]);
    if (socket) {
      socket.emit('chat message', newAnnouncement);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
      updateLoggedInUsers(user.email);
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    login,
    signIn,
    logout,
    removeUser,
    socket,
    loggedInUsers,
    onlineUsers,
    voters,
    addVoter,
    polls,
    addPoll,
    vote,
    addOption,
    removeOption,
    messages,
    sendMessage,
    sendAnnouncement,
    userVotes,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
