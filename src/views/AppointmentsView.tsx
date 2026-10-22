import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  User,
  CheckCircle,
  XCircle,
  MessageSquare,
  Filter,
  Phone,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Appointment, AppointmentStatus, Patient, StaffMember } from '../types/clinic';
import { storage } from '../services/storageService';
import { translations, Language } from '../i18n/translations';

interface Props {
  lang: Language;
  appointments: Appointment[];
  patients: Patient[];
  staff: StaffMember[];
  onOpenBookAppointmentModal: () => void;
}

export const AppointmentsView: React.FC<Props> = ({
  lang,
  appointments,
  patients,
  staff,
  onOpenBookAppointmentModal,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredAppointments = appointments.filter((apt) => {
    const matchDoctor = selectedDoctorId === 'All' || apt.doctorId === selectedDoctorId;
    const matchStatus = statusFilter === 'All' || apt.status === statusFilter;
    return matchDoctor && matchStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: AppointmentStatus) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return;
    storage.saveAppointment({ ...apt, status: newStatus });
  };

  const sendWhatsAppReminder = (apt: Appointment) => {
    const cleanPhone = apt.patientPhone.replace(/[^0-9]/g, '');
    const msg = isRtl
      ? `السلام عليكم ${apt.patientName}، نود تذكيرك بموعدك في مركز الأمل لدوالي الساقين يوم ${apt.date} الساعة ${apt.time} (${apt.type}) مع ${apt.doctorName}. العنوان: شارع الكندي، بغداد. نرجو الحضور قبل الموعد بـ 15 دقيقة.`
      : `Dear ${apt.patientName}, this is a reminder for your upcoming appointment at Al-Amal Vein Clinic on ${apt.date} at ${apt.time} (${apt.type}) with ${apt.doctorName}. Location: Al-Kindi St, Baghdad.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');

    storage.saveAppointment({ ...apt, whatsappReminderSent: true });
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.navAppointments}</h3>
            <p className="text-xs text-slate-500">
              {isRtl
                ? 'جدول مواعيد الكشف، الدوبلكس، وجلسات الليزر والتصليب'
                : 'Clinic schedule, consultation bookings, and laser procedures'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Doctor Filter */}
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
          >
            <option value="All">{isRtl ? 'جميع الأطباء' : 'All Specialists'}</option>
            {staff
              .filter((s) => s.role === 'Vascular Surgeon' || s.role === 'Phlebologist')
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {isRtl ? d.nameAr : d.name}
                </option>
              ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
          >
            <option value="All">{isRtl ? 'جميع الحالات' : 'All Statuses'}</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Checked In">Checked In</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Book Appointment Action */}
          <button
            onClick={onOpenBookAppointmentModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t.bookAppointment}</span>
          </button>
        </div>
      </div>

      {/* Appointments List View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{t.date} & Time</th>
                <th className="py-3 px-4">{t.patient}</th>
                <th className="py-3 px-4">{isRtl ? 'نوع الموعد' : 'Type'}</th>
                <th className="py-3 px-4">{isRtl ? 'الطبيب المعالج' : 'Doctor'}</th>
                <th className="py-3 px-4">Fee (IQD)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No appointments scheduled matching filters.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-medium">
                      <div className="font-bold text-slate-900 font-mono">{apt.date}</div>
                      <div className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{apt.time} ({apt.durationMinutes}m)</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{apt.patientName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{apt.patientPhone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                        {apt.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {apt.doctorName}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {apt.feeIQD.toLocaleString()} IQD
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={apt.status}
                        onChange={(e) => handleUpdateStatus(apt.id, e.target.value as AppointmentStatus)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          apt.status === 'Completed'
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                            : apt.status === 'Checked In'
                            ? 'bg-cyan-100 border-cyan-300 text-cyan-800 animate-pulse'
                            : apt.status === 'Cancelled'
                            ? 'bg-rose-100 border-rose-300 text-rose-800'
                            : 'bg-amber-100 border-amber-300 text-amber-800'
                        }`}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Checked In">Checked In</option>
                        <option value="In Consultation">In Consultation</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="No Show">No Show</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => sendWhatsAppReminder(apt)}
                          className={`p-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                            apt.whatsappReminderSent
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                          title="Send WhatsApp Reminder"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-[10px] font-bold hidden sm:inline">
                            {apt.whatsappReminderSent ? 'Sent' : 'Remind'}
                          </span>
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
    </div>
  );
};
