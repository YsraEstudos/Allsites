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
        // Rate limiting
        if (!rateLimiter.isAllowed('google-signin')) {
            return { success: false, error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' };
        }

        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Validate user data
        if (!user.uid || !validateEmail(user.email)) {
            throw new Error('Dados de usuário inválidos');
        }

        // Save user data to Firestore with sanitized data
        const userData = {
            uid: user.uid,
            email: sanitizeInput(user.email),
            displayName: sanitizeInput(user.displayName || ''),
            photoURL: user.photoURL || '',
            lastLogin: new Date(),
            isAnonymous: false,
            createdAt: new Date(),
            lastActivity: new Date()
        };

        await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
        
        return { success: true, user };
    } catch (error) {
        console.error('Error signing in with Google:', error);
        return { success: false, error: 'Erro ao fazer login com Google. Tente novamente.' };
    }
};

export const signInAnonymouslyFunc = async () => {
    try {
        // Rate limiting
        if (!rateLimiter.isAllowed('anonymous-signin')) {
            return { success: false, error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' };
        }

        const result = await signInAnonymously(auth);
        const user = result.user;
        
        if (!user.uid) {
            throw new Error('UID de usuário inválido');
        }

        // Save anonymous user data to Firestore
        const userData = {
            uid: user.uid,
            displayName: 'Usuário Anônimo',
            lastLogin: new Date(),
            isAnonymous: true,
            createdAt: new Date(),
            lastActivity: new Date()
        };

        await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
        
        return { success: true, user };
    } catch (error) {
        console.error('Error signing in anonymously:', error);
        return { success: false, error: 'Erro ao entrar como visitante. Tente novamente.' };
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
        const user = auth.currentUser;
        
        // Only allow users to access their own profile
        if (!user || user.uid !== uid) {
            throw new Error('Acesso não autorizado');
        }

        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Update last activity
            await updateDoc(docRef, { 
                lastActivity: new Date() 
            });
            
            return { success: true, profile: data };
        } else {
            return { success: false, error: 'Perfil não encontrado' };
        }
    } catch (error) {
        console.error('Error getting user profile:', error);
        return { success: false, error: error.message };
    }
};

export const updateUserProfile = async (uid, profileData) => {
    try {
        const user = auth.currentUser;
        
        if (!user || user.uid !== uid) {
            throw new Error('Usuário não autorizado');
        }

        // Validate and sanitize input data
        const sanitizedData = {};
        
        if (profileData.displayName !== undefined) {
            const sanitizedName = sanitizeInput(profileData.displayName);
            if (!validateDisplayName(sanitizedName)) {
                throw new Error('Nome deve ter entre 2 e 50 caracteres');
            }
            sanitizedData.displayName = sanitizedName;
        }

        if (profileData.photoURL !== undefined) {
            sanitizedData.photoURL = profileData.photoURL;
        }

        // Add security metadata
        sanitizedData.lastUpdated = new Date();
        sanitizedData.lastActivity = new Date();
        
        // Update Firebase Auth profile (only for non-anonymous users)
        if (user && !user.isAnonymous) {
            const authUpdateData = {};
            if (sanitizedData.displayName) authUpdateData.displayName = sanitizedData.displayName;
            if (sanitizedData.photoURL) authUpdateData.photoURL = sanitizedData.photoURL;
            
            if (Object.keys(authUpdateData).length > 0) {
                await updateProfile(user, authUpdateData);
            }
        }
        
        // Update Firestore document
        const docRef = doc(db, 'users', uid);
        await updateDoc(docRef, sanitizedData);
        
        return { success: true };
    } catch (error) {
        console.error('Error updating user profile:', error);
        return { success: false, error: error.message };
    }
};

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
            throw new Error('Nenhum usuário está conectado');
        }

        // Rate limiting for account deletion
        if (!rateLimiter.isAllowed(`delete-account-${user.uid}`)) {
            throw new Error('Muitas tentativas de exclusão. Tente novamente em 15 minutos.');
        }

        const userId = user.uid;
        
        // Delete user data from Firestore first
        await deleteDoc(doc(db, 'users', userId));
        
        // Delete profile photo if exists (only for non-anonymous users)
        if (user.photoURL && !user.isAnonymous) {
            await deleteProfilePhoto(userId, user.photoURL);
        }
        
        // Delete the user account
        await deleteUser(user);
        
        return { success: true };
    } catch (error) {
        console.error('Error deleting user account:', error);
        return { success: false, error: error.message };
    }
};

// Security and validation utilities
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/[<>]/g, '');
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validateDisplayName = (name) => {
    if (!name || typeof name !== 'string') return false;
    const sanitized = sanitizeInput(name);
    return sanitized.length >= 2 && sanitized.length <= 50;
};

const rateLimiter = {
    attempts: new Map(),
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    
    isAllowed(key) {
        const now = Date.now();
        const attempts = this.attempts.get(key) || [];
        
        // Remove old attempts outside the window
        const validAttempts = attempts.filter(time => now - time < this.windowMs);
        
        if (validAttempts.length >= this.maxAttempts) {
            return false;
        }
        
        validAttempts.push(now);
        this.attempts.set(key, validAttempts);
        return true;
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

// Export security utilities for frontend use
export { sanitizeInput, validateEmail, validateDisplayName };
