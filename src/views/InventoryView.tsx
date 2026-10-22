import React, { useState } from 'react';
import {
  Package,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Trash2,
  TrendingDown,
  Layers,
} from 'lucide-react';
import { InventoryItem } from '../types/clinic';
import { storage } from '../services/storageService';
import { translations, Language } from '../i18n/translations';

interface Props {
  lang: Language;
  inventory: InventoryItem[];
}

export const InventoryView: React.FC<Props> = ({
  lang,
  inventory,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Item State
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [category, setCategory] = useState<InventoryItem['category']>('Laser Fibers');
  const [currentStock, setCurrentStock] = useState(10);
  const [minThreshold, setMinThreshold] = useState(5);
  const [unit, setUnit] = useState('pcs');
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('2028-12-31');
  const [unitCostIQD, setUnitCostIQD] = useState(50000);
  const [supplier, setSupplier] = useState('Biolitec Europe');

  const filteredItems = inventory.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.nameAr.includes(search) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleAdjustStock = (id: string, delta: number) => {
    const item = inventory.find((i) => i.id === id);
    if (!item) return;
    const newStock = Math.max(0, item.currentStock + delta);
    storage.saveInventoryItem({ ...item, currentStock: newStock });
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      sku: sku.trim() || `SKU-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      nameAr: nameAr.trim() || name.trim(),
      category,
      currentStock,
      minThreshold,
      unit,
      batchNumber: batchNumber.trim() || `BAT-${new Date().getFullYear()}`,
      expiryDate,
      unitCostIQD,
      supplier: supplier.trim(),
    };

    storage.saveInventoryItem(newItem);
    setShowAddModal(false);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm(t.confirmDelete)) {
      storage.deleteInventoryItem(id);
    }
  };

  const lowStockTotal = inventory.filter((i) => i.currentStock <= i.minThreshold).length;

  return (
    <div className="space-y-6">
      {/* Top Controls Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.inventoryTitle}</h3>
            <p className="text-xs text-slate-500">
              {isRtl
                ? 'ألياف الليزر وقساطر الإدخال والمواد المصلبة والجوارب الضاغطة'
                : 'Laser fibers, introducer sheaths, Polidocanol ampoules & stocking inventory'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {lowStockTotal > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>
                {lowStockTotal} {isRtl ? 'مواد وشكت على النفاد' : 'Low Stock Items'}
              </span>
            </div>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t.newItem}</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="relative flex-1 w-full">
          <Search
            className={`w-4 h-4 text-slate-400 absolute ${
              isRtl ? 'right-3' : 'left-3'
            } top-1/2 -translate-y-1/2`}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search supply by name, SKU, or batch..."
            className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
              isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
            }`}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 cursor-pointer"
        >
          <option value="All">{t.all} Categories</option>
          <option value="Laser Fibers">Laser Fibers (ألياف ليزر)</option>
          <option value="Introducer Sheaths">Introducer Sheaths (قساطر مدخل)</option>
          <option value="Sclerosants">Sclerosants (مواد مصلبة)</option>
          <option value="Compression Stockings">Compression Stockings (جوارب ضاغطة)</option>
          <option value="Tumescent Kits">Tumescent Kits (أطقم تخدير)</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{t.sku}</th>
                <th className="py-3 px-4">{t.itemName}</th>
                <th className="py-3 px-4">{t.category}</th>
                <th className="py-3 px-4 text-center">{t.stockLevel}</th>
                <th className="py-3 px-4">{t.batchNo} & Expiry</th>
                <th className="py-3 px-4">{t.unitCost}</th>
                <th className="py-3 px-4 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const isLow = item.currentStock <= item.minThreshold;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-700">
                      {item.sku}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        {isRtl ? item.nameAr || item.name : item.name}
                      </div>
                      <div className="text-[11px] text-slate-500">{item.supplier}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleAdjustStock(item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span
                          className={`font-black font-mono px-2 py-0.5 rounded-lg text-xs ${
                            isLow
                              ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                              : 'bg-teal-50 text-teal-800'
                          }`}
                        >
                          {item.currentStock} {item.unit}
                        </span>
                        <button
                          onClick={() => handleAdjustStock(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      {isLow && (
                        <div className="text-[10px] text-rose-600 font-bold mt-1">
                          Reorder Alert (&lt;= {item.minThreshold})
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-700">{item.batchNumber}</div>
                      <div className="text-[10px] text-slate-400">Exp: {item.expiryDate}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {item.unitCostIQD.toLocaleString()} {t.iqdSuffix}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title={t.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Medical Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">{t.newItem}</h3>
            <form onSubmit={handleCreateItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">SKU / Code *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. FIB-1470"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">{t.category}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as InventoryItem['category'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  >
                    <option value="Laser Fibers">Laser Fibers</option>
                    <option value="Introducer Sheaths">Introducer Sheaths</option>
                    <option value="Sclerosants">Sclerosants</option>
                    <option value="Compression Stockings">Compression Stockings</option>
                    <option value="Tumescent Kits">Tumescent Kits</option>
                    <option value="Wound Dressings">Wound Dressings</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Item Name (English) *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 1470nm Radial Laser Fiber"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Stock Qty *</label>
                  <input
                    type="number"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Reorder Level *</label>
                  <input
                    type="number"
                    value={minThreshold}
                    onChange={(e) => setMinThreshold(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Cost (IQD) *</label>
                  <input
                    type="number"
                    value={unitCostIQD}
                    onChange={(e) => setUnitCostIQD(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
