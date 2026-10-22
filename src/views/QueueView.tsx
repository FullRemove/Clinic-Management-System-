import React, { useState } from 'react';
import {
  Clock,
  Volume2,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  CheckCircle,
  Plus,
  Trash2,
  AlertCircle,
  Stethoscope,
  Radio,
  Zap,
} from 'lucide-react';
import { QueueItem, Patient } from '../types/clinic';
import { storage } from '../services/storageService';
import { translations, Language } from '../i18n/translations';

interface Props {
  lang: Language;
  queue: QueueItem[];
  patients: Patient[];
  onCallPatient: (item: QueueItem) => void;
  onAdvanceQueue: (id: string) => void;
}

export const QueueView: React.FC<Props> = ({
  lang,
  queue,
  patients,
  onCallPatient,
  onAdvanceQueue,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [priority, setPriority] = useState<QueueItem['priority']>('Routine');
  const [stage, setStage] = useState<QueueItem['stage']>('Waiting');
  const [queueNotes, setQueueNotes] = useState('');

  const stages: { id: QueueItem['stage']; label: string; icon: React.ElementType }[] = [
    { id: 'Waiting', label: t.stageWaiting, icon: Clock },
    { id: 'Triage', label: t.stageTriage, icon: UserCheck },
    { id: 'In Consultation', label: t.stageConsultation, icon: Stethoscope },
    { id: 'Duplex Exam', label: t.stageDuplex, icon: Radio },
    { id: 'Procedure Suite', label: t.stageProcedure, icon: Zap },
    { id: 'Recovery', label: t.stageRecovery, icon: HeartPulseIcon },
    { id: 'Completed', label: t.stageCompleted, icon: CheckCircle },
  ];

  function HeartPulseIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M12 5v14" />
      </svg>
    );
  }

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    const p = patients.find((x) => x.id === selectedPatientId);
    if (!p) return;

    const ticketNumber = `V-${Math.floor(100 + Math.random() * 900)}`;
    const newItem: QueueItem = {
      id: `q-${Date.now()}`,
      ticketNumber,
      patientId: p.id,
      patientName: isRtl ? p.fullNameAr || p.fullName : p.fullName,
      phone: p.phone,
      arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      doctorId: 'st-1',
      doctorName: 'Dr. Karwan Kareem Kurd',
      stage,
      priority,
      notes: queueNotes.trim(),
    };

    storage.saveQueueItem(newItem);
    setShowCheckInModal(false);
    setQueueNotes('');
  };

  const handleRemove = (id: string) => {
    storage.removeFromQueue(id);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.queueTitle}</h3>
            <p className="text-xs text-slate-500">
              {isRtl
                ? 'تنظيم حركة المريض بين الاستشارة، السونار، الليزر، والتعافي'
                : 'Live clinic flow across triage, consultation, duplex, and EVLA suite'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCheckInModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addToQueue}</span>
        </button>
      </div>

      {/* Kanban / Multi-Station Flow Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stages.filter(s => s.id !== 'Completed').map((stg) => {
          const Icon = stg.icon;
          const itemsAtStation = queue.filter((q) => q.stage === stg.id);
          return (
            <div
              key={stg.id}
              className="bg-slate-100/70 border border-slate-200 rounded-2xl p-3 flex flex-col min-h-[380px]"
            >
              {/* Station Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-teal-700" />
                  <span className="font-bold text-slate-900 text-xs truncate">
                    {stg.label}
                  </span>
                </div>
                <span className="w-5 h-5 rounded-full bg-teal-800 text-white text-[10px] font-bold flex items-center justify-center">
                  {itemsAtStation.length}
                </span>
              </div>

              {/* Station Patient Cards */}
              <div className="flex-1 space-y-2.5 overflow-y-auto">
                {itemsAtStation.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-slate-400 text-[11px] italic">
                    Empty
                  </div>
                ) : (
                  itemsAtStation.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm hover:shadow transition space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-xs text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                          {item.ticketNumber}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            item.priority === 'Urgent' || item.priority === 'Post-Op Emergency'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>

                      <div>
                        <div className="font-bold text-slate-900 truncate">
                          {item.patientName}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {isRtl ? 'وقت الوصول:' : 'Arrived:'} {item.arrivalTime}
                        </div>
                      </div>

                      {item.notes && (
                        <div className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100 italic">
                          "{item.notes}"
                        </div>
                      )}

                      {/* Card Actions */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <button
                          onClick={() => onCallPatient(item)}
                          className="p-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 transition cursor-pointer"
                          title="Call patient"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onAdvanceQueue(item.id)}
                          className="px-2 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white font-bold text-[10px] transition cursor-pointer flex items-center gap-1"
                          title="Advance Station"
                        >
                          <span>{isRtl ? 'المحطة التالية' : 'Advance'}</span>
                          {isRtl ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completed / Discharged Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <h4 className="font-bold text-slate-900 text-xs mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          {isRtl ? 'المرضى الذين اكتملت زيارتهم اليوم وغادروا' : 'Discharged / Completed Patients Today'}
        </h4>
        <div className="flex flex-wrap gap-2 text-xs">
          {queue.filter((q) => q.stage === 'Completed').length === 0 ? (
            <span className="text-slate-400 text-xs italic">No discharged patients yet today.</span>
          ) : (
            queue
              .filter((q) => q.stage === 'Completed')
              .map((q) => (
                <div
                  key={q.id}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2"
                >
                  <span className="font-mono font-bold text-teal-700">{q.ticketNumber}</span>
                  <span className="font-medium text-slate-800">{q.patientName}</span>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Check-In Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              {t.addToQueue}
            </h3>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">{t.patient} *</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-teal-500"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {isRtl ? p.fullNameAr : p.fullName} ({p.mrn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">{t.stage}</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as QueueItem['stage'])}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
              >
                <option value="Waiting">Waiting Room (صالة الانتظار)</option>
                <option value="Triage">Triage / Vitals (فرز وعلامات حيوية)</option>
                <option value="In Consultation">Consultation Room (استشارة طبية)</option>
                <option value="Duplex Exam">Duplex Scan Suite (سونار)</option>
                <option value="Procedure Suite">Laser Suite (عمليات الليزر)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">{t.priority}</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as QueueItem['priority'])}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
              >
                <option value="Routine">Routine (اعتيادي)</option>
                <option value="Urgent">Urgent (عاجل)</option>
                <option value="Post-Op Emergency">Post-Op Emergency (طوارئ بعد العملية)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Queue Note</label>
              <input
                type="text"
                value={queueNotes}
                onChange={(e) => setQueueNotes(e.target.value)}
                placeholder="e.g. Needs immediate stocking adjustment"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCheckInModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleCheckIn}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold"
              >
                {t.addToQueue}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
