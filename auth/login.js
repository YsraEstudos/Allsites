import { signInWithGoogle, signInAnonymouslyFunc, onAuthStateChange } from '../firebase-config.js';

const googleSignInBtn = document.getElementById('googleSignIn');
const anonymousSignInBtn = document.getElementById('anonymousSignIn');
const errorMessage = document.getElementById('errorMessage');

// Check if user is already authenticated
onAuthStateChange((user) => {
    if (user) {
        // User is signed in, redirect to home
        window.location.href = '../index.html';
    }
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function setLoading(isLoading) {
    const buttons = [googleSignInBtn, anonymousSignInBtn];
    buttons.forEach(btn => {
        if (isLoading) {
            btn.classList.add('loading');
            btn.disabled = true;
        } else {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    });
}

// Google Sign In
googleSignInBtn.addEventListener('click', async () => {
    hideError();
    setLoading(true);
    
    try {
        const result = await signInWithGoogle();
        
        if (result.success) {
            // Redirect will happen via auth state observer
            console.log('Google sign-in successful');
        } else {
            showError(result.error || 'Erro ao fazer login com Google');
        }
    } catch (error) {
        console.error('Google sign-in error:', error);
        showError('Erro inesperado ao fazer login com Google');
    } finally {
        setLoading(false);
    }
});

// Anonymous Sign In
anonymousSignInBtn.addEventListener('click', async () => {
    hideError();
    setLoading(true);
    
    try {
        const result = await signInAnonymouslyFunc();
        
        if (result.success) {
            // Redirect will happen via auth state observer
            console.log('Anonymous sign-in successful');
        } else {
            showError(result.error || 'Erro ao entrar como visitante');
        }
    } catch (error) {
        console.error('Anonymous sign-in error:', error);
        showError('Erro inesperado ao entrar como visitante');
    } finally {
        setLoading(false);
    }
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (document.activeElement === googleSignInBtn) {
            googleSignInBtn.click();
        } else if (document.activeElement === anonymousSignInBtn) {
            anonymousSignInBtn.click();
        }
    }
});
