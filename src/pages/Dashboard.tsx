import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Target, Swords, Settings, Zap, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Component Thẻ thống kê Glassmorphic cao cấp
const StatCard = ({ title, value, icon, color }: { title: string, value: number | string, icon: React.ReactNode, color: string }) => (
  <div className="glass-panel p-6 rounded-2xl border border-white/[0.04] shadow-lg relative overflow-hidden group hover:-translate-y-1 hover:border-white/[0.08] transition-all duration-300">
    {/* Vệt sáng màu nền phát sáng mờ ở góc thẻ */}
    <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500 blur-xl" style={{ backgroundColor: color }}></div>
    
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-4xl font-bold text-white tracking-tight">{value}</h3>
      </div>
      <div className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${color}15`, color: color }}>
        {icon}
      </div>
    </div>
    
    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 font-medium relative z-10">
      <span className="flex items-center text-emerald-400">
        <ArrowUpRight size={14} className="mr-1" /> Active
      </span>
      <span>Live in database</span>
    </div>
  </div>
);

const Dashboard = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  
  // Kiểm tra quyền chỉnh sửa của user để hiển thị Quick Actions
  const isWritable = isAuthenticated && (role === 'Admin' || role === 'Developer');

  const [stats, setStats] = useState({
    enemies: 0,
    weapons: 0,
    bullets: 0,
    levels: 0,
    buffs: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [enemies, weapons, bullets, levels, buffs] = await Promise.all([
          axiosClient.get('/enemies'),
          axiosClient.get('/weapons'),
          axiosClient.get('/bullets'),
          axiosClient.get('/levels'),
          axiosClient.get('/buffs'),
        ]);
        
        setStats({
          enemies: (enemies as any).length || 0,
          weapons: (weapons as any).length || 0,
          bullets: (bullets as any).length || 0,
          levels: (levels as any).length || 0,
          buffs: (buffs as any).length || 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400 text-sm">Welcome to the Rogue-Kie Control Center. Monitor and adjust game configurations here.</p>
      </div>

      {/* Grid thẻ chỉ số */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard title="Total Enemies" value={stats.enemies} icon={<Target size={22} />} color="#f43f5e" />
        <StatCard title="Weapons" value={stats.weapons} icon={<Swords size={22} />} color="#6366f1" />
        <StatCard title="Bullets" value={stats.bullets} icon={<Target size={22} />} color="#f97316" />
        <StatCard title="Levels Defined" value={stats.levels} icon={<Settings size={22} />} color="#a855f7" />
        <StatCard title="Active Buffs" value={stats.buffs} icon={<Zap size={22} />} color="#eab308" />
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions - Chỉ hiển thị cho Admin/Developer */}
        {isWritable ? (
          <div className="glass-panel p-6 rounded-2xl border border-white/[0.04]">
             <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/enemies')}
                  className="p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl text-left transition-all border border-white/[0.04] hover:border-white/[0.08] cursor-pointer group active:scale-98"
                >
                  <Target className="text-red-400 mb-2 transition-transform group-hover:scale-110" />
                  <div className="font-semibold text-gray-200">New Enemy</div>
                  <div className="text-xs text-gray-500 mt-1">Add a new enemy type to the roster</div>
                </button>
                <button 
                  onClick={() => navigate('/weapons')}
                  className="p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl text-left transition-all border border-white/[0.04] hover:border-white/[0.08] cursor-pointer group active:scale-98"
                >
                  <Swords className="text-indigo-400 mb-2 transition-transform group-hover:scale-110" />
                  <div className="font-semibold text-gray-200">New Weapon</div>
                  <div className="text-xs text-gray-500 mt-1">Configure gun stats and behaviors</div>
                </button>
             </div>
          </div>
        ) : (
          /* Lời chào hoặc hướng dẫn dành cho Player */
          <div className="glass-panel p-6 rounded-2xl border border-white/[0.04] flex flex-col justify-center">
             <h3 className="text-lg font-bold text-white mb-2">Read-Only mode active</h3>
             <p className="text-gray-400 text-sm leading-relaxed">
               You are currently viewing the configurations in **Player mode**. You can browse and check all weapon, enemy, and buff parameters, but modification requires an authorized Admin or Developer account.
             </p>
          </div>
        )}

        {/* Hệ thống trạng thái */}
        <div className="bg-gradient-to-br from-indigo-950/20 to-cyan-950/20 p-6 rounded-2xl border border-indigo-500/10 shadow-lg flex flex-col justify-center items-center text-center">
           <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
              <Zap className="text-indigo-400" size={28} />
           </div>
           <h3 className="text-xl font-bold text-white mb-2">System Status: Online</h3>
           <p className="text-indigo-200/50 text-sm max-w-sm">
             The Web Admin panel is directly connected to the Backend Database. Changes made by admins will reflect in-game instantly via Sync API.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
