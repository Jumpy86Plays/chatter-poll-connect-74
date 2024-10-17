import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "Account created",
        description: "You've successfully signed up!",
      });
      return user;
    } catch (error) {
      console.error("Error signing up:", error);
      let errorMessage = "An error occurred during sign up.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already in use. Please try a different one.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use a stronger password.";
      }
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Logged in",
        description: "Welcome back!",
      });
      return userCredential.user;
    } catch (error) {
      console.error("Error logging in:", error);
      let errorMessage = "Invalid email or password. Please try again.";
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email. Please sign up.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      }
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const value = {
    currentUser,
    login,
    signUp,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}