# 🌟 Meu Site de Tudo - Servidor Local

Este arquivo contém instruções para executar o site localmente.

## Como executar

### Opção 1: Usando Python (Recomendado)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Opção 2: Usando Node.js
```bash
# Instalar http-server globalmente
npm install -g http-server

# Executar servidor
http-server . -p 8000
```

### Opção 3: Usando PHP
```bash
php -S localhost:8000
```

### Opção 4: Usando Live Server (VS Code)
1. Instale a extensão "Live Server" no VS Code
2. Clique com botão direito no arquivo index.html
3. Selecione "Open with Live Server"

## Acessar o site
Após executar um dos comandos acima, acesse:
http://localhost:8000

## Configuração do Firebase

Para usar as funcionalidades de autenticação:

1. Acesse o Firebase Console: https://console.firebase.google.com/
2. Selecione seu projeto: oiii-97eaa
3. Configure Authentication:
   - Ative o provedor Google
   - Adicione o domínio localhost:8000 aos domínios autorizados
4. Configure Firestore Database em modo teste
5. Configure Storage (opcional)

## Estrutura do Projeto

```
📁 ALLSites/
├── 📄 index.html          # Página principal
├── 📄 styles.css          # Estilos CSS
├── 📄 script.js           # JavaScript principal
├── 📄 auth.js             # Módulo de autenticação
├── 📄 firebase-config.js  # Configuração Firebase
├── 📄 manifest.json       # Manifesto PWA
├── 📄 sw.js              # Service Worker
├── 📄 server.md          # Este arquivo
└── 📄 README.md          # Documentação do projeto
```

## Recursos Implementados

✅ Interface dark minimalista
✅ Login com Google via Firebase
✅ Design responsivo
✅ Acessibilidade (WCAG 2.1)
✅ PWA (Progressive Web App)
✅ Animações suaves
✅ Service Worker para cache
✅ Notificações do sistema
✅ Performance otimizada

## Troubleshooting

### Erro de CORS
Se encontrar erros de CORS, certifique-se de estar usando um servidor HTTP e não abrindo o arquivo diretamente no navegador.

### Firebase Auth não funciona
1. Verifique se o domínio está autorizado no Firebase Console
2. Certifique-se de que a configuração do Firebase está correta
3. Verifique o console do navegador para erros específicos

### PWA não instala
1. Certifique-se de estar usando HTTPS (ou localhost)
2. Verifique se o manifest.json está acessível
3. Confirme se o Service Worker está registrado corretamente
