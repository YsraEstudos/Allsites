// Authentication Module - Simplified
import { auth } from './firebase-config.js';
import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';

class AuthManager {
    constructor() {
        this.user = null;
        this.provider = new GoogleAuthProvider();
        this.provider.addScope('profile');
        this.provider.addScope('email');
        
        this.initializeElements();
        this.bindEvents();
        this.observeAuthState();
    }

    initializeElements() {
        this.loginBtn = document.getElementById('login-btn');
        this.logoutBtn = document.getElementById('logout-btn');
        this.userInfo = document.getElementById('user-info');
        this.userAvatar = document.getElementById('user-avatar');
        this.userName = document.getElementById('user-name');
        this.authLoading = document.getElementById('auth-loading');
    }

    bindEvents() {
        if (this.loginBtn) {
            this.loginBtn.addEventListener('click', () => this.signInWithGoogle());
        }
        
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.signOut());
        }
    }

    observeAuthState() {
        this.showLoading();
        
        onAuthStateChanged(auth, (user) => {
            this.hideLoading();
            
            if (user) {
                this.user = user;
                this.showUserInfo(user);
                this.showToast(`Olá, ${user.displayName || 'Usuário'}! 👋`, 'success');
            } else {
                this.user = null;
                this.showLoginButton();
            }
        });
    }

    async signInWithGoogle() {
        try {
            this.showLoading();
            const result = await signInWithPopup(auth, this.provider);
            // Success is handled by onAuthStateChanged
        } catch (error) {
            this.hideLoading();
            console.error('Error during sign in:', error);
            
            let errorMessage = 'Erro ao fazer login. Tente novamente.';
            
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = 'Login cancelado.';
                    break;
                case 'auth/popup-blocked':
                    errorMessage = 'Pop-up bloqueado. Permita pop-ups para este site.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Erro de rede. Verifique sua conexão.';
                    break;
            }
            
            this.showToast(errorMessage, 'error');
        }
    }

    async signOut() {
        try {
            await signOut(auth);
            this.showToast('Até logo! 👋', 'success');
        } catch (error) {
            console.error('Error during sign out:', error);
            this.showToast('Erro ao fazer logout.', 'error');
        }
    }

    showUserInfo(user) {
        if (this.loginBtn) this.loginBtn.classList.add('hidden');
        if (this.userInfo) this.userInfo.classList.remove('hidden');
        
        if (this.userAvatar && user.photoURL) {
            this.userAvatar.src = user.photoURL;
            this.userAvatar.alt = `Avatar de ${user.displayName || 'Usuário'}`;
        }
        
        if (this.userName) {
            this.userName.textContent = user.displayName || user.email || 'Usuário';
        }
    }

    showLoginButton() {
        if (this.userInfo) this.userInfo.classList.add('hidden');
        if (this.loginBtn) this.loginBtn.classList.remove('hidden');
    }

    showLoading() {
        if (this.authLoading) this.authLoading.classList.remove('hidden');
        if (this.loginBtn) this.loginBtn.classList.add('hidden');
        if (this.userInfo) this.userInfo.classList.add('hidden');
    }

    hideLoading() {
        if (this.authLoading) this.authLoading.classList.add('hidden');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }
        }, 4000);

        // Click to remove
        toast.addEventListener('click', () => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        });
    }

    get isLoggedIn() {
        return this.user !== null;
    }

    get currentUser() {
        return this.user;
    }
}

// Initialize Auth Manager
let authManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        authManager = new AuthManager();
    });
} else {
    authManager = new AuthManager();
}

export { AuthManager, authManager };
