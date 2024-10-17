import { ref, push, onValue, off } from 'firebase/database';
import { realtimeDb } from '../firebase/firebase';

const chatRef = ref(realtimeDb, 'chat');

export const sendMessage = (user, message) => {
  push(chatRef, {
    user: user.email,
    message,
    timestamp: Date.now(),
  });
};

export const subscribeToChat = (callback) => {
  onValue(chatRef, (snapshot) => {
    const messages = [];
    snapshot.forEach((childSnapshot) => {
      messages.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });
    callback(messages);
  });
};

export const unsubscribeFromChat = () => {
  off(chatRef);
};