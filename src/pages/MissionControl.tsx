import { useState, useEffect, useRef } from 'react';
import { Radio, Shield, Play, Square, Activity, AlertCircle, Compass } from 'lucide-react';

interface SectorInfo {
  id: string;
  name: string;
  danger: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  temperature: string;
  radiation: string;
  boss: string;
  mobs: string;
}

// 25 Sector definitions for the Grid
const SECTOR_DATABASE: Record<string, SectorInfo> = {
  'A1': { id: 'SEC-A1', name: 'Alpha Hangar Gate', danger: 'LOW', temperature: '22°C', radiation: '0.02 Rad', boss: 'None', mobs: 'Space Slime, Drone' },
  'A2': { id: 'SEC-A2', name: 'Asteroid Outer Ring', danger: 'MEDIUM', temperature: '-120°C', radiation: '1.4 Rad', boss: 'None', mobs: 'Rock Bug, Space Slime' },
  'A3': { id: 'SEC-A3', name: 'Cryo-Storage Deck', danger: 'MEDIUM', temperature: '-180°C', radiation: '0.1 Rad', boss: 'None', mobs: 'Frost Wasp, Drone' },
  'A4': { id: 'SEC-A4', name: 'Deep Nebula Void', danger: 'HIGH', temperature: '-270°C', radiation: '3.8 Rad', boss: 'Nebula Wraith', mobs: 'Nebula Parasite, Void Slime' },
  'A5': { id: 'SEC-A5', name: 'Black Hole Event Horizon', danger: 'EXTREME', temperature: '500°C', radiation: '12.4 Rad', boss: 'Singularity Lord', mobs: 'Gravity Anomaly' },
  'B1': { id: 'SEC-B1', name: 'Hydroponics Lab Ruins', danger: 'LOW', temperature: '25°C', radiation: '0.05 Rad', boss: 'None', mobs: 'Mutant Spore, Toxic Bee' },
  'B2': { id: 'SEC-B2', name: 'Bio-Dome Core', danger: 'MEDIUM', temperature: '28°C', radiation: '0.2 Rad', boss: 'None', mobs: 'Acid Spitter, Mutant Spore' },
  'B3': { id: 'SEC-B3', name: 'Alien Hive Outpost', danger: 'HIGH', temperature: '35°C', radiation: '2.1 Rad', boss: 'Hive Queen', mobs: 'Hive Swarm, Acid Spitter' },
  'B4': { id: 'SEC-B4', name: 'Overgrown Forest Sector', danger: 'HIGH', temperature: '20°C', radiation: '0.8 Rad', boss: 'Goliath Root', mobs: 'Spore Bomber, Razor Beetle' },
  'B5': { id: 'SEC-B5', name: 'Toxic Swamp Basin', danger: 'EXTREME', temperature: '42°C', radiation: '5.2 Rad', boss: 'Plague Bringer', mobs: 'Acid Horror, Toxic Leech' },
  'C1': { id: 'SEC-C1', name: 'Orbital Bridge', danger: 'LOW', temperature: '18°C', radiation: '0.01 Rad', boss: 'None', mobs: 'Security Drone' },
  'C2': { id: 'SEC-C2', name: 'Solar Panels Deck', danger: 'MEDIUM', temperature: '80°C', radiation: '2.5 Rad', boss: 'None', mobs: 'Solar Wasp, Drone' },
  'C3': { id: 'SEC-C3', name: 'Command Deck Reactor', danger: 'HIGH', temperature: '45°C', radiation: '4.1 Rad', boss: 'Reactor Guardian', mobs: 'Plasma Spark, Shock Drone' },
  'C4': { id: 'SEC-C4', name: 'Main Power Grid Conduit', danger: 'HIGH', temperature: '55°C', radiation: '3.6 Rad', boss: 'Volt Overlord', mobs: 'Spark Bug, Plasma Drone' },
  'C5': { id: 'SEC-C5', name: 'Hyperdrive Core Hangar', danger: 'EXTREME', temperature: '150°C', radiation: '9.8 Rad', boss: 'Warp Beast', mobs: 'Core Anomaly, Phase Stalker' },
  'D1': { id: 'SEC-D1', name: 'Crew Quarters Beta', danger: 'LOW', temperature: '21°C', radiation: '0.02 Rad', boss: 'None', mobs: 'Infected Crew' },
  'D2': { id: 'SEC-D2', name: 'Medical Hangar Sector', danger: 'MEDIUM', temperature: '20°C', radiation: '0.08 Rad', boss: 'None', mobs: 'Nanite Swarm, Infected Crew' },
  'D3': { id: 'SEC-D3', name: 'Abandoned Hangar-09', danger: 'HIGH', temperature: '10°C', radiation: '1.2 Rad', boss: 'Rust Behemoth', mobs: 'Scrap Scavenger, Junk Mech' },
  'D4': { id: 'SEC-D4', name: 'Weapon Testing Armory', danger: 'HIGH', temperature: '30°C', radiation: '2.9 Rad', boss: 'Automated Mech', mobs: 'Laser Turret, Mine Drone' },
  'D5': { id: 'SEC-D5', name: 'Heavy Artillery Battery', danger: 'EXTREME', temperature: '90°C', radiation: '6.4 Rad', boss: 'Defense Prime', mobs: 'Artillery Mech, Heavy Turret' },
  'E1': { id: 'SEC-E1', name: 'Waste Disposal Shaft', danger: 'LOW', temperature: '15°C', radiation: '0.6 Rad', boss: 'None', mobs: 'Scrap Slime' },
  'E2': { id: 'SEC-E2', name: 'Station External Hull', danger: 'MEDIUM', temperature: '-100°C', radiation: '2.8 Rad', boss: 'None', mobs: 'Void Beetle' },
  'E3': { id: 'SEC-E3', name: 'Comms Dish Platform', danger: 'HIGH', temperature: '-50°C', radiation: '1.5 Rad', boss: 'Signal Jammer', mobs: 'Frequency Wasp, Frequency Drone' },
  'E4': { id: 'SEC-E4', name: 'Quantum Sensor Array', danger: 'HIGH', temperature: '-20°C', radiation: '3.1 Rad', boss: 'Dimension Weaver', mobs: 'Phase Glitch' },
  'E5': { id: 'SEC-E5', name: 'Dark Energy Singularity', danger: 'EXTREME', temperature: '300°C', radiation: '15.0 Rad', boss: 'Rookie Nemesis', mobs: 'Void Golem, Singularity Bug' }
};

interface RadarTarget {
  id: string;
  name: string;
  x: number;
  y: number;
  distance: string;
  danger: 'LOW' | 'MEDIUM' | 'HIGH';
}

const MissionControl = () => {
  const [selectedCoord, setSelectedCoord] = useState<string>('B4');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [simStats, setSimStats] = useState({
    wave: 1,
    hp: 100,
    shield: 100,
    kills: 0,
    gems: 0,
  });

  const simIntervalRef = useRef<any>(null);
  const simLogsEndRef = useRef<HTMLDivElement>(null);

  // Radar Targets
  const [radarTargets, setRadarTargets] = useState<RadarTarget[]>([
    { id: 'TGT-01', name: 'Hive Wasp Swarm', x: 120, y: 80, distance: '4.2 km', danger: 'MEDIUM' },
    { id: 'TGT-02', name: 'Acid Spitter Elite', x: 220, y: 190, distance: '8.7 km', danger: 'HIGH' },
    { id: 'TGT-03', name: 'Scrap Scavenger Mech', x: 70, y: 240, distance: '2.5 km', danger: 'LOW' }
  ]);

  // Simulate radar target movement
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarTargets(prev => prev.map(tgt => {
        // Randomly drift coordinates slightly
        const dx = Math.floor(Math.random() * 5) - 2;
        const dy = Math.floor(Math.random() * 5) - 2;
        const newX = Math.max(30, Math.min(270, tgt.x + dx));
        const newY = Math.max(30, Math.min(270, tgt.y + dy));
        const dist = Math.sqrt(Math.pow(newX - 150, 2) + Math.pow(newY - 150, 2)) * 0.05;
        return {
          ...tgt,
          x: newX,
          y: newY,
          distance: `${dist.toFixed(1)} km`
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulate mission events
  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationLogs(["[SIM] Orbital Drop Pod Lock established.", "[SIM] Launching drop pod from Hangar..."]);
    setSimStats({
      wave: 1,
      hp: 100,
      shield: 100,
      kills: 0,
      gems: 0,
    });

    const activeSector = SECTOR_DATABASE[selectedCoord];
    let currentWave = 1;
    let currentHp = 100;
    let currentShield = 100;
    let currentKills = 0;
    let currentGems = 0;
    let steps = 0;

    const simSteps = [
      () => `[SIM] Drop pod landed in sector ${activeSector.id} (${activeSector.name}).`,
      () => `[SIM] Atmospheric scan: Temp: ${activeSector.temperature}, Radiation: ${activeSector.radiation}.`,
      () => `[SIM] Rookie-1 weapon initialized: Laser Assault Rifle.`,
      () => {
        const dmg = Math.floor(Math.random() * 20) + 10;
        currentShield = Math.max(0, currentShield - dmg);
        setSimStats(prev => ({ ...prev, shield: currentShield }));
        return `[SIM] Combat engaged! Wave 1 swarm. Shield core damaged: -${dmg}% (Shield left: ${currentShield}%).`;
      },
      () => {
        const slain = Math.floor(Math.random() * 4) + 3;
        currentKills += slain;
        currentGems += slain * 5;
        setSimStats(prev => ({ ...prev, kills: currentKills, gems: currentGems }));
        return `[SIM] Firing plasma bullets. Slain ${slain} x Hostiles. Harvested +${slain * 5} Gems.`;
      },
      () => {
        currentWave = 2;
        setSimStats(prev => ({ ...prev, wave: currentWave }));
        return `[SIM] Wave 1 Cleared. Transitioning to Wave 2 floor coordinates.`;
      },
      () => {
        const reg = Math.floor(Math.random() * 15) + 10;
        currentShield = Math.min(100, currentShield + reg);
        setSimStats(prev => ({ ...prev, shield: currentShield }));
        return `[SIM] Power grid stable. Nanite core regenerated Shield: +${reg}% (Shield left: ${currentShield}%).`;
      },
      () => {
        const dmg = Math.floor(Math.random() * 40) + 20;
        const remainingDmg = Math.max(0, dmg - currentShield);
        currentShield = Math.max(0, currentShield - dmg);
        currentHp = Math.max(0, currentHp - remainingDmg);
        setSimStats(prev => ({ ...prev, shield: currentShield, hp: currentHp }));
        return `[SIM] WARNING! Boss incoming: ${activeSector.boss !== 'None' ? activeSector.boss : 'Elite Megabug'}. Severe impact: -${dmg}% damage (Shield: ${currentShield}%, HP: ${currentHp}%).`;
      },
      () => {
        if (currentHp <= 40) {
          return `[SIM] CRITICAL STATUS: Life support operating below 40% margin.`;
        }
        return `[SIM] Counter-strike initiated. Deploying grenade ordinance.`;
      },
      () => {
        const finalChance = Math.random() > 0.3; // 70% win rate
        if (finalChance && currentHp > 0) {
          currentKills += 10;
          currentGems += 100;
          setSimStats(prev => ({ ...prev, kills: currentKills, gems: currentGems }));
          setIsSimulating(false);
          if (simIntervalRef.current) clearInterval(simIntervalRef.current);
          return `[SIM] VICTORY! Boss eliminated. Sector secured. Telemetry and +100 Gems payload synchronized to Database.`;
        } else {
          currentHp = 0;
          setSimStats(prev => ({ ...prev, hp: 0 }));
          setIsSimulating(false);
          if (simIntervalRef.current) clearInterval(simIntervalRef.current);
          return `[SIM] DEFEAT! Rookie-1 KIA in Sector ${selectedCoord}. Mission aborted. Gem conversion failed.`;
        }
      }
    ];

    simIntervalRef.current = setInterval(() => {
      if (steps < simSteps.length) {
        const logMsg = simSteps[steps]();
        setSimulationLogs(prev => [...prev, logMsg]);
        steps++;
      } else {
        setIsSimulating(false);
        if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      }
    }, 2000);
  };

  const abortSimulation = () => {
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
    }
    setIsSimulating(false);
    setSimulationLogs(prev => [...prev, "[SIM] MISSION ABORTED BY COMMANDER. Shuttle evac capsule deployed."]);
  };

  // Auto-scroll simulation console logs
  useEffect(() => {
    if (simLogsEndRef.current) {
      simLogsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [simulationLogs]);

  useEffect(() => {
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  const currentSector = SECTOR_DATABASE[selectedCoord];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      {/* Title Header */}
      <div className="flex justify-between items-center pb-2 border-b border-[#4C1D95]/20">
        <div>
          <h1 className="text-3xl font-bold text-[#E2E8F0] mb-2 font-mono tracking-wide">Galactic Mission Control</h1>
          <p className="text-gray-400 text-sm">Monitor hostiles in real-time, inspect planetary sectors, and execute battlefield simulations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Cột 1: Radar Quét Mối Đe Dọa (4 cols) */}
        <div className="xl:col-span-4 flex flex-col">
          <div className="glass-panel p-6 rounded-2xl border border-[#4C1D95]/40 flex-1 flex flex-col items-center">
            <h3 className="text-lg font-bold text-[#E2E8F0] font-mono mb-4 flex items-center gap-2 w-full">
              <Compass className="text-[#F43F5E] animate-pulse" size={20} /> Cosmic Threat Radar
            </h3>
            
            {/* Radar Screen Area */}
            <div className="relative w-[280px] h-[280px] bg-[#0b0f19] rounded-full border-2 border-[#4C1D95]/50 flex items-center justify-center overflow-hidden shadow-2xl shadow-[#7C3AED]/10">
              {/* Radar Sweep Line */}
              <div className="absolute w-[2px] h-[140px] bg-gradient-to-t from-transparent to-[#F43F5E] radar-sweep-line top-0 z-10"></div>
              
              {/* Circular grids */}
              <div className="absolute w-[220px] h-[220px] rounded-full border border-[#4C1D95]/20"></div>
              <div className="absolute w-[160px] h-[160px] rounded-full border border-[#4C1D95]/25"></div>
              <div className="absolute w-[100px] h-[100px] rounded-full border border-[#4C1D95]/30"></div>
              
              {/* Crosshair lines */}
              <div className="absolute w-full h-[1px] bg-[#4C1D95]/30"></div>
              <div className="absolute h-full w-[1px] bg-[#4C1D95]/30"></div>
              
              {/* Center space station blip */}
              <div className="absolute w-3.5 h-3.5 bg-[#7C3AED] rounded-full border border-white z-20 shadow-[0_0_10px_#7C3AED]"></div>
              
              {/* Active targets on radar screen */}
              {radarTargets.map((tgt) => (
                <div 
                  key={tgt.id}
                  className="absolute w-2.5 h-2.5 bg-rose-500 rounded-full z-15 threat-blip"
                  style={{ left: `${tgt.x}px`, top: `${tgt.y}px` }}
                  title={`${tgt.name} (${tgt.distance})`}
                ></div>
              ))}
            </div>

            {/* Targets list */}
            <div className="w-full mt-6 space-y-2">
              <div className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-2 border-b border-[#4C1D95]/20 pb-1">Detected Signatures</div>
              {radarTargets.map((tgt) => (
                <div key={tgt.id} className="flex justify-between items-center text-xs font-mono bg-[#0F0F23]/60 px-3 py-2 rounded-lg border border-[#4C1D95]/20">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${tgt.danger === 'HIGH' ? 'bg-red-500' : tgt.danger === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                    <span className="text-gray-300 font-bold">{tgt.id}</span>
                    <span className="text-gray-400 truncate max-w-[100px]">{tgt.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-500">{tgt.distance}</span>
                    <span className={tgt.danger === 'HIGH' ? 'text-red-400' : tgt.danger === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'}>{tgt.danger}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cột 2: Bản đồ Tương tác & Trinh sát (4 cols) */}
        <div className="xl:col-span-4 flex flex-col">
          <div className="glass-panel p-6 rounded-2xl border border-[#4C1D95]/40 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-[#E2E8F0] font-mono mb-4 flex items-center gap-2">
              <Radio className="text-[#7C3AED]" size={20} /> Galactic Threat Sector Grid
            </h3>
            <p className="text-xs text-gray-400 mb-4 font-sans">Click on any coordinate cell below to load planetary telemetry reports.</p>
            
            {/* Grid 5x5 Map */}
            <div className="grid grid-cols-5 gap-2.5 flex-1 content-start mb-6">
              {Object.keys(SECTOR_DATABASE).map((coord) => {
                const isSelected = coord === selectedCoord;
                const danger = SECTOR_DATABASE[coord].danger;
                const dangerColor = danger === 'EXTREME' ? 'border-red-500/50 text-red-400 hover:bg-red-500/10' :
                                    danger === 'HIGH' ? 'border-rose-500/40 text-rose-400 hover:bg-rose-500/10' :
                                    danger === 'MEDIUM' ? 'border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10' :
                                    'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10';
                return (
                  <button
                    key={coord}
                    onClick={() => setSelectedCoord(coord)}
                    className={`h-[50px] rounded-xl border flex flex-col items-center justify-center text-xs font-mono font-bold transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#7C3AED] border-white text-white shadow-[0_0_15px_rgba(124,58,237,0.6)] scale-105' 
                        : `bg-[#0F0F23]/70 ${dangerColor}`
                    }`}
                  >
                    <span>{coord}</span>
                    <span className="text-[7px] font-normal opacity-75">{danger[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Sector Telemetry Report */}
            <div className="bg-[#0F0F23]/70 p-4 rounded-xl border border-[#4C1D95]/30 space-y-2 font-mono text-xs text-gray-300">
              <div className="flex justify-between border-b border-[#4C1D95]/20 pb-1 mb-2">
                <span className="font-bold text-[#A78BFA]">SECTOR DATASET</span>
                <span className="text-[#F43F5E] font-bold">{currentSector.id} ({selectedCoord})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="text-gray-200 text-right truncate max-w-[170px]">{currentSector.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Threat Level:</span>
                <span className={`font-bold ${currentSector.danger === 'EXTREME' ? 'text-red-500' : currentSector.danger === 'HIGH' ? 'text-rose-400' : currentSector.danger === 'MEDIUM' ? 'text-yellow-400' : 'text-emerald-400'}`}>
                  {currentSector.danger}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Local Boss:</span>
                <span className="text-gray-300">{currentSector.boss}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Hostile Flora/Fauna:</span>
                <span className="text-gray-300 text-right truncate max-w-[150px]" title={currentSector.mobs}>{currentSector.mobs}</span>
              </div>
              <div className="flex justify-between border-t border-[#4C1D95]/10 pt-2 mt-2">
                <span className="text-gray-500">Temperature:</span>
                <span className="text-gray-300">{currentSector.temperature}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Radiation:</span>
                <span className="text-gray-300">{currentSector.radiation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cột 3: Hộp Giả lập chiến đấu (4 cols) */}
        <div className="xl:col-span-4 flex flex-col">
          <div className="glass-panel p-6 rounded-2xl border border-[#4C1D95]/40 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-[#E2E8F0] font-mono mb-4 flex items-center gap-2">
              <Activity className="text-[#F43F5E]" size={20} /> Live Mission Simulator
            </h3>

            {/* Sim Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 font-mono text-xs">
              <div className="bg-[#0F0F23]/60 p-3 rounded-xl border border-[#4C1D95]/20 flex flex-col justify-center">
                <span className="text-gray-500">WAVE LEVEL</span>
                <span className="text-lg font-bold text-white mt-1">WAVE {simStats.wave} / 5</span>
              </div>
              <div className="bg-[#0F0F23]/60 p-3 rounded-xl border border-[#4C1D95]/20 flex flex-col justify-center">
                <span className="text-gray-500">HOSTILES ELIMINATED</span>
                <span className="text-lg font-bold text-[#F43F5E] mt-1">{simStats.kills} KILLS</span>
              </div>
              <div className="bg-[#0F0F23]/60 p-3 rounded-xl border border-[#4C1D95]/20 col-span-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-1"><Shield size={12} className="text-blue-400" /> SHIELD CORE</span>
                  <span className="text-blue-400 font-bold">{simStats.shield}%</span>
                </div>
                <div className="w-full bg-[#0F0F23] h-2 rounded-full overflow-hidden border border-blue-500/20">
                  <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${simStats.shield}%` }}></div>
                </div>
                
                <div className="flex justify-between mt-1">
                  <span className="text-gray-500 flex items-center gap-1"><AlertCircle size={12} className="text-rose-500" /> LIFE SUPPORT (HP)</span>
                  <span className="text-rose-500 font-bold">{simStats.hp}%</span>
                </div>
                <div className="w-full bg-[#0F0F23] h-2 rounded-full overflow-hidden border border-rose-500/20">
                  <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${simStats.hp}%` }}></div>
                </div>
              </div>
            </div>

            {/* Sim Control Button */}
            {!isSimulating ? (
              <button
                onClick={startSimulation}
                className="w-full bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] hover:from-[#6D28D9] hover:to-[#E11D48] text-white py-3 rounded-xl font-bold font-mono tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#7C3AED]/20 cursor-pointer active:scale-98"
              >
                <Play size={16} /> INITIATE SIMULATION
              </button>
            ) : (
              <button
                onClick={abortSimulation}
                className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold font-mono tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Square size={16} /> ABORT MISSION
              </button>
            )}

            {/* Simulator Console Screen */}
            <div className="flex-1 mt-4 p-4 bg-[#0b0f19] rounded-xl border border-[#4C1D95]/40 font-mono text-[10px] text-emerald-400 overflow-y-auto h-[160px] crt-screen crt-scanline space-y-1.5 select-text">
              {simulationLogs.length === 0 ? (
                <div className="text-gray-600 text-center py-10">Simulation unit ready.<br />Awaiting launch sequence...</div>
              ) : (
                simulationLogs.map((log, index) => (
                  <div key={index} className="leading-tight hover:bg-emerald-500/10 px-1 py-0.5 rounded transition-colors">
                    {log}
                  </div>
                ))
              )}
              <div ref={simLogsEndRef} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MissionControl;
