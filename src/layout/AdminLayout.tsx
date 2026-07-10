import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Swords, Target, Settings, Zap, LogOut, User, Sparkles, ShoppingBag, BarChart3, Users2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  // Trích xuất các thuộc tính xác thực từ Context để phân quyền hiển thị
  const { isAuthenticated, username, role, logout } = useAuth();
  
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    ...(role === 'Admin' || role === 'Developer' ? [
      { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },
      { name: 'Crew Members (Users)', icon: <Users2 size={20} />, path: '/users' }
    ] : []),
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
    <div className="flex h-screen space-grid text-[#E2E8F0] antialiased font-sans">
      {/* Sidebar - Thiết kế kính mờ tối giản chuẩn UI Pro Max */}
      <aside className="w-64 bg-[#161633]/90 border-r border-[#4C1D95]/40 flex flex-col backdrop-blur-md z-20">
        <div className="p-6 flex items-center gap-3">
          {/* Logo có dải gradient phát sáng */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#F43F5E] flex items-center justify-center font-bold text-white shadow-lg shadow-[#7C3AED]/35 font-mono">
            R
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#A78BFA] to-[#F43F5E] tracking-wide font-mono">
            Rogue-Kie
          </h1>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 px-4 mt-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative group font-sans ${
                  isActive
                    ? 'bg-[#7C3AED]/15 text-[#A78BFA] font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                    : 'text-gray-400 hover:bg-[#27273B]/50 hover:text-[#E2E8F0]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Vạch chỉ hướng phát sáng ở cạnh trái khi menu active */}
                  {isActive && (
                    <span className="absolute left-0 top-3.5 bottom-3.5 w-1 bg-[#F43F5E] rounded-r-full shadow-[0_0_12px_rgba(244,63,94,0.85)]"></span>
                  )}
                  <span className={`transition-colors duration-300 ${isActive ? 'text-[#A78BFA]' : 'text-gray-400 group-hover:text-[#A78BFA]'}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#4C1D95]/30">
          <div className="text-xs text-gray-500 text-center font-mono">Admin Panel v2.0 - Pro Max</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative space-grid">
        {/* Các quả cầu phát sáng mờ (ambient glow blobs) phía nền */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#7C3AED]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#F43F5E]/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header - Kính mờ đồng bộ */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-[#4C1D95]/30 bg-[#0F0F23]/60 backdrop-blur-md z-10">
          <h2 className="text-xs font-semibold text-[#A78BFA] uppercase tracking-widest font-mono">Galactic Command Hangar</h2>
          
          <div className="flex items-center gap-4">
            {/* Phân quyền hiển thị nút Đăng nhập / Đăng xuất tùy vào trạng thái xác thực */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4 animate-in fade-in duration-300">
                <div className="text-right">
                  <div className="text-sm font-semibold text-[#E2E8F0] font-sans">{username}</div>
                  <div className="text-xs text-[#A78BFA] font-mono uppercase tracking-wider">{role}</div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-[#EF4444] hover:bg-[#EF4444]/15 rounded-xl transition-all duration-200 cursor-pointer"
                  title="Đăng xuất"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] hover:from-[#6D28D9] hover:to-[#E11D48] text-white rounded-xl font-medium text-sm transition-all duration-300 shadow-md shadow-[#7C3AED]/20 hover:shadow-[#7C3AED]/35 active:scale-95"
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
