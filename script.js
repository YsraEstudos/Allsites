// Main JavaScript - Simplified
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 Meu Site de Tudo carregado!');
    
    // Add smooth hover effects to tool cards
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        // Add click animation
        card.addEventListener('click', function(e) {
            // Only animate if it's not a coming soon card
            if (!this.classList.contains('coming-soon')) {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
        
        // Prevent clicks on coming soon cards
        if (card.classList.contains('coming-soon')) {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
        }
    });
    
    // Simple page load animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Global error handling
window.addEventListener('error', (e) => {
    console.error('Erro:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rejeitada:', e.reason);
});
