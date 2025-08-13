# 📋 Organizador de Tarefas 

Sistema web completo para organizar atividades e prazos escolares, desenvolvido como projeto acadêmico com tela de login e interface moderna.

## 🚀 Tecnologias Utilizadas

- **HTML5** - Estrutura semântica e acessível
- **CSS3** - Estilização moderna com gradientes e animações
- **Bootstrap 5** - Framework CSS responsivo
- **Bootstrap Icons** - Ícones modernos
- **JavaScript ES6+** - Funcionalidades interativas avançadas
- **LocalStorage** - Persistência de dados no navegador
- **Google Fonts (Poppins)** - Tipografia moderna

## ✨ Funcionalidades Principais

### 🔐 Sistema de Autenticação
- Tela de login responsiva
- Validação de campos obrigatórios
- Feedback visual de carregamento
- Redirecionamento automático

### 📝 Gerenciamento de Tarefas
- ✅ Adicionar tarefas com data limite
- 🔍 Filtrar por status (Todas, Pendentes, Concluídas)
- ✏️ Marcar como concluída/reabrir tarefa
- 🗑️ Excluir tarefas com confirmação
- 📊 Contadores em tempo real (Total, Pendentes, Concluídas)

### 🎨 Interface e Experiência
- Interface moderna e intuitiva
- Design totalmente responsivo
- Animações suaves e transições
- Estados visuais para urgência de tarefas
- Estado vazio personalizado
- Alertas informativos

### 🌙 Recursos Especiais
- **Modo escuro** - Ativado via Konami Code
- **Validação inteligente** - Impede datas passadas e tarefas duplicadas
- **Categorização automática** - Tarefas urgentes (≤1 dia) e próximas (2-3 dias)
- **Salvamento automático** - Dados persistem entre sessões

## 🎯 Como Usar

1. **Clone o repositório**
   ```bash
   git clone [url-do-repositorio]
   ```

2. **Navegue até a pasta do projeto**
   ```bash
   cd organizador-tarefas
   ```

3. **Abra o arquivo login.html no navegador**
   - Pode usar qualquer servidor local ou abrir diretamente

4. **Faça login**
   - Use qualquer usuário e senha (autenticação simulada)

5. **Comece a organizar suas tarefas!**

## 📁 Estrutura do Projeto

```
organizador-tarefas/
├── index.html          # Página principal do organizador
├── login.html          # Tela de autenticação
├── css/
│   ├── index.css       # Estilos da página principal
│   └── login.css       # Estilos da tela de login
├── js/
│   ├── index.js        # Lógica principal das tarefas
│   └── login.js        # Sistema de autenticação
└── README.md           # Este arquivo
```

## 🎮 Easter Egg - Konami Code

Digite a sequência **← → B A** em qualquer tela para alternar entre modo claro e escuro!

**Sequência das teclas:**
- Seta para esquerda (←)
- Seta para direita (→) 
- Tecla B
- Tecla A

## 📱 Responsividade Completa

O sistema funciona perfeitamente em todos os dispositivos:

- 🖥️ **Desktop** - Interface completa com layout em colunas
- 📱 **Mobile** - Layout adaptado para telas pequenas
- 📟 **Tablet** - Experiência otimizada para telas médias

### Breakpoints de Responsividade:
- **≤576px**: Layout mobile otimizado
- **≤768px**: Ajustes para tablets
- **≥992px**: Layout desktop completo

## 🔧 Funcionalidades Técnicas

### Validações Implementadas
- Campos obrigatórios (título e data)
- Prevenção de datas passadas
- Detecção de tarefas duplicadas
- Confirmação antes de excluir

### Categorização Automática
- **🔴 Urgente**: Tarefas com prazo ≤ 1 dia
- **🟡 Próxima**: Tarefas com prazo entre 2-3 dias
- **⚪ Normal**: Tarefas com prazo > 3 dias

### Persistência de Dados
- Todas as tarefas são salvas automaticamente
- Preferência do modo escuro é mantida
- Dados persistem entre sessões do navegador

## 🎨 Design System

### Paleta de Cores Principal
- **Gradiente Primário**: #667eea → #764ba2
- **Gradiente Secundário**: #4facfe → #00f2fe
- **Sucesso**: #51cf66
- **Perigo**: #ff6b6b
- **Urgente**: #dc3545

### Tipografia
- **Fonte Principal**: Poppins (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700

## 🌙 Modo Escuro

O modo escuro oferece:
- Redução do cansaço visual
- Melhor experiência em ambientes com pouca luz
- Paleta de cores adaptada (#1a1a2e, #2d2d44, #3a3a55)
- Persistência da preferência do usuário

## 🧪 Tarefas de Exemplo

O sistema inclui tarefas pré-configuradas para demonstração:
- Trabalho de História (7 dias)
- Prova de Matemática (2 dias) 
- Seminário de Biologia (concluído)
- Trabalho WEB - Trier (4 dias)
- Exercícios de Português (1 dia)

## 🛠️ Recursos de Desenvolvimento

### Tratamento de Erros
- Try/catch para localStorage
- Validação de dados de entrada
- Fallbacks para funcionalidades

### Performance
- Código otimizado para carregamento rápido
- Uso eficiente do localStorage
- Animações com CSS para melhor performance

### Acessibilidade
- Estrutura semântica correta
- Labels apropriados para formulários
- Contraste adequado de cores 
- Suporte a navegação por teclado

## 🔄 Fluxo de Navegação

1. **login.html** → Autenticação do usuário
2. **index.html** → Página principal com todas as funcionalidades
3. **Dados persistem** entre as sessões

## 👨‍💻 Autor

**Elessando de Abreu**  
Projeto desenvolvido para a disciplina de Desenvolvimento Web - Trier

---

© 2025 - Todos os direitos reservados.