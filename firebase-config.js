// Firebase configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signInAnonymously,
    onAuthStateChanged, 
    signOut,
    updateProfile,
    deleteUser,
    linkWithCredential
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc,
    deleteDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL, 
    deleteObject 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDA51YgCq7UAxljlIuAUcgrHhqS8hXbTHQ",
    authDomain: "allsites-49962.firebaseapp.com",
    projectId: "allsites-49962",
    storageBucket: "allsites-49962.appspot.com", // Corrigido aqui
    messagingSenderId: "712864304203",
    appId: "1:712864304203:web:656a21e65dd7e1cc3f91ce",
    measurementId: "G-02DP7Q50XB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Auth functions
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Save user data to Firestore
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            lastLogin: new Date(),
            isAnonymous: false
        }, { merge: true });
        
        return { success: true, user };
    } catch (error) {
        console.error('Error signing in with Google:', error);
        return { success: false, error: error.message };
    }
};

export const signInAnonymouslyFunc = async () => {
    try {
        const result = await signInAnonymously(auth);
        const user = result.user;
        
        // Save anonymous user data to Firestore
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            displayName: 'Usuário Anônimo',
            lastLogin: new Date(),
            isAnonymous: true
        }, { merge: true });
        
        return { success: true, user };
    } catch (error) {
        console.error('Error signing in anonymously:', error);
        return { success: false, error: error.message };
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Error signing out:', error);
        return { success: false, error: error.message };
    }
};

export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = () => {
    return auth.currentUser;
};

// Profile functions
export const getUserProfile = async (uid) => {
    try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { success: true, profile: docSnap.data() };
        } else {
            return { success: false, error: 'Profile not found' };
        }
    } catch (error) {
        console.error('Error getting user profile:', error);
        return { success: false, error: error.message };
    }
};

export const updateUserProfile = async (uid, profileData) => {
    try {
        const user = auth.currentUser;
        
        // Update Firebase Auth profile
        if (user && !user.isAnonymous) {
            await updateProfile(user, {
                displayName: profileData.displayName,
                photoURL: profileData.photoURL
            });
        }
        
        // Update Firestore document
        const docRef = doc(db, 'users', uid);
        await updateDoc(docRef, {
            ...profileData,
            lastUpdated: new Date()
        });
        
        return { success: true };
    } catch (error) {
        console.error('Error updating user profile:', error);
        return { success: false, error: error.message };
    }
};

// --- Profile Photo Management ---
export async function deleteProfilePhoto(userId, photoURL) {
    try {
        if (!photoURL) {
            return { success: true };
        }
        
        // Extract the path from the full URL
        // Firebase Storage URLs have this format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?{query}
        try {
            const url = new URL(photoURL);
            const pathMatch = url.pathname.match(/\/o\/(.+)$/);
            if (pathMatch) {
                const filePath = decodeURIComponent(pathMatch[1]);
                const photoRef = ref(storage, filePath);
                await deleteObject(photoRef);
            }
        } catch (urlError) {
            // If it's not a full URL, try using it as a path directly
            const photoRef = ref(storage, photoURL);
            await deleteObject(photoRef);
        }
        
        return { success: true };
    } catch (error) {
        console.error('Error deleting profile photo:', error);
        return { success: false, error: error.message };
    }
};

export const deleteUserAccount = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('No user is currently signed in');
        }
        
        // Delete user data from Firestore
        await deleteDoc(doc(db, 'users', user.uid));
        
        // Delete profile photo if exists
        if (user.photoURL) {
            await deleteProfilePhoto(user.uid, user.photoURL);
        }
        
        // Delete the user account
        await deleteUser(user);
        
        return { success: true };
    } catch (error) {
        console.error('Error deleting user account:', error);
        return { success: false, error: error.message };
    }
};

// Utility functions
export const getUserInitials = (displayName, email) => {
    if (displayName) {
        return displayName
            .split(' ')
            .map(name => name.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }
    
    if (email) {
        return email.charAt(0).toUpperCase();
    }
    
    return '?';
};

export const linkAnonymousAccount = async (credential) => {
    try {
        const user = auth.currentUser;
        if (!user || !user.isAnonymous) {
            throw new Error('No anonymous user to link');
        }
        
        // Link the anonymous account with the credential
        const result = await linkWithCredential(user, credential);
        
        // Update user data in Firestore
        await updateDoc(doc(db, 'users', user.uid), {
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            isAnonymous: false,
            linkedAt: new Date()
        });
        
        return { success: true, user: result.user };
    } catch (error) {
        console.error('Error linking anonymous account:', error);
        return { success: false, error: error.message };
    }
};
