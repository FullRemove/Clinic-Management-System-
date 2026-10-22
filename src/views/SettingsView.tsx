import React, { useState } from 'react';
import {
  Settings,
  Save,
  Download,
  Upload,
  RefreshCw,
  Building,
  Phone,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { ClinicSettings } from '../types/clinic';
import { storage } from '../services/storageService';
import { translations, Language } from '../i18n/translations';

interface Props {
  lang: Language;
  settings: ClinicSettings;
}

export const SettingsView: React.FC<Props> = ({
  lang,
  settings,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [clinicNameEn, setClinicNameEn] = useState(settings.clinicNameEn);
  const [clinicNameAr, setClinicNameAr] = useState(settings.clinicNameAr);
  const [phone, setPhone] = useState(settings.phone);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);
  const [email, setEmail] = useState(settings.email);
  const [addressEn, setAddressEn] = useState(settings.addressEn);
  const [addressAr, setAddressAr] = useState(settings.addressAr);
  const [leadSurgeonEn, setLeadSurgeonEn] = useState(settings.leadSurgeonEn);
  const [leadSurgeonAr, setLeadSurgeonAr] = useState(settings.leadSurgeonAr);
  const [workingHoursEn, setWorkingHoursEn] = useState(settings.workingHoursEn);
  const [workingHoursAr, setWorkingHoursAr] = useState(settings.workingHoursAr);
  const [currency, setCurrency] = useState(settings.currency);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ClinicSettings = {
      ...settings,
      clinicNameEn,
      clinicNameAr,
      phone,
      whatsapp,
      email,
      addressEn,
      addressAr,
      leadSurgeonEn,
      leadSurgeonAr,
      workingHoursEn,
      workingHoursAr,
      currency,
    };
    storage.saveSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportBackup = () => {
    const jsonStr = storage.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VaricoseVeinsClinic_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = storage.importFullBackup(content);
      if (success) {
        alert(isRtl ? 'تمت استعادة قاعدة البيانات بنجاح.' : 'Clinic database restored successfully!');
        window.location.reload();
      } else {
        alert(isRtl ? 'فشل استرجاع الملف. تأكد من صحة التنسيق.' : 'Failed to import backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefault = () => {
    if (confirm(isRtl ? 'هل تريد استعادة البيانات النموذجية الافتراضية للعيادة؟' : 'Reset all clinic data to default sample records?')) {
      storage.resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.settingsTitle}</h3>
            <p className="text-xs text-slate-500">
              {isRtl
                ? 'إعدادات المركز، العملة (دينار عراقي)، والنسخ الاحتياطي لقاعدة البيانات'
                : 'Clinic profile, currency configuration & full JSON database backup / restore'}
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-bounce">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Saved Successfully</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Clinic Profile Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 text-xs">
          <h4 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-teal-600" />
            {t.clinicDetails}
          </h4>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Clinic Name (English) *</label>
                <input
                  type="text"
                  required
                  value={clinicNameEn}
                  onChange={(e) => setClinicNameEn(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">اسم المركز (العربية) *</label>
                <input
                  type="text"
                  required
                  value={clinicNameAr}
                  onChange={(e) => setClinicNameAr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Consultant Surgeon (English)</label>
                <input
                  type="text"
                  value={leadSurgeonEn}
                  onChange={(e) => setLeadSurgeonEn(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">اسم الاستشاري الجراح (العربية)</label>
                <input
                  type="text"
                  value={leadSurgeonAr}
                  onChange={(e) => setLeadSurgeonAr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">{t.phone}</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">WhatsApp</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Address (English)</label>
                <input
                  type="text"
                  value={addressEn}
                  onChange={(e) => setAddressEn(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">العنوان (العربية)</label>
                <input
                  type="text"
                  value={addressAr}
                  onChange={(e) => setAddressAr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">{t.currencyConfig}</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full sm:w-64 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
              >
                <option value="IQD">Iraqi Dinar (IQD / د.ع)</option>
                <option value="USD">US Dollar (USD / $)</option>
              </select>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{t.save}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Database Backup, Restore & Reset */}
        <div className="space-y-6 text-xs">
          {/* Backup & Restore Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Database Backups & Disaster Recovery
            </h4>

            <p className="text-slate-600 leading-relaxed text-[11px]">
              Export the entire clinic database (all registered patients, duplex reports, procedure notes, invoices, and audit trails) as an encrypted JSON backup file.
            </p>

            <button
              onClick={handleExportBackup}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-teal-400" />
              <span>{t.backupDatabase}</span>
            </button>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-slate-700 font-semibold mb-1.5">
                {t.restoreDatabase}
              </label>
              <label className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition cursor-pointer flex items-center justify-center gap-2 border border-slate-300 border-dashed">
                <Upload className="w-4 h-4 text-slate-600" />
                <span>Select JSON File to Restore</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Reset Box */}
          <div className="bg-white rounded-3xl border border-rose-200 p-6 shadow-sm space-y-3">
            <h4 className="font-bold text-rose-900 text-sm pb-1 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Factory Reset & Sample Data
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Resets all clinic storage to initial sample patients (CEAP C1 to C6), realistic duplex reports, appointments, and inventory.
            </p>
            <button
              onClick={handleResetToDefault}
              className="w-full py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition cursor-pointer border border-rose-200 flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.resetFactory}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
