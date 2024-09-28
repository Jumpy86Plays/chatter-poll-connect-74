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

  useEffect(() => {
    if (currentUser) {
      const newSocket = io('http://localhost:3000');
      setSocket(newSocket);
      return () => newSocket.close();
    }
  }, [currentUser]);

  function login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@gmail.com' && password === 'admin123') {
          const user = { email, isAdmin: true };
          setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        } else if (email === 'user@example.com' && password === 'password') {
          const user = { email, isAdmin: false };
          setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  }

  function signIn(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = { email, isAdmin: false };
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        resolve(user);
      }, 1000);
    });
  }

  function logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    login,
    signIn,
    logout,
    socket
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}