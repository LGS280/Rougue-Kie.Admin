import { useEffect, useState, useRef } from 'react';
import axiosClient from '../api/axiosClient';
import { Target, Swords, Settings, Zap, ArrowUpRight, Activity, Terminal, Users, Radio, Gamepad2, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Component Thẻ thống kê Hangar
const StatCard = ({ title, value, icon, color, description, isLive = false }: { title: string, value: number | string, icon: React.ReactNode, color: string, description: string, isLive?: boolean }) => (
  <div className="glass-panel p-5 rounded-2xl border border-[#4C1D95]/40 shadow-lg relative overflow-hidden group hover:-translate-y-1 hover:border-[#7C3AED]/50 transition-all duration-300">
    <div className="absolute top-0 right-0 w-28 h-28 opacity-5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500 blur-xl" style={{ backgroundColor: color }}></div>
    
    <div className="flex justify-between items-start relative z-10">
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          {isLive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
          <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider font-mono">{title}</p>
        </div>
        <h3 className="text-3xl font-bold text-[#E2E8F0] tracking-tight font-mono">{value}</h3>
      </div>
      <div className="p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${color}15`, color: color }}>
        {icon}
      </div>
    </div>
    
    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 font-medium relative z-10">
      <span className="flex items-center text-[#A78BFA] font-mono text-[11px]">
        <ArrowUpRight size={13} className="mr-0.5" /> Active
      </span>
      <span className="font-mono text-gray-400 text-[11px] truncate">{description}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const terminalEndRef = useRef<HTMLDivElement>(null);
  
  // Kiểm tra quyền chỉnh sửa của user để hiển thị Quick Actions
  const isWritable = isAuthenticated && (role === 'Admin' || role === 'Developer');

  // Thống kê game catalog
  const [stats, setStats] = useState({
    enemies: 0,
    weapons: 0,
    bullets: 0,
    levels: 0,
    buffs: 0,
  });

  // Thống kê vận hành thực tế (Live Operations)
  const [liveMetrics, setLiveMetrics] = useState({
    ccu: 0,
    activeRooms: 0,
    totalUsers: 0,
    totalRuns: 0,
  });

  // Logs terminal state (Dữ liệu thật từ recent-activities)
  const [logs, setLogs] = useState<string[]>([
    "System Boot Sequence Completed.",
    "Space Station Comms Online. Connected to Azure Central Gateway.",
    "Orbital database synchronized."
  ]);

  // Telemetry core dynamic variables
  const [latency, setLatency] = useState(12);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Hàm tải dữ liệu thực tế từ Backend API
  const fetchDashboardData = async () => {
    const startTime = performance.now();
    try {
      setIsRefreshing(true);
      
      // Chỉ tải các số liệu quản trị nhạy cảm (/admin/*) khi đã đăng nhập có quyền Admin/Developer
      // Tránh việc người dùng chưa đăng nhập bị dính lỗi 401 và tự động giật trang sang /login
      const [statsRes, ccuRes, activitiesRes] = isWritable
        ? await Promise.all([
            axiosClient.get('/admin/stats').catch(() => null),
            axiosClient.get('/admin/ccu').catch(() => null),
            axiosClient.get('/admin/recent-activities?limit=30').catch(() => null),
          ])
        : [null, null, null];

      const [enemies, weapons, bullets, levels, buffs] = await Promise.all([
        axiosClient.get('/enemies').catch(() => []),
        axiosClient.get('/weapons').catch(() => []),
        axiosClient.get('/bullets').catch(() => []),
        axiosClient.get('/levels').catch(() => []),
        axiosClient.get('/buffs').catch(() => []),
      ]);

      const roundTrip = Math.max(8, Math.round(performance.now() - startTime));
      setLatency(roundTrip);

      if (statsRes) {
        const s = statsRes as any;
        setLiveMetrics(prev => ({
          ...prev,
          totalUsers: s.totalUsers || 0,
          totalRuns: s.totalRuns || 0,
          ccu: s.onlinePlayerCCU || 0,
          activeRooms: s.activeRooms !== undefined ? s.activeRooms : prev.activeRooms,
        }));
      }

      if (ccuRes) {
        const c = ccuRes as any;
        setLiveMetrics(prev => ({
          ...prev,
          ccu: c.onlinePlayerCCU !== undefined ? c.onlinePlayerCCU : prev.ccu,
          activeRooms: c.activeRooms !== undefined ? c.activeRooms : prev.activeRooms,
        }));
      }

      setStats({
        enemies: (enemies as any).length || 0,
        weapons: (weapons as any).length || 0,
        bullets: (bullets as any).length || 0,
        levels: (levels as any).length || 0,
        buffs: (buffs as any).length || 0,
      });

      if (activitiesRes && Array.isArray(activitiesRes) && activitiesRes.length > 0) {
        const activityLogs = (activitiesRes as any[]).map((a: any) => 
          `[${a.timeFormatted || new Date(a.timestamp).toLocaleTimeString()}] [${(a.activityType || 'SYS').toUpperCase()}] ${a.description}`
        );
        setLogs(activityLogs);
      } else {
        const now = new Date().toLocaleTimeString();
        setLogs([
          `[${now}] [SYS] Gateway Online: Connected to Azure SignalR Hub.`,
          `[${now}] [SYS] Neon PostgreSQL Database: Operational & Synchronized.`,
          isWritable 
            ? `[${now}] [SYS] Hangar Telemetry ready: Waiting for new player expeditions.`
            : `[${now}] [INFO] Khách vãng lai: Vui lòng đăng nhập quyền Admin để xem số liệu vận hành trực tiếp.`
        ]);
      }

      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Dashboard:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Thiết lập Polling định kỳ mỗi 10 giây để cập nhật CCU và nhật ký hoạt động thời gian thực
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 10000);

    return () => clearInterval(interval);
  }, [isWritable]);

  // Scroll to bottom on new log
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-[#4C1D95]/20">
        <div>
          <h1 className="text-3xl font-bold text-[#E2E8F0] mb-1 font-mono tracking-wide">Deep Space Operations Center</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Rogue-Kie Live Command Base: Theo dõi người chơi thời gian thực, phòng đấu Co-op và nhật ký hệ thống.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDashboardData()}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161633] hover:bg-[#27273B] border border-[#4C1D95]/40 rounded-xl text-xs font-mono text-gray-300 transition-all cursor-pointer"
            title="Làm mới số liệu"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-[#A78BFA]' : ''} />
            <span>{lastRefreshed ? `Sync: ${lastRefreshed}` : 'Refresh'}</span>
          </button>
          {/* Orbital Beacon Indicator */}
          <div className="flex items-center gap-2 bg-[#161633] px-3.5 py-1.5 rounded-xl border border-[#4C1D95]/40 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 beacon-pulse"></div>
            <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">BEACON ONLINE</span>
          </div>
        </div>
      </div>

      {/* Grid 1: Thẻ chỉ số vận hành thời gian thực (Live Operations) */}
      <div>
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#A78BFA] mb-3 flex items-center gap-2">
          <Radio size={14} className="text-emerald-400 animate-pulse" /> Live Telemetry & Fleet Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Live CCU (Online)" 
            value={liveMetrics.ccu} 
            icon={<Radio size={22} />} 
            color="#10b981" 
            description="Người chơi đang online qua SignalR" 
            isLive={true} 
          />
          <StatCard 
            title="Active Co-op Rooms" 
            value={liveMetrics.activeRooms} 
            icon={<Gamepad2 size={22} />} 
            color="#06b6d4" 
            description="Phòng chơi Co-op đang mở" 
            isLive={liveMetrics.activeRooms > 0} 
          />
          <StatCard 
            title="Registered Pilots" 
            value={liveMetrics.totalUsers} 
            icon={<Users size={22} />} 
            color="#8b5cf6" 
            description="Tổng tài khoản phi hành gia" 
          />
          <StatCard 
            title="Dungeon Expeditions" 
            value={liveMetrics.totalRuns} 
            icon={<ShieldCheck size={22} />} 
            color="#f59e0b" 
            description="Tổng số chuyến thám hiểm đã chơi" 
          />
        </div>
      </div>

      {/* Grid 2: Thẻ chỉ số cấu hình trò chơi (Armory & Catalog) */}
      <div>
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
          <Activity size={14} className="text-[#7C3AED]" /> Armory Catalog & Dungeon Profiles
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
          <StatCard title="Alien Hostiles" value={stats.enemies} icon={<Target size={20} />} color="#f43f5e" description="Quái vật đã cấu hình" />
          <StatCard title="Armory Weapons" value={stats.weapons} icon={<Swords size={20} />} color="#7c3aed" description="Vũ khí & kiếm laser" />
          <StatCard title="Ammunition" value={stats.bullets} icon={<Target size={20} />} color="#f97316" description="Các loại đạn & hiệu ứng" />
          <StatCard title="Dungeon Floors" value={stats.levels} icon={<Settings size={20} />} color="#a78bfa" description="Màn chơi ngẫu nhiên" />
          <StatCard title="Nanite Buffs" value={stats.buffs} icon={<Zap size={20} />} color="#eab308" description="Thẻ bài cường hóa" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột bên trái: Quick Actions & Core Telemetry Meters */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          {isWritable ? (
            <div className="glass-panel p-5 rounded-2xl border border-[#4C1D95]/40">
              <h3 className="text-base font-bold text-[#E2E8F0] mb-3 font-mono">Quick Space Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate('/enemies')}
                  className="p-3.5 bg-[#0F0F23]/60 hover:bg-[#27273B]/40 rounded-xl text-left transition-all border border-[#4C1D95]/30 hover:border-[#7C3AED]/40 cursor-pointer group active:scale-98"
                >
                  <Target size={18} className="text-[#f43f5e] mb-1.5 transition-transform group-hover:scale-110" />
                  <div className="font-semibold text-gray-200 text-xs sm:text-sm font-sans">Manage Enemies</div>
                  <div className="text-[10px] text-gray-500 mt-0.5 font-sans">Cấu hình chỉ số quái vật</div>
                </button>
                <button 
                  onClick={() => navigate('/weapons')}
                  className="p-3.5 bg-[#0F0F23]/60 hover:bg-[#27273B]/40 rounded-xl text-left transition-all border border-[#4C1D95]/30 hover:border-[#7C3AED]/40 cursor-pointer group active:scale-98"
                >
                  <Swords size={18} className="text-[#a78bfa] mb-1.5 transition-transform group-hover:scale-110" />
                  <div className="font-semibold text-gray-200 text-xs sm:text-sm font-sans">Provision Armory</div>
                  <div className="text-[10px] text-gray-500 mt-0.5 font-sans">Cấu hình kho vũ khí</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-5 rounded-2xl border border-[#4C1D95]/40 flex flex-col justify-center">
              <h3 className="text-base font-bold text-white mb-2 font-mono">Telemetry Viewer Active</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-sans">
                Bạn đang ở chế độ xem trực tiếp số liệu thời gian thực của trạm không gian Rogue-Kie.
              </p>
            </div>
          )}

          {/* Telemetry Core Performance Meters */}
          <div className="glass-panel p-5 rounded-2xl border border-[#4C1D95]/40 space-y-4">
            <h3 className="text-base font-bold text-[#E2E8F0] font-mono flex items-center gap-2">
              <Activity size={16} className="text-[#7C3AED]" /> Core Telemetry Status
            </h3>
            <div className="space-y-3">
              {/* Meter 1: Server Gateway Latency */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">Backend API Gateway Ping</span>
                  <span className={latency < 40 ? 'text-emerald-400' : 'text-amber-400'}>{latency} ms</span>
                </div>
                <div className="w-full bg-[#0F0F23] h-2 rounded-full overflow-hidden border border-[#4C1D95]/30">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-[#7C3AED] h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(15, (latency / 100) * 100))}%` }}
                  ></div>
                </div>
              </div>

              {/* Meter 2: Co-op Rooms Capacity */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">SignalR Active Rooms</span>
                  <span className="text-cyan-400">{liveMetrics.activeRooms} Rooms</span>
                </div>
                <div className="w-full bg-[#0F0F23] h-2 rounded-full overflow-hidden border border-[#4C1D95]/30">
                  <div 
                    className="bg-cyan-500 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(5, liveMetrics.activeRooms * 20))}%` }}
                  ></div>
                </div>
              </div>

              {/* Node Status Info */}
              <div className="pt-2 border-t border-[#4C1D95]/20 flex justify-between text-[11px] font-mono text-gray-400">
                <span>Database: <span className="text-emerald-400">Neon PostgreSQL Online</span></span>
                <span>SignalR: <span className="text-emerald-400">20Hz Tick</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Cột bên phải: Live Hangar Logs (Terminal console với dữ liệu thực tế) */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-2xl border border-[#4C1D95]/40 shadow-2xl flex flex-col h-[420px]">
            {/* Terminal Header */}
            <div className="px-5 py-3 border-b border-[#4C1D95]/40 bg-[#161633]/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={16} className="text-[#F43F5E]" />
                <span className="text-xs font-mono font-bold text-[#E2E8F0] tracking-wide">LIVE HANGAR LOGS - SYSTEM STREAM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-400">Real-time Stream</span>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/60"></span>
                </div>
              </div>
            </div>

            {/* Terminal Log Output (CRT styled) */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs text-emerald-400 crt-screen crt-scanline space-y-1.5 select-text">
              {logs.map((log, i) => (
                <div key={i} className="leading-relaxed hover:bg-emerald-500/10 px-2 py-0.5 rounded transition-colors break-words">
                  {log}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
