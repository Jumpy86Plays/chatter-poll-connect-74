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
  };

  const removeUser = (email) => {
    setLoggedInUsers(prev => prev.filter(user => user !== email));
    setOnlineUsers(prev => prev.filter(user => user !== email));
  };

  const value = {
    currentUser,
    login,
    signIn,
    logout,
    removeUser,
    loggedInUsers,
    onlineUsers,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}