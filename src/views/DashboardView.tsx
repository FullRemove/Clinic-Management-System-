import React from 'react';
import {
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Activity,
  Zap,
  Users,
  CheckCircle,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Volume2,
} from 'lucide-react';
import {
  Patient,
  Appointment,
  QueueItem,
  ProcedureRecord,
  Invoice,
  AuditLogEntry,
} from '../types/clinic';
import { translations, Language } from '../i18n/translations';

interface Props {
  lang: Language;
  patients: Patient[];
  appointments: Appointment[];
  queue: QueueItem[];
  procedures: ProcedureRecord[];
  invoices: Invoice[];
  auditLogs: AuditLogEntry[];
  onNavigate: (view: string) => void;
  onCallPatient: (queueItem: QueueItem) => void;
  onAdvanceQueue: (id: string) => void;
  onOpenNewPatientModal: () => void;
  onOpenBookAppointmentModal: () => void;
}

export const DashboardView: React.FC<Props> = ({
  lang,
  patients,
  appointments,
  queue,
  procedures,
  invoices,
  auditLogs,
  onNavigate,
  onCallPatient,
  onAdvanceQueue,
  onOpenNewPatientModal,
  onOpenBookAppointmentModal,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  // Compute live statistics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr);

  const waitingQueue = queue.filter((q) => q.stage !== 'Completed');

  // Revenue & Balances
  const totalCollections = invoices.reduce((sum, inv) => sum + inv.paidIQD, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balanceIQD, 0);

  // CEAP Distribution
  const ceapCounts: Record<string, number> = {
    C1: 0,
    C2: 0,
    C3: 0,
    C4a: 0,
    C4b: 0,
    C4c: 0,
    C5: 0,
    C6: 0,
  };
  patients.forEach((p) => {
    if (ceapCounts[p.ceapGrade] !== undefined) {
      ceapCounts[p.ceapGrade]++;
    } else {
      ceapCounts[p.ceapGrade] = 1;
    }
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Clinic Welcome & Quick Action Shortcuts */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-teal-800 to-cyan-900 border border-teal-500/30 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-400/20 text-teal-300 border border-teal-400/40">
                {isRtl ? 'العيادة التخصصية' : 'Varicose Vein Specialized Suite'}
              </span>
              <span className="text-xs text-teal-200">
                {new Date().toLocaleDateString(lang === 'ar' ? 'ar-IQ' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t.clinicName}
            </h2>
            <p className="text-xs sm:text-sm text-teal-200/90 mt-1 max-w-xl">
              {t.clinicSubtitle}
            </p>
          </div>

          {/* Quick Action Shortcut Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenNewPatientModal}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>+</span>
              <span>{t.newPatient}</span>
            </button>
            <button
              onClick={onOpenBookAppointmentModal}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.bookAppointment}</span>
            </button>
            <button
              onClick={() => onNavigate('assessment')}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-300" />
              <span>{isRtl ? 'تقييم سريري CEAP' : 'CEAP Exam'}</span>
            </button>
            <button
              onClick={() => onNavigate('ultrasound')}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-teal-300" />
              <span>{isRtl ? 'سونار الدوبلكس' : 'Duplex Scan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Appointments */}
        <div
          onClick={() => onNavigate('appointments')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.todayAppointments}
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {todayAppointments.length}
            </span>
            <span className="text-xs text-teal-600 font-semibold">
              {appointments.length} {isRtl ? 'إجمالي المجدول' : 'total scheduled'}
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>{isRtl ? 'عرض الجدول الزمني' : 'View daily schedule'}</span>
            {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        </div>

        {/* Card 2: Live Waiting Queue */}
        <div
          onClick={() => onNavigate('queue')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.activeQueue}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">
              {waitingQueue.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {isRtl ? 'مرضى في غرف الانتظار' : 'patients in clinic'}
            </span>
          </div>
          <div className="mt-3 text-[11px] text-amber-700 font-medium flex items-center justify-between border-t border-slate-100 pt-2">
            <span>{isRtl ? 'إدارة محطات الدور' : 'Manage waiting stations'}</span>
            {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        </div>

        {/* Card 3: Today's Revenue */}
        <div
          onClick={() => onNavigate('finance')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.todayRevenue}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {totalCollections.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-semibold ml-1 mr-1">
              {t.iqdSuffix}
            </span>
          </div>
          <div className="mt-3 text-[11px] text-emerald-600 font-medium flex items-center justify-between border-t border-slate-100 pt-2">
            <span>{isRtl ? 'سجل القبض والفواتير' : 'Billing & receipts'}</span>
            {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        </div>

        {/* Card 4: Outstanding Balance in IQD */}
        <div
          onClick={() => onNavigate('finance')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.outstandingBalance}
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-110 transition">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">
              {totalOutstanding.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-semibold ml-1 mr-1">
              {t.iqdSuffix}
            </span>
          </div>
          <div className="mt-3 text-[11px] text-rose-600 font-medium flex items-center justify-between border-t border-slate-100 pt-2">
            <span>{isRtl ? 'المطالبات والذمم المعلقة' : 'Pending balances'}</span>
            {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Main Two-Column Section: Waiting Room Queue & Upcoming Interventions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Live Waiting Room & Procedures */}
        <div className="lg:col-span-2 space-y-6">
          {/* Waiting Room Live Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-sm font-bold text-slate-900">
                  {t.waitingRoomLive}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('queue')}
                className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>{isRtl ? 'عرض الشاشة الكاملة' : 'Full Queue View'}</span>
                {isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>

            {waitingQueue.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                {isRtl ? 'صالة الانتظار فارغة حالياً' : 'No patients currently waiting.'}
              </div>
            ) : (
              <div className="mt-4 divide-y divide-slate-100">
                {waitingQueue.slice(0, 5).map((q) => (
                  <div
                    key={q.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-teal-900 text-teal-200 font-black text-sm flex items-center justify-center shrink-0">
                        {q.ticketNumber}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          <span>{q.patientName}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              q.priority === 'Urgent' || q.priority === 'Post-Op Emergency'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {q.priority}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {isRtl ? 'الطبيب:' : 'Doctor:'} {q.doctorName} • {isRtl ? 'الوصول:' : 'Arrived:'} {q.arrivalTime}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200/60">
                        {q.stage}
                      </span>
                      <button
                        onClick={() => onCallPatient(q)}
                        className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 transition cursor-pointer"
                        title={isRtl ? 'مناداة المريض' : 'Call patient'}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onAdvanceQueue(q.id)}
                        className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition cursor-pointer"
                      >
                        {isRtl ? 'نقل للمحطة التالية' : 'Next Stage'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Surgical & Laser Procedures */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {t.upcomingInterventions}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('procedures')}
                className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>{isRtl ? 'سجل العمليات' : 'Procedures Log'}</span>
                {isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {procedures.map((proc) => (
                <div
                  key={proc.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>{proc.procedureType}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800">
                        {proc.leg} leg
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {proc.patientName} • {proc.roomNumber} • {proc.primarySurgeon}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {proc.operativeDetails.totalEnergyJoules && (
                      <span className="px-2 py-1 rounded-md bg-slate-100 font-mono text-[11px] text-slate-700">
                        {proc.operativeDetails.totalEnergyJoules} Joules
                      </span>
                    )}
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        proc.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}
                    >
                      {proc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: CEAP Breakdown & Follow-up alerts */}
        <div className="space-y-6">
          {/* CEAP Distribution Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              {t.ceapDistribution}
            </h3>

            <div className="mt-4 space-y-2.5 text-xs">
              {[
                { stage: 'C1', desc: 'Spider / Reticular (<3mm)', color: 'bg-cyan-500' },
                { stage: 'C2', desc: 'Varicose Veins (>=3mm)', color: 'bg-teal-500' },
                { stage: 'C3', desc: 'Venous Edema', color: 'bg-blue-500' },
                { stage: 'C4a', desc: 'Pigmentation / Eczema', color: 'bg-amber-500' },
                { stage: 'C4b', desc: 'Lipodermatosclerosis', color: 'bg-orange-500' },
                { stage: 'C5', desc: 'Healed Venous Ulcer', color: 'bg-purple-500' },
                { stage: 'C6', desc: 'Active Venous Ulcer', color: 'bg-rose-600 font-bold' },
              ].map((item) => {
                const count = ceapCounts[item.stage] || 0;
                const percentage =
                  patients.length > 0 ? Math.round((count / patients.length) * 100) : 0;
                return (
                  <div key={item.stage} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-800">
                        {item.stage}: <span className="font-normal text-slate-500">{item.desc}</span>
                      </span>
                      <span className="font-bold text-slate-900">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${item.color}`}
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Follow-up Alerts & Quick Reminders */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {t.followUpAlerts}
            </h3>

            <div className="mt-3 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200/60">
                <div className="font-bold text-teal-900 flex items-center justify-between">
                  <span>24h Post-EVLA Duplex Check</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-teal-200 text-teal-900">
                    Tomorrow
                  </span>
                </div>
                <div className="text-[11px] text-teal-800 mt-1">
                  Ali Mohammed Hassan (Right GSV Ablation) - Confirm GSV occlusion and ruling out EHIT (Endovenous Heat-Induced Thrombosis).
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/60">
                <div className="font-bold text-amber-900 flex items-center justify-between">
                  <span>Active Ulcer Dressing & Compression</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                    In 2 Days
                  </span>
                </div>
                <div className="text-[11px] text-amber-800 mt-1">
                  Omar Tariq Al-Nuaimi - Unna boot replacement & wound measurement.
                </div>
              </div>
            </div>
          </div>

          {/* Recent Audit Log Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              {t.recentActivity}
            </h3>

            <div className="mt-3 divide-y divide-slate-100 text-xs">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="py-2.5">
                  <div className="font-semibold text-slate-900 text-[11px] truncate">
                    {log.action}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center justify-between mt-0.5">
                    <span>{log.userName}</span>
                    <span className="font-mono">{log.timestamp.split(' ')[1] || log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
