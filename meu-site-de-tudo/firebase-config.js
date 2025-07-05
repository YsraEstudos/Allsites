// Firebase Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, addDoc, getDocs, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUhBrADjlhOHPqG6b8o1DZDOl7t8OIcRQ",
  authDomain: "all-in-one-site-9c1ae.firebaseapp.com",
  projectId: "all-in-one-site-9c1ae",
  storageBucket: "all-in-one-site-9c1ae.firebasestorage.app",
  messagingSenderId: "584089799134",
  appId: "1:584089799134:web:c17dd94b5c5ca95e17f4dc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Gemini API Configuration
export const GEMINI_API_KEY = "AIzaSyCqBfKXNDOL9ctuOJXfY03iAMJhqCHyWs0";
export const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// Auth functions
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Firestore functions for YouTube data
export async function saveYouTubeVideo(userId, videoData) {
  try {
    const docRef = await addDoc(collection(db, 'users', userId, 'youtube_videos'), {
      ...videoData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getYouTubeVideos(userId) {
  try {
    const q = query(
      collection(db, 'users', userId, 'youtube_videos'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const videos = [];
    querySnapshot.forEach((doc) => {
      videos.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, videos };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateYouTubeVideo(userId, videoId, updateData) {
  try {
    const videoRef = doc(db, 'users', userId, 'youtube_videos', videoId);
    await updateDoc(videoRef, {
      ...updateData,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteYouTubeVideo(userId, videoId) {
  try {
    await deleteDoc(doc(db, 'users', userId, 'youtube_videos', videoId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Firestore functions for Studies data
export async function saveStudyTopic(userId, topicData) {
  try {
    const docRef = await addDoc(collection(db, 'users', userId, 'study_topics'), {
      ...topicData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getStudyTopics(userId) {
  try {
    const q = query(
      collection(db, 'users', userId, 'study_topics'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const topics = [];
    querySnapshot.forEach((doc) => {
      topics.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, topics };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateStudyTopic(userId, topicId, updateData) {
  try {
    const topicRef = doc(db, 'users', userId, 'study_topics', topicId);
    await updateDoc(topicRef, {
      ...updateData,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteStudyTopic(userId, topicId) {
  try {
    await deleteDoc(doc(db, 'users', userId, 'study_topics', topicId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Gemini API function
export async function generateWithGemini(prompt) {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      text: data.candidates[0].content.parts[0].text
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Auth state observer
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, callback);
}
