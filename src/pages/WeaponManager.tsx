import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import axiosClient from '../api/axiosClient';

const WeaponManager = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    weaponName: '',
    damage: 20,
    fireRate: 0.5
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'weaponName', label: 'Weapon Name' },
    { key: 'damage', label: 'Damage' },
    { key: 'fireRate', label: 'Fire Rate (s)' }
  ];

  const loadData = async () => {
    try {
      const res = await axiosClient.get('/weapons');
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
      weaponName: '',
      damage: 20,
      fireRate: 0.5
    });
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      weaponName: item.weaponName,
      damage: item.damage,
      fireRate: item.fireRate
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if(confirm("Delete this weapon config?")) {
      await axiosClient.delete(`/weapons/${id}`);
      loadData();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axiosClient.put(`/weapons/${editingItem.id}`, { ...formData, id: editingItem.id });
      } else {
        await axiosClient.post('/weapons', formData);
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
        title="Weapon Arsenal" 
        description="Balance gun and melee weapon damage, fire rate, and reload times."
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
              {editingItem ? 'Edit Weapon' : 'Add Weapon'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Weapon Name</label>
                <input required type="text" value={formData.weaponName} onChange={e => setFormData({...formData, weaponName: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Damage</label>
                  <input required type="number" value={formData.damage} onChange={e => setFormData({...formData, damage: parseInt(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Fire Rate (sec)</label>
                  <input required type="number" step="0.1" value={formData.fireRate} onChange={e => setFormData({...formData, fireRate: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default WeaponManager;
