import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import axiosClient from '../api/axiosClient';

const LevelManager = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    floorNumber: 1,
    difficultyMultiplier: 1.0,
    maxEnemiesToSpawn: 10
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'floorNumber', label: 'Floor' },
    { key: 'difficultyMultiplier', label: 'Difficulty (x)' },
    { key: 'maxEnemiesToSpawn', label: 'Max Enemies' },
  ];

  const loadData = async () => {
    try {
      const res = await axiosClient.get('/gameconfigs/levels');
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
      floorNumber: 1,
      difficultyMultiplier: 1.0,
      maxEnemiesToSpawn: 10
    });
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      floorNumber: item.floorNumber,
      difficultyMultiplier: item.difficultyMultiplier,
      maxEnemiesToSpawn: item.maxEnemiesToSpawn
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if(confirm("Delete this level?")) {
      await axiosClient.delete(`/gameconfigs/levels/${id}`);
      loadData();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axiosClient.put(`/gameconfigs/levels/${editingItem.id}`, { ...formData, id: editingItem.id });
      } else {
        await axiosClient.post('/gameconfigs/levels', formData);
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
        title="Level Scaling" 
        description="Configure how difficulty scales as players progress through floors."
        columns={columns}
        data={data}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-[#1e1e1e] p-8 rounded-2xl border border-gray-800 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingItem ? 'Edit Level' : 'Add Level'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Floor Number</label>
                <input required type="number" value={formData.floorNumber} onChange={e => setFormData({...formData, floorNumber: parseInt(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Difficulty Multiplier (e.g. 1.5)</label>
                <input required type="number" step="0.1" value={formData.difficultyMultiplier} onChange={e => setFormData({...formData, difficultyMultiplier: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Max Enemies To Spawn</label>
                <input required type="number" value={formData.maxEnemiesToSpawn} onChange={e => setFormData({...formData, maxEnemiesToSpawn: parseInt(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
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
