import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import axiosClient from '../api/axiosClient';

const BuffManager = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    buffName: '',
    description: '',
    iconPath: '',
    buffType: 'Health',
    value: 10,
    rarity: 'Common'
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'buffName', label: 'Buff' },
    { key: 'buffType', label: 'Type' },
    { key: 'value', label: 'Value' },
    { key: 'rarity', label: 'Rarity' },
  ];

  const loadData = async () => {
    try {
      const res = await axiosClient.get('/gameconfigs/buffs');
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
      buffName: '',
      description: '',
      iconPath: '',
      buffType: 'Health',
      value: 10,
      rarity: 'Common'
    });
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      buffName: item.buffName,
      description: item.description,
      iconPath: item.iconPath,
      buffType: item.buffType,
      value: item.value,
      rarity: item.rarity
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if(confirm("Delete this buff?")) {
      await axiosClient.delete(`/gameconfigs/buffs/${id}`);
      loadData();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axiosClient.put(`/gameconfigs/buffs/${editingItem.id}`, { ...formData, id: editingItem.id });
      } else {
        await axiosClient.post('/gameconfigs/buffs', formData);
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
        title="Buff Configuration" 
        description="Manage the perks players can acquire between rooms (Soul Knight style)."
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
              {editingItem ? 'Edit Buff' : 'Add Buff'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Buff Name</label>
                <input required type="text" value={formData.buffName} onChange={e => setFormData({...formData, buffName: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea required rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Buff Type</label>
                  <select value={formData.buffType} onChange={e => setFormData({...formData, buffType: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500">
                    <option value="Health">Health</option>
                    <option value="Damage">Damage</option>
                    <option value="FireRate">Fire Rate</option>
                    <option value="MoveSpeed">Move Speed</option>
                    <option value="PoisonImmunity">Poison Immunity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Value</label>
                  <input required type="number" step="0.1" value={formData.value} onChange={e => setFormData({...formData, value: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Rarity</label>
                  <select value={formData.rarity} onChange={e => setFormData({...formData, rarity: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500">
                    <option value="Common">Common</option>
                    <option value="Rare">Rare</option>
                    <option value="Epic">Epic</option>
                    <option value="Legendary">Legendary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Icon Path (Unity)</label>
                  <input required type="text" value={formData.iconPath} onChange={e => setFormData({...formData, iconPath: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500" placeholder="e.g. Icons/health_buff" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors font-medium">Save Buff</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BuffManager;
