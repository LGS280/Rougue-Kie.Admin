import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import EnemyManager from './pages/EnemyManager';
import WeaponManager from './pages/WeaponManager';
import LevelManager from './pages/LevelManager';
import BuffManager from './pages/BuffManager';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="enemies" element={<EnemyManager />} />
          <Route path="weapons" element={<WeaponManager />} />
          <Route path="levels" element={<LevelManager />} />
          <Route path="buffs" element={<BuffManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
