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
   - Storage (upload de fotos)

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

## Como Usar

1. **Sirva via HTTP** (não abra diretamente no navegador):
   ```bash
   # Live Server (VS Code): Clique direito em index.html > "Open with Live Server"
   # Python: python -m http.server 8000
   # Node.js: npx http-server
   ```

2. **Acesse e teste** as funcionalidades de login

## Estrutura Final

```
/
├── index.html           # Página principal  
├── estilo.css          # Estilos
├── firebase-config.js  # Configuração Firebase
├── auth/
│   └── login.html      # Página de login
└── README.md           # Este arquivo
```

**Total: 5 arquivos essenciais** ✨

## Resolução de Problemas

**Upload de foto não funciona?**
- Verifique se está logado com Google (não anônimo)
- Confirme as regras do Storage acima
- Use arquivos JPG/PNG/GIF/WebP (máx 5MB)

**Erro de autenticação?**
- Verifique se Authentication está ativo no Firebase Console
- Confirme se Firestore está configurado

## 🔐 Autenticação Firebase

### Configuração
O site agora possui integração completa com Firebase Authentication:

- **Google Sign-In**: Login com conta Google
- **Login Anônimo**: Acesso como visitante temporário
- **Gerenciamento de Estado**: Persistência entre sessões
- **Vinculação de Contas**: Possibilidade de vincular conta Google a usuário anônimo

### Funcionalidades de Autenticação
- ✅ Login com Google (popup)
- ✅ Login anônimo (visitante)
- ✅ Logout seguro
- ✅ Detecção automática de estado de login
- ✅ Persistência de dados do usuário
- ✅ Vinculação de conta Google a usuário anônimo
- ✅ Tratamento de erros em português

### Como Testar
1. Use o arquivo `teste-firebase.html` para testes rápidos
2. Certifique-se de estar executando em um servidor web (não `file://`)
3. Verifique o console do navegador para logs detalhados

### Segurança
- Content Security Policy atualizado para Firebase
- Configuração adequada de domínios autorizados
- Tratamento seguro de tokens de autenticação
