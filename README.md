# Meu Site de Tudo

Um site minimalista para organizar e descobrir conteúdos interessantes, com autenticação via Google e login anônimo.

## Funcionalidades

- **Autenticação Firebase**:
  - Login com Google
  - Login anônimo (visitante)
  - Vinculação de conta anônima com Google
  - Gerenciamento de perfil
  - Upload de foto de perfil
  - Exclusão de conta

- **Seções**:
  - Hub Organizador do YouTube
  - Rastreador de Estudos
  - Desafio 67 Dias

# Meu Site de Tudo

Um site minimalista central que conecta diferentes aplicações, com autenticação via Google e login anônimo.

## Funcionalidades

- **Autenticação Firebase**:
  - Login com Google
  - Login anônimo (visitante)
  - Gerenciamento de perfil
  - Upload de foto de perfil
  - Exclusão de conta

- **Links para Aplicações Externas**:
  - Hub Organizador do YouTube: `https://youtube-hub.netlify.app/`
  - Rastreador de Estudos: `https://study-tracker.netlify.app/`
  - Desafio 67 Dias: `https://66dias.netlify.app/`

## Configuração do Firebase

### ✅ Configurações já aplicadas

As configurações do Firebase já estão definidas no projeto:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDA51YgCq7UAxljlIuAUcgrHhqS8hXbTHQ",
    authDomain: "allsites-49962.firebaseapp.com",
    projectId: "allsites-49962",
    storageBucket: "allsites-49962.firebasestorage.app",
    messagingSenderId: "712864304203",
    appId: "1:712864304203:web:656a21e65dd7e1cc3f91ce",
    measurementId: "G-02DP7Q50XB"
};
```

### Configuração necessária no Firebase Console

1. **Autenticação**: Ative Google e Login Anônimo
2. **Firestore Database**: Configure no modo de teste
3. **Storage**: Configure para upload de fotos de perfil

### 7. Configurar Regras de Segurança

#### Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

#### Storage Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can only access their own profile photos
    match /profile-photos/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Executando o Projeto

1. Configure o Firebase conforme as instruções acima
2. Sirva os arquivos através de um servidor HTTP (não abra diretamente no navegador)
3. Acesse `index.html`

### Servindo Localmente

Você pode usar qualquer servidor HTTP simples, por exemplo:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (se tiver http-server instalado)
npx http-server

# Live Server no VS Code
# Instale a extensão "Live Server" e clique com botão direito no index.html
```

## Estrutura do Projeto

```
/
├── index.html              # Página principal (hub central)
├── estilo.css             # Estilos globais
├── firebase-config.js     # Configuração do Firebase (já configurado)
├── auth/
│   └── login.html         # Página de login
└── README.md             # Este arquivo
```

## Aplicações Conectadas

Este site atua como um hub central que conecta as seguintes aplicações:

1. **Hub Organizador do YouTube** (`https://youtube-hub.netlify.app/`)
   - Organização de vídeos e canais favoritos
   - Categorias personalizadas
   - Sistema de anotações

2. **Rastreador de Estudos** (`https://study-tracker.netlify.app/`)
   - Controle de progresso de estudos
   - 3 exercícios diários por matéria
   - Gráficos de acompanhamento

3. **Desafio 67 Dias** (`https://66dias.netlify.app/`)
   - Transformação de hábitos
   - Acompanhamento diário
   - Sistema de metas

## Suporte

Este é um projeto de demonstração. Para questões específicas do Firebase, consulte a [documentação oficial](https://firebase.google.com/docs).
