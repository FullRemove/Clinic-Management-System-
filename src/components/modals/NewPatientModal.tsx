import React, { useState } from 'react';
import { X, UserPlus, HeartPulse, AlertCircle, ShieldAlert, Pill } from 'lucide-react';
import { Patient, CEAPClinical } from '../../types/clinic';
import { storage } from '../../services/storageService';
import { translations, Language } from '../../i18n/translations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onPatientSaved?: (patient: Patient) => void;
}

export const NewPatientModal: React.FC<Props> = ({
  isOpen,
  onClose,
  lang,
  onPatientSaved,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [fullName, setFullName] = useState('');
  const [fullNameAr, setFullNameAr] = useState('');
  const [dob, setDob] = useState('1980-01-01');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [phone, setPhone] = useState('+964');
  const [whatsapp, setWhatsapp] = useState('+964');
  const [bloodGroup, setBloodGroup] = useState<Patient['bloodGroup']>('O+');
  const [nationalId, setNationalId] = useState('');
  const [address, setAddress] = useState('Baghdad, Iraq');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [allergiesText, setAllergiesText] = useState('');
  const [medicationsText, setMedicationsText] = useState('Daflon 500mg');
  const [ceapGrade, setCeapGrade] = useState<CEAPClinical>('C2');
  const [affectedLeg, setAffectedLeg] = useState<'Right' | 'Left' | 'Bilateral'>('Right');
  const [notes, setNotes] = useState('');

  // Medical History Flags
  const [priorDVT, setPriorDVT] = useState(false);
  const [thrombophilia, setThrombophilia] = useState(false);
  const [priorVeinSurgery, setPriorVeinSurgery] = useState(false);
  const [anticoagulantTherapy, setAnticoagulantTherapy] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [hypertension, setHypertension] = useState(false);
  const [smoker, setSmoker] = useState(false);
  const [familyHistoryVeins, setFamilyHistoryVeins] = useState(true);
  const [prolongedStandingWork, setProlongedStandingWork] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() && !fullNameAr.trim()) {
      alert(isRtl ? 'يرجى إدخال اسم المريض' : 'Please provide patient name');
      return;
    }

    const nextId = `pt-${Date.now()}`;
    const year = new Date().getFullYear();
    const count = storage.getPatients().length + 1;
    const mrn = `VV-${year}-${String(count).padStart(3, '0')}`;
    const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newPatient: Patient = {
      id: nextId,
      mrn,
      nationalId: nationalId.trim() || String(Math.floor(100000000000 + Math.random() * 900000000000)),
      fullName: fullName.trim() || fullNameAr.trim(),
      fullNameAr: fullNameAr.trim() || fullName.trim(),
      dob,
      gender,
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      bloodGroup,
      address: address.trim(),
      emergencyContact: {
        name: emergencyName.trim() || 'Relative',
        relationship: emergencyRelation.trim() || 'Family',
        phone: emergencyPhone.trim() || phone.trim(),
      },
      allergies: allergiesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      medications: medicationsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      medicalHistory: {
        priorDVT,
        thrombophilia,
        priorVeinSurgery,
        anticoagulantTherapy,
        diabetes,
        hypertension,
        smoker,
        familyHistoryVeins,
        prolongedStandingWork,
        otherConditions: notes.trim(),
      },
      ceapGrade,
      affectedLeg,
      portalAccessCode: accessCode,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.savePatient(newPatient);
    if (onPatientSaved) onPatientSaved(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900 border border-teal-500/40 rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-800 to-cyan-800 border-b border-teal-600/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {t.registerNewPatient}
              </h3>
              <p className="text-xs text-teal-200">
                {isRtl
                  ? 'إنشاء ملف سريري جديد وتوثيق التاريخ الوريدي'
                  : 'Register a new varicose vein patient medical record'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Identity & Contact Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider border-b border-slate-800 pb-1">
              {isRtl ? 'بيانات المريض الأساسية' : 'Personal & Contact Information'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {t.fullNameEn} *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Hussein Ali Kadhim"
                  className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {t.fullNameAr} *
                </label>
                <input
                  type="text"
                  required
                  value={fullNameAr}
                  onChange={(e) => setFullNameAr(e.target.value)}
                  placeholder="مثال: حسين علي كاظم"
                  className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">{t.dateOfBirth}</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">{t.gender}</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                  className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
                >
                  <option value="Male">{isRtl ? 'ذكر' : 'Male'}</option>
                  <option value="Female">{isRtl ? 'أنثى' : 'Female'}</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">{t.bloodGroup}</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as Patient['bloodGroup'])}
                  className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">{t.nationalId}</label>
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="Civil ID"
                  className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">{t.phone} *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+964 770..."
                  className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">WhatsApp</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+964 770..."
                  className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">{t.address}</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="City, District"
                  className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
            </div>
          </div>

          {/* Venous Staging & Presentation */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-2">
              <HeartPulse className="w-3.5 h-3.5 text-cyan-400" />
              {isRtl ? 'الحالة السريرية وتصنيف الدوالي المبدئي' : 'Venous Presentation & Initial CEAP'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">{t.ceapStage}</label>
                <select
                  value={ceapGrade}
                  onChange={(e) => setCeapGrade(e.target.value as CEAPClinical)}
                  className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
                >
                  <option value="C0">C0 - No visible venous disease</option>
                  <option value="C1">C1 - Spider / Reticular veins (&lt;3mm)</option>
                  <option value="C2">C2 - Varicose veins (&ge;3mm)</option>
                  <option value="C3">C3 - Venous edema of ankle</option>
                  <option value="C4a">C4a - Pigmentation / Stasis dermatitis</option>
                  <option value="C4b">C4b - Lipodermatosclerosis / Atrophie blanche</option>
                  <option value="C4c">C4c - Corona phlebectatica</option>
                  <option value="C5">C5 - Healed venous ulcer scar</option>
                  <option value="C6">C6 - Active open venous ulcer</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">{t.affectedLeg}</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Right', 'Left', 'Bilateral'] as const).map((leg) => (
                    <button
                      key={leg}
                      type="button"
                      onClick={() => setAffectedLeg(leg)}
                      className={`py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                        affectedLeg === leg
                          ? 'bg-teal-600 border-teal-400 text-white shadow-md'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {leg === 'Right'
                        ? isRtl
                          ? 'اليمنى'
                          : 'Right'
                        : leg === 'Left'
                        ? isRtl
                          ? 'اليسرى'
                          : 'Left'
                        : isRtl
                        ? 'كلا الطرفين'
                        : 'Bilateral'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Venous Risk Factors Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              {t.medicalHistory}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/50 border border-slate-700/60 cursor-pointer hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={priorDVT}
                  onChange={(e) => setPriorDVT(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-400"
                />
                <span className="text-[11px] text-slate-200">{t.priorDVT}</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/50 border border-slate-700/60 cursor-pointer hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={thrombophilia}
                  onChange={(e) => setThrombophilia(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-400"
                />
                <span className="text-[11px] text-slate-200">{t.thrombophilia}</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/50 border border-slate-700/60 cursor-pointer hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={anticoagulantTherapy}
                  onChange={(e) => setAnticoagulantTherapy(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span className="text-[11px] text-slate-200">{t.anticoagulantTherapy}</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/50 border border-slate-700/60 cursor-pointer hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={priorVeinSurgery}
                  onChange={(e) => setPriorVeinSurgery(e.target.checked)}
                  className="rounded text-teal-500 focus:ring-teal-400"
                />
                <span className="text-[11px] text-slate-200">{t.priorVeinSurgery}</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/50 border border-slate-700/60 cursor-pointer hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={prolongedStandingWork}
                  onChange={(e) => setProlongedStandingWork(e.target.checked)}
                  className="rounded text-teal-500 focus:ring-teal-400"
                />
                <span className="text-[11px] text-slate-200">{t.standingWork}</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/50 border border-slate-700/60 cursor-pointer hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={familyHistoryVeins}
                  onChange={(e) => setFamilyHistoryVeins(e.target.checked)}
                  className="rounded text-teal-500 focus:ring-teal-400"
                />
                <span className="text-[11px] text-slate-200">{t.familyHistory}</span>
              </label>
            </div>
          </div>

          {/* Allergies & Medications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                {t.allergies}
              </label>
              <input
                type="text"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                placeholder="e.g. Lidocaine, Latex, Penicillin (comma separated)"
                className="w-full bg-slate-800/80 border border-rose-500/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-cyan-400" />
                {t.medications}
              </label>
              <input
                type="text"
                value={medicationsText}
                onChange={(e) => setMedicationsText(e.target.value)}
                placeholder="e.g. Daflon 500mg, Aspirin 100mg"
                className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">{t.clinicalNotes}</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Clinical observations, chief complaint, referral doctor..."
              className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold transition shadow-lg shadow-teal-500/20 active:scale-95 cursor-pointer"
            >
              {t.savePatient}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
