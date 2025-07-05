import { onAuthStateChange, logoutUser, getUserProfile, updateUserProfile, deleteProfilePhoto, getUserInitials, deleteUserAccount, linkAnonymousAccount, signInWithGoogle } from './firebase-config.js';

const userInfo = document.getElementById('userInfo');
const loginPrompt = document.getElementById('loginPrompt');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const profilePhoto = document.getElementById('profilePhoto');
const profileImage = document.getElementById('profileImage');
const profileInitials = document.getElementById('profileInitials');
const logoutBtn = document.getElementById('logoutBtn');
const profileBtn = document.getElementById('profileBtn');
const linkAccountBtn = document.getElementById('linkAccountBtn');

let currentUser = null;

// Security improvements
let sessionTimeout;
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

function resetSessionTimeout() {
    if (sessionTimeout) clearTimeout(sessionTimeout);
    
    if (currentUser) {
        sessionTimeout = setTimeout(() => {
            if (confirm('Sua sessão expirou por inatividade. Deseja continuar conectado?')) {
                resetSessionTimeout();
            } else {
                logoutUser();
            }
        }, SESSION_TIMEOUT);
    }
}

// Track user activity
const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
activityEvents.forEach(event => {
    document.addEventListener(event, () => {
        if (currentUser) {
            resetSessionTimeout();
        }
    }, { passive: true });
});

// Auth state observer
onAuthStateChange(async (user) => {
    currentUser = user;
    if (user) {
        // Reset session timeout when user signs in
        resetSessionTimeout();
        
        // User is signed in
        userEmail.textContent = user.email || 'Usuário Anônimo';
        
        // Show/hide link account button for anonymous users
        if (user.isAnonymous) {
            linkAccountBtn.style.display = 'block';
            linkAccountBtn.title = 'Vincular com Google para salvar seus dados';
        } else {
            linkAccountBtn.style.display = 'none';
        }
        
        // Load user profile
        await loadUserProfile(user);
        
        userInfo.style.display = 'flex';
        loginPrompt.style.display = 'none';
    } else {
        // Clear session timeout when user signs out
        if (sessionTimeout) clearTimeout(sessionTimeout);
        
        // User is signed out - redirect to login
        window.location.href = 'auth/login.html';
    }
});

async function loadUserProfile(user) {
    try {
        const result = await getUserProfile(user.uid);
        let profile = result.success ? result.profile : {};
        
        // Use Firebase Auth data as fallback
        const displayName = profile.displayName || user.displayName || '';
        const photoURL = profile.photoURL || user.photoURL || '';
        
        // Update display name - handle anonymous users
        if (user.isAnonymous) {
            userName.textContent = profile.displayName || 'Usuário Anônimo';
        } else {
            userName.textContent = displayName || user.email.split('@')[0];
        }
        
        // Update profile photo
        if (photoURL && !user.isAnonymous) {
            profileImage.src = photoURL;
            profileImage.style.display = 'block';
            profileInitials.style.display = 'none';
        } else {
            profileImage.style.display = 'none';
            profileInitials.style.display = 'flex';
            if (user.isAnonymous) {
                profileInitials.textContent = '👤';
            } else {
                profileInitials.textContent = getUserInitials(displayName, user.email);
            }
        }
        
    } catch (error) {
        console.error('Error loading profile:', error);
        // Use fallback values
        if (user.isAnonymous) {
            userName.textContent = 'Usuário Anônimo';
            profileInitials.textContent = '👤';
        } else {
            userName.textContent = user.email.split('@')[0];
            profileInitials.textContent = getUserInitials('', user.email);
        }
        profileImage.style.display = 'none';
        profileInitials.style.display = 'flex';
    }
}

// Logout handler
logoutBtn.addEventListener('click', async () => {
    try {
        await logoutUser();
        // Auth state observer will handle redirect
    } catch (error) {
        console.error('Error signing out:', error);
    }
});

// Profile modal functionality
profileBtn.addEventListener('click', () => {
    if (currentUser) {
        showProfileModal();
    }
});

// Link account functionality for anonymous users
linkAccountBtn.addEventListener('click', async () => {
    if (currentUser && currentUser.isAnonymous) {
        try {
            linkAccountBtn.disabled = true;
            linkAccountBtn.textContent = '🔄';
            
            // For anonymous users, we'll sign out and sign in with Google
            // This is simpler than linking accounts
            await logoutUser();
            window.location.href = 'auth/login.html';
        } catch (error) {
            console.error('Error redirecting to link account:', error);
            alert('Erro ao vincular conta: ' + error.message);
        } finally {
            linkAccountBtn.disabled = false;
            linkAccountBtn.textContent = '🔗';
        }
    }
});

function showProfileModal() {
    // Create profile modal if it doesn't exist
    if (!document.getElementById('profileModal')) {
        createProfileModal();
    }
    
    const modal = document.getElementById('profileModal');
    populateProfileModal();
    modal.classList.add('active');
}

function createProfileModal() {
    const modalHTML = `
        <div id="profileModal" class="profile-modal">
            <div class="profile-modal-content">
                <div class="profile-modal-header">
                    <h3 class="profile-modal-title">Editar Perfil</h3>
                    <button class="profile-modal-close" id="closeProfileModal">×</button>
                </div>
                
                <form class="profile-form" id="profileForm">
                    <div class="profile-photo-section">
                        <div class="profile-photo-preview" id="photoPreview">
                            <img id="previewImage" style="display: none;" alt="Preview">
                            <div class="profile-initials" id="previewInitials"></div>
                        </div>
                        
                        <div class="photo-upload-section">
                            <input type="file" id="photoUpload" class="photo-upload-input" accept="image/*">
                            <button type="button" class="photo-upload-btn" id="uploadBtn">Escolher Foto</button>
                            <button type="button" class="photo-remove-btn" id="removePhotoBtn" style="display: none;">Remover Foto</button>
                            <div class="anonymous-photo-message" id="anonymousPhotoMessage" style="display: none;">
                                <p>📸 Upload de fotos disponível apenas para contas Google</p>
                                <small>Vincule sua conta para usar esta funcionalidade</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="profileDisplayName">Nome</label>
                        <input type="text" id="profileDisplayName" placeholder="Seu nome completo">
                    </div>
                    
                    <div class="profile-modal-actions">
                        <button type="button" class="profile-cancel-btn" id="cancelProfileBtn">Cancelar</button>
                        <button type="submit" class="profile-save-btn" id="saveProfileBtn">Salvar</button>
                        <button type="button" class="profile-delete-btn" id="deleteAccountBtn" style="display: none;">Excluir Conta</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    document.getElementById('closeProfileModal').addEventListener('click', hideProfileModal);
    document.getElementById('cancelProfileBtn').addEventListener('click', hideProfileModal);
    document.getElementById('uploadBtn').addEventListener('click', () => {
        document.getElementById('photoUpload').click();
    });
    document.getElementById('photoUpload').addEventListener('change', handlePhotoUpload);
    document.getElementById('removePhotoBtn').addEventListener('click', handlePhotoRemove);
    document.getElementById('profileForm').addEventListener('submit', handleProfileSave);
    document.getElementById('deleteAccountBtn').addEventListener('click', handleAccountDelete);
    
    // Close modal when clicking outside
    document.getElementById('profileModal').addEventListener('click', (e) => {
        if (e.target.id === 'profileModal') {
            hideProfileModal();
        }
    });
}

function populateProfileModal() {
    if (!currentUser) return;
    
    const displayNameInput = document.getElementById('profileDisplayName');
    const previewImage = document.getElementById('previewImage');
    const previewInitials = document.getElementById('previewInitials');
    const removeBtn = document.getElementById('removePhotoBtn');
    const deleteBtn = document.getElementById('deleteAccountBtn');
    const photoUploadSection = document.querySelector('.photo-upload-section');
    const uploadBtn = document.getElementById('uploadBtn');
    const photoUpload = document.getElementById('photoUpload');
    const anonymousMessage = document.getElementById('anonymousPhotoMessage');
    
    displayNameInput.value = currentUser.displayName || '';
    
    // Hide photo upload for anonymous users
    if (currentUser.isAnonymous) {
        uploadBtn.style.display = 'none';
        photoUpload.style.display = 'none';
        removeBtn.style.display = 'none';
        deleteBtn.style.display = 'none';
        anonymousMessage.style.display = 'block';
        
        previewImage.style.display = 'none';
        previewInitials.style.display = 'flex';
        previewInitials.textContent = '👤';
    } else {
        uploadBtn.style.display = 'block';
        photoUpload.style.display = 'none'; // Keep file input hidden
        deleteBtn.style.display = 'block';
        anonymousMessage.style.display = 'none';
        
        if (currentUser.photoURL) {
            previewImage.src = currentUser.photoURL;
            previewImage.style.display = 'block';
            previewInitials.style.display = 'none';
            removeBtn.style.display = 'block';
        } else {
            previewImage.style.display = 'none';
            previewInitials.style.display = 'flex';
            previewInitials.textContent = getUserInitials(currentUser.displayName, currentUser.email);
            removeBtn.style.display = 'none';
        }
    }
}

function hideProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Tipo de arquivo não suportado. Use JPG, PNG, GIF ou WebP.');
            e.target.value = '';
            return;
        }
        
        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('Arquivo muito grande. Tamanho máximo: 5MB.');
            e.target.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewImage = document.getElementById('previewImage');
            const previewInitials = document.getElementById('previewInitials');
            const removeBtn = document.getElementById('removePhotoBtn');
            
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            previewInitials.style.display = 'none';
            removeBtn.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function handlePhotoRemove() {
    const previewImage = document.getElementById('previewImage');
    const previewInitials = document.getElementById('previewInitials');
    const removeBtn = document.getElementById('removePhotoBtn');
    const photoUpload = document.getElementById('photoUpload');
    
    previewImage.style.display = 'none';
    previewInitials.style.display = 'flex';
    removeBtn.style.display = 'none';
    photoUpload.value = '';
    
    const displayName = document.getElementById('profileDisplayName').value;
    previewInitials.textContent = getUserInitials(displayName, currentUser.email);
}

async function handleProfileSave(e) {
    e.preventDefault();
    
    if (!currentUser) {
        console.error('No current user');
        return;
    }
    
    const saveBtn = document.getElementById('saveProfileBtn');
    const displayName = document.getElementById('profileDisplayName').value.trim();
    
    // Validate input
    if (displayName && (displayName.length < 2 || displayName.length > 50)) {
        alert('O nome deve ter entre 2 e 50 caracteres.');
        return;
    }

    // Sanitize input
    const sanitizedName = displayName.replace(/[<>]/g, '');
    if (sanitizedName !== displayName) {
        alert('Nome contém caracteres inválidos.');
        return;
    }
    
    saveBtn.disabled = true;
    saveBtn.textContent = 'Salvando...';
    
    try {
        // Update profile with display name only
        const updateData = {
            displayName: sanitizedName,
            photoURL: currentUser.isAnonymous ? '' : (currentUser.photoURL || '')
        };
        
        const updateResult = await updateUserProfile(currentUser.uid, updateData);
        if (!updateResult.success) {
            throw new Error('Falha ao atualizar perfil: ' + updateResult.error);
        }
        
        // Reload profile in main page
        await loadUserProfile(currentUser);
        
        hideProfileModal();
        
    } catch (error) {
        console.error('Error saving profile:', error);
        alert('Erro ao salvar perfil: ' + error.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Salvar';
    }
}

async function handleAccountDelete() {
    if (!currentUser) return;
    
    const confirmMessage = currentUser.isAnonymous 
        ? 'Tem certeza que deseja excluir sua conta anônima? Todos os seus dados serão perdidos permanentemente.'
        : 'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão perdidos permanentemente.';
    
    if (!confirm(confirmMessage)) {
        return;
    }

    // Second confirmation for extra security
    const finalConfirmation = prompt('Para confirmar a exclusão, digite "EXCLUIR" (em maiúsculas):');
    if (finalConfirmation !== 'EXCLUIR') {
        alert('Exclusão cancelada.');
        return;
    }
    
    const deleteBtn = document.getElementById('deleteAccountBtn');
    deleteBtn.disabled = true;
    deleteBtn.textContent = 'Excluindo...';
    
    try {
        const result = await deleteUserAccount();
        if (result.success) {
            alert('Conta excluída com sucesso.');
            // Auth state observer will handle redirect
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        alert('Erro ao excluir conta: ' + error.message);
        deleteBtn.disabled = false;
        deleteBtn.textContent = 'Excluir Conta';
    }
}
