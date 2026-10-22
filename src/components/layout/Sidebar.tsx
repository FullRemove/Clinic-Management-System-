import React from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  Activity,
  Radio,
  FileCheck2,
  Zap,
  CreditCard,
  Package,
  UserCheck,
  BarChart3,
  MessageSquare,
  Settings,
  ShieldCheck,
  User,
  Globe,
  ChevronRight,
  ChevronLeft,
  Lock,
  LogOut,
} from 'lucide-react';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { UserRole, UserAccount, PermissionKey } from '../../types/clinic';
import { translations, Language } from '../../i18n/translations';
import { storage } from '../../services/storageService';

interface Props {
  currentView: string;
  onNavigate: (view: string) => void;
  lang: Language;
  onToggleLang: () => void;
  activeRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
  queueCount: number;
  lowStockCount: number;
  todayAptCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<Props> = ({
  currentView,
  onNavigate,
  lang,
  onToggleLang,
  activeRole,
  onChangeRole,
  currentUser,
  onLogout,
  queueCount,
  lowStockCount,
  todayAptCount,
  isMobileOpen,
  onCloseMobile,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const navItems: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge: React.ReactNode;
    badgeColor?: string;
    permission?: PermissionKey;
  }[] = [
    {
      id: 'dashboard',
      label: t.navDashboard,
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'patients',
      label: t.navPatients,
      icon: Users,
      badge: null,
      permission: 'view_patients',
    },
    {
      id: 'appointments',
      label: t.navAppointments,
      icon: Calendar,
      badge: todayAptCount > 0 ? todayAptCount : null,
      badgeColor: 'bg-teal-500 text-slate-950',
      permission: 'schedule_appointments',
    },
    {
      id: 'queue',
      label: t.navQueue,
      icon: Clock,
      badge: queueCount > 0 ? queueCount : null,
      badgeColor: 'bg-amber-400 text-slate-950 font-bold animate-pulse',
      permission: 'manage_queue',
    },
    {
      id: 'assessment',
      label: t.navClinicalAssessment,
      icon: Activity,
      badge: null,
      permission: 'clinical_assessment',
    },
    {
      id: 'ultrasound',
      label: t.navUltrasound,
      icon: Radio,
      badge: null,
      permission: 'duplex_ultrasound',
    },
    {
      id: 'treatment-plans',
      label: t.navTreatmentPlans,
      icon: FileCheck2,
      badge: null,
      permission: 'manage_treatment_plans',
    },
    {
      id: 'procedures',
      label: t.navProcedures,
      icon: Zap,
      badge: null,
      permission: 'perform_laser_procedures',
    },
    {
      id: 'finance',
      label: t.navFinance,
      icon: CreditCard,
      badge: null,
      permission: 'manage_billing',
    },
    {
      id: 'inventory',
      label: t.navInventory,
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : null,
      badgeColor: 'bg-rose-500 text-white font-bold',
      permission: 'manage_inventory',
    },
    {
      id: 'reports',
      label: t.navReports,
      icon: BarChart3,
      badge: null,
      permission: 'view_reports',
    },
    {
      id: 'whatsapp',
      label: t.navWhatsApp,
      icon: MessageSquare,
      badge: null,
      permission: 'view_patients',
    },
    {
      id: 'staff',
      label: t.navStaff,
      icon: UserCheck,
      badge: null,
      permission: 'manage_staff',
    },
    {
      id: 'settings',
      label: t.navSettings,
      icon: Settings,
      badge: null,
      permission: 'manage_settings',
    },
    {
      id: 'audit',
      label: t.navAudit,
      icon: ShieldCheck,
      badge: null,
      permission: 'view_audit_logs',
    },
    {
      id: 'portal',
      label: t.navPortal,
      icon: User,
      badge: 'Portal',
      badgeColor: 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/30',
    },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Dark Teal Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 z-50 w-72 bg-[#0B2528] text-slate-100 flex flex-col border-r border-teal-900/60 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isRtl ? 'right-0 border-l border-r-0' : 'left-0'
        } ${
          isMobileOpen
            ? 'translate-x-0'
            : isRtl
            ? 'translate-x-full lg:translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Clinic Header */}
        <div className="p-5 border-b border-teal-900/50 bg-[#081E20] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20 ring-2 ring-teal-300/40 shrink-0">
              <svg className="w-6 h-6 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-4-8c2.5-3 5.5-3 8 0m-8-5c2.5-3 5.5-3 8 0" />
              </svg>
            </div>
            <div className="overflow-hidden">
              <h1 className="text-base font-extrabold tracking-tight text-white leading-tight truncate">
                {isRtl ? 'مركز الأمل للدوالي' : 'Al-Amal Vein Clinic'}
              </h1>
              <p className="text-[11px] font-medium text-teal-400 truncate">
                {isRtl ? 'علاج الدوالي بالقسطرة والليزر' : 'Endovenous Laser & Vein Care'}
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-teal-900/50"
          >
            {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Staff User & Role Bar */}
        <div className="px-4 py-3 bg-[#07181a] border-b border-teal-950 space-y-2.5">
          {currentUser && (
            <div className="flex items-center justify-between pb-2 border-b border-teal-950/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={
                    currentUser.avatarUrl ||
                    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-cyan-400/50 shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {isRtl ? currentUser.nameAr || currentUser.name : currentUser.name}
                  </div>
                  <div className="text-[10px] text-teal-400 truncate">
                    {currentUser.licenseNumber ? `Lic: ${currentUser.licenseNumber}` : currentUser.email}
                  </div>
                </div>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg bg-teal-950/60 hover:bg-rose-900/60 text-slate-300 hover:text-white transition cursor-pointer"
                  title={isRtl ? 'تسجيل الخروج' : 'Sign Out'}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">{t.activeRole}:</span>
            <span className="px-2 py-0.5 rounded-full bg-teal-900/60 border border-teal-500/30 text-teal-300 font-semibold text-[10px]">
              {activeRole}
            </span>
          </div>

          <select
            value={activeRole}
            onChange={(e) => onChangeRole(e.target.value as UserRole)}
            className="w-full bg-[#0d2e32] border border-teal-700/50 rounded-lg px-2.5 py-1.5 text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
          >
            <option value="Vascular Surgeon">Dr. Karwan (Vascular Surgeon)</option>
            <option value="Phlebologist">Dr. Sarah (Phlebologist / Duplex)</option>
            <option value="Nurse">Zainab Hassan (Scrub Nurse)</option>
            <option value="Receptionist">Ahmed Al-Jaf (Receptionist)</option>
            <option value="Accountant">Noor Al-Huda (Accountant)</option>
            <option value="Clinic Admin">Administrator (Full Access)</option>
            <option value="Patient Portal">Patient Portal View</option>
          </select>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const isPermitted = !item.permission || storage.hasPermission(activeRole, item.permission);

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!isPermitted) {
                    alert(
                      isRtl
                        ? `هذا القسم مقيد بدور ${activeRole}. يلزم تصريح سريري أو إداري للوصول.`
                        : `This module is restricted for role "${activeRole}". Elevated clearance required.`
                    );
                    return;
                  }
                  handleNavClick(item.id);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  !isPermitted
                    ? 'opacity-40 hover:opacity-70 bg-slate-900/20 text-slate-400'
                    : isActive
                    ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md shadow-teal-900/40 ring-1 ring-teal-400/30'
                    : 'text-slate-300 hover:bg-teal-900/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      !isPermitted
                        ? 'text-slate-500'
                        : isActive
                        ? 'text-cyan-200'
                        : 'text-teal-400/80'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!isPermitted && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-950/60 text-amber-400 border border-amber-600/30">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Lock</span>
                    </span>
                  )}
                  {item.badge !== null && isPermitted && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        item.badgeColor || 'bg-teal-950 text-teal-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Actions: Language Switch & PWA Install */}
        <div className="p-4 border-t border-teal-900/50 bg-[#081E20] space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onToggleLang}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-900/40 border border-teal-700/40 text-teal-300 hover:bg-teal-800/50 hover:text-white text-xs font-semibold transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'العربية (RTL)' : 'English (LTR)'}</span>
            </button>

            <PWAInstallButton isRtl={isRtl} />
          </div>

          <div className="text-[10px] text-teal-600 text-center font-mono">
            Varicose Veins Clinic Suite v2.4 (IQD)
          </div>
        </div>
      </aside>
    </>
  );
};
