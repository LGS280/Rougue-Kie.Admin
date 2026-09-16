import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import axiosClient from '../api/axiosClient';

// Quản lý các gói súng và vật phẩm bày bán trong Cửa Hàng (Shop Packages)
const ShopItemManager = () => {
  const [data, setData] = useState([]);
  const [weapons, setWeapons] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    itemType: 'WEAPON_GEM',
    description: '',
    price: 500,
    currencyType: 'GEM'
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Tên Gói / Súng' },
    { key: 'itemType', label: 'Phân Loại Tab' },
    { key: 'description', label: 'Mô Tả' },
    { key: 'price', label: 'Giá Bán' },
    { key: 'currencyType', label: 'Loại Tiền' }
  ];

  // Tải danh sách vật phẩm shop và danh sách súng từ backend
  const loadData = async () => {
    try {
      const [shopRes, weaponsRes]: any = await Promise.all([
        axiosClient.get('/shopitems'),
        axiosClient.get('/weapons')
      ]);

      const mapped = shopRes.map((s: any) => ({
        ...s,
        id: s.shopItemId
      }));
      setData(mapped);
      setWeapons(weaponsRes || []);
    } catch (e) {
      console.error("Lỗi khi tải dữ liệu gói shop:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      itemType: 'WEAPON_GEM',
      description: '',
      price: 500,
      currencyType: 'GEM'
    });
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      itemType: item.itemType || 'WEAPON_GEM',
      description: item.description || '',
      price: item.price,
      currencyType: item.currencyType || 'GEM'
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa gói vật phẩm này khỏi cửa hàng?")) {
      try {
        await axiosClient.delete(`/shopitems/${id}`);
        loadData();
      } catch (e) {
        console.error("Lỗi khi xóa gói vật phẩm shop:", e);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axiosClient.put(`/shopitems/${editingItem.shopItemId}`, formData);
      } else {
        await axiosClient.post('/shopitems', formData);
      }
      setModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Lỗi khi lưu cấu hình gói shop:", error);
    }
  };

  return (
    <>
      <DataTable 
        title="Shop Packages Configuration" 
        description="Quản lý và cấu hình các gói súng và trang phục bày bán trong Cửa Hàng (Shop) của game."
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
              {editingItem ? 'Sửa Gói Cửa Hàng' : 'Thêm Gói Cửa Hàng Mới'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              {/* Dropdown chọn súng từ danh sách WeaponConfigs có sẵn */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 font-sans">
                  Chọn Súng Có Sẵn (Tự động điền)
                </label>
                <select
                  onChange={(e) => {
                    const selected = weapons.find((w: any) => w.id === parseInt(e.target.value));
                    if (selected) {
                      setFormData({
                        ...formData,
                        name: selected.weaponName,
                        description: `Súng ${selected.weaponName} (${selected.weaponType} - ${selected.rarity})`
                      });
                    }
                  }}
                  defaultValue=""
                  className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/50 transition-all font-sans"
                >
                  <option value="">-- Chọn súng để tự động điền tên & mô tả --</option>
                  {weapons.map((w: any) => (
                    <option key={w.id} value={w.id}>
                      {w.weaponName} ({w.weaponType} - {w.rarity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 font-sans">Tên gói / Tên súng</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/50 transition-all font-sans" placeholder="Ví dụ: AK-47 Gold" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 font-sans">Mô tả gói</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/50 transition-all font-sans" rows={2} placeholder="Thông tin chi tiết về gói súng..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1 font-sans">Phân loại Tab</label>
                  <select 
                    value={formData.itemType} 
                    onChange={e => {
                      const newType = e.target.value;
                      const newCurrency = newType === 'WEAPON_VIP' ? 'VND' : 'GEM';
                      setFormData({...formData, itemType: newType, currencyType: newCurrency});
                    }} 
                    className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/50 transition-all font-sans"
                  >
                    <option value="WEAPON_GEM">Tab GEM WEAPONS</option>
                    <option value="WEAPON_VIP">Tab VIP (VietQR)</option>
                    <option value="SKIN">Tab SKINS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1 font-sans">Loại tiền tệ</label>
                  <select value={formData.currencyType} onChange={e => setFormData({...formData, currencyType: e.target.value})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/50 transition-all font-sans">
                    <option value="GEM">GEM (Tiền game)</option>
                    <option value="VND">VND (Tiền thật)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1 font-sans">Giá bán</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/50 transition-all font-sans" />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white hover:bg-[#27273B]/50 rounded-xl transition-all cursor-pointer">Hủy</button>
                <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] hover:from-[#6D28D9] hover:to-[#E11D48] text-white rounded-xl transition-all duration-300 font-medium shadow-md shadow-[#7C3AED]/20 cursor-pointer">Lưu cấu hình</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopItemManager;
