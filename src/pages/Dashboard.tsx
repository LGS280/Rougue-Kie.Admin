import { useEffect, useState, useRef } from 'react';
import axiosClient from '../api/axiosClient';
import { Target, Swords, Settings, Zap, ArrowUpRight, Activity, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Component Thẻ thống kê Hangar
const StatCard = ({ title, value, icon, color, description }: { title: string, value: number | string, icon: React.ReactNode, color: string, description: string }) => (
  <div className="glass-panel p-6 rounded-2xl border border-[#4C1D95]/40 shadow-lg relative overflow-hidden group hover:-translate-y-1 hover:border-[#7C3AED]/50 transition-all duration-300">
    <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500 blur-xl" style={{ backgroundColor: color }}></div>
    
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1 font-mono">{title}</p>
        <h3 className="text-4xl font-bold text-[#E2E8F0] tracking-tight font-mono">{value}</h3>
      </div>
      <div className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${color}15`, color: color }}>
        {icon}
      </div>
    </div>
    
    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 font-medium relative z-10">
      <span className="flex items-center text-[#A78BFA] font-mono">
        <ArrowUpRight size={14} className="mr-1" /> Active
      </span>
      <span className="font-mono text-gray-500">{description}</span>
    </div>
  </div>
);

// Mẫu log phi hành đoàn viễn tưởng
const MOCK_LOGS = [
  "Rookie shuttle docking initiated at Platform-03.",
  "Alien infestation wave anomaly detected in Forest Sector.",
  "Syncing weapon telemetry payload with orbital database.",
  "Nanite shield modifiers calibrated: +15% damage resist.",
  "Hostile lifeform data update packet transmitted: Boss-1.",
  "Armory catalog updated. AK-47 recoil coefficients synced.",
  "Rookie-1 spawned in sector 4, room active.",
  "Cosmetic skin 'Carbon Fiber' unlocked by client-09.",
  "Sub-light comms transceiver operating at 20Hz frequency.",
  "Stripe transaction logged: User-09 acquired 500 Gems.",
  "Server core fuel cells functioning at optimal 98% load.",
  "Emergency evacuation drills logged. Room codes flushed."
];

const Dashboard = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const terminalEndRef = useRef<HTMLDivElement>(null);
  
  // Kiểm tra quyền chỉnh sửa của user để hiển thị Quick Actions
  const isWritable = isAuthenticated && (role === 'Admin' || role === 'Developer');

  const [stats, setStats] = useState({
    enemies: 0,
    weapons: 0,
    bullets: 0,
    levels: 0,
    buffs: 0,
  });

  // Logs terminal state
  const [logs, setLogs] = useState<string[]>([
    "System Boot Sequence Completed.",
    "Space Station Comms Online. Connected to Azure Central Gateway.",
    "Orbital database synced with local cache."
  ]);

  // Telemetry core dynamic variables
  const [dbLoad, setDbLoad] = useState(42);
  const [latency, setLatency] = useState(18);

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

  // Effect to simulate live terminal logs stream
  useEffect(() => {
    const interval = setInterval(() => {
      const randomLog = MOCK_LOGS[Math.floor(Math.random() * MOCK_LOGS.length)];
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      setLogs(prev => {
        const newLogs = [...prev, `[${timeStr}] ${randomLog}`];
        if (newLogs.length > 30) newLogs.shift();
        return newLogs;
      });

      // Simulate slight fluctuations in metrics
      setDbLoad(prev => Math.max(30, Math.min(85, prev + Math.floor(Math.random() * 11) - 5)));
      setLatency(prev => Math.max(8, Math.min(45, prev + Math.floor(Math.random() * 7) - 3)));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom on new log
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      {/* Title Header */}
      <div className="flex justify-between items-center pb-2 border-b border-[#4C1D95]/20">
        <div>
          <h1 className="text-3xl font-bold text-[#E2E8F0] mb-2 font-mono tracking-wide">Deep Space Operations Center</h1>
          <p className="text-gray-400 text-sm">Welcome to the Rogue-Kie Space Command Base. Monitor game core subsystems and orbital configurations.</p>
        </div>
        {/* Orbital Beacon Indicator */}
        <div className="flex items-center gap-3 bg-[#161633] px-4 py-2 rounded-xl border border-[#4C1D95]/40 shadow-inner">
          <div className="w-3 h-3 rounded-full bg-emerald-500 beacon-pulse"></div>
          <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">ORBITAL BEACON: ONLINE</span>
        </div>
      </div>

      {/* Grid thẻ chỉ số */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard title="Hostiles (Enemies)" value={stats.enemies} icon={<Target size={22} />} color="#f43f5e" description="Alien species cataloged" />
        <StatCard title="Armory (Weapons)" value={stats.weapons} icon={<Swords size={22} />} color="#7c3aed" description="Guns and sabers defined" />
        <StatCard title="Ordnance (Bullets)" value={stats.bullets} icon={<Target size={22} />} color="#f97316" description="Ammunition physics config" />
        <StatCard title="Sectors Mapped" value={stats.levels} icon={<Settings size={22} />} color="#a78bfa" description="Random floor profiles" />
        <StatCard title="Nanite Modifiers" value={stats.buffs} icon={<Zap size={22} />} color="#eab308" description="Active perks & modifiers" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Hàng bên trái: Quick Actions hoặc Info */}
        <div className="lg:col-span-5 space-y-8 flex flex-col">
          {isWritable ? (
            <div className="glass-panel p-6 rounded-2xl border border-[#4C1D95]/40 flex-1">
              <h3 className="text-lg font-bold text-[#E2E8F0] mb-4 font-mono">Quick Ship Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/enemies')}
                  className="p-4 bg-[#0F0F23]/60 hover:bg-[#27273B]/40 rounded-xl text-left transition-all border border-[#4C1D95]/30 hover:border-[#7C3AED]/40 cursor-pointer group active:scale-98"
                >
                  <Target className="text-[#f43f5e] mb-2 transition-transform group-hover:scale-110" />
                  <div className="font-semibold text-gray-200 font-sans">Synthesize Enemy</div>
                  <div className="text-xs text-gray-500 mt-1 font-sans">Deploy new alien threat catalog</div>
                </button>
                <button 
                  onClick={() => navigate('/weapons')}
                  className="p-4 bg-[#0F0F23]/60 hover:bg-[#27273B]/40 rounded-xl text-left transition-all border border-[#4C1D95]/30 hover:border-[#7C3AED]/40 cursor-pointer group active:scale-98"
                >
                  <Swords className="text-[#a78bfa] mb-2 transition-transform group-hover:scale-110" />
                  <div className="font-semibold text-gray-200 font-sans">Provision Armory</div>
                  <div className="text-xs text-gray-500 mt-1 font-sans">Modify weapon stats & recoil properties</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl border border-[#4C1D95]/40 flex flex-col justify-center flex-1">
              <h3 className="text-lg font-bold text-white mb-2 font-mono">Read-Only Mode Active</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-sans">
                Station dashboard is set to **Telemetry Viewer**. You can inspect alien structures, armory parameters, and nanite profiles, but server updates are locked to Space Commanders (Admins).
              </p>
            </div>
          )}

          {/* Telemetry Core Performance Meters */}
          <div className="glass-panel p-6 rounded-2xl border border-[#4C1D95]/40 space-y-4">
            <h3 className="text-lg font-bold text-[#E2E8F0] font-mono flex items-center gap-2">
              <Activity size={18} className="text-[#7C3AED]" /> Core Telemetry
            </h3>
            <div className="space-y-3">
              {/* Meter 1: DB Fuel Core Load */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">Database Core Load</span>
                  <span className="text-[#A78BFA]">{dbLoad}%</span>
                </div>
                <div className="w-full bg-[#0F0F23] h-2 rounded-full overflow-hidden border border-[#4C1D95]/30">
                  <div className="bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] h-full transition-all duration-1000" style={{ width: `${dbLoad}%` }}></div>
                </div>
              </div>
              {/* Meter 2: Sub-light Latency */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">Comms Network Latency</span>
                  <span className="text-emerald-400">{latency} ms</span>
                </div>
                <div className="w-full bg-[#0F0F23] h-2 rounded-full overflow-hidden border border-[#4C1D95]/30">
                  <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${(latency / 50) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hàng bên phải: Live Hangar Logs (Terminal console) */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-2xl border border-[#4C1D95]/40 shadow-2xl flex flex-col h-[400px]">
            {/* Terminal Header */}
            <div className="px-5 py-3 border-b border-[#4C1D95]/40 bg-[#161633]/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={16} className="text-[#F43F5E]" />
                <span className="text-xs font-mono font-bold text-[#E2E8F0] tracking-wide">LIVE HANGAR LOGS - CO-OP CHANNEL</span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60"></span>
              </div>
            </div>
            {/* Terminal Log Output (CRT styled) */}
            <div className="flex-1 p-5 overflow-auto font-mono text-xs text-emerald-400 crt-screen crt-scanline space-y-2 select-text">
              {logs.map((log, i) => (
                <div key={i} className="leading-relaxed hover:bg-emerald-500/10 px-2 py-0.5 rounded transition-colors">
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
