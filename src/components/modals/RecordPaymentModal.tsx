import React, { useState } from 'react';
import { X, CreditCard, DollarSign, Receipt, CheckCircle } from 'lucide-react';
import { Invoice, PaymentReceipt } from '../../types/clinic';
import { storage } from '../../services/storageService';
import { translations, Language } from '../../i18n/translations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  invoice: Invoice;
  onPaymentRecorded?: () => void;
}

export const RecordPaymentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  lang,
  invoice,
  onPaymentRecorded,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [amountIQD, setAmountIQD] = useState(invoice.balanceIQD);
  const [method, setMethod] = useState<PaymentReceipt['method']>('Cash');
  const [receivedBy, setReceivedBy] = useState('Noor Al-Huda (Accountant)');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paidNum = Number(amountIQD);
    if (paidNum <= 0) {
      alert(isRtl ? 'يرجى إدخال مبلغ صحيح' : 'Please enter a valid amount');
      return;
    }

    const receiptNum = `REC-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const newPayment: PaymentReceipt = {
      id: `pay-${Date.now()}`,
      receiptNumber: receiptNum,
      date: new Date().toLocaleString(),
      amountIQD: paidNum,
      method,
      receivedBy,
      notes: notes.trim(),
    };

    const newPaidTotal = invoice.paidIQD + paidNum;
    const newBalance = Math.max(0, invoice.totalIQD - newPaidTotal);
    const newStatus = newBalance === 0 ? 'Paid' : 'Partial';

    const updatedInvoice: Invoice = {
      ...invoice,
      paidIQD: newPaidTotal,
      balanceIQD: newBalance,
      status: newStatus,
      payments: [...invoice.payments, newPayment],
    };

    storage.saveInvoice(updatedInvoice);
    if (onPaymentRecorded) onPaymentRecorded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md my-8 bg-slate-900 border border-teal-500/40 rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-800 to-cyan-800 border-b border-teal-600/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {t.recordPayment}
              </h3>
              <p className="text-xs text-teal-200">
                {invoice.invoiceNumber} • {invoice.patientName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Invoice Balances Summary */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 block">{t.totalAmount}:</span>
              <span className="text-sm font-bold text-slate-200">
                {invoice.totalIQD.toLocaleString()} {t.iqdSuffix}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-rose-400 block">{t.balanceDue}:</span>
              <span className="text-sm font-extrabold text-rose-400">
                {invoice.balanceIQD.toLocaleString()} {t.iqdSuffix}
              </span>
            </div>
          </div>

          {/* Payment Amount */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {isRtl ? 'المبلغ المسدد الآن (د.ع) *' : 'Amount Being Paid (IQD) *'}
            </label>
            <input
              type="number"
              required
              min={1000}
              max={invoice.balanceIQD}
              value={amountIQD}
              onChange={(e) => setAmountIQD(Number(e.target.value))}
              className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">{t.paymentMethod}</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentReceipt['method'])}
              className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
            >
              <option value="Cash">{isRtl ? 'نقداً (كاش)' : 'Cash'}</option>
              <option value="Visa/MasterCard">Visa / MasterCard</option>
              <option value="ZainCash">ZainCash (محفظة زين كاش)</option>
              <option value="FastPay">FastPay (فاست باي)</option>
              <option value="Qi Card">Qi Card (كي كارد / الرافدين)</option>
            </select>
          </div>

          {/* Received By Staff Member */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {isRtl ? 'الموظف المستلم' : 'Received By'}
            </label>
            <input
              type="text"
              value={receivedBy}
              onChange={(e) => setReceivedBy(e.target.value)}
              className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">{t.clinicalNotes}</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Deposit for EVLA procedure"
              className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold transition shadow-lg shadow-teal-500/20 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{t.recordPayment}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
