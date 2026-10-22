import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle,
  Zap,
  Activity,
  Layers,
  Save,
  Pill,
  HeartPulse,
} from 'lucide-react';
import { TreatmentPlan, Patient } from '../types/clinic';
import { storage } from '../services/storageService';
import { translations, Language } from '../i18n/translations';

interface Props {
  lang: Language;
  patients: Patient[];
}

export const TreatmentPlansView: React.FC<Props> = ({
  lang,
  patients,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const activePatient = patients.find((p) => p.id === selectedPatientId);

  // Treatment Modality Prescriptions
  const [compressionActive, setCompressionActive] = useState(true);
  const [compressionClass, setCompressionClass] = useState<TreatmentPlan['modalities']['compressionTherapy']['classGrade']>('Class II (23-32 mmHg)');
  const [compressionStyle, setCompressionStyle] = useState<TreatmentPlan['modalities']['compressionTherapy']['style']>('Thigh-high');

  const [laserActive, setLaserActive] = useState(true);
  const [laserWavelength, setLaserWavelength] = useState<1470 | 980>(1470);
  const [laserFiber, setLaserFiber] = useState<TreatmentPlan['modalities']['evlaLaser']['fiberType']>('Radial 2-ring');

  const [foamActive, setFoamActive] = useState(true);
  const [foamAgent, setFoamAgent] = useState<TreatmentPlan['modalities']['foamSclerotherapy']['agent']>('Polidocanol 1%');
  const [foamSessions, setFoamSessions] = useState(2);

  const [phlebectomyActive, setPhlebectomyActive] = useState(false);
  const [medsActive, setMedsActive] = useState(true);
  const [medDetails, setMedDetails] = useState('Daflon 500mg 2 tablets daily with meals for 3 months');

  const [stagingNotes, setStagingNotes] = useState(
    'Session 1: Right GSV 1470nm Radial Laser Ablation under tumescent local anesthesia.\nSession 2 (2 weeks later): Duplex check + Foam sclerotherapy of residual calf tributary varices.'
  );

  const [approved, setApproved] = useState(true);

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;

    alert(isRtl ? 'تم حفظ الخطة العلاجية المتكاملة للمريض واعتمادها بنجاح.' : 'Comprehensive vein treatment plan saved and approved.');
  };

  return (
    <div className="space-y-6">
      {/* Header & Patient Select */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.navTreatmentPlans}</h3>
            <p className="text-xs text-slate-500">
              {isRtl
                ? 'تخطيط العلاج متعدد المراحل (الليزر، الرغوة، الجوارب الطبية، والأدوية)'
                : 'Multi-modality venous management protocols (EVLA, Sclerotherapy, Stockings & Daflon)'}
            </p>
          </div>
        </div>

        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="w-full md:w-72 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-teal-500"
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {isRtl ? p.fullNameAr : p.fullName} ({p.mrn}) - CEAP: {p.ceapGrade}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSavePlan} className="space-y-6 text-xs">
        {/* Modalities Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Endovenous Laser Ablation (EVLA) */}
          <div className={`p-5 rounded-2xl border transition ${laserActive ? 'bg-white border-teal-500/50 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <label className="flex items-center gap-2 font-bold text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={laserActive}
                  onChange={(e) => setLaserActive(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-600" />
                  EVLA Thermal Laser Ablation
                </span>
              </label>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                Gold Standard
              </span>
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Laser Wavelength</label>
                <select
                  value={laserWavelength}
                  onChange={(e) => setLaserWavelength(Number(e.target.value) as 1470 | 980)}
                  disabled={!laserActive}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                >
                  <option value={1470}>1470 nm (Targeting water absorption - Minimal post-op pain)</option>
                  <option value={980}>980 nm (Hemoglobin absorption)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Fiber Style</label>
                <select
                  value={laserFiber}
                  onChange={(e) => setLaserFiber(e.target.value as TreatmentPlan['modalities']['evlaLaser']['fiberType'])}
                  disabled={!laserActive}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                >
                  <option value="Radial 2-ring">Radial 2-Ring Fiber (360° uniform energy distribution)</option>
                  <option value="Slim radial">Slim Radial Fiber (for small tortuous segments)</option>
                  <option value="Bare-tip">Bare-tip fiber</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Ultrasound Foam Sclerotherapy (UGFS) */}
          <div className={`p-5 rounded-2xl border transition ${foamActive ? 'bg-white border-teal-500/50 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <label className="flex items-center gap-2 font-bold text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={foamActive}
                  onChange={(e) => setFoamActive(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-600" />
                  Ultrasound-Guided Foam Sclerotherapy (UGFS)
                </span>
              </label>
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Sclerosing Agent & Concentration</label>
                <select
                  value={foamAgent}
                  onChange={(e) => setFoamAgent(e.target.value as TreatmentPlan['modalities']['foamSclerotherapy']['agent'])}
                  disabled={!foamActive}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                >
                  <option value="Polidocanol 1%">Polidocanol 1% (Aethoxysklerol - Tessari 1:4 foam)</option>
                  <option value="Polidocanol 2%">Polidocanol 2%</option>
                  <option value="Polidocanol 3%">Polidocanol 3%</option>
                  <option value="STS 1%">Sodium Tetradecyl Sulfate (Fibrovein 1%)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Planned Sessions</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={foamSessions}
                  onChange={(e) => setFoamSessions(Number(e.target.value))}
                  disabled={!foamActive}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Compression Therapy Protocol */}
          <div className="p-5 rounded-2xl bg-white border border-teal-500/50 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600" />
              Medical Elastic Compression Therapy
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Compression Grade</label>
                <select
                  value={compressionClass}
                  onChange={(e) => setCompressionClass(e.target.value as TreatmentPlan['modalities']['compressionTherapy']['classGrade'])}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                >
                  <option value="Class II (23-32 mmHg)">Class II (23-32 mmHg) - Standard post-op</option>
                  <option value="Class I (18-21 mmHg)">Class I (18-21 mmHg) - Mild symptoms</option>
                  <option value="Class III (34-46 mmHg)">Class III (34-46 mmHg) - Severe lymphedema/C6</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Style</label>
                <select
                  value={compressionStyle}
                  onChange={(e) => setCompressionStyle(e.target.value as TreatmentPlan['modalities']['compressionTherapy']['style'])}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                >
                  <option value="Thigh-high">Thigh-high with silicone grip top</option>
                  <option value="Below-knee">Below-knee (Calf length)</option>
                  <option value="Pantyhose">Pantyhose (Tights)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 4: Medical Venotonic Pharmacotherapy */}
          <div className="p-5 rounded-2xl bg-white border border-teal-500/50 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
              <Pill className="w-4 h-4 text-cyan-600" />
              Venotonic Medical Therapy
            </h4>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Prescription Instructions</label>
              <textarea
                rows={2}
                value={medDetails}
                onChange={(e) => setMedDetails(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Staging Plan & Clinician Confirmation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div>
            <label className="block text-slate-800 font-bold mb-1">
              {isRtl ? 'خطة وتوقيت المراحل العلاجية' : 'Staged Procedure Timeline & Sequence'}
            </label>
            <textarea
              rows={3}
              value={stagingNotes}
              onChange={(e) => setStagingNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-teal-800">
              <input
                type="checkbox"
                checked={approved}
                onChange={(e) => setApproved(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Clinician Formally Approved Plan</span>
            </label>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{t.save}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
