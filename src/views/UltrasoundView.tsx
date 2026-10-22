import React, { useState } from 'react';
import {
  Radio,
  Printer,
  Save,
  CheckCircle,
  AlertTriangle,
  Upload,
  Plus,
  Trash2,
  FileText,
  Activity,
  Layers,
} from 'lucide-react';
import { DuplexUltrasoundReport, Patient, LegUltrasoundData } from '../types/clinic';
import { storage } from '../services/storageService';
import { translations, Language } from '../i18n/translations';

interface Props {
  lang: Language;
  patients: Patient[];
  reports: DuplexUltrasoundReport[];
}

export const UltrasoundView: React.FC<Props> = ({
  lang,
  patients,
  reports,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const activePatient = patients.find((p) => p.id === selectedPatientId);

  // Active or New Report State
  const existingReport = reports.find((r) => r.patientId === selectedPatientId) || reports[0];

  const [sonographer, setSonographer] = useState(existingReport?.sonographer || 'Dr. Sarah Al-Bayati');
  const [vascularSurgeon, setVascularSurgeon] = useState(existingReport?.vascularSurgeon || 'Dr. Karwan Kareem Kurd');
  const [verifiedBySurgeon, setVerifiedBySurgeon] = useState(true);

  // Right Leg Data
  const [rightDeepPatent, setRightDeepPatent] = useState(existingReport?.rightLeg.deepVeinsPatent ?? true);
  const [rightGSVComp, setRightGSVComp] = useState<'Competent' | 'Incompetent'>(existingReport?.rightLeg.gsvCompetence || 'Incompetent');
  const [rightSFJDiameter, setRightSFJDiameter] = useState(existingReport?.rightLeg.sfjDiameterMm ?? 9.8);
  const [rightSFJReflux, setRightSFJReflux] = useState(existingReport?.rightLeg.sfjRefluxSec ?? 3.2);
  const [rightMidThighDiam, setRightMidThighDiam] = useState(existingReport?.rightLeg.midThighDiameterMm ?? 7.4);
  const [rightMidThighReflux, setRightMidThighReflux] = useState(existingReport?.rightLeg.midThighRefluxSec ?? 2.8);
  const [rightBelowKneeDiam, setRightBelowKneeDiam] = useState(existingReport?.rightLeg.belowKneeDiameterMm ?? 5.6);
  const [rightSSVComp, setRightSSVComp] = useState<'Competent' | 'Incompetent'>(existingReport?.rightLeg.ssvCompetence || 'Competent');
  const [rightSSVDiam, setRightSSVDiam] = useState(existingReport?.rightLeg.ssvDiameterMm ?? 3.1);
  const [rightSSVReflux, setRightSSVReflux] = useState(existingReport?.rightLeg.ssvRefluxSec ?? 0.2);

  // Left Leg Data
  const [leftDeepPatent, setLeftDeepPatent] = useState(existingReport?.leftLeg.deepVeinsPatent ?? true);
  const [leftGSVComp, setLeftGSVComp] = useState<'Competent' | 'Incompetent'>(existingReport?.leftLeg.gsvCompetence || 'Competent');
  const [leftSFJDiameter, setLeftSFJDiameter] = useState(existingReport?.leftLeg.sfjDiameterMm ?? 5.1);
  const [leftSFJReflux, setLeftSFJReflux] = useState(existingReport?.leftLeg.sfjRefluxSec ?? 0.3);
  const [leftMidThighDiam, setLeftMidThighDiam] = useState(existingReport?.leftLeg.midThighDiameterMm ?? 4.0);
  const [leftMidThighReflux, setLeftMidThighReflux] = useState(existingReport?.leftLeg.midThighRefluxSec ?? 0.2);
  const [leftBelowKneeDiam, setLeftBelowKneeDiam] = useState(existingReport?.leftLeg.belowKneeDiameterMm ?? 3.2);
  const [leftSSVComp, setLeftSSVComp] = useState<'Competent' | 'Incompetent'>(existingReport?.leftLeg.ssvCompetence || 'Competent');
  const [leftSSVDiam, setLeftSSVDiam] = useState(existingReport?.leftLeg.ssvDiameterMm ?? 2.8);
  const [leftSSVReflux, setLeftSSVReflux] = useState(existingReport?.leftLeg.ssvRefluxSec ?? 0.1);

  // Conclusions
  const [conclusion, setConclusion] = useState(
    existingReport?.conclusion ||
      'Right SFJ and GSV trunk severe reflux (>3s) with dilation up to 9.8mm. Deep veins patent with no DVT.'
  );
  const [ablationZone, setAblationZone] = useState(
    existingReport?.recommendedAblationZone ||
      'Right GSV thermal ablation (SFJ to below knee, ~42cm) with 1470nm Radial Laser.'
  );

  const handleSaveUltrasound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;

    const report: DuplexUltrasoundReport = {
      id: existingReport?.id || `us-${Date.now()}`,
      patientId: activePatient.id,
      examDate: new Date().toISOString().split('T')[0],
      sonographer,
      vascularSurgeon,
      verifiedBySurgeon,
      verifiedAt: new Date().toISOString(),
      rightLeg: {
        deepVeinsPatent: rightDeepPatent,
        cfvRefluxSec: 0.1,
        fvRefluxSec: 0.2,
        popvRefluxSec: 0.2,
        gsvCompetence: rightGSVComp,
        sfjDiameterMm: rightSFJDiameter,
        sfjRefluxSec: rightSFJReflux,
        midThighDiameterMm: rightMidThighDiam,
        midThighRefluxSec: rightMidThighReflux,
        belowKneeDiameterMm: rightBelowKneeDiam,
        ssvCompetence: rightSSVComp,
        ssvDiameterMm: rightSSVDiam,
        ssvRefluxSec: rightSSVReflux,
        aasvCompetence: 'Competent',
        aasvDiameterMm: 3.0,
        perforatorIncompetencies: [
          {
            name: "Boyd's Perforator",
            location: 'Medial calf',
            diameterMm: 4.1,
            refluxDurationSec: 1.4,
          },
        ],
        thrombusPresent: !rightDeepPatent,
        tortuousBranchesDescription: 'Medial calf tortuous tributaries 4-6mm',
      },
      leftLeg: {
        deepVeinsPatent: leftDeepPatent,
        cfvRefluxSec: 0.1,
        fvRefluxSec: 0.1,
        popvRefluxSec: 0.1,
        gsvCompetence: leftGSVComp,
        sfjDiameterMm: leftSFJDiameter,
        sfjRefluxSec: leftSFJReflux,
        midThighDiameterMm: leftMidThighDiam,
        midThighRefluxSec: leftMidThighReflux,
        belowKneeDiameterMm: leftBelowKneeDiam,
        ssvCompetence: leftSSVComp,
        ssvDiameterMm: leftSSVDiam,
        ssvRefluxSec: leftSSVReflux,
        aasvCompetence: 'Competent',
        aasvDiameterMm: 2.5,
        perforatorIncompetencies: [],
        thrombusPresent: !leftDeepPatent,
        tortuousBranchesDescription: 'No major cluster',
      },
      conclusion,
      recommendedAblationZone: ablationZone,
      images: existingReport?.images || [
        {
          id: 'img-1',
          url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=80',
          title: 'SFJ Doppler Trace',
          findings: 'Pathological reflux > 3.0s upon manual calf compression release.',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    storage.saveUltrasoundReport(report);
    alert(isRtl ? 'تم حفظ تقرير الدوبلكس الملون بنجاح.' : 'Duplex ultrasound report saved successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Patient Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.duplexTitle}</h3>
            <p className="text-xs text-slate-500">
              {isRtl
                ? 'فحص الأوردة السطحية والعميقة وزمن الارتجاع والقطر'
                : 'Superficial & deep venous reflux, diameters & junction competence'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
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
            <span className="hidden sm:inline">{t.printReport}</span>
          </button>
        </div>
      </div>

      {/* Ultrasound Form */}
      <form onSubmit={handleSaveUltrasound} className="space-y-6 text-xs">
        {/* Clinicians Attribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Sonographer / Phlebologist</label>
            <input
              type="text"
              value={sonographer}
              onChange={(e) => setSonographer(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Verifying Vascular Surgeon</label>
            <input
              type="text"
              value={vascularSurgeon}
              onChange={(e) => setVascularSurgeon(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-teal-800">
              <input
                type="checkbox"
                checked={verifiedBySurgeon}
                onChange={(e) => setVerifiedBySurgeon(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>{t.verifiedBySurgeon}</span>
            </label>
          </div>
        </div>

        {/* Bilateral Venous Duplex Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* RIGHT LOWER LIMB */}
          <div className="bg-white rounded-2xl border-2 border-teal-500/40 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-teal-100">
              <span className="font-extrabold text-sm text-teal-900 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-teal-500" />
                {t.rightLimb}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                  rightGSVComp === 'Incompetent'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-teal-100 text-teal-800'
                }`}
              >
                GSV {rightGSVComp}
              </span>
            </div>

            {/* Deep Veins Patency */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <label className="flex items-center gap-2 font-bold text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rightDeepPatent}
                  onChange={(e) => setRightDeepPatent(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>{t.deepVeinsPatent}</span>
              </label>
              <p className="text-[11px] text-slate-500 mt-1">
                Common Femoral Vein (CFV), Femoral Vein (FV), and Popliteal Vein (PopV) compressible with normal augmentation.
              </p>
            </div>

            {/* GSV Parameters Right */}
            <div className="space-y-3">
              <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                {t.gsvTitle}
              </h5>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">{t.sfjDiameter}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={rightSFJDiameter}
                    onChange={(e) => setRightSFJDiameter(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">{t.sfjReflux}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={rightSFJReflux}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setRightSFJReflux(val);
                      setRightGSVComp(val >= 0.5 ? 'Incompetent' : 'Competent');
                    }}
                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2 font-bold focus:ring-2 focus:ring-teal-500 ${
                      rightSFJReflux >= 0.5 ? 'text-rose-600 border-rose-300' : 'text-slate-900 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">{t.midThighDiameter}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={rightMidThighDiam}
                    onChange={(e) => setRightMidThighDiam(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">{t.midThighReflux}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={rightMidThighReflux}
                    onChange={(e) => setRightMidThighReflux(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">{t.belowKneeDiameter}</label>
                <input
                  type="number"
                  step="0.1"
                  value={rightBelowKneeDiam}
                  onChange={(e) => setRightBelowKneeDiam(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                />
              </div>
            </div>

            {/* SSV Parameters Right */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                {t.ssvTitle}
              </h5>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">SPJ Status</label>
                  <select
                    value={rightSSVComp}
                    onChange={(e) => setRightSSVComp(e.target.value as 'Competent' | 'Incompetent')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-900 font-medium"
                  >
                    <option value="Competent">Competent</option>
                    <option value="Incompetent">Incompetent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">{t.ssvDiameter}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={rightSSVDiam}
                    onChange={(e) => setRightSSVDiam(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">{t.ssvReflux}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={rightSSVReflux}
                    onChange={(e) => setRightSSVReflux(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-900 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* LEFT LOWER LIMB */}
          <div className="bg-white rounded-2xl border-2 border-cyan-500/40 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-100">
              <span className="font-extrabold text-sm text-cyan-900 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-500" />
                {t.leftLimb}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                  leftGSVComp === 'Incompetent'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-cyan-100 text-cyan-800'
                }`}
              >
                GSV {leftGSVComp}
              </span>
            </div>

            {/* Deep Veins Patency */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <label className="flex items-center gap-2 font-bold text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={leftDeepPatent}
                  onChange={(e) => setLeftDeepPatent(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span>{t.deepVeinsPatent}</span>
              </label>
              <p className="text-[11px] text-slate-500 mt-1">
                Deep veins patent with respiratory phasicity and full compressibility.
              </p>
            </div>

            {/* GSV Parameters Left */}
            <div className="space-y-3">
              <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                {t.gsvTitle}
              </h5>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">{t.sfjDiameter}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={leftSFJDiameter}
                    onChange={(e) => setLeftSFJDiameter(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">{t.sfjReflux}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={leftSFJReflux}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setLeftSFJReflux(val);
                      setLeftGSVComp(val >= 0.5 ? 'Incompetent' : 'Competent');
                    }}
                    className={`w-full bg-slate-50 border rounded-xl px-3 py-2 font-bold focus:ring-2 focus:ring-cyan-500 ${
                      leftSFJReflux >= 0.5 ? 'text-rose-600 border-rose-300' : 'text-slate-900 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">{t.midThighDiameter}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={leftMidThighDiam}
                    onChange={(e) => setLeftMidThighDiam(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">{t.midThighReflux}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={leftMidThighReflux}
                    onChange={(e) => setLeftMidThighReflux(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">{t.belowKneeDiameter}</label>
                <input
                  type="number"
                  step="0.1"
                  value={leftBelowKneeDiam}
                  onChange={(e) => setLeftBelowKneeDiam(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                />
              </div>
            </div>

            {/* SSV Parameters Left */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                {t.ssvTitle}
              </h5>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">SPJ Status</label>
                  <select
                    value={leftSSVComp}
                    onChange={(e) => setLeftSSVComp(e.target.value as 'Competent' | 'Incompetent')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-900 font-medium"
                  >
                    <option value="Competent">Competent</option>
                    <option value="Incompetent">Incompetent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">{t.ssvDiameter}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={leftSSVDiam}
                    onChange={(e) => setLeftSSVDiam(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">{t.ssvReflux}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={leftSSVReflux}
                    onChange={(e) => setLeftSSVReflux(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-900 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conclusions & Treatment Zone Recommendations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div>
            <label className="block text-slate-800 font-bold mb-1.5">{t.clinicalImpression}</label>
            <textarea
              rows={2}
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-teal-800 font-bold mb-1.5">{t.recommendedIntervention}</label>
            <input
              type="text"
              value={ablationZone}
              onChange={(e) => setAblationZone(e.target.value)}
              className="w-full bg-slate-50 border border-teal-300 rounded-xl p-3 text-teal-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveUltrasound}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
