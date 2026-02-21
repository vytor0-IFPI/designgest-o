import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { GmailProvider } from './context/GmailContext';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Clients } from './components/Clients';
import { Projects } from './components/Projects';
import { Users } from './components/Users';
import { Reports } from './components/Reports';
import { Tasks } from './components/Tasks';

type Page = 'dashboard' | 'clients' | 'projects' | 'users' | 'reports' | 'tasks';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated) {
    return (
      <>
        <div style={{ position: 'fixed', top: 0, left: 0, color: 'white', zIndex: 9999, fontSize: '10px', opacity: 0.5 }}>App Rendering...</div>
        <Login />
      </>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <Clients />;
      case 'projects':
        return <Projects onOpenMessages={() => alert('Recurso de mensagens em desenvolvimento')} />;
      case 'reports':
        return <Reports />;
      case 'tasks':
        return <Tasks />;
      case 'users':
        return <Users />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
}

export function App() {
  return (
    <GmailProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </GmailProvider>
  );
}
