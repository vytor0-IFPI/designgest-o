# 📊 Gestão de Projetos - Elite Management System

![Banner](https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&ixlib=rb-4.0.3)

## 🚀 Sobre o Projeto
O **Gestão de Projetos** é um sistema completo e moderno desenvolvido para profissionais que buscam excelência na organização de seus clientes e fluxos de trabalho. Combinando uma interface **Premium Dark Mode** com ferramentas de produtividade de ponta, o sistema oferece controle financeiro, gestão de tarefas e monitoramento administrativo.

🌐 **Acesse agora:** [https://vytor0-IFPI.github.io/designgest-o/](https://vytor0-IFPI.github.io/designgest-o/)

---

## ✨ Funcionalidades Principais

### 🏢 Gestão de Clientes e Projetos
*   Cadastro detalhado de clientes e empresas.
*   Controle de status (Pendente, Em Andamento, Revisão, Concluído).
*   Gestão de prazos e orçamentos com métricas financeiras.

### 📋 Fluxo de Trabalho (Estilo Trello)
*   Quadro Kanban interativo para organização de tarefas.
*   Colunas de status (A Fazer, Em Andamento, Concluído).
*   Movimentação ágil de tarefas e controle de prioridades.

### 📝 Mural de Notas
*   Sistema de anotações rápidas estilo Post-it.
*   Cores dinâmicas para fácil identificação e organização visual.
*   Persistência de dados para nunca perder uma ideia.

### 🛡️ Painel Administrativo de Elite
*   **Relatórios de Auditoria:** Veja o que cada usuário está fazendo em tempo real.
*   **Gestão de Usuários:** Ative/desative contas e controle níveis de acesso.
*   **Métricas de Desempenho:** Uptime, tempo online e logs de atividades.

### 📧 Automação de E-mails (Gmail API)
*   **Integração Google OAuth2:** Autenticação segura para envio de e-mails via conta Gmail.
*   **Boas-vindas Automatizadas:** Novos usuários recebem confirmação imediata por e-mail.
*   **Notificações de Clientes:** Envio automático de boas-vindas para novos clientes.
*   **Relatórios Administrativos:** Administradores recebem alertas de atividades críticas por e-mail.
*   **Status de Projeto:** Notifique clientes sobre progresso de projetos com um clique.

### ☁️ Sincronização em Nuvem (Multi-dispositivos)
O sistema agora suporta sincronização global via **Supabase**. Isso resolve o problema de dados que não aparecem em outros dispositivos (como celular e notebook).

**Para ativar a sincronização:**
1. Crie um projeto no [Supabase](https://supabase.com/).
2. Adicione as seguintes variáveis ao seu arquivo `.env`:
   ```env
   VITE_SUPABASE_URL=seu_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_key
   ```
3. Execute o seguinte SQL no editor do Supabase para criar as tabelas:
   ```sql
   create table users (id uuid primary key, name text, email text, username text, password text, role text, "createdAt" timestamp with time zone, "isActive" boolean);
   create table clients (id uuid primary key, "userId" uuid, name text, email text, phone text, company text, "createdAt" timestamp with time zone);
   create table projects (id uuid primary key, "userId" uuid, title text, description text, "clientId" uuid, status text, priority text, deadline timestamp with time zone, price numeric, tags jsonb, messages jsonb, "createdAt" timestamp with time zone, "updatedAt" timestamp with time zone);
   create table tasks (id uuid primary key, "userId" uuid, title text, description text, status text, priority text, "createdAt" timestamp with time zone);
   create table notes (id uuid primary key, "userId" uuid, title text, content text, color text, "createdAt" timestamp with time zone);
   ```

---

## 🎨 Design System
*   **Dark Theme High-Contrast:** Interface visualmente impactante e confortável.
*   **Glassmorphism:** Efeitos de transparência e profundidade modernos.
*   **Micro-animações:** Transições suaves em cada interação.
*   **Mobile Ready:** Totalmente responsivo para qualquer dispositivo.

---

## 🛠️ Tecnologias Utilizadas
*   **React 18** (Vite)
*   **Tailwind CSS 4** (Estilização Premium)
*   **Lucide React** (Pacote de Ícones)
*   **LocalStorage API** (Persistência de dados local)
*   **GitHub Actions** (Deploy Automatizado)

---

## 💻 Como rodar localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/vytor0-IFPI/designgest-o.git
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

---

## 👤 Desenvolvedores Master
*   **VYTOR** - Lead Administrator
*   **KAIAN** - Lead Administrator

---
© 2026 Gestão de Projetos. Todos os direitos reservados.