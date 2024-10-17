import { db } from '../firebase/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

const POLLS_COLLECTION = 'polls';

export const createPoll = async (pollData) => {
  try {
    const docRef = await addDoc(collection(db, POLLS_COLLECTION), {
      ...pollData,
      votes: {},
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating poll:", error);
    throw error;
  }
};

export const getPolls = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, POLLS_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting polls:", error);
    throw error;
  }
};

export const votePoll = async (pollId, option, userId) => {
  try {
    const pollRef = doc(db, POLLS_COLLECTION, pollId);
    const pollDoc = await getDoc(pollRef);
    
    if (!pollDoc.exists()) {
      throw new Error("Poll not found");
    }

    const pollData = pollDoc.data();
    const votes = pollData.votes || {};

    // Remove previous vote if exists
    Object.keys(votes).forEach(key => {
      votes[key] = votes[key].filter(id => id !== userId);
    });

    // Add new vote
    if (!votes[option]) {
      votes[option] = [];
    }
    votes[option].push(userId);

    await updateDoc(pollRef, { votes });
    return votes;
  } catch (error) {
    console.error("Error voting on poll:", error);
    throw error;
  }
};