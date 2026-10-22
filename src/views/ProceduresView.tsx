import React, { useState } from 'react';
import {
  Zap,
  CheckCircle,
  AlertTriangle,
  Printer,
  ShieldCheck,
  FileCheck,
  Play,
  Clock,
  User,
  HeartPulse,
  Save,
  Plus,
} from 'lucide-react';
import { ProcedureRecord, Patient } from '../types/clinic';
import { storage } from '../services/storageService';
import { translations, Language } from '../i18n/translations';

interface Props {
  lang: Language;
  patients: Patient[];
  procedures: ProcedureRecord[];
}

export const ProceduresView: React.FC<Props> = ({
  lang,
  patients,
  procedures,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [activeProcedure, setActiveProcedure] = useState<ProcedureRecord>(procedures[0]);
  const [selectedPatientId, setSelectedPatientId] = useState(activeProcedure?.patientId || patients[0]?.id || '');
  const activePatient = patients.find((p) => p.id === selectedPatientId);

  // Pre-op checklist
  const [npoFasting, setNpoFasting] = useState(activeProcedure?.preopChecklist?.npoFastingConfirmed ?? true);
  const [bloodThinners, setBloodThinners] = useState(activeProcedure?.preopChecklist?.bloodThinnersAdjusted ?? true);
  const [allergiesVerified, setAllergiesVerified] = useState(activeProcedure?.preopChecklist?.allergiesVerified ?? true);
  const [duplexMarking, setDuplexMarking] = useState(activeProcedure?.preopChecklist?.duplexMarkingConfirmed ?? true);
  const [vitalsNormal, setVitalsNormal] = useState(activeProcedure?.preopChecklist?.baselineVitalsNormal ?? true);
  const [stockingsReady, setStockingsReady] = useState(activeProcedure?.preopChecklist?.compressionStockingsOnSite ?? true);

  // Consent
  const [consentConfirmed, setConsentConfirmed] = useState(activeProcedure?.consentConfirmed ?? true);
  const [consentName, setConsentName] = useState(activeProcedure?.consentSignedBy || activePatient?.fullName || '');

  // Operative Parameters
  const [veinTreated, setVeinTreated] = useState(activeProcedure?.operativeDetails?.veinTreated || 'Right GSV (SFJ to below knee)');
  const [treatedLengthCm, setTreatedLengthCm] = useState(activeProcedure?.operativeDetails?.treatedLengthCm ?? 42);
  const [laserPowerWatts, setLaserPowerWatts] = useState(activeProcedure?.operativeDetails?.laserPowerWatts ?? 8);
  const [totalEnergyJoules, setTotalEnergyJoules] = useState(activeProcedure?.operativeDetails?.totalEnergyJoules ?? 3150);
  const [tumescentVolumeMl, setTumescentVolumeMl] = useState(activeProcedure?.operativeDetails?.tumescentVolumeMl ?? 380);
  const [anesthesiaType, setAnesthesiaType] = useState<ProcedureRecord['operativeDetails']['anesthesiaType']>(
    activeProcedure?.operativeDetails?.anesthesiaType || 'Tumescent Local'
  );
  const [complications, setComplications] = useState(activeProcedure?.immediatePostOp?.complications || 'None');
  const [procStatus, setProcStatus] = useState<ProcedureRecord['status']>(activeProcedure?.status || 'Completed');

  // Compute LEED
  const calculatedLEED = treatedLengthCm > 0 ? Math.round(totalEnergyJoules / treatedLengthCm) : 0;

  const handleSaveProcedure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;

    const updated: ProcedureRecord = {
      id: activeProcedure?.id || `pr-${Date.now()}`,
      patientId: activePatient.id,
      patientName: isRtl ? activePatient.fullNameAr || activePatient.fullName : activePatient.fullName,
      procedureDate: new Date().toISOString().split('T')[0],
      procedureType: 'EVLA (Endovenous Laser Ablation)',
      leg: activePatient.affectedLeg,
      primarySurgeon: 'Dr. Karwan Kareem Kurd',
      assistingStaff: 'Nurse Zainab Hassan',
      roomNumber: 'Interventional Suite 1',
      preopChecklist: {
        npoFastingConfirmed: npoFasting,
        bloodThinnersAdjusted: bloodThinners,
        allergiesVerified,
        duplexMarkingConfirmed: duplexMarking,
        baselineVitalsNormal: vitalsNormal,
        compressionStockingsOnSite: stockingsReady,
      },
      consentConfirmed,
      consentSignedBy: consentName,
      consentTimestamp: new Date().toISOString(),
      operativeDetails: {
        veinTreated,
        catheterAccessSite: 'Percutaneous puncture below knee',
        treatedLengthCm,
        laserWavelengthNm: 1470,
        laserPowerWatts,
        totalEnergyJoules,
        leedJPerCm: calculatedLEED,
        pullbackRateMmPerSec: 1.0,
        tumescentFormula: 'Cold Saline 500mL + Lidocaine 2% + Adrenaline + NaHCO3',
        tumescentVolumeMl,
        anesthesiaType,
      },
      immediatePostOp: {
        toleratedWell: true,
        hemostasisAchieved: true,
        distalPulsesPalpable: true,
        compressionApplied: true,
        complications,
      },
      postOpInstructions: [
        'Wear Class II compression stockings 48 hours continuously without removal.',
        'Walk for 30 minutes immediately post-procedure.',
        'Walk 10-15 minutes every 2 hours during daytime.',
        'Avoid heavy lifting (> 15 kg), hot baths, saunas, and strenuous gym for 7 days.',
        'Call emergency hotline immediately if experiencing severe sudden calf pain, chest pain, or shortness of breath.',
      ],
      followUpDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      status: procStatus,
      createdAt: new Date().toISOString(),
    };

    storage.saveProcedure(updated);
    setActiveProcedure(updated);
    alert(isRtl ? 'تم حفظ سجل العملية وبروتوكول الليزر بنجاح.' : 'Procedure protocol and energy log saved successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Patient Selection */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.proceduresTitle}</h3>
            <p className="text-xs text-slate-500">
              {isRtl
                ? 'قسطرة الليزر الوريدي 1470nm والتصليب الرغوي وموافقة المريض'
                : '1470nm Radial EVLA, UGFS foam log, informed consent & safety protocol'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedPatientId}
            onChange={(e) => {
              setSelectedPatientId(e.target.value);
              const p = patients.find((x) => x.id === e.target.value);
              if (p) setConsentName(p.fullName);
            }}
            className="flex-1 md:w-72 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {isRtl ? p.fullNameAr : p.fullName} ({p.mrn})
              </option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Discharge Sheet</span>
          </button>
        </div>
      </div>

      {/* Main Procedure Form */}
      <form onSubmit={handleSaveProcedure} className="space-y-6 text-xs">
        {/* Pre-operative Safety Checklist */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {t.preopChecklist}
            </h4>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              WHO Surgical Safety Compliant
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { id: 'npo', label: t.npoFasting, val: npoFasting, set: setNpoFasting },
              { id: 'thinners', label: t.thinnersHeld, val: bloodThinners, set: setBloodThinners },
              { id: 'allergies', label: t.allergiesDoubleChecked, val: allergiesVerified, set: setAllergiesVerified },
              { id: 'marking', label: t.duplexMarkingDone, val: duplexMarking, set: setDuplexMarking },
              { id: 'vitals', label: t.vitalsNormal, val: vitalsNormal, set: setVitalsNormal },
              { id: 'stockings', label: t.stockingsReady, val: stockingsReady, set: setStockingsReady },
            ].map((chk) => (
              <label
                key={chk.id}
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                  chk.val
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 font-medium'
                    : 'bg-rose-50 border-rose-200 text-rose-900 font-bold'
                }`}
              >
                <input
                  type="checkbox"
                  checked={chk.val}
                  onChange={(e) => chk.set(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 mt-0.5"
                />
                <span className="text-[11px] leading-tight">{chk.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Informed Surgical Consent */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-600" />
              {t.surgicalConsent}
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">
              Timestamp: {new Date().toLocaleDateString()}
            </span>
          </div>

          <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px]">
            {t.consentStatement}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                {isRtl ? 'اسم المريض الموقع' : 'Signee Full Name'}
              </label>
              <input
                type="text"
                value={consentName}
                onChange={(e) => setConsentName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-teal-800">
                <input
                  type="checkbox"
                  checked={consentConfirmed}
                  onChange={(e) => setConsentConfirmed(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>{t.patientAgreed}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Laser Energy Parameters & LEED Calculation Card */}
        <div className="bg-slate-900 text-white rounded-2xl border border-teal-500/40 p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-teal-500/20">
            <div>
              <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                {t.laserParameters}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Biolitec 1470nm Radial 2-Ring Thermal Occlusion Log
              </p>
            </div>

            {/* Calculated LEED Badge */}
            <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-teal-400/30">
              <span className="text-xs text-slate-400 font-semibold">{t.calculatedLEED}:</span>
              <span className="font-mono text-lg font-black text-amber-300">
                {calculatedLEED} J/cm
              </span>
              <span className="text-[10px] text-teal-300">
                {calculatedLEED >= 60 && calculatedLEED <= 85 ? '(Optimal Range)' : '(Review)'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-teal-300 font-semibold mb-1">{t.treatedLength}</label>
              <input
                type="number"
                value={treatedLengthCm}
                onChange={(e) => setTreatedLengthCm(Number(e.target.value))}
                className="w-full bg-slate-800 border border-teal-500/30 rounded-xl px-3 py-2 text-white font-bold focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-teal-300 font-semibold mb-1">Power (Watts)</label>
              <input
                type="number"
                value={laserPowerWatts}
                onChange={(e) => setLaserPowerWatts(Number(e.target.value))}
                className="w-full bg-slate-800 border border-teal-500/30 rounded-xl px-3 py-2 text-white font-bold focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-teal-300 font-semibold mb-1">{t.totalEnergy}</label>
              <input
                type="number"
                value={totalEnergyJoules}
                onChange={(e) => setTotalEnergyJoules(Number(e.target.value))}
                className="w-full bg-slate-800 border border-teal-500/30 rounded-xl px-3 py-2 text-white font-bold focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-teal-300 font-semibold mb-1">{t.tumescentMl}</label>
              <input
                type="number"
                value={tumescentVolumeMl}
                onChange={(e) => setTumescentVolumeMl(Number(e.target.value))}
                className="w-full bg-slate-800 border border-teal-500/30 rounded-xl px-3 py-2 text-white font-bold focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>
        </div>

        {/* Immediate Post-Op & Discharge Handout */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-emerald-600" />
            {t.postOpStatus}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">{t.immediateComplications}</label>
              <input
                type="text"
                value={complications}
                onChange={(e) => setComplications(e.target.value)}
                placeholder="None observed"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Procedure Status</label>
              <select
                value={procStatus}
                onChange={(e) => setProcStatus(e.target.value as ProcedureRecord['status'])}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="Completed">Completed & Tolerated Well</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Recovered">Recovered / Ready for Discharge</option>
              </select>
            </div>
          </div>

          {/* Discharge Advice Bullet Box */}
          <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-2">
            <span className="font-bold text-teal-900 block text-xs">
              {t.postOpDischargeAdvice} (Included in Patient Take-Home Pack):
            </span>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-teal-950">
              <li>Wear Class II compression stockings continuously for 48 hours without removal.</li>
              <li>Walk for 30 minutes immediately post-procedure before going home.</li>
              <li>Walk 10-15 minutes every 2 hours during daytime to prevent venous stasis.</li>
              <li>Avoid heavy weightlifting (&gt; 15 kg), hot baths, saunas, and strenuous gym for 7 days.</li>
              <li>Attend scheduled 24-hour venous duplex scan appointment.</li>
            </ul>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveProcedure}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
