import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function login(email, password) {
    // Mock login function
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'user@example.com' && password === 'password') {
          const user = { email };
          setCurrentUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  }

  function logout() {
    // Mock logout function
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser(null);
        localStorage.removeItem('user');
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
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}