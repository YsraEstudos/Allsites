# 🌟 Meu Site de Tudo

Um espaço minimalista e moderno para organizar e descobrir conteúdos interessantes, construído com foco em performance, acessibilidade e experiência do usuário.

## ✨ Características

### 🎨 Design Moderno
- Interface dark elegante com elementos glassmorphism
- Animações suaves e responsivas
- Suporte a PWA (Progressive Web App)
- Design responsivo para todos os dispositivos

### 🚀 Performance Otimizada
- Carregamento rápido com lazy loading
- Animações otimizadas com `will-change`
- Monitoramento de performance integrado
- Suporte a Service Workers

### ♿ Acessibilidade
- Navegação por teclado completa
- Suporte a leitores de tela
- Respeita preferências de movimento reduzido
- Alto contraste disponível
- Skip links para navegação rápida

### 📱 Recursos Interativos
- Sistema de notificações
- Estados de carregamento visuais
- Efeitos de ripple em cards
- Parallax suave no hero
- Efeito de typing animado

## 🛠️ Ferramentas Disponíveis

### 🎬 Hub Organizador do YouTube
Organize, anote e gerencie seus vídeos e canais favoritos do YouTube com categorias personalizadas.

**Tags:** Organização, YouTube, Produtividade

### 📚 Rastreador de Estudos
Adicione tópicos de estudo e acompanhe seu progresso diário marcando 3 exercícios por matéria.

**Tags:** Estudos, Progresso, Educação

### 🎯 Desafio 67 Dias
Transforme sua vida em 67 dias com hábitos consistentes e acompanhamento diário.

**Tags:** Hábitos, Desafio, Crescimento
  - Upload de foto de perfil (apenas Google)
  - Exclusão de conta

- **Links para Aplicações Externas**:
  - Hub Organizador do YouTube: `https://youtube-hub.netlify.app/`
  - Rastreador de Estudos: `https://study-tracker.netlify.app/`
  - Desafio 67 Dias: `https://66dias.netlify.app/`

## Configuração do Firebase

As configurações já estão aplicadas no projeto. Para usar:

1. **Ative no Firebase Console**:
   - Authentication (Google + Anônimo)
   - Firestore Database (modo teste)

2. **Configure as regras de segurança**:

**Firestore:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Storage:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-photos/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
