# Meu Site de Tudo

Um site minimalista central que conecta diferentes aplicações, com autenticação via Google e login anônimo.

## Funcionalidades

- **Autenticação Firebase**:
  - Login com Google
  - Login anônimo (visitante)
  - Gerenciamento de perfil
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
