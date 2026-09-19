import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

const EnemyManager = () => {
  const { isAuthenticated, role } = useAuth();
  const isWritable = isAuthenticated && (role === 'Admin' || role === 'Developer');

  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    enemyName: '',
    baseHealth: 100,
    moveSpeed: 5.0,
    attackSpeed: 1.0,
    prefabName: ''
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'enemyName', label: 'Enemy Name' },
    { key: 'baseHealth', label: 'Health' },
    { key: 'moveSpeed', label: 'Move SPD' },
    { key: 'attackSpeed', label: 'ATK SPD' },
    ...(isWritable ? [{ key: 'prefabName', label: 'Prefab' }] : []),
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
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-[#161633] p-8 rounded-2xl border border-[#4C1D95]/40 w-full max-w-md shadow-2xl shadow-[#7C3AED]/10">
            <h2 className="text-xl font-bold text-[#E2E8F0] mb-6 font-mono tracking-wide">
              {editingItem ? 'Edit Enemy' : 'Add New Enemy'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 font-sans">Enemy Name</label>
                <input required type="text" value={formData.enemyName} onChange={e => setFormData({...formData, enemyName: e.target.value})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/50 transition-all font-sans" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 font-sans">Base Health</label>
                  <input required type="number" value={formData.baseHealth} onChange={e => setFormData({...formData, baseHealth: parseInt(e.target.value) || 0})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#7C3AED] text-sm font-sans" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 font-sans">Move Speed</label>
                  <input required type="number" step="0.1" value={formData.moveSpeed} onChange={e => setFormData({...formData, moveSpeed: parseFloat(e.target.value) || 0})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#7C3AED] text-sm font-sans" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 font-sans">Attack Speed</label>
                  <input required type="number" step="0.1" value={formData.attackSpeed} onChange={e => setFormData({...formData, attackSpeed: parseFloat(e.target.value) || 0})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#7C3AED] text-sm font-sans" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 font-sans">Prefab Name (Unity)</label>
                <input required type="text" value={formData.prefabName} onChange={e => setFormData({...formData, prefabName: e.target.value})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/50 transition-all font-sans" placeholder="e.g. Melog, Goblin" />
              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white hover:bg-[#27273B]/50 rounded-xl transition-all cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] hover:from-[#6D28D9] hover:to-[#E11D48] text-white rounded-xl transition-all duration-300 font-medium shadow-md shadow-[#7C3AED]/20 cursor-pointer">Save Config</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EnemyManager;
