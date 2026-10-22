import React, { useState } from 'react';
import {
  Activity,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  User,
  HeartPulse,
  Save,
  FileCheck2,
  Stethoscope,
} from 'lucide-react';
import { ClinicalAssessment, CEAPClinical, Patient, CEAPEtiologic, CEAPAnatomic, CEAPPathophysiologic } from '../types/clinic';
import { storage } from '../services/storageService';
import { translations, Language } from '../i18n/translations';
import { BilateralLegVisualizer } from '../components/common/BilateralLegVisualizer';

interface Props {
  lang: Language;
  patients: Patient[];
  assessments: ClinicalAssessment[];
}

export const ClinicalAssessmentView: React.FC<Props> = ({
  lang,
  patients,
  assessments,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const activePatient = patients.find((p) => p.id === selectedPatientId);

  // Form States
  const [legAffected, setLegAffected] = useState<'Right' | 'Left' | 'Bilateral'>(
    activePatient?.affectedLeg || 'Right'
  );

  // Symptoms
  const [heaviness, setHeaviness] = useState(true);
  const [achingPain, setAchingPain] = useState(true);
  const [eveningSwelling, setEveningSwelling] = useState(true);
  const [nightCramps, setNightCramps] = useState(true);
  const [itching, setItching] = useState(true);
  const [restlessLegs, setRestlessLegs] = useState(false);
  const [throbbing, setThrobbing] = useState(true);
  const [burningSensation, setBurningSensation] = useState(true);
  const [bleedingHistory, setBleedingHistory] = useState(false);
  const [painScale, setPainScale] = useState(6);

  // Physical Exam
  const [edemaGrade, setEdemaGrade] = useState<'None' | '1+ Mild' | '2+ Moderate' | '3+ Severe'>('2+ Moderate');
  const [edemaType, setEdemaType] = useState<'Pitting' | 'Non-pitting' | 'Brawny / Lymphedema'>('Pitting');
  const [coronaPhlebectatica, setCoronaPhlebectatica] = useState(true);
  const [hyperpigmentation, setHyperpigmentation] = useState(true);
  const [venousEczema, setVenousEczema] = useState(false);
  const [lipodermatosclerosis, setLipodermatosclerosis] = useState(false);
  const [atrophieBlanche, setAtrophieBlanche] = useState(false);
  const [ulcerActive, setUlcerActive] = useState(false);
  const [ulcerHealed, setUlcerHealed] = useState(false);

  // CEAP
  const [clinicalClass, setClinicalClass] = useState<CEAPClinical>('C4a');
  const [isSymptomatic, setIsSymptomatic] = useState(true);
  const [etiologic, setEtiologic] = useState<CEAPEtiologic>('Ep');
  const [anatomicSuperficial, setAnatomicSuperficial] = useState(true);
  const [anatomicPerforator, setAnatomicPerforator] = useState(true);
  const [anatomicDeep, setAnatomicDeep] = useState(false);
  const [pathophysiologic, setPathophysiologic] = useState<CEAPPathophysiologic>('Pr');

  // Doctor Sign-off
  const [doctorConfirmed, setDoctorConfirmed] = useState(true);
  const [doctorName, setDoctorName] = useState('Dr. Karwan Kareem Kurd (Vascular Surgeon)');
  const [clinicalSummary, setClinicalSummary] = useState('');

  // Calculate VCSS score dynamically
  const calculateVCSS = () => {
    let score = 0;
    if (painScale > 7) score += 3;
    else if (painScale > 3) score += 2;
    else if (painScale > 0) score += 1;

    if (clinicalClass === 'C2') score += 2;
    else if (clinicalClass >= 'C3') score += 3;

    if (edemaGrade === '3+ Severe') score += 3;
    else if (edemaGrade === '2+ Moderate') score += 2;
    else if (edemaGrade === '1+ Mild') score += 1;

    if (hyperpigmentation) score += 2;
    if (lipodermatosclerosis) score += 2;
    if (ulcerActive) score += 3;
    else if (ulcerHealed) score += 1;

    return Math.min(30, score);
  };

  const currentVCSS = calculateVCSS();

  const handleSaveAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;

    const anatomic: CEAPAnatomic[] = [];
    if (anatomicSuperficial) anatomic.push('As');
    if (anatomicPerforator) anatomic.push('Ap');
    if (anatomicDeep) anatomic.push('Ad');
    if (anatomic.length === 0) anatomic.push('An');

    const newAssessment: ClinicalAssessment = {
      id: `ca-${Date.now()}`,
      patientId: activePatient.id,
      visitDate: new Date().toISOString().split('T')[0],
      doctorId: 'st-1',
      doctorName,
      legAffected,
      symptoms: {
        heaviness,
        achingPain,
        eveningSwelling,
        nightCramps,
        itching,
        restlessLegs,
        throbbing,
        burningSensation,
        bleedingHistory,
        painScale0to10: painScale,
      },
      physicalExam: {
        edemaGrade,
        edemaType,
        coronaPhlebectatica,
        hyperpigmentation,
        venousEczema,
        lipodermatosclerosis,
        atrophieBlanche,
        ulcerActive,
        ulcerHealed,
      },
      ceap: {
        clinical: clinicalClass,
        symptomatic: isSymptomatic,
        etiologic,
        anatomic,
        pathophysiologic,
      },
      vcssScore: currentVCSS,
      doctorConfirmation: {
        confirmed: doctorConfirmed,
        doctorName,
        confirmedAt: new Date().toISOString(),
        signatureNote: 'Validated clinical staging. Indicated for vein treatment protocol.',
      },
      clinicalSummary:
        clinicalSummary ||
        `${legAffected} lower limb varicose veins graded ${clinicalClass}${
          isSymptomatic ? ',s' : ',a'
        } ${etiologic} ${anatomic.join(',')} ${pathophysiologic}. VCSS score: ${currentVCSS}/30.`,
      createdAt: new Date().toISOString(),
    };

    storage.saveAssessment(newAssessment);
    alert(isRtl ? 'تم حفظ التقييم السريري وتحديث تصنيف CEAP للمريض بنجاح.' : 'Clinical assessment and CEAP updated successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Patient Header Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t.clinicalAssessmentTitle}
            </h3>
            <p className="text-xs text-slate-500">
              {isRtl
                ? 'فحص الأوردة، مقياس الأعراض، وتحديد تصنيف CEAP 2020'
                : 'Bilateral limb exam, symptom score & revised CEAP 2020 builder'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
            {t.patient}:
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => {
              setSelectedPatientId(e.target.value);
              const p = patients.find((x) => x.id === e.target.value);
              if (p) {
                setClinicalClass(p.ceapGrade);
                setLegAffected(p.affectedLeg);
              }
            }}
            className="flex-1 md:w-72 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {isRtl ? p.fullNameAr : p.fullName} ({p.mrn}) - CEAP: {p.ceapGrade}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Interactive Clinical Form */}
      <form onSubmit={handleSaveAssessment} className="space-y-6">
        {/* Anatomical Leg Visualizer */}
        <BilateralLegVisualizer
          selectedLeg={legAffected}
          onSelectLeg={setLegAffected}
          ceapGrade={clinicalClass}
          hasUlcer={ulcerActive}
          hasPigmentation={hyperpigmentation}
          isInteractive={true}
          isRtl={isRtl}
        />

        {/* Symptoms & Pain Scale Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-500" />
              {t.symptomsTitle}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">{t.painScale}:</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800">
                {painScale} / 10
              </span>
            </div>
          </div>

          {/* Pain Scale Slider */}
          <div className="space-y-1">
            <input
              type="range"
              min={0}
              max={10}
              value={painScale}
              onChange={(e) => setPainScale(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>0 (No Pain)</span>
              <span>5 (Moderate Aching)</span>
              <span>10 (Severe / Incapacitating)</span>
            </div>
          </div>

          {/* 9 Common Venous Symptoms Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            {[
              { id: 'heaviness', label: t.symptomHeaviness, val: heaviness, set: setHeaviness },
              { id: 'aching', label: t.symptomAching, val: achingPain, set: setAchingPain },
              { id: 'swelling', label: t.symptomEveningSwelling, val: eveningSwelling, set: setEveningSwelling },
              { id: 'cramps', label: t.symptomNightCramps, val: nightCramps, set: setNightCramps },
              { id: 'itching', label: t.symptomItching, val: itching, set: setItching },
              { id: 'restless', label: t.symptomRestlessLegs, val: restlessLegs, set: setRestlessLegs },
              { id: 'throbbing', label: t.symptomThrobbing, val: throbbing, set: setThrobbing },
              { id: 'burning', label: t.symptomBurning, val: burningSensation, set: setBurningSensation },
              { id: 'bleeding', label: t.symptomBleeding, val: bleedingHistory, set: setBleedingHistory },
            ].map((sym) => (
              <label
                key={sym.id}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                  sym.val
                    ? 'bg-rose-50 border-rose-200 text-rose-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={sym.val}
                  onChange={(e) => sym.set(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span className="truncate">{sym.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Physical Examination Findings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            {t.physicalExamTitle}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-semibold mb-1 text-xs">{t.edemaGrade}</label>
              <select
                value={edemaGrade}
                onChange={(e) => setEdemaGrade(e.target.value as typeof edemaGrade)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="None">None</option>
                <option value="1+ Mild">1+ Mild ankle pitting (&lt; 2mm depth)</option>
                <option value="2+ Moderate">2+ Moderate leg swelling (2-4mm depth)</option>
                <option value="3+ Severe">3+ Severe diffuse edema (&gt; 4mm depth)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1 text-xs">{t.edemaType}</label>
              <select
                value={edemaType}
                onChange={(e) => setEdemaType(e.target.value as typeof edemaType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="Pitting">Pitting edema (Venous congestion)</option>
                <option value="Non-pitting">Non-pitting / Indurated</option>
                <option value="Brawny / Lymphedema">Brawny / Secondary Phlebolymphedema</option>
              </select>
            </div>
          </div>

          {/* Stasis & Skin Changes Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            {[
              { id: 'corona', label: t.coronaPhlebectatica, val: coronaPhlebectatica, set: setCoronaPhlebectatica },
              { id: 'pigment', label: t.hyperpigmentation, val: hyperpigmentation, set: setHyperpigmentation },
              { id: 'eczema', label: t.venousEczema, val: venousEczema, set: setVenousEczema },
              { id: 'lipodermo', label: t.lipodermatosclerosis, val: lipodermatosclerosis, set: setLipodermatosclerosis },
              { id: 'atrophie', label: t.atrophieBlanche, val: atrophieBlanche, set: setAtrophieBlanche },
              { id: 'ulcerAct', label: t.ulcerActive, val: ulcerActive, set: setUlcerActive },
              { id: 'ulcerHeal', label: t.ulcerHealed, val: ulcerHealed, set: setUlcerHealed },
            ].map((item) => (
              <label
                key={item.id}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                  item.val
                    ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.val}
                  onChange={(e) => {
                    item.set(e.target.checked);
                    if (item.id === 'ulcerAct' && e.target.checked) setClinicalClass('C6');
                    if (item.id === 'ulcerHeal' && e.target.checked && !ulcerActive) setClinicalClass('C5');
                    if (item.id === 'lipodermo' && e.target.checked && !ulcerActive && !ulcerHealed) setClinicalClass('C4b');
                    if (item.id === 'pigment' && e.target.checked && !ulcerActive && !ulcerHealed && !lipodermatosclerosis) setClinicalClass('C4a');
                  }}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="truncate">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* CEAP 2020 Classification Builder & VCSS Card */}
        <div className="bg-slate-900 rounded-2xl border border-teal-500/40 p-5 text-white shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-teal-500/20">
            <div>
              <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wider flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-cyan-400" />
                {t.ceapClassificationBuilder}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Official International Union of Phlebology (UIP) Staging
              </p>
            </div>

            {/* Live CEAP Badge */}
            <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-teal-400/30">
              <span className="text-xs text-slate-400 font-semibold">CEAP Code:</span>
              <span className="font-mono text-base font-black text-cyan-300 tracking-wider">
                {clinicalClass}
                {isSymptomatic ? ',s' : ',a'} {etiologic} As,p {pathophysiologic}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {/* C Component */}
            <div>
              <label className="block text-teal-300 font-semibold mb-1">{t.clinicalClass}</label>
              <select
                value={clinicalClass}
                onChange={(e) => setClinicalClass(e.target.value as CEAPClinical)}
                className="w-full bg-slate-800 border border-teal-500/30 rounded-xl px-2.5 py-2 text-white font-bold focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
              >
                <option value="C0">C0 - No visible signs</option>
                <option value="C1">C1 - Spider / Reticular (&lt;3mm)</option>
                <option value="C2">C2 - Varicose veins (&ge;3mm)</option>
                <option value="C3">C3 - Edema</option>
                <option value="C4a">C4a - Pigmentation / Eczema</option>
                <option value="C4b">C4b - Lipodermatosclerosis</option>
                <option value="C4c">C4c - Corona phlebectatica</option>
                <option value="C5">C5 - Healed ulcer scar</option>
                <option value="C6">C6 - Active venous ulcer</option>
              </select>
            </div>

            {/* E Component */}
            <div>
              <label className="block text-teal-300 font-semibold mb-1">{t.etiologicClass}</label>
              <select
                value={etiologic}
                onChange={(e) => setEtiologic(e.target.value as CEAPEtiologic)}
                className="w-full bg-slate-800 border border-teal-500/30 rounded-xl px-2.5 py-2 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
              >
                <option value="Ep">Ep - Primary venous disease</option>
                <option value="Es">Es - Secondary (Post-thrombotic DVT)</option>
                <option value="Ec">Ec - Congenital (Klippel-Trenaunay)</option>
                <option value="En">En - No venous cause identified</option>
              </select>
            </div>

            {/* A Component */}
            <div>
              <label className="block text-teal-300 font-semibold mb-1">{t.anatomicClass}</label>
              <div className="flex items-center gap-1.5 pt-1">
                <label className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 cursor-pointer text-[11px]">
                  <input
                    type="checkbox"
                    checked={anatomicSuperficial}
                    onChange={(e) => setAnatomicSuperficial(e.target.checked)}
                    className="rounded text-teal-500"
                  />
                  <span>As (Superficial)</span>
                </label>
                <label className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 cursor-pointer text-[11px]">
                  <input
                    type="checkbox"
                    checked={anatomicPerforator}
                    onChange={(e) => setAnatomicPerforator(e.target.checked)}
                    className="rounded text-teal-500"
                  />
                  <span>Ap (Perforator)</span>
                </label>
              </div>
            </div>

            {/* P Component */}
            <div>
              <label className="block text-teal-300 font-semibold mb-1">{t.pathophysiologicClass}</label>
              <select
                value={pathophysiologic}
                onChange={(e) => setPathophysiologic(e.target.value as CEAPPathophysiologic)}
                className="w-full bg-slate-800 border border-teal-500/30 rounded-xl px-2.5 py-2 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
              >
                <option value="Pr">Pr - Reflux only</option>
                <option value="Po">Po - Obstruction only</option>
                <option value="Pr,o">Pr,o - Both Reflux & Obstruction</option>
                <option value="Pn">Pn - No pathophysiology</option>
              </select>
            </div>
          </div>

          {/* VCSS Live Indicator */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-teal-500/30">
            <div>
              <span className="font-bold text-teal-300 text-xs block">
                {t.vcssScoreTitle}
              </span>
              <span className="text-[11px] text-slate-400">
                Composite clinical severity score (0 = normal, 30 = severe venous disease)
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-cyan-400 font-mono">
                {currentVCSS}
              </span>
              <span className="text-xs text-slate-400 ml-1">/ 30</span>
            </div>
          </div>
        </div>

        {/* Doctor Validation Sign-Off Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-teal-50 border border-teal-200">
            <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-teal-900 text-xs">
                {t.doctorConfirmationTitle}
              </h4>
              <p className="text-[11px] text-teal-800 mt-0.5 leading-relaxed">
                {t.doctorConfirmationNote}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                {isRtl ? 'اسم الجراح / الطبيب المعتمد' : 'Confirming Vascular Surgeon'}
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                {isRtl ? 'الخلاصة الطبية والتوصية' : 'Summary & Next Step'}
              </label>
              <input
                type="text"
                value={clinicalSummary}
                onChange={(e) => setClinicalSummary(e.target.value)}
                placeholder="e.g. Right GSV EVLA laser ablation recommended."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-teal-800">
              <input
                type="checkbox"
                checked={doctorConfirmed}
                onChange={(e) => setDoctorConfirmed(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>{t.confirmAndSign}</span>
            </label>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveAssessment}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
