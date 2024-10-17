import { ref, push, onValue, off } from 'firebase/database';
import { realtimeDb } from '../firebase/firebase';
import { toast } from "@/components/ui/use-toast";

const chatRef = ref(realtimeDb, 'chat');

export const sendMessage = async (user, message) => {
  try {
    await push(chatRef, {
      user: user.email,
      message,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Error sending message:", error);
    toast({
      title: "Error",
      description: "Failed to send message. Please try again.",
      variant: "destructive",
    });
  }
};

export const subscribeToChat = (callback) => {
  onValue(chatRef, (snapshot) => {
    const messages = [];
    snapshot.forEach((childSnapshot) => {
      messages.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });
    callback(messages);
  }, (error) => {
    console.error("Error fetching messages:", error);
    toast({
      title: "Error",
      description: "Failed to load messages. Please refresh the page.",
      variant: "destructive",
    });
  });
};

export const unsubscribeFromChat = () => {
  off(chatRef);
};