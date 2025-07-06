# 🌟 Meu Site de Tudo

Um hub simples e elegante para suas ferramentas favoritas, com design inspirado no macOS.

## ✨ Características

- **Design macOS**: Interface limpa e minimalista inspirada no macOS
- **Tema Escuro**: Visual elegante e confortável para os olhos
- **Login Google**: Autenticação simples e segura via Firebase
- **Responsivo**: Funciona perfeitamente em desktop e mobile
- **Em Breve**: Seção dedicada para futuras ferramentas

## 🛠️ Ferramentas Disponíveis

### Ativas
- **🎬 Hub Organizador do YouTube**: Organize seus vídeos e canais favoritos
- **📚 Rastreador de Estudos**: Acompanhe seu progresso nos estudos
- **🎯 Desafio 67 Dias**: Transforme sua vida em 67 dias

### Em Breve
- **💰 Controle Financeiro**: Gerencie suas finanças pessoais
- **📝 Bloco de Notas**: Anote ideias importantes
- **⏰ Pomodoro Timer**: Gerencie seu tempo com técnica Pomodoro

## 🚀 Como usar

1. **Servidor local**: Abra `index.html` em um servidor HTTP
2. **Login**: Clique em "Entrar com Google" para fazer login
3. **Navegue**: Clique nas ferramentas para acessá-las

### Executar localmente

```bash
# Python
python -m http.server 8000

# Node.js (http-server)
npm install -g http-server
http-server . -p 8000

# PHP
php -S localhost:8000
```

Acesse: `http://localhost:8000`

## ⚙️ Configuração Firebase

As configurações já estão aplicadas. Para usar:

1. **Firebase Console**: https://console.firebase.google.com/
2. **Projeto**: oiii-97eaa
3. **Ativar**:
   - Authentication (Google)
   - Firestore Database (modo teste)

## 📱 Recursos

- **Notificações toast**: Feedback visual elegante
- **Hover effects**: Animações suaves estilo macOS  
- **Loading states**: Estados de carregamento visuais
- **Cards "Em breve"**: Preview de futuras ferramentas

## 🎨 Design System

- **Cores**: Tons de cinza escuro com azul de destaque (#007AFF)
- **Tipografia**: SF Pro Display (sistema Apple)
- **Sombras**: Sutis e elegantes
- **Bordas**: Arredondadas (12-16px)
- **Backdrop blur**: Efeito de vidro fosco

## 📁 Estrutura

```
📁 ALLSites/
├── 📄 index.html          # Página principal
├── 📄 styles.css          # Estilos macOS
├── 📄 script.js           # JavaScript simplificado
├── 📄 auth.js             # Autenticação Firebase
├── 📄 firebase-config.js  # Configuração Firebase
└── 📄 README.md          # Documentação
```

## 🔮 Próximos Passos

- [ ] Implementar ferramentas "Em breve"
- [ ] Adicionar modo claro/escuro
- [ ] Sistema de favoritos
- [ ] Busca por ferramentas
- [ ] Categorias personalizadas

---

Feito com ❤️ para organizar suas ferramentas favoritas
