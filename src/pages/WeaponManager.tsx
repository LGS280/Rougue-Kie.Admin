import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import axiosClient from '../api/axiosClient';

const WeaponManager = () => {
  const [data, setData] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    weaponName: '',
    prefabName: '',
    fireRate: 0.5,
    manaCost: 10,
    bulletsPerShot: 1,
    spreadAngle: 0.0,
    shootSound: '',
    shootVolume: 1.0,
    handPositionX: 0,
    handPositionY: 0,
    handPositionZ: 0,
    recoilDistance: 0.15,
    recoilDuration: 0.05,
    returnDuration: 0.1,
    bulletId: 1
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'weaponName', label: 'Weapon Name' },
    { key: 'prefabName', label: 'Prefab' },
    { key: 'fireRate', label: 'Fire Rate' },
    { key: 'manaCost', label: 'Mana' },
    { key: 'bulletId', label: 'Bullet ID' }
  ];

  const loadData = async () => {
    try {
      const [weaponsRes, bulletsRes] = await Promise.all([
        axiosClient.get('/weapons'),
        axiosClient.get('/bullets')
      ]);
      setData(weaponsRes as any);
      setBullets(bulletsRes as any);
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
      prefabName: '',
      fireRate: 0.5,
      manaCost: 10,
      bulletsPerShot: 1,
      spreadAngle: 0.0,
      shootSound: '',
      shootVolume: 1.0,
      handPositionX: 0,
      handPositionY: 0,
      handPositionZ: 0,
      recoilDistance: 0.15,
      recoilDuration: 0.05,
      returnDuration: 0.1,
      bulletId: bullets.length > 0 ? (bullets[0] as any).id : 1
    });
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      weaponName: item.weaponName || '',
      prefabName: item.prefabName || '',
      fireRate: item.fireRate ?? 0.5,
      manaCost: item.manaCost ?? 10,
      bulletsPerShot: item.bulletsPerShot ?? 1,
      spreadAngle: item.spreadAngle ?? 0.0,
      shootSound: item.shootSound || '',
      shootVolume: item.shootVolume ?? 1.0,
      handPositionX: item.handPositionX ?? 0,
      handPositionY: item.handPositionY ?? 0,
      handPositionZ: item.handPositionZ ?? 0,
      recoilDistance: item.recoilDistance ?? 0.15,
      recoilDuration: item.recoilDuration ?? 0.05,
      returnDuration: item.returnDuration ?? 0.1,
      bulletId: item.bulletId
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
        description="Balance gun and melee weapon fire rate, mana cost, and bullet configurations."
        columns={columns}
        data={data}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-[#1e1e1e] p-8 rounded-2xl border border-gray-800 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingItem ? 'Edit Weapon' : 'Add Weapon'}
            </h2>
            <form onSubmit={handleSave} className="space-y-6">
              {/* General Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Weapon Name</label>
                  <input required type="text" value={formData.weaponName} onChange={e => setFormData({...formData, weaponName: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Prefab Name</label>
                  <input required type="text" value={formData.prefabName} onChange={e => setFormData({...formData, prefabName: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="Weapons/AK47_Prefab" />
                </div>
              </div>

              {/* Combat Stats */}
              <div>
                <h3 className="text-sm font-bold text-gray-300 mb-3 border-b border-gray-700 pb-1">Combat Stats</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Fire Rate</label>
                    <input required type="number" step="0.1" value={formData.fireRate} onChange={e => setFormData({...formData, fireRate: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Mana Cost</label>
                    <input required type="number" value={formData.manaCost} onChange={e => setFormData({...formData, manaCost: parseInt(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Bullets / Shot</label>
                    <input required type="number" value={formData.bulletsPerShot} onChange={e => setFormData({...formData, bulletsPerShot: parseInt(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Spread Angle</label>
                    <input required type="number" step="0.1" value={formData.spreadAngle} onChange={e => setFormData({...formData, spreadAngle: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-blue-500 text-sm" />
                  </div>
                </div>
              </div>

              {/* Handling (Hand Position & Recoil) */}
              <div>
                <h3 className="text-sm font-bold text-gray-300 mb-3 border-b border-gray-700 pb-1">Handling</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Hand Position (X, Y, Z)</label>
                    <div className="grid grid-cols-3 gap-2">
                      <input type="number" step="0.01" value={formData.handPositionX} onChange={e => setFormData({...formData, handPositionX: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-blue-500 text-sm" />
                      <input type="number" step="0.01" value={formData.handPositionY} onChange={e => setFormData({...formData, handPositionY: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-blue-500 text-sm" />
                      <input type="number" step="0.01" value={formData.handPositionZ} onChange={e => setFormData({...formData, handPositionZ: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-blue-500 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Recoil (Dist, Dur, Return)</label>
                    <div className="grid grid-cols-3 gap-2">
                      <input type="number" step="0.01" value={formData.recoilDistance} onChange={e => setFormData({...formData, recoilDistance: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-blue-500 text-sm" title="Recoil Distance" />
                      <input type="number" step="0.01" value={formData.recoilDuration} onChange={e => setFormData({...formData, recoilDuration: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-blue-500 text-sm" title="Recoil Duration" />
                      <input type="number" step="0.01" value={formData.returnDuration} onChange={e => setFormData({...formData, returnDuration: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-blue-500 text-sm" title="Return Duration" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Audio & Bullet */}
              <div>
                <h3 className="text-sm font-bold text-gray-300 mb-3 border-b border-gray-700 pb-1">Audio & Payload</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Shoot Sound</label>
                    <input type="text" value={formData.shootSound} onChange={e => setFormData({...formData, shootSound: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-blue-500 text-sm" placeholder="SFX_Shoot" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Shoot Volume</label>
                    <input type="number" step="0.1" min="0" max="1" value={formData.shootVolume} onChange={e => setFormData({...formData, shootVolume: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-blue-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Bullet Type</label>
                    <select required value={formData.bulletId} onChange={e => setFormData({...formData, bulletId: parseInt(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-blue-500 text-sm">
                      {bullets.map((b: any) => (
                        <option key={b.id} value={b.id}>{b.bulletName}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium">Save Configurations</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default WeaponManager;
