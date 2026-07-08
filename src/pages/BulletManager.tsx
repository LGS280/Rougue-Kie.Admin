import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import axiosClient from '../api/axiosClient';

const BulletManager = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    bulletName: '',
    damage: 10,
    critRate: 0.1,
    flightSpeed: 10.0,
    piercingCount: 1,
    prefabName: ''
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'bulletName', label: 'Bullet Name' },
    { key: 'damage', label: 'Damage' },
    { key: 'critRate', label: 'Crit Rate' },
    { key: 'flightSpeed', label: 'Flight SPD' },
    { key: 'piercingCount', label: 'Piercing' },
    { key: 'prefabName', label: 'Prefab' },
  ];

  const loadData = async () => {
    try {
      const res = await axiosClient.get('/bullets');
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
      bulletName: '',
      damage: 10,
      critRate: 0.1,
      flightSpeed: 10.0,
      piercingCount: 1,
      prefabName: ''
    });
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      bulletName: item.bulletName,
      damage: item.damage,
      critRate: item.critRate,
      flightSpeed: item.flightSpeed,
      piercingCount: item.piercingCount,
      prefabName: item.prefabName
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if(confirm("Are you sure you want to delete this bullet?")) {
      await axiosClient.delete(`/bullets/${id}`);
      loadData();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axiosClient.put(`/bullets/${editingItem.id}`, formData);
      } else {
        await axiosClient.post('/bullets', formData);
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
        title="Bullet Configuration" 
        description="Adjust physics and properties for bullets in the game."
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
              {editingItem ? 'Edit Bullet' : 'Add New Bullet'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Bullet Name</label>
                <input required type="text" value={formData.bulletName} onChange={e => setFormData({...formData, bulletName: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Damage</label>
                  <input required type="number" value={formData.damage} onChange={e => setFormData({...formData, damage: parseInt(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Crit Rate (0.0-1.0)</label>
                  <input required type="number" step="0.01" value={formData.critRate} onChange={e => setFormData({...formData, critRate: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Flight Speed</label>
                  <input required type="number" step="0.1" value={formData.flightSpeed} onChange={e => setFormData({...formData, flightSpeed: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Piercing Count</label>
                  <input required type="number" value={formData.piercingCount} onChange={e => setFormData({...formData, piercingCount: parseInt(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Prefab Name (Unity)</label>
                <input required type="text" value={formData.prefabName} onChange={e => setFormData({...formData, prefabName: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. Prefabs/Bullets/Fireball" />
              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium">Save Config</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BulletManager;
