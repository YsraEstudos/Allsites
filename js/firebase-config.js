// Firebase configuration and initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signInAnonymously,
    signOut,
    onAuthStateChanged,
    linkWithPopup
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Firebase configuration
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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Export Firebase services for use in main.js
window.firebaseAuth = {
    auth,
    googleProvider,
    signInWithPopup,
    signInAnonymously,
    signOut,
    onAuthStateChanged,
    linkWithPopup,
    GoogleAuthProvider
};

// Firebase authentication state listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('Usuário logado:', user);
        
        // Update user data in localStorage for main.js compatibility
        const userData = {
            uid: user.uid,
            name: user.displayName || 'Usuário',
            email: user.email || 'usuario@anonimo.com',
            photo: user.photoURL || null,
            isAnonymous: user.isAnonymous,
            provider: user.isAnonymous ? 'anonymous' : 'google'
        };
        
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Dispatch custom event for main.js to listen
        window.dispatchEvent(new CustomEvent('firebaseAuthStateChanged', {
            detail: { user: userData, isLoggedIn: true }
        }));
        
    } else {
        console.log('Usuário deslogado');
        
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userData');
        
        // Dispatch custom event for main.js to listen
        window.dispatchEvent(new CustomEvent('firebaseAuthStateChanged', {
            detail: { user: null, isLoggedIn: false }
        }));
    }
});

// Firebase authentication functions
window.firebaseAuthFunctions = {
    // Google Sign In
    async signInWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            console.log('Login com Google realizado:', user);
            return {
                success: true,
                user: user,
                message: 'Login realizado com sucesso!'
            };
        } catch (error) {
            console.error('Erro no login com Google:', error);
            return {
                success: false,
                error: error.code,
                message: getFirebaseErrorMessage(error.code)
            };
        }
    },

    // Anonymous Sign In
    async signInAnonymous() {
        try {
            const result = await signInAnonymously(auth);
            const user = result.user;
            
            console.log('Login anônimo realizado:', user);
            return {
                success: true,
                user: user,
                message: 'Acesso como visitante realizado!'
            };
        } catch (error) {
            console.error('Erro no login anônimo:', error);
            return {
                success: false,
                error: error.code,
                message: getFirebaseErrorMessage(error.code)
            };
        }
    },

    // Sign Out
    async signOutUser() {
        try {
            await signOut(auth);
            console.log('Logout realizado');
            return {
                success: true,
                message: 'Logout realizado com sucesso!'
            };
        } catch (error) {
            console.error('Erro no logout:', error);
            return {
                success: false,
                error: error.code,
                message: 'Erro ao fazer logout'
            };
        }
    },

    // Get current user
    getCurrentUser() {
        return auth.currentUser;
    },

    // Link Google account to anonymous user
    async linkGoogleAccount() {
        try {
            const user = auth.currentUser;
            if (!user || !user.isAnonymous) {
                throw new Error('Usuário deve estar logado anonimamente');
            }

            const result = await linkWithPopup(user, googleProvider);
            console.log('Conta Google vinculada:', result.user);
            
            return {
                success: true,
                user: result.user,
                message: 'Conta Google vinculada com sucesso!'
            };
        } catch (error) {
            console.error('Erro ao vincular conta Google:', error);
            return {
                success: false,
                error: error.code,
                message: getFirebaseErrorMessage(error.code)
            };
        }
    }
};

// Firebase error messages in Portuguese
function getFirebaseErrorMessage(errorCode) {
    const errorMessages = {
        'auth/popup-closed-by-user': 'Login cancelado pelo usuário',
        'auth/popup-blocked': 'Pop-up bloqueado pelo navegador',
        'auth/cancelled-popup-request': 'Solicitação de pop-up cancelada',
        'auth/account-exists-with-different-credential': 'Conta já existe com credencial diferente',
        'auth/auth-domain-config-required': 'Configuração de domínio necessária',
        'auth/credential-already-in-use': 'Credencial já está em uso',
        'auth/operation-not-allowed': 'Operação não permitida',
        'auth/requires-recent-login': 'Requer login recente',
        'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
        'auth/user-disabled': 'Usuário desabilitado',
        'auth/user-not-found': 'Usuário não encontrado',
        'auth/wrong-password': 'Senha incorreta',
        'auth/invalid-email': 'Email inválido',
        'auth/email-already-in-use': 'Email já está em uso',
        'auth/weak-password': 'Senha muito fraca',
        'auth/network-request-failed': 'Falha na conexão de rede'
    };
    
    return errorMessages[errorCode] || 'Erro desconhecido. Tente novamente.';
}

console.log('Firebase inicializado com sucesso!');
