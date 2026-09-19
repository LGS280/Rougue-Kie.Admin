import { useEffect, useState } from 'react';
import { TrendingUp, Users, DollarSign, Wallet, ShieldCheck, ShieldAlert, RefreshCw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

interface TransactionItem {
  transactionId: number;
  orderCode: number;
  userId: number;
  username: string;
  shopItemId?: number;
  itemName: string;
  transactionType: string;
  amount: number;
  currencyType: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  paidAt?: string;
}

interface PaymentAnalytics {
  totalRevenueVND: number;
  totalTransactions: number;
  successfulTransactions: number;
  pendingTransactions: number;
  cancelledTransactions: number;
  totalGemsInEconomy: number;
  totalCoinsInEconomy: number;
  dailyRevenue: { date: string; dayLabel: string; revenue: number; transactionCount: number }[];
  weeklyRevenue: { weekLabel: string; revenue: number; gemVolume: number }[];
}

interface PlayerAnalytics {
  totalRegisteredUsers: number;
  totalRunsPlayed: number;
  onlineCCU: number;
  activeRooms: number;
  dailyActivity: { dayName: string; date: string; totalRuns: number; survivedRuns: number; defeatRuns: number; uniquePlayers: number }[];
}

const Analytics = () => {
  const { isAuthenticated, role } = useAuth();
  const isWritable = isAuthenticated && (role === 'Admin' || role === 'Developer');

  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [paymentData, setPaymentData] = useState<PaymentAnalytics | null>(null);
  const [playerData, setPlayerData] = useState<PlayerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [txsRes, payRes, playRes] = await Promise.all([
        axiosClient.get('/admin/transactions?limit=50').catch(() => []),
        axiosClient.get('/admin/analytics/payment').catch(() => null),
        axiosClient.get('/admin/analytics/players').catch(() => null),
      ]);

      setTransactions((txsRes as any) || []);
      setPaymentData(payRes as any);
      setPlayerData(playRes as any);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu phân tích hệ thống:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isWritable) {
      fetchAnalyticsData();
    }
  }, [isWritable]);

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

  // Tính toán biểu đồ đường cong số lượt chơi theo ngày (SVG Plot)
  const dailyActivity = playerData?.dailyActivity || [];
  const maxRuns = Math.max(...dailyActivity.map(d => d.totalRuns), 4);
  const points = dailyActivity.map((d, index) => {
    const x = 50 + index * 70;
    const y = 170 - (d.totalRuns / maxRuns) * 130;
    return { x, y, day: d.dayName, runs: d.totalRuns };
  });

  const linePath = points.length > 0
    ? points.reduce((acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '')
    : "M 50 140 L 470 140";
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} 180 L ${points[0].x} 180 Z`
    : "M 50 140 L 470 140 L 470 180 L 50 180 Z";

  // Tính toán biểu đồ cột doanh thu các tuần (SVG Bar Chart)
  const weeklyRevenue = paymentData?.weeklyRevenue || [];
  const maxWeeklyRev = Math.max(...weeklyRevenue.map(w => w.revenue), 50000);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-[#4C1D95]/20">
        <div>
          <h1 className="text-3xl font-bold text-[#E2E8F0] mb-1 font-mono tracking-wide">Galactic Analytics & Revenue</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Real-time player telemetry, PayOS VietQR payments, and economy metrics.</p>
        </div>
        <button
          onClick={fetchAnalyticsData}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-[#161633] hover:bg-[#27273B] border border-[#4C1D95]/40 rounded-xl text-xs font-mono text-gray-300 transition-all cursor-pointer"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin text-[#A78BFA]' : ''} />
          <span>{lastRefreshed ? `Sync: ${lastRefreshed}` : 'Refresh'}</span>
        </button>
      </div>

      {/* Grid thẻ KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Doanh thu thực tế */}
        <div className="glass-panel p-5 rounded-2xl border border-[#4C1D95]/30 relative overflow-hidden group">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase">PayOS VietQR Revenue</p>
              <h3 className="text-2xl font-bold text-white font-mono mt-1">
                {(paymentData?.totalRevenueVND || 0).toLocaleString('vi-VN')} ₫
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-[11px] text-emerald-400 mt-3 font-mono flex items-center gap-1">
            <TrendingUp size={12} /> {paymentData?.successfulTransactions || 0} Giao dịch thành công
          </p>
        </div>

        {/* KPI 2: Người chơi thực tế */}
        <div className="glass-panel p-5 rounded-2xl border border-[#4C1D95]/30 relative overflow-hidden group">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase">Active Pilots (CCU)</p>
              <h3 className="text-2xl font-bold text-white font-mono mt-1">
                {playerData?.onlineCCU || 0}
              </h3>
            </div>
            <div className="p-3 bg-[#7C3AED]/10 text-[#A78BFA] rounded-xl">
              <Users size={20} />
            </div>
          </div>
          <p className="text-[11px] text-[#A78BFA] mt-3 font-mono flex items-center gap-1">
            <Users size={12} /> {playerData?.totalRegisteredUsers || 0} Phi hành gia đã đăng ký
          </p>
        </div>

        {/* KPI 3: Lượng Gem lưu thông */}
        <div className="glass-panel p-5 rounded-2xl border border-[#4C1D95]/30 relative overflow-hidden group">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase">Gem Circulation</p>
              <h3 className="text-2xl font-bold text-white font-mono mt-1">
                {(paymentData?.totalGemsInEconomy || 0).toLocaleString('vi-VN')}
              </h3>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
              <Wallet size={20} />
            </div>
          </div>
          <p className="text-[11px] text-gray-500 mt-3 font-mono">
            {paymentData?.totalCoinsInEconomy ? `${paymentData.totalCoinsInEconomy.toLocaleString('vi-VN')} Coins` : 'In-game store reserves'}
          </p>
        </div>

        {/* KPI 4: Gateway & SignalR Status */}
        <div className="glass-panel p-5 rounded-2xl border border-[#4C1D95]/30 relative overflow-hidden group">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase">SignalR Hub Nodes</p>
              <h3 className="text-2xl font-bold text-white font-mono mt-1">
                {playerData?.activeRooms || 0} Active
              </h3>
            </div>
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
              <ShieldCheck size={20} />
            </div>
          </div>
          <p className="text-[11px] text-cyan-400 mt-3 font-mono flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 20Hz Tickrate Online
          </p>
        </div>
      </div>

      {/* Grid Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Biểu đồ Active Players (SVG Line Chart) - 6 cols */}
        <div className="lg:col-span-6">
          <div className="glass-panel p-5 rounded-2xl border border-[#4C1D95]/40 flex flex-col h-[350px]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-gray-300 font-mono flex items-center gap-2">
                <Users size={16} className="text-[#7C3AED]" /> Daily Expeditions Telemetry (7 Days)
              </h3>
              <span className="text-[11px] font-mono text-[#A78BFA]">
                Total: {playerData?.totalRunsPlayed || 0} Runs
              </span>
            </div>
            
            {/* SVG Plot */}
            <div className="flex-1 w-full bg-[#0F0F23]/60 rounded-xl border border-[#4C1D95]/20 p-2 relative">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="40" y1="30" x2="480" y2="30" stroke="#4C1D95" strokeOpacity="0.1" strokeDasharray="3" />
                <line x1="40" y1="80" x2="480" y2="80" stroke="#4C1D95" strokeOpacity="0.1" strokeDasharray="3" />
                <line x1="40" y1="130" x2="480" y2="130" stroke="#4C1D95" strokeOpacity="0.1" strokeDasharray="3" />
                <line x1="40" y1="175" x2="480" y2="175" stroke="#4C1D95" strokeOpacity="0.25" />

                {/* Fill Area */}
                <path d={areaPath} fill="url(#area-grad)" />

                {/* Glowing Line */}
                <path d={linePath} fill="none" stroke="#7C3AED" strokeWidth="3" filter="url(#glow)" strokeLinecap="round" />

                {/* Dynamic Data Points */}
                {points.map((pt, idx) => (
                  <g key={idx}>
                    <circle cx={pt.x} cy={pt.y} r="4" fill="#F43F5E" className="transition-transform hover:scale-150" />
                    <text x={pt.x} y={pt.y - 8} fill="#E2E8F0" fontSize="9" textAnchor="middle" fontFamily="monospace">
                      {pt.runs}
                    </text>
                    <text x={pt.x} y="192" fill="#9CA3AF" fontSize="10" textAnchor="middle" fontFamily="monospace">
                      {pt.day}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Biểu đồ Weekly Revenue (SVG Bar Chart) - 6 cols */}
        <div className="lg:col-span-6">
          <div className="glass-panel p-5 rounded-2xl border border-[#4C1D95]/40 flex flex-col h-[350px]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-gray-300 font-mono flex items-center gap-2">
                <DollarSign size={16} className="text-[#F43F5E]" /> PayOS Weekly Revenue (VND)
              </h3>
              <span className="text-[11px] font-mono text-emerald-400">
                {(paymentData?.totalRevenueVND || 0).toLocaleString('vi-VN')} ₫
              </span>
            </div>
            
            {/* SVG Plot */}
            <div className="flex-1 w-full bg-[#0F0F23]/60 rounded-xl border border-[#4C1D95]/20 p-2">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="40" y1="30" x2="480" y2="30" stroke="#4C1D95" strokeOpacity="0.1" />
                <line x1="40" y1="80" x2="480" y2="80" stroke="#4C1D95" strokeOpacity="0.1" />
                <line x1="40" y1="130" x2="480" y2="130" stroke="#4C1D95" strokeOpacity="0.1" />
                <line x1="40" y1="175" x2="480" y2="175" stroke="#4C1D95" strokeOpacity="0.25" />

                {/* Bars */}
                {weeklyRevenue.map((w, idx) => {
                  const x = 70 + idx * 80;
                  const barHeight = Math.max(8, (w.revenue / maxWeeklyRev) * 135);
                  const y = 175 - barHeight;
                  return (
                    <g key={idx}>
                      <rect 
                        x={x} 
                        y={y} 
                        width="35" 
                        height={barHeight} 
                        rx="4" 
                        fill="url(#bar-grad)" 
                        className="hover:opacity-85 transition-opacity" 
                      />
                      <text x={x + 17.5} y={y - 6} fill="#10B981" fontSize="9" textAnchor="middle" fontFamily="monospace">
                        {w.revenue > 0 ? (w.revenue >= 1000 ? `${Math.round(w.revenue / 1000)}k` : w.revenue) : '0'}
                      </text>
                      <text x={x + 17.5} y="192" fill="#9CA3AF" fontSize="9" textAnchor="middle" fontFamily="monospace">
                        {w.weekLabel}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            {/* Chart Legend */}
            <div className="flex gap-4 justify-center mt-2.5 text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                <span className="text-gray-400">VietQR Real Cashflow</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bảng Giao dịch thực tế từ Database */}
      <div className="glass-panel p-5 rounded-2xl border border-[#4C1D95]/40 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-gray-200 font-mono tracking-wide">Live Space Transactions (PayOS VietQR)</h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">Dữ liệu đơn hàng thực tế từ bảng Transactions trong Database.</p>
          </div>
          <span className="text-xs font-mono text-gray-400">Total: {transactions.length} records</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#4C1D95]/20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#161633]/80 border-b border-[#4C1D95]/30">
                <th className="px-5 py-3 text-xs font-semibold text-[#A78BFA] uppercase tracking-wider font-mono">Order Code</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#A78BFA] uppercase tracking-wider font-mono">Pilot Username</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#A78BFA] uppercase tracking-wider font-mono">Package / Item</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#A78BFA] uppercase tracking-wider font-mono">Amount</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#A78BFA] uppercase tracking-wider font-mono">Payment Gateway</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#A78BFA] uppercase tracking-wider font-mono">Timestamp</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#A78BFA] uppercase tracking-wider font-mono text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4C1D95]/10">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400 font-mono text-xs">
                    Chưa có giao dịch nạp tiền nào được ghi nhận trong cơ sở dữ liệu.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isPaid = tx.status === 'PAID' || tx.status === 'SUCCESS';
                  const isPending = tx.status === 'PENDING';
                  return (
                    <tr key={tx.transactionId} className="hover:bg-[#27273B]/20 transition-all font-mono text-xs">
                      <td className="px-5 py-3.5 text-[#A78BFA] font-bold">#{tx.orderCode}</td>
                      <td className="px-5 py-3.5 text-gray-200 font-sans font-semibold">{tx.username}</td>
                      <td className="px-5 py-3.5 text-gray-300">{tx.itemName || 'Custom Item'}</td>
                      <td className="px-5 py-3.5 text-emerald-400 font-bold">
                        {tx.amount.toLocaleString('vi-VN')} {tx.currencyType || 'VND'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-400">{tx.paymentMethod || 'PayOS VietQR'}</td>
                      <td className="px-5 py-3.5 text-gray-500">
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleString('vi-VN') : '-'}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-bold border border-emerald-500/25">
                            <CheckCircle2 size={11} /> PAID
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-lg text-[10px] font-bold border border-amber-500/25">
                            <Clock size={11} /> PENDING
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-500/10 text-rose-400 rounded-lg text-[10px] font-bold border border-rose-500/25">
                            <AlertCircle size={11} /> {tx.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Analytics;
