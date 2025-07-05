import { onAuthStateChange } from './firebase-config.js';

onAuthStateChange(async (user) => {
    if (!user) {
        window.location.href = 'auth/login.html';
    }
});
