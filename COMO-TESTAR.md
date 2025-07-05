# 🚀 Como Testar o Site

## Pré-requisitos

1. **Firebase Console**: Configure seu projeto com as credenciais já incluídas
2. **Servidor HTTP**: Use qualquer servidor local (não abra os arquivos diretamente)

## Passos para Testar

### 1. Configurar Firebase (Necessário apenas uma vez)

Acesse [Firebase Console](https://console.firebase.google.com/) e:

- **Authentication**: 
  - Ative "Google" como provedor de login
  - Ative "Anônimo" 
- **Firestore Database**: 
  - Crie no modo de teste
- **Storage**: 
  - Configure para upload de imagens

### 2. Servir o Site Localmente

**Opção 1 - Live Server (VS Code):**
```
1. Instale a extensão "Live Server"
2. Clique com botão direito em index.html
3. Selecione "Open with Live Server"
```

**Opção 2 - Python:**
```bash
# Na pasta do projeto
python -m http.server 8000
# Acesse: http://localhost:8000
```

**Opção 3 - Node.js:**
```bash
npx http-server
# Acesse: http://localhost:8080
```

### 3. Testar Funcionalidades

1. **Acesso Inicial**: Deve redirecionar para login
2. **Login Google**: Teste autenticação completa
3. **Login Anônimo**: Teste como visitante
4. **Perfil**: Edite nome e foto (apenas Google)
5. **Links Externos**: Verifique se abrem em nova aba

## ✅ Site Totalmente Configurado

- ✅ Firebase configurado com suas credenciais
- ✅ Autenticação Google + Anônimo
- ✅ Sistema de perfil com upload de foto
- ✅ Links externos para aplicações
- ✅ Interface responsiva e moderna
- ✅ Sem dependência de logo ou imagens locais

## 🔗 Links das Aplicações

- **Hub YouTube**: https://youtube-hub.netlify.app/
- **Rastreador Estudos**: https://study-tracker.netlify.app/
- **Desafio 67 Dias**: https://66dias.netlify.app/

## 📱 Deploy

Para colocar online, você pode usar:
- **Netlify**: Arraste a pasta para netlify.com/drop
- **Vercel**: Conecte com GitHub
- **Firebase Hosting**: `firebase deploy`

O site está pronto para uso! 🎉
