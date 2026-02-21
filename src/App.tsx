import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Clients } from './components/Clients';
import { Projects } from './components/Projects';
import { Messages } from './components/Messages';
import { Users } from './components/Users';

type Page = 'dashboard' | 'clients' | 'projects' | 'messages' | 'users';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();

  const handleOpenMessages = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentPage('messages');
  };

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
        return <Projects onOpenMessages={handleOpenMessages} />;
      case 'messages':
        return (
          <Messages 
            selectedProjectId={selectedProjectId} 
            onSelectProject={setSelectedProjectId}
          />
        );
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
