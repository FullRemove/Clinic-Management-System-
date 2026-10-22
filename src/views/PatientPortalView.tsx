import React, { useState } from 'react';
import {
  User,
  KeyRound,
  Calendar,
  FileText,
  CreditCard,
  HeartPulse,
  Radio,
  CheckCircle,
  Clock,
  Printer,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  LogOut,
  Files,
  Download,
  Eye,
  X,
} from 'lucide-react';
import { Patient, Appointment, Invoice, DuplexUltrasoundReport, PatientDocument } from '../types/clinic';
import { storage } from '../services/storageService';
import { translations, Language } from '../i18n/translations';

interface Props {
  lang: Language;
  onExitPortal: () => void;
}

export const PatientPortalView: React.FC<Props> = ({
  lang,
  onExitPortal,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [inputCode, setInputCode] = useState('AL7491');
  const [authenticatedPatient, setAuthenticatedPatient] = useState<Patient | null>(() => {
    return storage.getPatients().find((p) => p.portalAccessCode === 'AL7491') || storage.getPatients()[0];
  });
  const [activeTab, setActiveTab] = useState<'care' | 'appointments' | 'ultrasound' | 'documents' | 'billing'>('care');
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [bookingDate, setBookingDate] = useState('2026-10-25');
  const [bookingTime, setBookingTime] = useState('11:00');
  const [bookingNotes, setBookingNotes] = useState('');
  const [previewDoc, setPreviewDoc] = useState<PatientDocument | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputCode.trim().toUpperCase();
    const found = storage.getPatients().find(
      (p) => p.portalAccessCode?.toUpperCase() === query || p.mrn.toUpperCase() === query
    );
    if (found) {
      setAuthenticatedPatient(found);
    } else {
      alert(isRtl ? 'لم يتم العثور على ملف يطابق هذا الرمز أو الرقم' : 'No patient file matches this MRN or access PIN');
    }
  };

  const patientAppointments = authenticatedPatient
    ? storage.getAppointments().filter((a) => a.patientId === authenticatedPatient.id)
    : [];
  const patientInvoices = authenticatedPatient
    ? storage.getInvoices().filter((i) => i.patientId === authenticatedPatient.id)
    : [];
  const patientUltrasound = authenticatedPatient
    ? storage.getUltrasoundReports().find((u) => u.patientId === authenticatedPatient.id)
    : null;
  const patientDocuments = authenticatedPatient
    ? storage.getPatientDocuments(authenticatedPatient.id).filter((d) => !d.isConfidential)
    : [];

  const handleRequestBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticatedPatient) return;

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: authenticatedPatient.id,
      patientName: isRtl ? authenticatedPatient.fullNameAr || authenticatedPatient.fullName : authenticatedPatient.fullName,
      patientPhone: authenticatedPatient.phone,
      doctorId: 'st-1',
      doctorName: 'Dr. Karwan Kareem Kurd',
      date: bookingDate,
      time: bookingTime,
      durationMinutes: 30,
      type: 'Initial Consultation',
      status: 'Scheduled',
      feeIQD: 50000,
      notes: `Requested via Patient Portal: ${bookingNotes.trim()}`,
      createdAt: new Date().toISOString(),
    };

    storage.saveAppointment(newApt);
    setRequestSubmitted(true);
    setTimeout(() => setRequestSubmitted(false), 4000);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between space-y-6">
      {/* Top Banner with Logout */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-cyan-900 rounded-3xl p-6 text-white shadow-xl border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-500/30">
              {t.navPortal}
            </span>
            <h2 className="text-xl font-black mt-1">
              {t.portalWelcome}
            </h2>
            <p className="text-xs text-teal-200 mt-0.5 max-w-xl">
              {t.portalSubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={onExitPortal}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 border border-white/20 self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.closePortal}</span>
        </button>
      </div>

      {/* Access Code Login Box if not authenticated */}
      {!authenticatedPatient ? (
        <div className="max-w-md mx-auto w-full bg-white rounded-3xl border border-slate-200 p-6 shadow-xl space-y-4 text-xs my-8">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t.enterAccessCode}</h3>
            <p className="text-slate-500 text-xs">
              Check your clinic appointment card or SMS message for your 6-digit access PIN.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="text"
              required
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="e.g. AL7491 or VV-2026-001"
              className="w-full text-center text-lg font-mono font-bold tracking-widest bg-slate-50 border border-slate-200 rounded-2xl py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
            >
              Access My Vein Medical Record
            </button>
          </form>
        </div>
      ) : (
        /* Authenticated Patient Dashboard */
        <div className="space-y-6">
          {/* Patient Info Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-teal-800 text-teal-100 font-bold flex items-center justify-center font-mono">
                {authenticatedPatient.mrn}
              </span>
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  {isRtl ? authenticatedPatient.fullNameAr || authenticatedPatient.fullName : authenticatedPatient.fullName}
                </div>
                <div className="text-slate-500 mt-0.5">
                  Affected Limb: <strong>{authenticatedPatient.affectedLeg}</strong> • CEAP Staging: <strong>{authenticatedPatient.ceapGrade}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAuthenticatedPatient(null)}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                Change Patient PIN
              </button>
            </div>
          </div>

          {/* Portal Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('care')}
              className={`px-4 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'care' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              {t.postOpCarePlan}
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-4 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'appointments' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              {t.navAppointments} ({patientAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('ultrasound')}
              className={`px-4 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'ultrasound' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              {t.navUltrasound}
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'documents' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Files className="w-3.5 h-3.5" />
                <span>{isRtl ? 'المستندات والتقارير' : 'Approved Documents'}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-teal-100 text-teal-900 font-bold">
                  {patientDocuments.length}
                </span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`px-4 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'billing' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              {t.myInvoices} ({patientInvoices.length})
            </button>
          </div>

          {/* Tab 1: Post-Op Care & Stocking Guide */}
          {activeTab === 'care' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-teal-600" />
                  Your Post-Procedure Recovery Protocol
                </h4>
                <div className="space-y-3 text-slate-700 leading-relaxed">
                  <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 font-medium">
                    ✓ <strong>Compression Stockings:</strong> Keep wearing your Class II compression stockings for 48 hours without taking them off, even while sleeping.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-medium">
                    ✓ <strong>Walking Routine:</strong> Walk for 10-15 minutes every 2 hours during daytime. Gentle walking activates the calf muscle pump and speeds healing.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-medium">
                    ✓ <strong>Activities to Avoid:</strong> Avoid hot showers, baths, saunas, and strenuous heavy gym exercises for 7 days.
                  </div>
                </div>
              </div>

              {/* Emergency Hotline Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">
                  When to Contact the Clinic Immediately
                </h4>
                <p className="text-slate-600">
                  Please call our direct clinical hotline (+964 750 123 4567) or attend emergency if you notice:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-rose-700 font-medium">
                  <li>Sudden severe calf swelling or acute pain.</li>
                  <li>Sudden shortness of breath or sharp chest discomfort.</li>
                  <li>Significant active bleeding through your compression dressing.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Appointments & Online Booking Request */}
          {activeTab === 'appointments' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
              {/* Existing Appointments */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">My Scheduled Appointments</h4>
                {patientAppointments.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">No scheduled visits.</div>
                ) : (
                  patientAppointments.map((apt) => (
                    <div key={apt.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-900">{apt.type}</div>
                        <div className="text-[11px] text-teal-700 font-mono mt-0.5">
                          {apt.date} at {apt.time} • {apt.doctorName}
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                        {apt.status}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Online Booking Request Form */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">{t.requestBooking}</h4>

                {requestSubmitted ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-center">
                    ✓ Your appointment request has been submitted to reception! We will confirm via WhatsApp shortly.
                  </div>
                ) : (
                  <form onSubmit={handleRequestBooking} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Preferred Date</label>
                        <input
                          type="date"
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Preferred Time</label>
                        <input
                          type="time"
                          required
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Reason for Visit</label>
                      <input
                        type="text"
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        placeholder="e.g. Sclerotherapy follow-up or compression check"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition shadow-sm cursor-pointer"
                    >
                      Submit Appointment Request
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Duplex Ultrasound Report */}
          {activeTab === 'ultrasound' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-600" />
                Approved Venous Duplex Ultrasound Conclusion
              </h4>
              {patientUltrasound ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                    <span className="font-bold text-teal-950 block">Diagnostic Conclusion:</span>
                    <p className="text-teal-900 mt-1 leading-relaxed">{patientUltrasound.conclusion}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-800 block">Recommended Ablation / Intervention Zone:</span>
                    <p className="text-slate-700 mt-1">{patientUltrasound.recommendedAblationZone}</p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400">
                  No duplex scan on file yet.
                </div>
              )}
            </div>
          )}

          {/* Tab: Medical Documents & Reports */}
          {activeTab === 'documents' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Files className="w-4 h-4 text-teal-600" />
                    {isRtl ? 'المستندات والتقارير الطبية المعتمدة' : 'Official Medical Documents & Reports'}
                  </h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {isRtl
                      ? 'يمكنك معاينة وتحميل نتائج السونار والتقارير الطبية وموافقة العملية المعتمدة من العيادة.'
                      : 'Access, view, and download your approved Doppler scans, lab reports, and procedure consents.'}
                  </p>
                </div>
              </div>

              {patientDocuments.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Files className="w-8 h-8 mx-auto text-slate-300" />
                  <p>{isRtl ? 'لا توجد مستندات معتمدة منشورة لملفك بعد.' : 'No approved medical documents on file yet.'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patientDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                            {doc.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {doc.fileSizeKb} KB
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-xs mt-2">
                          {isRtl ? doc.titleAr || doc.title : doc.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {doc.notes || doc.fileName}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 text-[11px] text-slate-500">
                        <span>{doc.uploadedAt}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isRtl ? 'معاينة' : 'View'}</span>
                          </button>
                          <a
                            href={doc.fileUrl}
                            download={doc.fileName}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{isRtl ? 'تحميل' : 'Download'}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Invoices & Billing */}
          {activeTab === 'billing' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Billing Statements & Receipts
              </h4>
              {patientInvoices.length === 0 ? (
                <div className="py-8 text-center text-slate-400">No invoices issued.</div>
              ) : (
                patientInvoices.map((inv) => (
                  <div key={inv.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="font-mono font-bold text-teal-800">{inv.invoiceNumber}</div>
                      <div className="text-[11px] text-slate-500">{inv.date}</div>
                    </div>
                    <div className="text-right rtl:text-left">
                      <div className="font-bold text-slate-900">{inv.totalIQD.toLocaleString()} IQD</div>
                      <div className="text-[11px] text-slate-500">
                        Paid: {inv.paidIQD.toLocaleString()} IQD • Balance: {inv.balanceIQD.toLocaleString()} IQD
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Full Resolution Document Viewer Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-teal-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 bg-gradient-to-r from-teal-900 via-teal-800 to-cyan-900 text-white flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-950/80 border border-teal-400/40 text-teal-300">
                  {previewDoc.category}
                </span>
                <h3 className="font-bold text-sm mt-1">
                  {isRtl ? previewDoc.titleAr || previewDoc.title : previewDoc.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewDoc.fileUrl}
                  download={previewDoc.fileName}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto bg-slate-950 flex items-center justify-center">
              {previewDoc.fileType.startsWith('image/') || previewDoc.fileUrl.startsWith('data:image/') || previewDoc.fileUrl.startsWith('http') ? (
                <img
                  src={previewDoc.fileUrl}
                  alt={previewDoc.title}
                  className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl border border-slate-800"
                />
              ) : (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <Files className="w-12 h-12 mx-auto text-teal-400" />
                  <p className="font-mono text-sm text-white">{previewDoc.fileName}</p>
                  <a
                    href={previewDoc.fileUrl}
                    download={previewDoc.fileName}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
                  >
                    <Download className="w-4 h-4" />
                    Download File to View
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
