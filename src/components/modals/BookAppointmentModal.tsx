import React, { useState } from 'react';
import { X, Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { Appointment, AppointmentType, Patient, StaffMember } from '../../types/clinic';
import { storage } from '../../services/storageService';
import { translations, Language } from '../../i18n/translations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  preselectedPatientId?: string;
  onAppointmentBooked?: (appointment: Appointment) => void;
}

export const BookAppointmentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  lang,
  preselectedPatientId,
  onAppointmentBooked,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const patients = storage.getPatients();
  const staff = storage.getStaff().filter((s) => s.role === 'Vascular Surgeon' || s.role === 'Phlebologist');

  const [patientId, setPatientId] = useState(preselectedPatientId || (patients[0]?.id || ''));
  const [doctorId, setDoctorId] = useState(staff[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:00');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [type, setType] = useState<AppointmentType>('Initial Consultation');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  // Auto fee mapping in IQD
  const getFee = (aptType: AppointmentType): number => {
    switch (aptType) {
      case 'Initial Consultation':
        return 50000;
      case 'Duplex Ultrasound Scan':
        return 100000;
      case 'EVLA Laser Procedure':
        return 1500000;
      case 'Foam Sclerotherapy':
        return 250000;
      case 'Phlebectomy':
        return 400000;
      case 'Post-Op Follow-up':
        return 0; // included in surgical package
      case 'Stocking Fitting & Check':
        return 25000;
      default:
        return 50000;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selPatient = patients.find((p) => p.id === patientId);
    const selDoctor = staff.find((s) => s.id === doctorId);

    if (!selPatient) {
      alert(isRtl ? 'يرجى اختيار مريض' : 'Please select a patient');
      return;
    }

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: selPatient.id,
      patientName: isRtl ? selPatient.fullNameAr || selPatient.fullName : selPatient.fullName,
      patientPhone: selPatient.phone,
      doctorId: selDoctor?.id || 'st-1',
      doctorName: selDoctor ? (isRtl ? selDoctor.nameAr : selDoctor.name) : 'Dr. Karwan Kareem Kurd',
      date,
      time,
      durationMinutes,
      type,
      status: 'Scheduled',
      feeIQD: getFee(type),
      notes: notes.trim(),
      whatsappReminderSent: false,
      createdAt: new Date().toISOString(),
    };

    storage.saveAppointment(newApt);
    if (onAppointmentBooked) onAppointmentBooked(newApt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 bg-slate-900 border border-teal-500/40 rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-800 to-cyan-800 border-b border-teal-600/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {t.bookAppointment}
              </h3>
              <p className="text-xs text-teal-200">
                {isRtl ? 'جدولة موعد سريري أو ليزري جديد' : 'Schedule clinical or laser appointment'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Patient Selection */}
          <div>
            <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-400" />
              {t.patient} *
            </label>
            <select
              required
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
            >
              <option value="">{isRtl ? '-- اختر المريض --' : '-- Select Patient --'}</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {isRtl ? p.fullNameAr : p.fullName} ({p.mrn}) - {p.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
              {isRtl ? 'الطبيب المعالج / الاختصاصي' : 'Attending Specialist'} *
            </label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
            >
              {staff.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {isRtl ? doc.nameAr : doc.name} ({doc.role})
                </option>
              ))}
            </select>
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {isRtl ? 'نوع الموعد / الإجراء' : 'Appointment Type'}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AppointmentType)}
              className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
            >
              <option value="Initial Consultation">Initial Consultation (50,000 IQD)</option>
              <option value="Duplex Ultrasound Scan">Duplex Ultrasound Scan (100,000 IQD)</option>
              <option value="EVLA Laser Procedure">EVLA Laser Ablation (1,500,000 IQD)</option>
              <option value="Foam Sclerotherapy">Foam Sclerotherapy UGFS (250,000 IQD)</option>
              <option value="Phlebectomy">Ambulatory Phlebectomy (400,000 IQD)</option>
              <option value="Post-Op Follow-up">Post-Op Review / Stocking Check (Complimentary)</option>
              <option value="Stocking Fitting & Check">Compression Stocking Fitting (25,000 IQD)</option>
            </select>
          </div>

          {/* Date, Time & Duration */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">{t.date}</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {isRtl ? 'الوقت' : 'Time'}
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                {isRtl ? 'المدة (دقيقة)' : 'Duration'}
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
              </select>
            </div>
          </div>

          {/* Fee preview badge */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-teal-950/60 border border-teal-500/30">
            <span className="text-slate-300 font-medium">
              {isRtl ? 'الرسوم التقديرية (دينار عراقي):' : 'Estimated Standard Fee (IQD):'}
            </span>
            <span className="text-sm font-extrabold text-teal-300">
              {getFee(type).toLocaleString()} {t.iqdSuffix}
            </span>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">{t.clinicalNotes}</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Clinical preparation instructions, fasting note..."
              className="w-full bg-slate-800/80 border border-teal-500/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
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
              {t.bookAppointment}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
