import React, { useState } from 'react';
import {
  Lock,
  User,
  ShieldCheck,
  Stethoscope,
  Activity,
  HeartPulse,
  CreditCard,
  UserCheck,
  ArrowRight,
  ArrowLeft,
  Globe,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { storage } from '../../services/storageService';
import { UserAccount, UserRole } from '../../types/clinic';
import { translations, Language } from '../../i18n/translations';

interface Props {
  lang: Language;
  onToggleLang: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  onEnterPatientPortal: () => void;
}

export const LoginScreen: React.FC<Props> = ({
  lang,
  onToggleLang,
  onLoginSuccess,
  onEnterPatientPortal,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const accounts = storage.getUserAccounts();

  const [identifier, setIdentifier] = useState('dr.karwan');
  const [password, setPassword] = useState('doctor123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const user = storage.login(identifier, password);
    if (user) {
      onLoginSuccess(user);
    } else {
      setErrorMsg(
        isRtl
          ? 'اسم المستخدم أو كلمة المرور غير صحيحة. يرجى تجربة الحسابات السريعة بالأسفل.'
          : 'Invalid credentials. You can click any pre-configured staff profile below to sign in.'
      );
    }
  };

  const handleQuickLogin = (acc: UserAccount) => {
    setIdentifier(acc.username);
    setPassword(acc.password || 'password123');
    const user = storage.login(acc.username, acc.password);
    if (user) {
      onLoginSuccess(user);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 flex flex-col justify-between relative overflow-hidden text-slate-100 ${isRtl ? 'font-cairo' : 'font-sans'}`}>
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 -mt-32 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar: Brand & Language Toggle */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-teal-950/80 bg-[#081E20]/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20 ring-2 ring-teal-300/40">
            <svg className="w-6 h-6 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-4-8c2.5-3 5.5-3 8 0m-8-5c2.5-3 5.5-3 8 0" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-tight">
              {t.clinicName}
            </h1>
            <p className="text-[11px] text-teal-400 font-medium">
              {isRtl ? 'منظومة إدارة عيادة الدوالي المتكاملة' : 'Varicose Veins Clinic Management Suite'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-900/40 border border-teal-700/40 text-teal-300 hover:text-white text-xs font-semibold transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'العربية (RTL)' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch my-6">
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-[11px] font-bold text-teal-400 uppercase tracking-widest">
                  {isRtl ? 'تسجيل دخول الكادر الطبي والإداري' : 'Authorized Personnel Sign In'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isRtl ? 'تسجيل الدخول إلى محطة العمل' : 'Access Clinical Workstation'}
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {isRtl
                  ? 'يرجى تسجيل الدخول بحسابك لمباشرة الجولات السريرية، فحص الدوبلكس، عمليات الليزر أو الفواتير.'
                  : 'Enter your clinic credentials to manage patients, duplex scans, laser protocols, or billing.'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-400" />
                  {isRtl ? 'اسم المستخدم أو البريد الإلكتروني' : 'Username or Email'}
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. dr.karwan or karwan.kurd@alamal-veins.iq"
                  className="w-full bg-slate-950/80 border border-teal-500/30 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-teal-400" />
                  {isRtl ? 'كلمة المرور' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/80 border border-teal-500/30 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 ${
                      isRtl ? 'left-3' : 'right-3'
                    } text-slate-400 hover:text-white`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-teal-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isRtl ? 'تسجيل الدخول' : 'Sign In to System'}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Quick Switch to Patient Portal */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">
                {isRtl ? 'هل أنت مريض تراجع العيادة؟' : 'Are you a vein clinic patient?'}
              </span>
              <button
                type="button"
                onClick={onEnterPatientPortal}
                className="text-cyan-400 hover:text-cyan-300 font-bold text-xs underline cursor-pointer"
              >
                {t.navPortal} →
              </button>
            </div>
          </div>

          {/* Right Column: Pre-configured Staff Demo Accounts (5 cols) */}
          <div className="lg:col-span-5 bg-[#0B2528]/80 border border-teal-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-md flex flex-col justify-between space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-teal-900/60 mb-3">
                <span className="font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  {isRtl ? 'حسابات تجريبية سريعة' : 'Quick Demo Staff Login'}
                </span>
                <span className="text-[10px] text-teal-400/80">One-click</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                {isRtl
                  ? 'اضغط على أي دور وظيفي بالأسفل لتسجيل الدخول فوراً واختبار الصلاحيات المخصصة له:'
                  : 'Click on any staff member below to log in instantly and test their role-specific permissions:'}
              </p>

              {/* Staff Accounts List */}
              <div className="space-y-2 overflow-y-auto max-h-[360px] pr-1">
                {accounts.map((acc) => {
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleQuickLogin(acc)}
                      className="w-full p-2.5 rounded-2xl bg-slate-900/60 hover:bg-teal-900/60 border border-teal-500/20 hover:border-teal-400 text-left rtl:text-right transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={acc.avatarUrl}
                          alt={acc.name}
                          className="w-9 h-9 rounded-xl object-cover border border-teal-500/40 shrink-0"
                        />
                        <div className="truncate">
                          <div className="font-bold text-white text-xs truncate group-hover:text-cyan-300 transition">
                            {isRtl ? acc.nameAr : acc.name}
                          </div>
                          <div className="text-[10px] text-teal-400 truncate">
                            {acc.role}
                          </div>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-950 border border-teal-500/30 text-teal-300 shrink-0">
                        Select
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-teal-950/60 border border-teal-500/30 text-[10px] text-teal-200 flex items-center justify-between">
              <span>Security: Role-Based Access Control</span>
              <span className="font-mono text-cyan-400 font-bold">RBAC v2.4</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 px-6 text-center text-xs text-slate-500 border-t border-teal-950/80 bg-[#081E20]/50">
        Varicose Veins Clinic Management System • Endovenous Laser Therapy (EVLA 1470nm) & Duplex Ultrasound Platform
      </footer>
    </div>
  );
};
