import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Target, Swords, Settings, Zap, ArrowUpRight } from 'lucide-react';

const StatCard = ({ title, value, icon, color }: { title: string, value: number | string, icon: React.ReactNode, color: string }) => (
  <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800/50 shadow-lg relative overflow-hidden group hover:border-gray-700 transition-colors duration-300">
    <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500`} style={{ backgroundColor: color }}></div>
    
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-4xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl`} style={{ backgroundColor: `${color}20`, color: color }}>
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
  const [stats, setStats] = useState({
    enemies: 0,
    weapons: 0,
    levels: 0,
    buffs: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [enemies, weapons, levels, buffs] = await Promise.all([
          axiosClient.get('/enemies'),
          axiosClient.get('/weapons'),
          axiosClient.get('/levels'),
          axiosClient.get('/buffs'),
        ]);
        
        setStats({
          enemies: enemies.length || 0,
          weapons: weapons.length || 0,
          levels: levels.length || 0,
          buffs: buffs.length || 0,
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
        <p className="text-gray-400">Welcome to the Rogue-Kie Control Center. Monitor and adjust game configurations here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Enemies" value={stats.enemies} icon={<Target size={24} />} color="#ef4444" />
        <StatCard title="Weapons Configured" value={stats.weapons} icon={<Swords size={24} />} color="#3b82f6" />
        <StatCard title="Levels Defined" value={stats.levels} icon={<Settings size={24} />} color="#8b5cf6" />
        <StatCard title="Active Buffs" value={stats.buffs} icon={<Zap size={24} />} color="#eab308" />
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800/50 shadow-lg">
           <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
           <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl text-left transition-colors border border-gray-700/50">
                <Target className="text-red-400 mb-2" />
                <div className="font-medium text-gray-200">New Enemy</div>
                <div className="text-xs text-gray-500 mt-1">Add a new enemy type</div>
              </button>
              <button className="p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl text-left transition-colors border border-gray-700/50">
                <Swords className="text-blue-400 mb-2" />
                <div className="font-medium text-gray-200">New Weapon</div>
                <div className="text-xs text-gray-500 mt-1">Configure gun stats</div>
              </button>
           </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-6 rounded-2xl border border-blue-800/30 shadow-lg flex flex-col justify-center items-center text-center">
           <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
              <Zap className="text-blue-400" size={32} />
           </div>
           <h3 className="text-xl font-bold text-white mb-2">System Status: Online</h3>
           <p className="text-blue-200/70 text-sm max-w-sm">
             The Web Admin panel is directly connected to the Backend Database. Changes made here will reflect in-game instantly via Sync API.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
