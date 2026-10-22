import React, { useState } from 'react';
import {
  Menu,
  Search,
  Plus,
  Volume2,
  Calendar,
  UserPlus,
  Bell,
  PhoneCall,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  LogOut,
  Shield,
  User,
} from 'lucide-react';
import { UserRole, QueueItem, Patient, UserAccount } from '../../types/clinic';
import { translations, Language } from '../../i18n/translations';
import { storage } from '../../services/storageService';

interface Props {
  onOpenMobile: () => void;
  lang: Language;
  activeRole: UserRole;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectPatientFromSearch: (patientId: string) => void;
  patients: Patient[];
  queue: QueueItem[];
  onCallNextPatient: () => void;
  onOpenNewPatientModal: () => void;
  onOpenBookAppointmentModal: () => void;
  lowStockCount: number;
}

export const Header: React.FC<Props> = ({
  onOpenMobile,
  lang,
  activeRole,
  currentUser,
  onLogout,
  searchQuery,
  onSearchChange,
  onSelectPatientFromSearch,
  patients,
  queue,
  onCallNextPatient,
  onOpenNewPatientModal,
  onOpenBookAppointmentModal,
  lowStockCount,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Filter patients for global search dropdown
  const filteredPatients = searchQuery.trim()
    ? patients.filter(
        (p) =>
          p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.fullNameAr.includes(searchQuery) ||
          p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.phone.includes(searchQuery) ||
          p.ceapGrade.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const waitingPatients = queue.filter(
    (q) => q.stage === 'Waiting' || q.stage === 'Triage'
  );
  const nextInLine = waitingPatients[0];

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-700 text-white shadow-lg border-b border-teal-600/30">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onOpenMobile}
            className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Global Quick Search */}
          <div className="relative flex-1">
            <div className="relative flex items-center">
              <Search
                className={`w-4 h-4 text-teal-200/80 absolute ${
                  isRtl ? 'right-3' : 'left-3'
                } pointer-events-none`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder={t.searchPlaceholder}
                className={`w-full bg-slate-900/40 hover:bg-slate-900/50 focus:bg-slate-950/80 border border-teal-500/40 focus:border-cyan-300 rounded-xl py-2 text-xs text-white placeholder:text-teal-200/60 transition shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-400/30 ${
                  isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className={`absolute ${
                    isRtl ? 'left-2.5' : 'right-2.5'
                  } text-xs text-teal-300 hover:text-white bg-white/10 rounded-full w-4 h-4 flex items-center justify-center`}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Instant Search Dropdown Results */}
            {showSearchDropdown && searchQuery.trim() && (
              <div
                className={`absolute top-full mt-2 w-full bg-slate-900 border border-teal-500/40 rounded-xl shadow-2xl py-2 z-50 max-h-80 overflow-y-auto ${
                  isRtl ? 'right-0' : 'left-0'
                }`}
              >
                <div className="px-3 py-1 text-[11px] font-bold text-teal-400 uppercase tracking-wider border-b border-slate-800">
                  {isRtl ? 'نتائج البحث السريع' : 'Search Matches'} ({filteredPatients.length})
                </div>
                {filteredPatients.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-slate-400 text-center">
                    {isRtl ? 'لا يوجد مريض مطابق' : 'No patients match your search.'}
                  </div>
                ) : (
                  filteredPatients.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectPatientFromSearch(p.id);
                        setShowSearchDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left rtl:text-right hover:bg-teal-900/50 flex items-center justify-between transition cursor-pointer border-b border-slate-800/50 last:border-0"
                    >
                      <div>
                        <div className="text-xs font-semibold text-white flex items-center gap-2">
                          <span>{isRtl ? p.fullNameAr || p.fullName : p.fullName}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-950 border border-teal-500/40 text-teal-300 font-mono">
                            {p.mrn}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {p.phone} • {p.affectedLeg} leg • {p.gender}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-900/60 border border-rose-500/30 text-rose-300">
                        {p.ceapGrade}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions, Queue Call, Notifications */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Call Next Patient Button */}
          {nextInLine ? (
            <button
              onClick={onCallNextPatient}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition active:scale-95 cursor-pointer animate-pulse"
              title={`Call ticket ${nextInLine.ticketNumber} (${nextInLine.patientName})`}
            >
              <Volume2 className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">{t.callNext}:</span>
              <span className="bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded text-[11px]">
                {nextInLine.ticketNumber}
              </span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 text-teal-200 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>{isRtl ? 'لا يوجد انتظار' : 'Queue Empty'}</span>
            </div>
          )}

          {/* Quick Action: New Patient */}
          <button
            onClick={onOpenNewPatientModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 transition active:scale-95 cursor-pointer shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5 text-cyan-200" />
            <span className="hidden md:inline">{t.newPatient}</span>
          </button>

          {/* Quick Action: Book Appointment */}
          <button
            onClick={onOpenBookAppointmentModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition active:scale-95 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.bookAppointment}</span>
          </button>

          {/* Notifications Popover Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white relative transition active:scale-95 cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {lowStockCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {lowStockCount}
                </span>
              )}
            </button>

            {/* Notifications Menu */}
            {showNotifications && (
              <div
                className={`absolute top-full mt-2 w-72 sm:w-80 bg-slate-900 border border-teal-500/40 rounded-2xl shadow-2xl p-4 z-50 ${
                  isRtl ? 'left-0' : 'right-0'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {isRtl ? 'التنبيهات السريرية' : 'Clinic Alerts'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-900/60 text-teal-300 font-semibold">
                    {lowStockCount > 0 ? `${lowStockCount} Action Needed` : 'System Normal'}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  {lowStockCount > 0 && (
                    <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-rose-300">
                          {isRtl ? 'تنبيه مخزون منخفض' : 'Low Stock Warning'}
                        </div>
                        <div className="text-[11px] text-slate-300 mt-0.5">
                          {isRtl
                            ? 'أمبولات مصلب Aethoxysklerol 1% تحت الحد الأدنى (4 أمبولات متبقية).'
                            : 'Polidocanol 1% ampoules below reorder threshold (4 units remaining).'}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-2.5 rounded-xl bg-teal-950/50 border border-teal-500/20 text-slate-300 flex items-start gap-2.5">
                    <FileSpreadsheet className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-teal-300">
                        {isRtl ? 'متابعة 24 ساعة بعد الليزر' : '24h Post-EVLA Ultrasound'}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {isRtl
                          ? 'المريض علي محمد حسن مجدول لفحص الدوبلكس التأكيدي لانسداد الوريد.'
                          : 'Ali Mohammed Hassan scheduled for 24h duplex occlusion confirmation.'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Authenticated Staff Profile & Sign Out */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-2 rtl:pr-2 rtl:pl-0 border-l rtl:border-r rtl:border-l-0 border-teal-600/40">
              <div className="flex items-center gap-2">
                <img
                  src={
                    currentUser.avatarUrl ||
                    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-400/50 shadow-sm"
                />
                <div className="text-left rtl:text-right hidden sm:block">
                  <div className="text-xs font-bold text-white leading-tight">
                    {isRtl ? currentUser.nameAr || currentUser.name : currentUser.name}
                  </div>
                  <div className="text-[10px] text-teal-300 font-medium">
                    {currentUser.role}
                  </div>
                </div>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-rose-600 text-white text-xs font-medium transition cursor-pointer shadow-sm active:scale-95"
                  title={isRtl ? 'تسجيل الخروج الآمن' : 'Secure Sign Out'}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{isRtl ? 'خروج' : 'Logout'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
