import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import axiosClient from '../api/axiosClient';
import { sanitizeNumberInput, normalizeNumberPayload, handleNumberFocus } from '../utils/numberInput';

interface LevelFormData {
  stageId: number | string;
  floorNumber: number | string;
  difficultyMultiplier: number | string;
  baseRoomCount: number | string;
  coopExtraRooms: number | string;
  coopMobHPMultiplier: number | string;
  coopBossHPMultiplier: number | string;
  coopExtraMobsPerRoom: number | string;
  chestRoomCount: number | string;
  coopExtraChestRooms: number | string;
}

const LevelManager = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Trạng thái Form: Đồng bộ với cấu hình LevelConfig và Co-op Scaling trong Database
  const [formData, setFormData] = useState<LevelFormData>({
    stageId: 1,
    floorNumber: 1,
    difficultyMultiplier: 1.0,
    baseRoomCount: 7,
    coopExtraRooms: 2,
    coopMobHPMultiplier: 0.4,
    coopBossHPMultiplier: 0.6,
    coopExtraMobsPerRoom: 1,
    chestRoomCount: 1,
    coopExtraChestRooms: 0
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'stageId', label: 'Stage' },
    { key: 'floorNumber', label: 'Floor' },
    { key: 'difficultyMultiplier', label: 'Difficulty (x)' },
    { key: 'baseRoomCount', label: 'Base Rooms (Solo)' },
    { key: 'coopExtraRooms', label: 'Co-op +Rooms' },
    { key: 'chestRoomCount', label: 'Chest Rooms (Solo)' },
    { key: 'coopExtraChestRooms', label: 'Co-op +Chest' },
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
      coopExtraMobsPerRoom: 1,
      chestRoomCount: 1,
      coopExtraChestRooms: 0
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
      coopExtraMobsPerRoom: item.coopExtraMobsPerRoom ?? 1,
      chestRoomCount: item.chestRoomCount ?? 1,
      coopExtraChestRooms: item.coopExtraChestRooms ?? 0
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
      const payload = {
        ...formData,
        stageId: normalizeNumberPayload(formData.stageId, 1),
        floorNumber: normalizeNumberPayload(formData.floorNumber, 1),
        difficultyMultiplier: normalizeNumberPayload(formData.difficultyMultiplier, 1.0),
        baseRoomCount: normalizeNumberPayload(formData.baseRoomCount, 7),
        coopExtraRooms: normalizeNumberPayload(formData.coopExtraRooms, 2),
        coopMobHPMultiplier: normalizeNumberPayload(formData.coopMobHPMultiplier, 0.4),
        coopBossHPMultiplier: normalizeNumberPayload(formData.coopBossHPMultiplier, 0.6),
        coopExtraMobsPerRoom: normalizeNumberPayload(formData.coopExtraMobsPerRoom, 1),
        chestRoomCount: normalizeNumberPayload(formData.chestRoomCount, 1),
        coopExtraChestRooms: normalizeNumberPayload(formData.coopExtraChestRooms, 0),
      };
      if (editingItem) {
        await axiosClient.put(`/levels/${editingItem.id}`, payload);
      } else {
        await axiosClient.post('/levels', payload);
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
                  <input required type="number" value={formData.stageId ?? ''} onFocus={handleNumberFocus} onChange={e => setFormData({...formData, stageId: sanitizeNumberInput(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Floor Number</label>
                  <input required type="number" value={formData.floorNumber ?? ''} onFocus={handleNumberFocus} onChange={e => setFormData({...formData, floorNumber: sanitizeNumberInput(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Difficulty Multiplier (e.g. 1.5)</label>
                <input required type="number" step="0.1" value={formData.difficultyMultiplier ?? ''} onFocus={handleNumberFocus} onChange={e => setFormData({...formData, difficultyMultiplier: sanitizeNumberInput(e.target.value, true)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Base Rooms (Solo)</label>
                  <input required type="number" value={formData.baseRoomCount ?? ''} onFocus={handleNumberFocus} onChange={e => setFormData({...formData, baseRoomCount: sanitizeNumberInput(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Co-op +Rooms</label>
                  <input required type="number" value={formData.coopExtraRooms ?? ''} onFocus={handleNumberFocus} onChange={e => setFormData({...formData, coopExtraRooms: sanitizeNumberInput(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Chest Rooms (Solo)</label>
                  <input required type="number" value={formData.chestRoomCount ?? ''} onFocus={handleNumberFocus} onChange={e => setFormData({...formData, chestRoomCount: sanitizeNumberInput(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Co-op +Chest Rooms</label>
                  <input required type="number" value={formData.coopExtraChestRooms ?? ''} onFocus={handleNumberFocus} onChange={e => setFormData({...formData, coopExtraChestRooms: sanitizeNumberInput(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Co-op Mob HP (+/P, e.g. 0.4)</label>
                  <input required type="number" step="0.05" value={formData.coopMobHPMultiplier ?? ''} onFocus={handleNumberFocus} onChange={e => setFormData({...formData, coopMobHPMultiplier: sanitizeNumberInput(e.target.value, true)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Co-op Boss HP (+/P, e.g. 0.6)</label>
                  <input required type="number" step="0.05" value={formData.coopBossHPMultiplier ?? ''} onFocus={handleNumberFocus} onChange={e => setFormData({...formData, coopBossHPMultiplier: sanitizeNumberInput(e.target.value, true)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Co-op Extra Mobs/Room</label>
                <input required type="number" value={formData.coopExtraMobsPerRoom ?? ''} onFocus={handleNumberFocus} onChange={e => setFormData({...formData, coopExtraMobsPerRoom: sanitizeNumberInput(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
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
