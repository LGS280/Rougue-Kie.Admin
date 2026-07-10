import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import axiosClient from '../api/axiosClient';

// Lớp quản lý các vật phẩm bày bán trong Cửa Hàng (Shop Items) như Thuốc lắc, Vũ khí buff
const ShopItemManager = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    itemType: 'Consumable',
    description: '',
    price: 0,
    currencyType: 'Gem'
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'itemType', label: 'Type' },
    { key: 'description', label: 'Description' },
    { key: 'price', label: 'Price' },
    { key: 'currencyType', label: 'Currency' }
  ];

  // Tải danh sách vật phẩm từ API backend
  const loadData = async () => {
    try {
      const res: any = await axiosClient.get('/shopitems');
      // Ánh xạ shopItemId sang id để tương thích với DataTable component
      const mapped = res.map((s: any) => ({
        ...s,
        id: s.shopItemId
      }));
      setData(mapped);
    } catch (e) {
      console.error("Lỗi khi tải dữ liệu vật phẩm shop:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      itemType: 'Consumable',
      description: '',
      price: 0,
      currencyType: 'Gem'
    });
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      itemType: item.itemType || 'Consumable',
      description: item.description || '',
      price: item.price,
      currencyType: item.currencyType || 'Gem'
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa vật phẩm này khỏi cửa hàng?")) {
      try {
        await axiosClient.delete(`/shopitems/${id}`);
        loadData();
      } catch (e) {
        console.error("Lỗi khi xóa vật phẩm shop:", e);
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
      console.error("Lỗi khi lưu cấu hình vật phẩm shop:", error);
    }
  };

  return (
    <>
      <DataTable 
        title="Shop Items Configuration" 
        description="Cấu hình các vật phẩm bổ trợ, vật phẩm tiêu hao mua được bằng tiền tệ trong game."
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
              {editingItem ? 'Sửa vật phẩm cửa hàng' : 'Thêm vật phẩm cửa hàng mới'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tên vật phẩm</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Mô tả vật phẩm</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Phân loại</label>
                  <select value={formData.itemType} onChange={e => setFormData({...formData, itemType: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                    <option value="Consumable">Consumable</option>
                    <option value="Weapon">Weapon</option>
                    <option value="Boost">Boost</option>
                    <option value="Special">Special</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Loại tiền tệ</label>
                  <select value={formData.currencyType} onChange={e => setFormData({...formData, currencyType: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                    <option value="Gem">Gem</option>
                    <option value="Ruby">Ruby</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Giá bán</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium">Lưu cấu hình</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopItemManager;
