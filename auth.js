// Authentication Module
import { auth } from './firebase-config.js';
import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged,
    signInAnonymously 
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
                this.showNotification(`Bem-vindo, ${user.displayName || 'Usuário'}!`, 'success');
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
            const user = result.user;
            
            // Log do usuário para debug (remover em produção)
            console.log('User signed in:', {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            });
            
        } catch (error) {
            this.hideLoading();
            console.error('Error during sign in:', error);
            
            let errorMessage = 'Erro ao fazer login. Tente novamente.';
            
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = 'Login cancelado pelo usuário.';
                    break;
                case 'auth/popup-blocked':
                    errorMessage = 'Pop-up bloqueado. Permita pop-ups para este site.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Erro de rede. Verifique sua conexão.';
                    break;
            }
            
            this.showNotification(errorMessage, 'error');
        }
    }

    async signOut() {
        try {
            await signOut(auth);
            this.showNotification('Logout realizado com sucesso!', 'success');
        } catch (error) {
            console.error('Error during sign out:', error);
            this.showNotification('Erro ao fazer logout.', 'error');
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

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');

        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);

        // Allow manual removal by clicking
        notification.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }

    // Getter para verificar se o usuário está logado
    get isLoggedIn() {
        return this.user !== null;
    }

    // Getter para obter dados do usuário
    get currentUser() {
        return this.user;
    }
}

// Animation for notification removal
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize Auth Manager when DOM is loaded
let authManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        authManager = new AuthManager();
    });
} else {
    authManager = new AuthManager();
}

// Export for potential use in other modules
export { AuthManager, authManager };
