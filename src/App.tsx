import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Clients } from './components/Clients';
import { Projects } from './components/Projects';
import { Users } from './components/Users';
import { GeminiAssistant } from './components/GeminiAssistant';
import { Reports } from './components/Reports';
import { Tasks } from './components/Tasks';

type Page = 'dashboard' | 'clients' | 'projects' | 'users' | 'gemini' | 'reports' | 'tasks';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <Clients />;
      case 'projects':
        return <Projects onOpenMessages={() => setCurrentPage('gemini')} />;
      case 'gemini':
        return <GeminiAssistant />;
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
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
