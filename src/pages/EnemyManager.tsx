import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import axiosClient from '../api/axiosClient';

const EnemyManager = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    enemyName: '',
    baseHealth: 100,
    baseDamage: 10,
    moveSpeed: 5.0,
    attackSpeed: 1.0,
    prefabName: ''
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'enemyName', label: 'Enemy Name' },
    { key: 'baseHealth', label: 'Health' },
    { key: 'baseDamage', label: 'Damage' },
    { key: 'moveSpeed', label: 'Move SPD' },
    { key: 'attackSpeed', label: 'ATK SPD' },
    { key: 'prefabName', label: 'Prefab' },
  ];

  const loadData = async () => {
    try {
      const res = await axiosClient.get('/enemies');
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
      enemyName: '',
      baseHealth: 100,
      baseDamage: 10,
      moveSpeed: 5.0,
      attackSpeed: 1.0,
      prefabName: ''
    });
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      enemyName: item.enemyName,
      baseHealth: item.baseHealth,
      baseDamage: item.baseDamage,
      moveSpeed: item.moveSpeed,
      attackSpeed: item.attackSpeed,
      prefabName: item.prefabName
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if(confirm("Are you sure you want to delete this enemy?")) {
      await axiosClient.delete(`/enemies/${id}`);
      loadData();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axiosClient.put(`/enemies/${editingItem.id}`, formData);
      } else {
        await axiosClient.post('/enemies', formData);
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
        title="Enemy Configuration" 
        description="Adjust base stats for all enemy variants in the game."
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
              {editingItem ? 'Edit Enemy' : 'Add New Enemy'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Enemy Name</label>
                <input required type="text" value={formData.enemyName} onChange={e => setFormData({...formData, enemyName: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Base Health</label>
                  <input required type="number" value={formData.baseHealth} onChange={e => setFormData({...formData, baseHealth: parseInt(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Base Damage</label>
                  <input required type="number" value={formData.baseDamage} onChange={e => setFormData({...formData, baseDamage: parseInt(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Move Speed</label>
                  <input required type="number" step="0.1" value={formData.moveSpeed} onChange={e => setFormData({...formData, moveSpeed: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Attack Speed</label>
                  <input required type="number" step="0.1" value={formData.attackSpeed} onChange={e => setFormData({...formData, attackSpeed: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Prefab Name (Unity)</label>
                <input required type="text" value={formData.prefabName} onChange={e => setFormData({...formData, prefabName: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. Prefabs/Enemies/Goblin" />
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

export default EnemyManager;
