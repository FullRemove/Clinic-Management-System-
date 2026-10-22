/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { storage } from './services/storageService';
import { UserRole, QueueItem, Patient, UserAccount } from './types/clinic';
import { translations, Language } from './i18n/translations';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LoginScreen } from './components/auth/LoginScreen';

// Modals
import { NewPatientModal } from './components/modals/NewPatientModal';
import { BookAppointmentModal } from './components/modals/BookAppointmentModal';

// Views
import { DashboardView } from './views/DashboardView';
import { PatientsView } from './views/PatientsView';
import { AppointmentsView } from './views/AppointmentsView';
import { QueueView } from './views/QueueView';
import { ClinicalAssessmentView } from './views/ClinicalAssessmentView';
import { UltrasoundView } from './views/UltrasoundView';
import { TreatmentPlansView } from './views/TreatmentPlansView';
import { ProceduresView } from './views/ProceduresView';
import { FinanceView } from './views/FinanceView';
import { InventoryView } from './views/InventoryView';
import { StaffView } from './views/StaffView';
import { ReportsView } from './views/ReportsView';
import { WhatsAppView } from './views/WhatsAppView';
import { SettingsView } from './views/SettingsView';
import { AuditView } from './views/AuditView';
import { PatientPortalView } from './views/PatientPortalView';

export default function App() {
  // Sync state from storage
  const [lang, setLang] = useState<Language>(() => storage.getLanguage());
  const [activeRole, setActiveRole] = useState<UserRole>(() => storage.getActiveRole());
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => storage.getCurrentUser());
  const [currentView, setCurrentView] = useState<string>('dashboard');

  // Clinic Entities
  const [patients, setPatients] = useState(() => storage.getPatients());
  const [appointments, setAppointments] = useState(() => storage.getAppointments());
  const [queue, setQueue] = useState(() => storage.getQueue());
  const [assessments, setAssessments] = useState(() => storage.getAssessments());
  const [ultrasoundReports, setUltrasoundReports] = useState(() => storage.getUltrasoundReports());
  const [procedures, setProcedures] = useState(() => storage.getProcedures());
  const [invoices, setInvoices] = useState(() => storage.getInvoices());
  const [expenses, setExpenses] = useState(() => storage.getExpenses());
  const [inventory, setInventory] = useState(() => storage.getInventory());
  const [staff, setStaff] = useState(() => storage.getStaff());
  const [auditLogs, setAuditLogs] = useState(() => storage.getAuditLog());
  const [settings, setSettings] = useState(() => storage.getSettings());

  // UI States
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedPatientForDrawer, setSelectedPatientForDrawer] = useState<string | null>(null);

  // Modals
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] = useState(false);
  const [appointmentPatientPreselect, setAppointmentPatientPreselect] = useState<string | undefined>(undefined);

  // Call Toast Notification
  const [callNotification, setCallNotification] = useState<{
    ticket: string;
    name: string;
    station: string;
  } | null>(null);

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setPatients(storage.getPatients());
      setAppointments(storage.getAppointments());
      setQueue(storage.getQueue());
      setAssessments(storage.getAssessments());
      setUltrasoundReports(storage.getUltrasoundReports());
      setProcedures(storage.getProcedures());
      setInvoices(storage.getInvoices());
      setExpenses(storage.getExpenses());
      setInventory(storage.getInventory());
      setStaff(storage.getStaff());
      setAuditLogs(storage.getAuditLog());
      setSettings(storage.getSettings());
      setActiveRole(storage.getActiveRole());
      setCurrentUser(storage.getCurrentUser());
      setLang(storage.getLanguage());
    });
    return () => unsubscribe();
  }, []);

  // Update HTML document direction when language toggles
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    const nextLang: Language = lang === 'en' ? 'ar' : 'en';
    storage.setLanguage(nextLang);
    setLang(nextLang);
  };

  const handleRoleChange = (role: UserRole) => {
    storage.setActiveRole(role);
    setActiveRole(role);
    const matched = storage.getUserByRole(role);
    if (matched) {
      localStorage.setItem('vv_auth_user', JSON.stringify(matched));
      setCurrentUser(matched);
    }
    if (role === 'Patient Portal') {
      setCurrentView('portal');
    }
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    storage.setActiveRole(user.role);
    if (user.role === 'Patient Portal') {
      setCurrentView('portal');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    storage.logout();
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const handleEnterPatientPortal = () => {
    const portalUser: UserAccount = {
      id: 'usr-portal',
      username: 'patient',
      name: lang === 'ar' ? 'بوابة المراجع الذاتية' : 'Patient Self-Service Portal',
      nameAr: 'بوابة المراجع الذاتية',
      email: 'portal@alamal-veins.iq',
      role: 'Patient Portal',
      title: 'Patient Online Access',
      titleAr: 'وصول بوابة المرضى الإلكترونية',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    };
    localStorage.setItem('vv_auth_user', JSON.stringify(portalUser));
    storage.setActiveRole('Patient Portal');
    setCurrentUser(portalUser);
    setActiveRole('Patient Portal');
    setCurrentView('portal');
  };

  // Play realistic medical chime sound via Web Audio API
  const playChimeSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc1.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(440, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.85);
      osc2.stop(ctx.currentTime + 0.85);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  const handleCallPatient = (queueItem: QueueItem) => {
    playChimeSound();
    setCallNotification({
      ticket: queueItem.ticketNumber,
      name: queueItem.patientName,
      station: queueItem.stage,
    });
    setTimeout(() => setCallNotification(null), 5000);

    storage.logAudit({
      userId: 'st-4',
      userName: 'Reception / Triage Call',
      userRole: activeRole,
      action: `Called Ticket ${queueItem.ticketNumber}`,
      category: 'Patient',
      details: `${queueItem.patientName} called to ${queueItem.stage}`,
    });
  };

  const handleCallNextFromHeader = () => {
    const waiting = queue.filter((q) => q.stage === 'Waiting' || q.stage === 'Triage');
    if (waiting.length > 0) {
      handleCallPatient(waiting[0]);
    }
  };

  const handleAdvanceQueue = (id: string) => {
    storage.advanceQueueStage(id);
  };

  const handleSelectPatientFromSearch = (patientId: string) => {
    setSelectedPatientForDrawer(patientId);
    setCurrentView('patients');
  };

  const lowStockCount = inventory.filter((i) => i.currentStock <= i.minThreshold).length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAptCount = appointments.filter((a) => a.date === todayStr).length;
  const queueWaitingCount = queue.filter((q) => q.stage !== 'Completed').length;

  const isRtl = lang === 'ar';

  // Gate with Login Screen if not authenticated
  if (!currentUser) {
    return (
      <LoginScreen
        lang={lang}
        onToggleLang={toggleLanguage}
        onLoginSuccess={handleLoginSuccess}
        onEnterPatientPortal={handleEnterPatientPortal}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 ${isRtl ? 'font-cairo' : 'font-sans'}`}>
      {/* Dark Teal Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={(v) => {
          setCurrentView(v);
          if (v !== 'patients') setSelectedPatientForDrawer(null);
        }}
        lang={lang}
        onToggleLang={toggleLanguage}
        activeRole={activeRole}
        onChangeRole={handleRoleChange}
        currentUser={currentUser}
        onLogout={handleLogout}
        queueCount={queueWaitingCount}
        lowStockCount={lowStockCount}
        todayAptCount={todayAptCount}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Layout with Margin for Fixed Sidebar */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${isRtl ? 'lg:mr-72' : 'lg:ml-72'}`}>
        {/* Turquoise Gradient Header */}
        <Header
          onOpenMobile={() => setIsMobileNavOpen(true)}
          lang={lang}
          activeRole={activeRole}
          currentUser={currentUser}
          onLogout={handleLogout}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          onSelectPatientFromSearch={handleSelectPatientFromSearch}
          patients={patients}
          queue={queue}
          onCallNextPatient={handleCallNextFromHeader}
          onOpenNewPatientModal={() => setIsNewPatientModalOpen(true)}
          onOpenBookAppointmentModal={() => {
            setAppointmentPatientPreselect(undefined);
            setIsBookAppointmentModalOpen(true);
          }}
          lowStockCount={lowStockCount}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentView === 'dashboard' && (
            <DashboardView
              lang={lang}
              patients={patients}
              appointments={appointments}
              queue={queue}
              procedures={procedures}
              invoices={invoices}
              auditLogs={auditLogs}
              onNavigate={setCurrentView}
              onCallPatient={handleCallPatient}
              onAdvanceQueue={handleAdvanceQueue}
              onOpenNewPatientModal={() => setIsNewPatientModalOpen(true)}
              onOpenBookAppointmentModal={() => {
                setAppointmentPatientPreselect(undefined);
                setIsBookAppointmentModalOpen(true);
              }}
            />
          )}

          {currentView === 'patients' && (
            <PatientsView
              lang={lang}
              patients={patients}
              onOpenNewPatientModal={() => setIsNewPatientModalOpen(true)}
              onBookAppointmentForPatient={(pId) => {
                setAppointmentPatientPreselect(pId);
                setIsBookAppointmentModalOpen(true);
              }}
              selectedPatientId={selectedPatientForDrawer}
              onClearSelectedPatient={() => setSelectedPatientForDrawer(null)}
            />
          )}

          {currentView === 'appointments' && (
            <AppointmentsView
              lang={lang}
              appointments={appointments}
              patients={patients}
              staff={staff}
              onOpenBookAppointmentModal={() => {
                setAppointmentPatientPreselect(undefined);
                setIsBookAppointmentModalOpen(true);
              }}
            />
          )}

          {currentView === 'queue' && (
            <QueueView
              lang={lang}
              queue={queue}
              patients={patients}
              onCallPatient={handleCallPatient}
              onAdvanceQueue={handleAdvanceQueue}
            />
          )}

          {currentView === 'assessment' && (
            <ClinicalAssessmentView
              lang={lang}
              patients={patients}
              assessments={assessments}
            />
          )}

          {currentView === 'ultrasound' && (
            <UltrasoundView
              lang={lang}
              patients={patients}
              reports={ultrasoundReports}
            />
          )}

          {currentView === 'treatment-plans' && (
            <TreatmentPlansView
              lang={lang}
              patients={patients}
            />
          )}

          {currentView === 'procedures' && (
            <ProceduresView
              lang={lang}
              patients={patients}
              procedures={procedures}
            />
          )}

          {currentView === 'finance' && (
            <FinanceView
              lang={lang}
              invoices={invoices}
              expenses={expenses}
              patients={patients}
            />
          )}

          {currentView === 'inventory' && (
            <InventoryView
              lang={lang}
              inventory={inventory}
            />
          )}

          {currentView === 'staff' && (
            <StaffView
              lang={lang}
              staff={staff}
              activeRole={activeRole}
              onChangeRole={handleRoleChange}
            />
          )}

          {currentView === 'reports' && (
            <ReportsView
              lang={lang}
              patients={patients}
              appointments={appointments}
              procedures={procedures}
              invoices={invoices}
            />
          )}

          {currentView === 'whatsapp' && (
            <WhatsAppView
              lang={lang}
              patients={patients}
              appointments={appointments}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              lang={lang}
              settings={settings}
            />
          )}

          {currentView === 'audit' && (
            <AuditView
              lang={lang}
              auditLogs={auditLogs}
            />
          )}

          {currentView === 'portal' && (
            <PatientPortalView
              lang={lang}
              onExitPortal={() => {
                storage.setActiveRole('Vascular Surgeon');
                setActiveRole('Vascular Surgeon');
                setCurrentView('dashboard');
              }}
            />
          )}
        </main>
      </div>

      {/* Floating Audio / Patient Call Notification Toast */}
      {callNotification && (
        <div
          className={`fixed bottom-6 ${
            isRtl ? 'left-6' : 'right-6'
          } z-50 bg-slate-950 text-white border-2 border-amber-400 p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-bounce max-w-sm`}
        >
          <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 font-black text-lg flex items-center justify-center shrink-0">
            {callNotification.ticket}
          </div>
          <div>
            <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">
              {isRtl ? 'مناداة المريض الآن' : 'Calling Patient Now'}
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              {callNotification.name}
            </div>
            <div className="text-[11px] text-slate-300">
              {isRtl ? 'المحطة:' : 'Station:'} {callNotification.station}
            </div>
          </div>
        </div>
      )}

      {/* New Patient Registration Modal */}
      <NewPatientModal
        isOpen={isNewPatientModalOpen}
        onClose={() => setIsNewPatientModalOpen(false)}
        lang={lang}
      />

      {/* Book Appointment Modal */}
      <BookAppointmentModal
        isOpen={isBookAppointmentModalOpen}
        onClose={() => setIsBookAppointmentModalOpen(false)}
        lang={lang}
        preselectedPatientId={appointmentPatientPreselect}
      />
    </div>
  );
}
