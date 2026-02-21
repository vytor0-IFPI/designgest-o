# 📊 Elite Management System - Gestão de Projetos

![Banner](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2426)

## 🚀 Sobre o Projeto
O **Elite Management System** é uma plataforma ultra-moderna, com interface **Total Dark Mode**, projetada para profissionais que exigem o máximo de performance e estética. O sistema oferece isolamento completo de dados por usuário, sincronização em nuvem em tempo real e automação via Gmail.

🌐 **Acesse agora:** [https://vytor0-IFPI.github.io/designgest-o/](https://vytor0-IFPI.github.io/designgest-o/)

---

## ✨ Funcionalidades Master

### 🌑 Elite Dark Mode (Total Dark)
*   Interface 100% focada em tons de preto e camadas profundas.
*   Design System baseado em Glassmorphism e gradientes violeta.
*   Conforto visual extremo para longas jornadas de trabalho.

### 🔐 Privacidade & Isolamento (Multi-tenancy)
*   **Dados Privados:** Cada usuário possui seu próprio ecossistema de dados.
*   **Segurança:** Clientes, projetos e tarefas de um usuário são invisíveis para outros.
*   **Nuvem:** Sincronização automática via Supabase, garantindo que você tenha seus dados em qualquer dispositivo.

### 📧 Gmail Automation Elite
*   **Conexão Rápida:** Botão direto no dashboard para autorizar sua conta Google.
*   **Notificações Inteligentes:** Envio de boas-vindas para novos clientes.
*   **Relatórios Adm:** Envio automático de logs de atividade para os administradores master.

### 📊 Gestão Estruturada
*   **Dashboard:** Métricas financeiras e de produtividade em tempo real.
*   **Kanban Premium:** Controle ágil de tarefas com prioridades e prazos.
*   **Mural de Notas:** Sistema de insights rápidos com persistência global.

---

## ☁️ Configuração de Sincronização em Nuvem

Para ativar a sincronização global, adicione as chaves ao arquivo `.env`:

```env
VITE_SUPABASE_URL=seu_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_key
VITE_GOOGLE_CLIENT_ID=seu_client_id_google
```

### SQL do Banco de Dados (Supabase)
```sql
create table users (id uuid primary key, name text, email text, username text, password text, role text, "createdAt" timestamp with time zone, "isActive" boolean);
create table clients (id uuid primary key, "userId" uuid, name text, email text, phone text, company text, "createdAt" timestamp with time zone);
create table projects (id uuid primary key, "userId" uuid, title text, description text, "clientId" uuid, status text, priority text, deadline timestamp with time zone, price numeric, tags jsonb, messages jsonb, "createdAt" timestamp with time zone, "updatedAt" timestamp with time zone);
create table tasks (id uuid primary key, "userId" uuid, title text, description text, status text, priority text, "createdAt" timestamp with time zone);
create table notes (id uuid primary key, "userId" uuid, title text, content text, color text, "createdAt" timestamp with time zone);
```

---

## 🛠️ Stack Tecnológica
*   **React 18** + **Vite**
*   **Tailwind CSS 4** (Configuração Elite Hybrid)
*   **Supabase** (Realtime Database)
*   **Gmail API** (Google OAuth2)
*   **Lucide React** (Elite Icon Set)

---

© 2026 Elite Management System. Desenvolvido para a Excelência.