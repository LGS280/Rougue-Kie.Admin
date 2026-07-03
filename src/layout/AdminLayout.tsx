import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Swords, Target, Settings, Zap } from 'lucide-react';

const AdminLayout = () => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Enemies', icon: <Target size={20} />, path: '/enemies' },
    { name: 'Weapons', icon: <Swords size={20} />, path: '/weapons' },
    { name: 'Levels', icon: <Settings size={20} />, path: '/levels' },
    { name: 'Buffs', icon: <Zap size={20} />, path: '/buffs' },
  ];

  return (
    <div className="flex h-screen bg-[#121212] text-gray-200">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e1e1e] border-r border-gray-800 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg">
            R
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 tracking-wide">
            Rogue-Kie
          </h1>
        </div>
        
        <nav className="flex-1 px-4 mt-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 font-medium'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 text-center">Admin Panel v1.0</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Ambient light effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <header className="h-16 flex items-center px-8 border-b border-gray-800/50 backdrop-blur-sm z-10">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest">Control Center</h2>
        </header>

        <div className="flex-1 overflow-auto p-8 z-10 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
