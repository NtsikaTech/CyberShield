
import React, { useState } from 'react';
import { AppView } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [user, setUser] = useState<{ username: string } | null>(null);

  const handleLogin = (username: string) => {
    setUser({ username });
    setView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setView(AppView.LOGIN);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {view === AppView.LOGIN ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
