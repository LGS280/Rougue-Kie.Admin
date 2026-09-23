import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import axiosClient from '../api/axiosClient';

const LevelManager = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Trạng thái Form: Đồng bộ với cấu hình LevelConfig và Co-op Scaling trong Database
  const [formData, setFormData] = useState({
    stageId: 1,
    floorNumber: 1,
    difficultyMultiplier: 1.0,
    baseRoomCount: 7,
    coopExtraRooms: 2,
    coopMobHPMultiplier: 0.4,
    coopBossHPMultiplier: 0.6,
    coopExtraMobsPerRoom: 1
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'stageId', label: 'Stage' },
    { key: 'floorNumber', label: 'Floor' },
    { key: 'difficultyMultiplier', label: 'Difficulty (x)' },
    { key: 'baseRoomCount', label: 'Base Rooms (Solo)' },
    { key: 'coopExtraRooms', label: 'Co-op +Rooms' },
    { key: 'coopMobHPMultiplier', label: 'Co-op Mob HP (+/P)' },
    { key: 'coopBossHPMultiplier', label: 'Co-op Boss HP (+/P)' },
    { key: 'coopExtraMobsPerRoom', label: 'Co-op +Mobs/Room' },
  ];

  const loadData = async () => {
    try {
      const res = await axiosClient.get('/levels');
      setData(res as any);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      stageId: 1,
      floorNumber: 1,
      difficultyMultiplier: 1.0,
      baseRoomCount: 7,
      coopExtraRooms: 2,
      coopMobHPMultiplier: 0.4,
      coopBossHPMultiplier: 0.6,
      coopExtraMobsPerRoom: 1
    });
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      stageId: item.stageId,
      floorNumber: item.floorNumber,
      difficultyMultiplier: item.difficultyMultiplier,
      baseRoomCount: item.baseRoomCount ?? 7,
      coopExtraRooms: item.coopExtraRooms ?? 2,
      coopMobHPMultiplier: item.coopMobHPMultiplier ?? 0.4,
      coopBossHPMultiplier: item.coopBossHPMultiplier ?? 0.6,
      coopExtraMobsPerRoom: item.coopExtraMobsPerRoom ?? 1
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if(confirm("Delete this level?")) {
      await axiosClient.delete(`/levels/${id}`);
      loadData();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axiosClient.put(`/levels/${editingItem.id}`, formData);
      } else {
        await axiosClient.post('/levels', formData);
      }
      setModalOpen(false);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <DataTable 
        title="Level Scaling & Co-op Progression" 
        description="Configure difficulty, room count, and Co-op health & mob scaling for each dungeon floor."
        columns={columns}
        data={data}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-[#1e1e1e] p-8 rounded-2xl border border-gray-800 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingItem ? 'Edit Level & Co-op Config' : 'Add Level & Co-op Config'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Stage ID</label>
                  <input required type="number" value={formData.stageId} onChange={e => setFormData({...formData, stageId: parseInt(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Floor Number</label>
                  <input required type="number" value={formData.floorNumber} onChange={e => setFormData({...formData, floorNumber: parseInt(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Difficulty Multiplier (e.g. 1.5)</label>
                <input required type="number" step="0.1" value={formData.difficultyMultiplier} onChange={e => setFormData({...formData, difficultyMultiplier: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Base Rooms (Solo)</label>
                  <input required type="number" value={formData.baseRoomCount} onChange={e => setFormData({...formData, baseRoomCount: parseInt(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Co-op +Rooms</label>
                  <input required type="number" value={formData.coopExtraRooms} onChange={e => setFormData({...formData, coopExtraRooms: parseInt(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Co-op Mob HP (+/P, e.g. 0.4)</label>
                  <input required type="number" step="0.05" value={formData.coopMobHPMultiplier} onChange={e => setFormData({...formData, coopMobHPMultiplier: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Co-op Boss HP (+/P, e.g. 0.6)</label>
                  <input required type="number" step="0.05" value={formData.coopBossHPMultiplier} onChange={e => setFormData({...formData, coopBossHPMultiplier: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Co-op Extra Mobs/Room</label>
                <input required type="number" value={formData.coopExtraMobsPerRoom} onChange={e => setFormData({...formData, coopExtraMobsPerRoom: parseInt(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors font-medium">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LevelManager;
