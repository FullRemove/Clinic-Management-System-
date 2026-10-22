import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Receipt,
  Printer,
  CreditCard,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  FileText,
  Calendar,
  X,
} from 'lucide-react';
import { Invoice, ClinicExpense, Patient, InvoiceItem } from '../types/clinic';
import { storage } from '../services/storageService';
import { translations, Language } from '../i18n/translations';
import { RecordPaymentModal } from '../components/modals/RecordPaymentModal';

interface Props {
  lang: Language;
  invoices: Invoice[];
  expenses: ClinicExpense[];
  patients: Patient[];
}

export const FinanceView: React.FC<Props> = ({
  lang,
  invoices,
  expenses,
  patients,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [activeTab, setActiveTab] = useState<'invoices' | 'expenses'>('invoices');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [showNewExpenseModal, setShowNewExpenseModal] = useState(false);

  // New Invoice State
  const [invPatientId, setInvPatientId] = useState(patients[0]?.id || '');
  const [invItems, setInvItems] = useState<InvoiceItem[]>([
    {
      id: 'it-1',
      description: 'Right Leg EVLA Laser Ablation (1470nm Radial) + Tumescent Anesthesia',
      descriptionAr: 'قسطرة ليزر وريدي للطرف الأيمن مع تخدير انتفاخي',
      quantity: 1,
      unitPriceIQD: 1500000,
      totalIQD: 1500000,
    },
  ]);
  const [invDiscount, setInvDiscount] = useState(0);

  // New Expense State
  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState<ClinicExpense['category']>('Laser Equipment & Fibers');
  const [expAmount, setExpAmount] = useState(150000);
  const [expMethod, setExpMethod] = useState('Cash');

  // Compute Financial Aggregates
  const totalBilled = invoices.reduce((s, i) => s + i.totalIQD, 0);
  const totalCollected = invoices.reduce((s, i) => s + i.paidIQD, 0);
  const totalOutstanding = invoices.reduce((s, i) => s + i.balanceIQD, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amountIQD, 0);
  const netProfit = totalCollected - totalExpenses;

  const filteredInvoices = invoices.filter(
    (inv) => statusFilter === 'All' || inv.status === statusFilter
  );

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const p = patients.find((x) => x.id === invPatientId);
    if (!p) return;

    const subtotal = invItems.reduce((s, it) => s + it.totalIQD, 0);
    const total = Math.max(0, subtotal - invDiscount);
    const invNum = `INV-${new Date().getFullYear()}-${String(storage.getInvoices().length + 1).padStart(3, '0')}`;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNum,
      patientId: p.id,
      patientName: isRtl ? p.fullNameAr || p.fullName : p.fullName,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      items: invItems,
      subtotalIQD: subtotal,
      discountIQD: invDiscount,
      totalIQD: total,
      paidIQD: 0,
      balanceIQD: total,
      status: 'Pending',
      payments: [],
      notes: '',
      createdAt: new Date().toISOString(),
    };

    storage.saveInvoice(newInvoice);
    setShowNewInvoiceModal(false);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim()) return;

    const newExpense: ClinicExpense = {
      id: `exp-${Date.now()}`,
      title: expTitle.trim(),
      titleAr: expTitle.trim(),
      category: expCategory,
      amountIQD: expAmount,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: expMethod,
      receiptRef: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      recordedBy: 'Current Accountant',
    };

    storage.saveExpense(newExpense);
    setShowNewExpenseModal(false);
    setExpTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isRtl ? 'إجمالي الفواتير الصادرة' : 'Total Billed (IQD)'}
          </div>
          <div className="mt-2 text-xl font-black text-slate-900">
            {totalBilled.toLocaleString()} <span className="text-xs text-slate-500">{t.iqdSuffix}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            {isRtl ? 'المقبوضات المحصلة نقداً' : 'Total Collected (IQD)'}
          </div>
          <div className="mt-2 text-xl font-black text-emerald-600">
            {totalCollected.toLocaleString()} <span className="text-xs text-slate-500">{t.iqdSuffix}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-rose-600 uppercase tracking-wider">
            {t.outstandingBalance}
          </div>
          <div className="mt-2 text-xl font-black text-rose-600">
            {totalOutstanding.toLocaleString()} <span className="text-xs text-slate-500">{t.iqdSuffix}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
            {isRtl ? 'صافي أرباح العيادة' : 'Net Clinic Margin'}
          </div>
          <div className="mt-2 text-xl font-black text-cyan-700">
            {netProfit.toLocaleString()} <span className="text-xs text-slate-500">{t.iqdSuffix}</span>
          </div>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'invoices'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.financeTitle} ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'expenses'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.expenseTracker} ({expenses.length})
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {activeTab === 'invoices' ? (
            <>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
              >
                <option value="All">{t.all}</option>
                <option value="Paid">{t.statusPaid}</option>
                <option value="Partial">{t.statusPartial}</option>
                <option value="Pending">{t.statusPending}</option>
              </select>

              <button
                onClick={() => setShowNewInvoiceModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{t.newInvoice}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowNewExpenseModal(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{t.recordExpense}</span>
            </button>
          )}
        </div>
      </div>

      {/* Invoices List */}
      {activeTab === 'invoices' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">{t.invoiceNumber}</th>
                  <th className="py-3 px-4">{t.patient}</th>
                  <th className="py-3 px-4">{t.date}</th>
                  <th className="py-3 px-4">{t.totalAmount}</th>
                  <th className="py-3 px-4">{t.paidAmount}</th>
                  <th className="py-3 px-4">{t.balanceDue}</th>
                  <th className="py-3 px-4">{t.paymentStatus}</th>
                  <th className="py-3 px-4 text-center">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-700">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {inv.patientName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {inv.date}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {inv.totalIQD.toLocaleString()} {t.iqdSuffix}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600">
                      {inv.paidIQD.toLocaleString()} {t.iqdSuffix}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-rose-600">
                      {inv.balanceIQD.toLocaleString()} {t.iqdSuffix}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'Partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {inv.balanceIQD > 0 && (
                          <button
                            onClick={() => setSelectedInvoiceForPayment(inv)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{t.recordPayment}</span>
                          </button>
                        )}
                        <button
                          onClick={() => window.print()}
                          className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                          title="Print Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Expenses List */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Ref #</th>
                  <th className="py-3 px-4">{isRtl ? 'بيان المصروف' : 'Title'}</th>
                  <th className="py-3 px-4">{t.category}</th>
                  <th className="py-3 px-4">{t.date}</th>
                  <th className="py-3 px-4">{t.paymentMethod}</th>
                  <th className="py-3 px-4">{t.totalAmount}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-600">
                      {exp.receiptRef}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {isRtl ? exp.titleAr : exp.title}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-semibold">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">{exp.date}</td>
                    <td className="py-3 px-4 text-slate-700">{exp.paymentMethod}</td>
                    <td className="py-3 px-4 font-black text-rose-600">
                      {exp.amountIQD.toLocaleString()} {t.iqdSuffix}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Dialog */}
      {selectedInvoiceForPayment && (
        <RecordPaymentModal
          isOpen={true}
          onClose={() => setSelectedInvoiceForPayment(null)}
          lang={lang}
          invoice={selectedInvoiceForPayment}
        />
      )}

      {/* New Invoice Modal */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-teal-600" />
              {t.newInvoice}
            </h3>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">{t.patient} *</label>
              <select
                value={invPatientId}
                onChange={(e) => setInvPatientId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {isRtl ? p.fullNameAr : p.fullName} ({p.mrn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {isRtl ? 'البنود المضافة' : 'Invoice Line Item'}
              </label>
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'EVLA') {
                    setInvItems([
                      ...invItems,
                      {
                        id: `it-${Date.now()}`,
                        description: 'EVLA Laser Ablation (1470nm Radial) + Tumescent',
                        descriptionAr: 'قسطرة ليزر وريدي 1470 نانومتر',
                        quantity: 1,
                        unitPriceIQD: 1500000,
                        totalIQD: 1500000,
                      },
                    ]);
                  } else if (val === 'Duplex') {
                    setInvItems([
                      ...invItems,
                      {
                        id: `it-${Date.now()}`,
                        description: 'Bilateral Venous Duplex Ultrasound Scan',
                        descriptionAr: 'سونار الدوبلكس الملون لكلا الطرفين',
                        quantity: 1,
                        unitPriceIQD: 100000,
                        totalIQD: 100000,
                      },
                    ]);
                  } else if (val === 'Foam') {
                    setInvItems([
                      ...invItems,
                      {
                        id: `it-${Date.now()}`,
                        description: 'Ultrasound-Guided Foam Sclerotherapy (UGFS)',
                        descriptionAr: 'جلسة تصليب وريدي رغوي موجه بالسونار',
                        quantity: 1,
                        unitPriceIQD: 250000,
                        totalIQD: 250000,
                      },
                    ]);
                  } else if (val === 'Stockings') {
                    setInvItems([
                      ...invItems,
                      {
                        id: `it-${Date.now()}`,
                        description: 'Class II Medical Compression Stockings (Thigh-high)',
                        descriptionAr: 'جوارب طبية ضاغطة فئة ثانية فخذية',
                        quantity: 1,
                        unitPriceIQD: 75000,
                        totalIQD: 75000,
                      },
                    ]);
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
              >
                <option value="">+ Add Standard Medical Procedure / Item...</option>
                <option value="EVLA">EVLA 1470nm Laser Ablation (1,500,000 IQD)</option>
                <option value="Duplex">Bilateral Duplex Scan (100,000 IQD)</option>
                <option value="Foam">Foam Sclerotherapy UGFS (250,000 IQD)</option>
                <option value="Stockings">Class II Compression Stockings (75,000 IQD)</option>
              </select>
            </div>

            {/* Line items preview */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              {invItems.map((item, idx) => (
                <div key={item.id} className="flex justify-between items-center text-[11px]">
                  <span className="font-medium text-slate-800">{item.description}</span>
                  <span className="font-bold text-slate-900">{item.totalIQD.toLocaleString()} IQD</span>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">{t.discount}</label>
              <input
                type="number"
                value={invDiscount}
                onChange={(e) => setInvDiscount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowNewInvoiceModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleCreateInvoice}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold"
              >
                {t.newInvoice}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Expense Modal */}
      {showNewExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">{t.recordExpense}</h3>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Expense Title *</label>
              <input
                type="text"
                required
                value={expTitle}
                onChange={(e) => setExpTitle(e.target.value)}
                placeholder="e.g. Ultrasound probe gel refill"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">{t.category}</label>
              <select
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value as ClinicExpense['category'])}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
              >
                <option value="Laser Equipment & Fibers">Laser Equipment & Fibers</option>
                <option value="Ultrasound & Imaging Supplies">Ultrasound & Imaging Supplies</option>
                <option value="Sclerosant & Pharmaceuticals">Sclerosant & Pharmaceuticals</option>
                <option value="Compression Stockings Inventory">Compression Stockings Inventory</option>
                <option value="Clinic Rent & Utilities">Clinic Rent & Utilities</option>
                <option value="Staff Salaries & Commission">Staff Salaries & Commission</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">{t.totalAmount} (IQD) *</label>
              <input
                type="number"
                value={expAmount}
                onChange={(e) => setExpAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
              />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowNewExpenseModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleCreateExpense}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                {t.recordExpense}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
