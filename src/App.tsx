
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import EnemyManager from './pages/EnemyManager';
import WeaponManager from './pages/WeaponManager';
import LevelManager from './pages/LevelManager';
import BuffManager from './pages/BuffManager';
import BulletManager from './pages/BulletManager';
import CharacterManager from './pages/CharacterManager';
import CosmeticManager from './pages/CosmeticManager';
import ShopItemManager from './pages/ShopItemManager';
import UserManager from './pages/UserManager';
import MaintenanceManager from './pages/MaintenanceManager';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="users" element={<UserManager />} />
            <Route path="enemies" element={<EnemyManager />} />
            <Route path="weapons" element={<WeaponManager />} />
            <Route path="bullets" element={<BulletManager />} />
            <Route path="levels" element={<LevelManager />} />
            <Route path="buffs" element={<BuffManager />} />
            <Route path="characters" element={<CharacterManager />} />
            <Route path="cosmetics" element={<CosmeticManager />} />
            <Route path="shop-items" element={<ShopItemManager />} />
            <Route path="maintenance" element={<MaintenanceManager />} />
          </Route>
          {/* Fallback route cho bất kỳ đường dẫn không xác định nào */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
