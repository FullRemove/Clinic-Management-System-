import React, { useState } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  Phone,
  MessageSquare,
  FileText,
  Calendar,
  AlertTriangle,
  HeartPulse,
  Trash2,
  ExternalLink,
  Printer,
  X,
  CreditCard,
  Radio,
  Zap,
  Files,
} from 'lucide-react';
import { Patient, CEAPClinical, Appointment, Invoice, DuplexUltrasoundReport, ProcedureRecord } from '../types/clinic';
import { storage } from '../services/storageService';
import { translations, Language } from '../i18n/translations';
import { BilateralLegVisualizer } from '../components/common/BilateralLegVisualizer';
import { PatientDocumentsManager } from '../components/documents/PatientDocumentsManager';

interface Props {
  lang: Language;
  patients: Patient[];
  onOpenNewPatientModal: () => void;
  onBookAppointmentForPatient: (patientId: string) => void;
  selectedPatientId?: string | null;
  onClearSelectedPatient?: () => void;
}

export const PatientsView: React.FC<Props> = ({
  lang,
  patients,
  onOpenNewPatientModal,
  onBookAppointmentForPatient,
  selectedPatientId,
  onClearSelectedPatient,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [search, setSearch] = useState('');
  const [ceapFilter, setCeapFilter] = useState<string>('All');
  const [activeProfileId, setActiveProfileId] = useState<string | null>(selectedPatientId || null);
  const [activeTab, setActiveTab] = useState<'overview' | 'assessment' | 'ultrasound' | 'procedures' | 'documents' | 'billing'>('overview');

  // Filter patients
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.fullNameAr.includes(search) ||
      p.mrn.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search);
    const matchesCeap = ceapFilter === 'All' || p.ceapGrade === ceapFilter;
    return matchesSearch && matchesCeap;
  });

  const activePatient = patients.find((p) => p.id === activeProfileId);

  // Get related records for active patient
  const patientAppointments = activePatient
    ? storage.getAppointments().filter((a) => a.patientId === activePatient.id)
    : [];
  const patientInvoices = activePatient
    ? storage.getInvoices().filter((i) => i.patientId === activePatient.id)
    : [];
  const patientUltrasounds = activePatient
    ? storage.getUltrasoundReports().filter((u) => u.patientId === activePatient.id)
    : [];
  const patientProcedures = activePatient
    ? storage.getProcedures().filter((pr) => pr.patientId === activePatient.id)
    : [];

  const handleDeletePatient = (id: string, name: string) => {
    if (confirm(`${t.confirmDelete}\n${name}`)) {
      storage.deletePatient(id);
      if (activeProfileId === id) setActiveProfileId(null);
    }
  };

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const greeting = isRtl
      ? `مرحباً ${name}، نود التواصل معك من مركز الأمل لعلاج دوالي الساقين بخصوص خطتكم العلاجية.`
      : `Hello ${name}, this is Al-Amal Vein Clinic contacting you regarding your clinical appointments.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(greeting)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Search, CEAP Filter, Register Button */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search
              className={`w-4 h-4 text-slate-400 absolute ${
                isRtl ? 'right-3' : 'left-3'
              } top-1/2 -translate-y-1/2 pointer-events-none`}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition ${
                isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
              }`}
            />
          </div>

          {/* CEAP Grade Filter */}
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={ceapFilter}
              onChange={(e) => setCeapFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="All">{isRtl ? 'جميع درجات CEAP' : 'All CEAP Grades'}</option>
              <option value="C1">C1 - Spider / Reticular (&lt;3mm)</option>
              <option value="C2">C2 - Varicose Veins (&ge;3mm)</option>
              <option value="C3">C3 - Venous Edema</option>
              <option value="C4a">C4a - Pigmentation / Eczema</option>
              <option value="C4b">C4b - Lipodermatosclerosis</option>
              <option value="C5">C5 - Healed Venous Ulcer</option>
              <option value="C6">C6 - Active Venous Ulcer</option>
            </select>
          </div>
        </div>

        {/* Register New Patient Button */}
        <button
          onClick={onOpenNewPatientModal}
          className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t.registerNewPatient}</span>
        </button>
      </div>

      {/* Patient Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            {t.patientList} ({filteredPatients.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {isRtl ? 'الأحدث تسجيلاً' : 'Sorted by recent'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{t.mrn}</th>
                <th className="py-3 px-4">{t.patientName}</th>
                <th className="py-3 px-4">{t.ceapStage}</th>
                <th className="py-3 px-4">{t.affectedLeg}</th>
                <th className="py-3 px-4">{t.phone}</th>
                <th className="py-3 px-4">{isRtl ? 'التاريخ الطبي' : 'Key Risks'}</th>
                <th className="py-3 px-4 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    {t.noRecords}
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-teal-50/40 transition cursor-pointer"
                    onClick={() => setActiveProfileId(p.id)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-teal-700">
                      {p.mrn}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {isRtl ? p.fullNameAr || p.fullName : p.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {p.gender} • {p.dob}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          p.ceapGrade === 'C6'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : p.ceapGrade === 'C5' || p.ceapGrade === 'C4b'
                            ? 'bg-orange-100 text-orange-800'
                            : p.ceapGrade === 'C4a' || p.ceapGrade === 'C3'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {p.ceapGrade}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {p.affectedLeg}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {p.phone}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.medicalHistory.priorDVT && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-100 text-rose-700 font-bold">
                            Prior DVT
                          </span>
                        )}
                        {p.medicalHistory.anticoagulantTherapy && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-semibold">
                            Blood Thinners
                          </span>
                        )}
                        {p.allergies.length > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-100 text-purple-700">
                            Allergies ({p.allergies.length})
                          </span>
                        )}
                        {!p.medicalHistory.priorDVT &&
                          !p.medicalHistory.anticoagulantTherapy &&
                          p.allergies.length === 0 && (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div
                        className="flex items-center justify-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setActiveProfileId(p.id)}
                          className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 transition cursor-pointer"
                          title={t.viewProfile}
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onBookAppointmentForPatient(p.id)}
                          className="p-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-700 transition cursor-pointer"
                          title={t.bookAppointment}
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setActiveProfileId(p.id);
                            setActiveTab('documents');
                          }}
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer"
                          title={isRtl ? 'المستندات والصور' : 'Documents & Photos'}
                        >
                          <Files className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openWhatsApp(p.whatsapp || p.phone, p.fullName)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition cursor-pointer"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePatient(p.id, p.fullName)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                          title={t.delete}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Patient Profile Drawer / Modal */}
      {activePatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl my-8 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 p-6 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-teal-950/60 border border-teal-400/40 text-teal-300">
                    {activePatient.mrn}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500 text-slate-950">
                    CEAP: {activePatient.ceapGrade}
                  </span>
                  <span className="text-xs text-teal-200">
                    PIN: <span className="font-mono">{activePatient.portalAccessCode}</span>
                  </span>
                </div>
                <h2 className="text-xl font-black mt-1">
                  {isRtl ? activePatient.fullNameAr || activePatient.fullName : activePatient.fullName}
                </h2>
                <p className="text-xs text-teal-200 mt-0.5">
                  {activePatient.gender} • {activePatient.dob} • Blood: {activePatient.bloodGroup} • {activePatient.phone}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  title="Print Patient File"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setActiveProfileId(null);
                    if (onClearSelectedPatient) onClearSelectedPatient();
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sub-Tabs Navigation */}
            <div className="flex items-center gap-1 bg-slate-100 p-2 border-b border-slate-200 text-xs overflow-x-auto">
              {[
                { id: 'overview', label: isRtl ? 'نظرة عامة والتاريخ' : 'Overview & History' },
                { id: 'assessment', label: isRtl ? 'التقييم السريري' : 'Clinical & CEAP' },
                { id: 'ultrasound', label: isRtl ? 'سونار الدوبلكس' : 'Duplex Scans' },
                { id: 'procedures', label: isRtl ? 'العمليات والليزر' : 'Procedures & Laser' },
                { id: 'documents', label: isRtl ? 'المستندات والصور' : 'Documents & Photos' },
                { id: 'billing', label: isRtl ? 'الفواتير والمالية' : 'Billing & Invoices' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white text-teal-800 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-800">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Visual Leg & Clinical Flags */}
                  <div className="space-y-4">
                    <BilateralLegVisualizer
                      selectedLeg={activePatient.affectedLeg}
                      ceapGrade={activePatient.ceapGrade}
                      hasUlcer={activePatient.ceapGrade === 'C6'}
                      hasPigmentation={activePatient.ceapGrade === 'C4a' || activePatient.ceapGrade === 'C4b'}
                      isInteractive={false}
                      isRtl={isRtl}
                    />

                    {/* Medical Alert Flags */}
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-2">
                      <h4 className="font-bold text-amber-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-700" />
                        {isRtl ? 'التنبيهات والمحاذير السريرية' : 'Critical Clinical Flags'}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <span className="text-slate-700">
                          {isRtl ? 'تاريخ جلطة DVT:' : 'Prior DVT:'}{' '}
                          <strong>{activePatient.medicalHistory.priorDVT ? 'Yes (Post-Thrombotic)' : 'No'}</strong>
                        </span>
                        <span className="text-slate-700">
                          {isRtl ? 'مميعات الدم:' : 'Anticoagulants:'}{' '}
                          <strong>{activePatient.medicalHistory.anticoagulantTherapy ? 'Yes' : 'No'}</strong>
                        </span>
                        <span className="text-slate-700">
                          {isRtl ? 'جراحة دوالي سابقة:' : 'Prior Vein Surgery:'}{' '}
                          <strong>{activePatient.medicalHistory.priorVeinSurgery ? 'Yes' : 'No'}</strong>
                        </span>
                        <span className="text-slate-700">
                          {isRtl ? 'طبيعة العمل وقوف طويل:' : 'Prolonged Standing:'}{' '}
                          <strong>{activePatient.medicalHistory.prolongedStandingWork ? 'Yes' : 'No'}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Demographics, Allergies & Current Medications */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                        {isRtl ? 'معلومات الاتصال والطوارئ' : 'Contact & Emergency'}
                      </h4>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t.phone}:</span>
                          <span className="font-semibold text-slate-900">{activePatient.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t.nationalId}:</span>
                          <span className="font-mono text-slate-900">{activePatient.nationalId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t.address}:</span>
                          <span className="text-slate-900">{activePatient.address}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-200">
                          <span className="text-slate-500">{t.emergencyContact}:</span>
                          <span className="font-semibold text-slate-900">
                            {activePatient.emergencyContact.name} ({activePatient.emergencyContact.relationship}) -{' '}
                            {activePatient.emergencyContact.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Allergies Box */}
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                      <h4 className="font-bold text-rose-900 mb-2 uppercase tracking-wider text-[11px]">
                        {t.allergies}
                      </h4>
                      {activePatient.allergies.length === 0 ? (
                        <span className="text-slate-500 text-xs">No known drug allergies (NKDA)</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {activePatient.allergies.map((alg, i) => (
                            <span key={i} className="px-2 py-1 rounded-lg bg-rose-200/80 text-rose-900 font-bold text-[11px]">
                              {alg}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Medications Box */}
                    <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                      <h4 className="font-bold text-teal-900 mb-2 uppercase tracking-wider text-[11px]">
                        {t.medications}
                      </h4>
                      {activePatient.medications.length === 0 ? (
                        <span className="text-slate-500 text-xs">No ongoing medications recorded</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {activePatient.medications.map((med, i) => (
                            <span key={i} className="px-2 py-1 rounded-lg bg-teal-200/80 text-teal-950 font-semibold text-[11px]">
                              {med}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* General Notes */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-1 text-[11px]">
                        {t.clinicalNotes}
                      </h4>
                      <p className="text-slate-600 leading-relaxed">
                        {activePatient.notes || 'No additional notes recorded.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'assessment' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {t.clinicalAssessmentTitle}
                  </h3>
                  <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal-900">Current Confirmed CEAP:</span>
                      <span className="px-3 py-1 rounded-full font-black bg-teal-600 text-white text-sm">
                        {activePatient.ceapGrade}
                      </span>
                    </div>
                    <p className="mt-2 text-slate-700">
                      Affected Limb: <strong>{activePatient.affectedLeg}</strong>. Detailed symptoms, physical examination findings, and VCSS scores can be managed in the dedicated CEAP module.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'ultrasound' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {t.duplexTitle} ({patientUltrasounds.length})
                  </h3>
                  {patientUltrasounds.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">
                      {isRtl ? 'لا يوجد تقرير دوبلكس مسجل لهذا المريض حالياً' : 'No duplex scans recorded for this patient yet.'}
                    </div>
                  ) : (
                    patientUltrasounds.map((u) => (
                      <div key={u.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-teal-900">Exam Date: {u.examDate}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Surgeon Verified
                          </span>
                        </div>
                        <p className="text-slate-800 font-medium">{u.conclusion}</p>
                        <div className="text-[11px] text-teal-700 font-semibold">
                          Target Zone: {u.recommendedAblationZone}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'procedures' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {t.proceduresTitle} ({patientProcedures.length})
                  </h3>
                  {patientProcedures.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">
                      {isRtl ? 'لا توجد عمليات مسجلة' : 'No surgical or laser procedures recorded yet.'}
                    </div>
                  ) : (
                    patientProcedures.map((pr) => (
                      <div key={pr.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{pr.procedureType}</span>
                          <span className="font-mono text-teal-700">{pr.procedureDate}</span>
                        </div>
                        <div className="text-[11px] text-slate-600">
                          Operating Surgeon: {pr.primarySurgeon} • Suite: {pr.roomNumber}
                        </div>
                        {pr.operativeDetails.totalEnergyJoules && (
                          <div className="p-2 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 font-mono text-[11px]">
                            Energy: {pr.operativeDetails.totalEnergyJoules} J | LEED: {pr.operativeDetails.leedJPerCm} J/cm | Tumescent: {pr.operativeDetails.tumescentVolumeMl} mL
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="py-1">
                  <PatientDocumentsManager
                    lang={lang}
                    patient={activePatient}
                    currentUserRole={storage.getActiveRole()}
                  />
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {t.financeTitle} ({patientInvoices.length})
                  </h3>
                  {patientInvoices.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">
                      No invoices found for this patient.
                    </div>
                  ) : (
                    patientInvoices.map((inv) => (
                      <div key={inv.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-teal-700">{inv.invoiceNumber}</span>
                          <div className="text-[11px] text-slate-500">{inv.date}</div>
                        </div>
                        <div className="text-right rtl:text-left">
                          <div className="font-bold text-slate-900">{inv.totalIQD.toLocaleString()} IQD</div>
                          <div className="text-[11px] text-rose-600">
                            Balance: {inv.balanceIQD.toLocaleString()} IQD
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => openWhatsApp(activePatient.whatsapp || activePatient.phone, activePatient.fullName)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Contact</span>
              </button>

              <button
                onClick={() => {
                  onBookAppointmentForPatient(activePatient.id);
                  setActiveProfileId(null);
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.bookAppointment}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
