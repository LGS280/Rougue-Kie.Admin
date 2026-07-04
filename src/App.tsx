
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import EnemyManager from './pages/EnemyManager';
import WeaponManager from './pages/WeaponManager';
import LevelManager from './pages/LevelManager';
import BuffManager from './pages/BuffManager';
import BulletManager from './pages/BulletManager';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, role } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'Admin' && role !== 'Developer') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="enemies" element={<EnemyManager />} />
            <Route path="weapons" element={<WeaponManager />} />
            <Route path="bullets" element={<BulletManager />} />
            <Route path="levels" element={<LevelManager />} />
            <Route path="buffs" element={<BuffManager />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
