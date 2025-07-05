// Firebase Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, addDoc, getDocs, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDA51YgCq7UAxljlIuAUcgrHhqS8hXbTHQ",
  authDomain: "allsites-49962.firebaseapp.com",
  projectId: "allsites-49962",
  storageBucket: "allsites-49962.firebasestorage.app",
  messagingSenderId: "712864304203",
  appId: "1:712864304203:web:656a21e65dd7e1cc3f91ce",
  measurementId: "G-02DP7Q50XB"
};

// Initialize Firebase
let app, auth, db, storage, analytics;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Only initialize analytics if measurementId is provided
  if (firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { auth, db, storage, analytics };

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

export async function registerUser(email, password, displayName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile with display name
    if (displayName) {
      await updateProfile(user, {
        displayName: displayName
      });
    }
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: displayName || '',
      photoURL: user.photoURL || '',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
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

// Profile management functions
export async function updateUserProfile(userId, profileData) {
  try {
    const user = auth.currentUser;
    if (user && user.uid === userId) {
      // Update Firebase Auth profile
      const updateData = {};
      if (profileData.displayName !== undefined) updateData.displayName = profileData.displayName;
      if (profileData.photoURL !== undefined) updateData.photoURL = profileData.photoURL;
      
      if (Object.keys(updateData).length > 0) {
        await updateProfile(user, updateData);
      }
    }
    
    // Update Firestore document
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: new Date()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getUserProfile(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { success: true, profile: userSnap.data() };
    } else {
      return { success: false, error: 'Profile not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function uploadProfilePhoto(userId, file) {
  try {
    // Create a reference to the file location
    const fileRef = ref(storage, `profile-photos/${userId}/${file.name}`);
    
    // Upload the file
    const snapshot = await uploadBytes(fileRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Update user profile with new photo URL
    await updateUserProfile(userId, { photoURL: downloadURL });
    
    return { success: true, photoURL: downloadURL };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteProfilePhoto(userId, photoURL) {
  try {
    // Delete from storage
    if (photoURL) {
      const photoRef = ref(storage, photoURL);
      await deleteObject(photoRef);
    }
    
    // Update user profile
    await updateUserProfile(userId, { photoURL: '' });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Helper function to get user initials
export function getUserInitials(displayName, email) {
  if (displayName) {
    return displayName.split(' ').map(name => name.charAt(0).toUpperCase()).join('').substring(0, 2);
  }
  if (email) {
    return email.charAt(0).toUpperCase();
  }
  return 'U';
}
