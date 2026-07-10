import { TrendingUp, Users, DollarSign, Wallet, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MOCK_TRANSACTIONS = [
  { id: 'TX-9021', user: 'Rookie-09', type: 'Stripe Purchase', amount: '$9.99', asset: '1,000 Ruby', time: '10 mins ago', status: 'SUCCESS' },
  { id: 'TX-9022', user: 'Vanguard-2', type: 'Gold Conversion', amount: '2,500 Gold', asset: '250 Gems', time: '1 hr ago', status: 'SUCCESS' },
  { id: 'TX-9023', user: 'Specter-4', type: 'Stripe Purchase', amount: '$4.99', asset: '500 Ruby', time: '3 hrs ago', status: 'SUCCESS' },
  { id: 'TX-9024', user: 'Rookie-14', type: 'Gold Conversion', amount: '5,000 Gold', asset: '500 Gems', time: '6 hrs ago', status: 'SUCCESS' },
  { id: 'TX-9025', user: 'Commander-X', type: 'Stripe Purchase', amount: '$19.99', asset: '2,200 Ruby', time: '1 day ago', status: 'SUCCESS' }
];

const Analytics = () => {
  const { isAuthenticated, role } = useAuth();
  const isWritable = isAuthenticated && (role === 'Admin' || role === 'Developer');

  if (!isWritable) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-300 space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#F43F5E]/10 border border-[#F43F5E]/40 flex items-center justify-center text-[#F43F5E] shadow-lg shadow-[#F43F5E]/10 animate-pulse">
          <ShieldAlert size={32} />
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h2 className="text-xl font-bold text-[#F43F5E] font-mono tracking-wide">ACCESS DENIED</h2>
          <p className="text-xs text-gray-400 font-sans leading-relaxed">
            Your current security credentials do not grant you clearance to view orbital telemetry or revenue charts. Please contact the Station Commander (Admin) to request higher clearance.
          </p>
        </div>
      </div>
    );
  }

  // SVG Chart 1 Points: Active Players (Mon - Sun)
  // X: 50, 120, 190, 260, 330, 400, 470
  // Y: 150 (Mon: 120), (Tue: 90), (Wed: 130), (Thu: 60), (Fri: 40), (Sat: 20), (Sun: 30)
  const linePath = "M 50 140 Q 120 80 190 120 T 260 70 T 330 50 T 400 25 T 470 35";
  const areaPath = `${linePath} L 470 180 L 50 180 Z`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      {/* Title Header */}
      <div className="flex justify-between items-center pb-2 border-b border-[#4C1D95]/20">
        <div>
          <h1 className="text-3xl font-bold text-[#E2E8F0] mb-2 font-mono tracking-wide">Galactic Analytics & Revenue</h1>
          <p className="text-gray-400 text-sm">Real-time player telemetry, gem conversion yields, and transaction monitoring.</p>
        </div>
      </div>

      {/* Grid thẻ KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-[#4C1D95]/30 relative overflow-hidden group">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase">Orbital Revenue</p>
              <h3 className="text-2xl font-bold text-white font-mono mt-1">$1,248.50</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-[10px] text-emerald-400 mt-4 font-mono flex items-center gap-1">
            <TrendingUp size={12} /> +12.4% vs last week
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[#4C1D95]/30 relative overflow-hidden group">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase">Active Spacecrafts</p>
              <h3 className="text-2xl font-bold text-white font-mono mt-1">428</h3>
            </div>
            <div className="p-3 bg-[#7C3AED]/10 text-[#A78BFA] rounded-xl">
              <Users size={20} />
            </div>
          </div>
          <p className="text-[10px] text-[#A78BFA] mt-4 font-mono flex items-center gap-1">
            <TrendingUp size={12} /> +8.1% active sessions
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[#4C1D95]/30 relative overflow-hidden group">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase">Ruby Circulation</p>
              <h3 className="text-2xl font-bold text-white font-mono mt-1">154.2K</h3>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
              <Wallet size={20} />
            </div>
          </div>
          <p className="text-[10px] text-gray-500 mt-4 font-mono">Store credit reserves</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-[#4C1D95]/30 relative overflow-hidden group">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase">Gateway Uptime</p>
              <h3 className="text-2xl font-bold text-white font-mono mt-1">99.98%</h3>
            </div>
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
              <ShieldCheck size={20} />
            </div>
          </div>
          <p className="text-[10px] text-cyan-400 mt-4 font-mono">Secure SignalR Nodes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Biểu đồ Active Players (SVG Line Chart) - 6 cols */}
        <div className="lg:col-span-6">
          <div className="glass-panel p-6 rounded-2xl border border-[#4C1D95]/40 flex flex-col h-[350px]">
            <h3 className="text-sm font-bold text-gray-300 font-mono mb-4 flex items-center gap-2">
              <Users size={16} className="text-[#7C3AED]" /> Active Players Telemetry (Daily)
            </h3>
            
            {/* SVG Plot */}
            <div className="flex-1 w-full bg-[#0F0F23]/60 rounded-xl border border-[#4C1D95]/20 p-2 relative">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  {/* Neon Glow Filter */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  {/* Area Gradient */}
                  <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="50" y1="20" x2="470" y2="20" stroke="#4C1D95" strokeOpacity="0.1" strokeDasharray="3" />
                <line x1="50" y1="60" x2="470" y2="60" stroke="#4C1D95" strokeOpacity="0.1" strokeDasharray="3" />
                <line x1="50" y1="100" x2="470" y2="100" stroke="#4C1D95" strokeOpacity="0.1" strokeDasharray="3" />
                <line x1="50" y1="140" x2="470" y2="140" stroke="#4C1D95" strokeOpacity="0.1" strokeDasharray="3" />
                <line x1="50" y1="180" x2="470" y2="180" stroke="#4C1D95" strokeOpacity="0.2" />

                {/* Fill Area */}
                <path d={areaPath} fill="url(#area-grad)" />

                {/* Glowing Line */}
                <path d={linePath} fill="none" stroke="#7C3AED" strokeWidth="3.5" filter="url(#glow)" strokeLinecap="round" />

                {/* Dots on peak values */}
                <circle cx="50" cy="140" r="4" fill="#F43F5E" />
                <circle cx="120" cy="80" r="4" fill="#F43F5E" />
                <circle cx="190" cy="120" r="4" fill="#F43F5E" />
                <circle cx="260" cy="70" r="4" fill="#F43F5E" />
                <circle cx="330" cy="50" r="4" fill="#F43F5E" />
                <circle cx="400" cy="25" r="4" fill="#F43F5E" className="animate-ping" />
                <circle cx="400" cy="25" r="4.5" fill="#F43F5E" />
                <circle cx="470" cy="35" r="4" fill="#F43F5E" />

                {/* X Axis Labels */}
                <text x="50" y="196" fill="#6B7280" fontSize="10" textAnchor="middle" fontFamily="monospace">Mon</text>
                <text x="120" y="196" fill="#6B7280" fontSize="10" textAnchor="middle" fontFamily="monospace">Tue</text>
                <text x="190" y="196" fill="#6B7280" fontSize="10" textAnchor="middle" fontFamily="monospace">Wed</text>
                <text x="260" y="196" fill="#6B7280" fontSize="10" textAnchor="middle" fontFamily="monospace">Thu</text>
                <text x="330" y="196" fill="#6B7280" fontSize="10" textAnchor="middle" fontFamily="monospace">Fri</text>
                <text x="400" y="196" fill="#A78BFA" fontSize="10" textAnchor="middle" fontFamily="monospace">Sat</text>
                <text x="470" y="196" fill="#A78BFA" fontSize="10" textAnchor="middle" fontFamily="monospace">Sun</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Biểu đồ Ruby/Gem Sales (SVG Bar Chart) - 6 cols */}
        <div className="lg:col-span-6">
          <div className="glass-panel p-6 rounded-2xl border border-[#4C1D95]/40 flex flex-col h-[350px]">
            <h3 className="text-sm font-bold text-gray-300 font-mono mb-4 flex items-center gap-2">
              <DollarSign size={16} className="text-[#F43F5E]" /> Gem/Ruby Weekly Revenue
            </h3>
            
            {/* SVG Plot */}
            <div className="flex-1 w-full bg-[#0F0F23]/60 rounded-xl border border-[#4C1D95]/20 p-2">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  {/* Bar Gradients */}
                  <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F43F5E" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                  <linearGradient id="bar-grad-2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="40" y1="20" x2="470" y2="20" stroke="#4C1D95" strokeOpacity="0.1" />
                <line x1="40" y1="60" x2="470" y2="60" stroke="#4C1D95" strokeOpacity="0.1" />
                <line x1="40" y1="100" x2="470" y2="100" stroke="#4C1D95" strokeOpacity="0.1" />
                <line x1="40" y1="140" x2="470" y2="140" stroke="#4C1D95" strokeOpacity="0.1" />
                <line x1="40" y1="170" x2="470" y2="170" stroke="#4C1D95" strokeOpacity="0.2" />

                {/* Bar 1 (Week 1) */}
                <rect x="70" y="80" width="22" height="90" rx="4" fill="url(#bar-grad)" className="hover:opacity-85 transition-opacity" />
                <rect x="96" y="110" width="22" height="60" rx="4" fill="url(#bar-grad-2)" className="hover:opacity-85 transition-opacity" />

                {/* Bar 2 (Week 2) */}
                <rect x="150" y="50" width="22" height="120" rx="4" fill="url(#bar-grad)" />
                <rect x="176" y="80" width="22" height="90" rx="4" fill="url(#bar-grad-2)" />

                {/* Bar 3 (Week 3) */}
                <rect x="230" y="30" width="22" height="140" rx="4" fill="url(#bar-grad)" />
                <rect x="256" y="60" width="22" height="110" rx="4" fill="url(#bar-grad-2)" />

                {/* Bar 4 (Week 4) */}
                <rect x="310" y="20" width="22" height="150" rx="4" fill="url(#bar-grad)" />
                <rect x="336" y="40" width="22" height="130" rx="4" fill="url(#bar-grad-2)" />

                {/* Bar 5 (Week 5 - Current) */}
                <rect x="390" y="10" width="22" height="160" rx="4" fill="url(#bar-grad)" />
                <rect x="416" y="30" width="22" height="140" rx="4" fill="url(#bar-grad-2)" />

                {/* Axis Labels */}
                <text x="94" y="188" fill="#6B7280" fontSize="9" textAnchor="middle" fontFamily="monospace">Wk 24</text>
                <text x="174" y="188" fill="#6B7280" fontSize="9" textAnchor="middle" fontFamily="monospace">Wk 25</text>
                <text x="254" y="188" fill="#6B7280" fontSize="9" textAnchor="middle" fontFamily="monospace">Wk 26</text>
                <text x="334" y="188" fill="#6B7280" fontSize="9" textAnchor="middle" fontFamily="monospace">Wk 27</text>
                <text x="414" y="188" fill="#E2E8F0" fontSize="9" textAnchor="middle" fontFamily="monospace">Wk 28 (CUR)</text>
              </svg>
            </div>
            
            {/* Chart Legend */}
            <div className="flex gap-4 justify-center mt-3 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-rose-500"></span>
                <span className="text-gray-400">Ruby (Cash Flow)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-cyan-400"></span>
                <span className="text-gray-400">Gems (Game Economy)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bảng Giao dịch gần nhất */}
      <div className="glass-panel p-6 rounded-2xl border border-[#4C1D95]/40 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-gray-200 font-mono tracking-wide">Latest Space Transactions</h3>
        <div className="overflow-x-auto rounded-xl border border-[#4C1D95]/20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#161633]/60 border-b border-[#4C1D95]/30">
                <th className="px-6 py-4 text-xs font-semibold text-[#A78BFA] uppercase tracking-wider font-mono">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#A78BFA] uppercase tracking-wider font-mono">Player callsign</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#A78BFA] uppercase tracking-wider font-mono">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#A78BFA] uppercase tracking-wider font-mono">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#A78BFA] uppercase tracking-wider font-mono">Asset Granted</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#A78BFA] uppercase tracking-wider font-mono">Timestamp</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#A78BFA] uppercase tracking-wider font-mono text-right">Gateway status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4C1D95]/10">
              {MOCK_TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#27273B]/20 transition-all font-mono text-xs">
                  <td className="px-6 py-4 text-gray-400 font-bold">{tx.id}</td>
                  <td className="px-6 py-4 text-gray-200 font-sans font-semibold">{tx.user}</td>
                  <td className="px-6 py-4 text-gray-400">{tx.type}</td>
                  <td className="px-6 py-4 text-emerald-400 font-bold">{tx.amount}</td>
                  <td className="px-6 py-4 text-rose-400 font-bold">{tx.asset}</td>
                  <td className="px-6 py-4 text-gray-500">{tx.time}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-bold border border-emerald-500/25">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Analytics;
