
window.addEventListener('load', async () => {
    console.log('Página carregada, aguardando Firebase...');
    
    // Wait a bit for Firebase to initialize
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user is already authenticated
    if (window.firebaseAuthFunctions) {
        const currentUser = window.firebaseAuthFunctions.getCurrentUser();
        if (currentUser) {
            console.log('Usuário já autenticado:', currentUser.email);
            window.location.href = '../index.html';
            return;
        }
    }
    
    initializeLoginHandlers();
});

function initializeLoginHandlers() {
    const googleSignInBtn = document.getElementById('googleSignIn');
    const anonymousSignInBtn = document.getElementById('anonymousSignIn');
    const errorMessage = document.getElementById('errorMessage');
    const popupHelp = document.getElementById('popupHelp');
    const reloadBtn = document.getElementById('reloadBtn');


    if(reloadBtn) {
        reloadBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function hideError() {
        errorMessage.style.display = 'none';
        popupHelp.style.display = 'none';
    }

    function showPopupHelp() {
        popupHelp.style.display = 'block';
    }

    function setLoading(isLoading) {
        const buttons = [googleSignInBtn, anonymousSignInBtn];
        buttons.forEach(btn => {
            if (isLoading) {
                btn.classList.add('loading');
                btn.disabled = true;
                btn.style.opacity = '0.6';
            } else {
                btn.classList.remove('loading');
                btn.disabled = false;
                btn.style.opacity = '1';
            }
        });
    }

    // Google Sign In
    googleSignInBtn.addEventListener('click', async () => {
        console.log('Botão Google clicado!');
        hideError();
        setLoading(true);
        
        if (!window.firebaseAuthFunctions) {
            showError('Firebase ainda não foi carregado. Aguarde...');
            setLoading(false);
            return;
        }
        
        try {
            const result = await window.firebaseAuthFunctions.signInWithGoogle();
            console.log('Resultado do login Google:', result);
            
            if (result.success) {
                showError('Login realizado com sucesso! Redirecionando...');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            } else {
                showError(result.message || 'Erro ao fazer login com Google');
                
                // Se foi erro de popup bloqueado, mostrar ajuda
                if (result.message && result.message.toLowerCase().includes('popup')) {
                    setTimeout(() => {
                        showPopupHelp();
                    }, 1000);
                }
            }
        } catch (error) {
            console.error('Erro capturado no catch:', error);
            showError('Erro inesperado: ' + error.message);
        } finally {
            setLoading(false);
        }
    });

    // Anonymous Sign In
    anonymousSignInBtn.addEventListener('click', async () => {
        console.log('Botão Visitante clicado!');
        hideError();
        setLoading(true);
        
        if (!window.firebaseAuthFunctions) {
            showError('Firebase ainda não foi carregado. Aguarde...');
            setLoading(false);
            return;
        }
        
        try {
            const result = await window.firebaseAuthFunctions.signInAnonymous();
            console.log('Resultado do login anônimo:', result);
            
            if (result.success) {
                showError('Acesso como visitante realizado! Redirecionando...');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            } else {
                showError(result.message || 'Erro ao entrar como visitante');
            }
        } catch (error) {
            console.error('Erro no login anônimo:', error);
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

    console.log('Handlers de login inicializados');
}
