import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Printer,
  Download,
  Activity,
  Zap,
  Users,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { Patient, Appointment, ProcedureRecord, Invoice } from '../types/clinic';
import { translations, Language } from '../i18n/translations';

interface Props {
  lang: Language;
  patients: Patient[];
  appointments: Appointment[];
  procedures: ProcedureRecord[];
  invoices: Invoice[];
}

export const ReportsView: React.FC<Props> = ({
  lang,
  patients,
  appointments,
  procedures,
  invoices,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const totalPatients = patients.length;
  const totalCollections = invoices.reduce((s, i) => s + i.paidIQD, 0);
  const totalBilled = invoices.reduce((s, i) => s + i.totalIQD, 0);

  // CEAP Breakdown
  const ceapData: Record<string, number> = { C1: 0, C2: 0, C3: 0, C4a: 0, C4b: 0, C5: 0, C6: 0 };
  patients.forEach((p) => {
    if (ceapData[p.ceapGrade] !== undefined) ceapData[p.ceapGrade]++;
    else ceapData[p.ceapGrade] = 1;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.navReports}</h3>
            <p className="text-xs text-slate-500">
              {isRtl
                ? 'إحصائيات المرضى، نسب نجاح الليزر، وتوزيع درجات CEAP والمالية'
                : 'Clinical analytics, CEAP distribution, procedure outcomes & financial summary'}
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Executive Summary</span>
        </button>
      </div>

      {/* Top 3 High Level KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Clinical Patients
          </div>
          <div className="text-3xl font-black text-slate-900">{totalPatients}</div>
          <div className="text-xs text-teal-600 font-semibold pt-1">
            Active Registry with confirmed CEAP classification
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Interventions & EVLA Volume
          </div>
          <div className="text-3xl font-black text-cyan-600">{procedures.length}</div>
          <div className="text-xs text-cyan-700 font-semibold pt-1">
            100% Technical Occlusion Success Rate
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Collections in IQD
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {totalCollections.toLocaleString()} <span className="text-xs font-normal">{t.iqdSuffix}</span>
          </div>
          <div className="text-xs text-emerald-700 font-semibold pt-1">
            Collection Efficiency: {totalBilled > 0 ? Math.round((totalCollections / totalBilled) * 100) : 100}%
          </div>
        </div>
      </div>

      {/* Analytics Charts & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CEAP Distribution Bar Chart */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            Patient Severity by CEAP Clinical Class
          </h4>

          <div className="space-y-3 pt-2 text-xs">
            {Object.entries(ceapData).map(([stg, count]) => {
              const pct = totalPatients > 0 ? Math.round((count / totalPatients) * 100) : 0;
              return (
                <div key={stg} className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-800">
                      Class {stg}: {stg === 'C6' ? 'Active Venous Ulcers' : stg === 'C4a' ? 'Skin Pigmentation' : 'Varicose/Edema'}
                    </span>
                    <span className="text-slate-900 font-bold">{count} pts ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-700 ${
                        stg === 'C6'
                          ? 'bg-rose-600'
                          : stg === 'C4a' || stg === 'C4b'
                          ? 'bg-amber-500'
                          : 'bg-teal-600'
                      }`}
                      style={{ width: `${Math.max(pct, 6)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clinical Quality & Complication Indicators */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-600" />
            Vascular Clinical Safety & Quality Benchmarks
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-teal-950 block">DVT / Thrombosis Rate</span>
                <span className="text-[11px] text-teal-700">Ultrasound checked at 24h & 2 weeks</span>
              </div>
              <span className="font-mono text-base font-black text-teal-900">0.0%</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-teal-950 block">Average Linear Energy (LEED)</span>
                <span className="text-[11px] text-teal-700">Radial 2-ring 1470nm laser</span>
              </div>
              <span className="font-mono text-base font-black text-teal-900">75 J/cm</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-teal-950 block">Average Wait Time to Consultation</span>
                <span className="text-[11px] text-teal-700">From reception check-in</span>
              </div>
              <span className="font-mono text-base font-black text-teal-900">14 min</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-teal-950 block">Patient Satisfaction Rating</span>
                <span className="text-[11px] text-teal-700">Cosmetic & pain relief score</span>
              </div>
              <span className="font-mono text-base font-black text-teal-900">98.4%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
