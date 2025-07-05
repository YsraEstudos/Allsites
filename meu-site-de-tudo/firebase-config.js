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
    console.log('Updating profile for user:', userId, 'with data:', profileData);
    
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    
    if (user.uid !== userId) {
      throw new Error('User ID mismatch');
    }
    
    // Update Firebase Auth profile
    const authUpdateData = {};
    if (profileData.displayName !== undefined) authUpdateData.displayName = profileData.displayName;
    if (profileData.photoURL !== undefined) authUpdateData.photoURL = profileData.photoURL;
    
    if (Object.keys(authUpdateData).length > 0) {
      console.log('Updating Firebase Auth profile with:', authUpdateData);
      await updateProfile(user, authUpdateData);
      console.log('Firebase Auth profile updated successfully');
    }
    
    // Update Firestore document
    console.log('Updating Firestore document');
    const userRef = doc(db, 'users', userId);
    
    // Check if document exists, if not create it
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      console.log('Creating new user document in Firestore');
      await setDoc(userRef, {
        email: user.email,
        displayName: profileData.displayName || '',
        photoURL: profileData.photoURL || '',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      console.log('Updating existing user document in Firestore');
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: new Date()
      });
    }
    
    console.log('Profile updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
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
    console.log('Starting photo upload for user:', userId);
    console.log('File size:', file.size, 'bytes');
    console.log('File type:', file.type);
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Arquivo muito grande. Máximo: 5MB');
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Arquivo deve ser uma imagem');
    }
    
    // Create a unique filename to avoid conflicts
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const fileRef = ref(storage, `profile-photos/${userId}/${fileName}`);
    
    console.log('Uploading file to:', `profile-photos/${userId}/${fileName}`);
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Upload timeout - tente novamente')), 30000); // 30 seconds
    });
    
    // Upload the file with timeout
    const uploadPromise = uploadBytes(fileRef, file);
    const snapshot = await Promise.race([uploadPromise, timeoutPromise]);
    console.log('File uploaded successfully');
    
    // Get the download URL with timeout
    const urlPromise = getDownloadURL(snapshot.ref);
    const downloadURL = await Promise.race([urlPromise, timeoutPromise]);
    console.log('Download URL obtained:', downloadURL);
    
    return { success: true, photoURL: downloadURL };
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    let errorMessage = error.message;
    
    // Translate common Firebase errors
    if (errorMessage.includes('storage/unauthorized')) {
      errorMessage = 'Sem permissão para upload. Verifique se está logado.';
    } else if (errorMessage.includes('storage/retry-limit-exceeded')) {
      errorMessage = 'Falha no upload. Verifique sua conexão.';
    } else if (errorMessage.includes('storage/invalid-format')) {
      errorMessage = 'Formato de arquivo inválido.';
    }
    
    return { success: false, error: errorMessage };
  }
}

export async function deleteProfilePhoto(userId, photoURL) {
  try {
    console.log('Deleting photo for user:', userId, 'URL:', photoURL);
    
    // Delete from storage only if photoURL is a Firebase Storage URL
    if (photoURL && photoURL.includes('firebasestorage.googleapis.com')) {
      try {
        // Extract the file path from the URL
        const url = new URL(photoURL);
        const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);
        if (pathMatch) {
          const filePath = decodeURIComponent(pathMatch[1]);
          const photoRef = ref(storage, filePath);
          await deleteObject(photoRef);
          console.log('Photo deleted from storage');
        }
      } catch (deleteError) {
        console.warn('Could not delete photo from storage:', deleteError);
        // Continue even if deletion fails - just update the profile
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting profile photo:', error);
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

// Debug function to test Firebase connectivity
export async function testFirebaseConnection() {
  try {
    console.log('Testing Firebase Auth...');
    const user = auth.currentUser;
    console.log('Current user:', user ? user.email : 'Not logged in');
    
    if (user) {
      console.log('Testing Firestore...');
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      console.log('Firestore access successful, user doc exists:', userSnap.exists());
      
      console.log('Testing Storage...');
      // Try to create a reference to test storage access
      const testRef = ref(storage, `test/${user.uid}/test.txt`);
      console.log('Storage reference created successfully');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return { success: false, error: error.message };
  }
}
