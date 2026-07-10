import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Swords, Target, Settings, Zap, LogOut, User, Sparkles, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  // Trích xuất các thuộc tính xác thực từ Context để phân quyền hiển thị
  const { isAuthenticated, username, role, logout } = useAuth();
  
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Characters', icon: <User size={20} />, path: '/characters' },
    { name: 'Cosmetics', icon: <Sparkles size={20} />, path: '/cosmetics' },
    { name: 'Shop Items', icon: <ShoppingBag size={20} />, path: '/shop-items' },
    { name: 'Enemies', icon: <Target size={20} />, path: '/enemies' },
    { name: 'Weapons', icon: <Swords size={20} />, path: '/weapons' },
    { name: 'Bullets', icon: <Target size={20} />, path: '/bullets' },
    { name: 'Levels', icon: <Settings size={20} />, path: '/levels' },
    { name: 'Buffs', icon: <Zap size={20} />, path: '/buffs' },
  ];

  return (
    <div className="flex h-screen bg-[#07080a] text-gray-200 antialiased font-sans">
      {/* Sidebar - Thiết kế kính mờ tối giản */}
      <aside className="w-64 bg-[#0c0d12]/90 border-r border-white/[0.04] flex flex-col backdrop-blur-md z-20">
        <div className="p-6 flex items-center gap-3">
          {/* Logo có dải gradient phát sáng */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            R
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-wide">
            Rogue-Kie
          </h1>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 px-4 mt-6 space-y-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative group ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400 font-medium'
                    : 'text-gray-400 hover:bg-white/[0.02] hover:text-gray-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Vạch chỉ hướng phát sáng ở cạnh trái khi menu active */}
                  {isActive && (
                    <span className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-400 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"></span>
                  )}
                  {item.icon}
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/[0.04]">
          <div className="text-xs text-gray-600 text-center font-mono">Admin Panel v2.0</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Các quả cầu phát sáng mờ (ambient glow blobs) phía nền */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header - Kính mờ đồng bộ */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/[0.04] bg-[#07080a]/50 backdrop-blur-md z-10">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono">Control Center</h2>
          
          <div className="flex items-center gap-4">
            {/* Phân quyền hiển thị nút Đăng nhập / Đăng xuất tùy vào trạng thái xác thực */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4 animate-in fade-in duration-300">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-200">{username}</div>
                  <div className="text-xs text-gray-500 font-mono uppercase tracking-wider">{role}</div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                  title="Đăng xuất"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-xl font-medium text-sm transition-all duration-300 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95"
              >
                Admin Login
              </NavLink>
            )}
          </div>
        </header>

        {/* Nội dung trang động */}
        <div className="flex-1 overflow-auto p-8 z-10 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
