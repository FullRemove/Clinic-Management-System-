import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Phone,
  User,
  Copy,
  CheckCircle,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Patient, Appointment } from '../types/clinic';
import { storage } from '../services/storageService';
import { translations, Language } from '../i18n/translations';

interface Props {
  lang: Language;
  patients: Patient[];
  appointments: Appointment[];
}

export const WhatsAppView: React.FC<Props> = ({
  lang,
  patients,
  appointments,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const activePatient = patients.find((p) => p.id === selectedPatientId);

  const [customPhone, setCustomPhone] = useState(activePatient?.whatsapp || activePatient?.phone || '+964');
  const [selectedTemplate, setSelectedTemplate] = useState<'appointment' | 'preop' | 'postop' | 'twoweek'>('appointment');
  const [messageText, setMessageText] = useState('');
  const [copied, setCopied] = useState(false);

  // Sync custom phone on patient change
  React.useEffect(() => {
    if (activePatient) {
      setCustomPhone(activePatient.whatsapp || activePatient.phone);
      updateTemplateMessage(selectedTemplate, activePatient);
    }
  }, [selectedPatientId, selectedTemplate, lang]);

  const updateTemplateMessage = (tpl: typeof selectedTemplate, pt: Patient) => {
    const patientName = isRtl ? pt.fullNameAr || pt.fullName : pt.fullName;
    let text = '';

    if (tpl === 'appointment') {
      text = isRtl
        ? `مرحباً بك عزيزي/عزيزتي ${patientName}،\n\nنود تأكيد موعدك القادم في مركز الأمل التخصصي لعلاج دوالي الساقين.\n📍 العنوان: بغداد، شارع الكندي، المجمع الطبي، جناح 402.\n🕒 يرجى الحضور قبل الموعد بـ 15 دقيقة مصطحباً بطاقتك وأي تقارير سونار سابقة.\nلأي استفسار يمكنك الرد على هذه المحادثة.`
        : `Dear ${patientName},\n\nThis is a confirmation of your appointment at Al-Amal Vein & Vascular Center.\n📍 Address: Al-Kindi Street, Medical District, Suite 402, Baghdad.\n🕒 Please arrive 15 minutes before your slot with your ID and prior medical reports.`;
    } else if (tpl === 'preop') {
      text = isRtl
        ? `تعليمات هامة قبل عملية قسطرة الليزر (EVLA) - ${patientName}:\n\n1. تناول وجبة خفيفة قبل موعدك بساعتين مع شرب الماء الكافي.\n2. ارتدِ بنطالاً واسعاً ومريحاً أو دشداشة لتسهيل ارتداء الجوارب بعد العملية.\n3. تأكد من إحضار الجوارب الضاغطة الطبية الموصوفة معك إلى العيادة.\n4. استمر في تناول أدويتك المعتادة للضغط والقلب كما تم الاتفاق مع د. كاروان.\n\nنتمنى لكم دوام الصحة والعافية.`
        : `Pre-EVLA Laser Procedure Instructions for ${patientName}:\n\n1. Have a light meal and stay well hydrated 2 hours before the procedure.\n2. Wear loose-fitting, comfortable trousers or a robe.\n3. Bring your prescribed Class II compression stockings with you.\n4. Take your regular medications (blood pressure/thyroid) as usual unless advised otherwise.`;
    } else if (tpl === 'postop') {
      text = isRtl
        ? `متابعة اليوم الأول بعد القسطرة الليزرية - ${patientName}:\n\nحمد لله على سلامتكم من مركز الأمل.\nتذكير بالتعليمات الهامة:\n✓ استمر بارتداء الجورب الضاغط لمدة 48 ساعة متواصلة دون نزعه حتى في وقت النوم.\n✓ احرص على المشي لمدة 10 إلى 15 دقيقة كل ساعتين خلال ساعات النهار.\n✓ تجنب حمل الأوزان الثقيلة (> 15 كغم) والحمامات الساخنة لمدة أسبوع.\n\nموعد سونار المتابعة مجدول خلال 24 ساعة للاطمئنان على انسداد الوريد.`
        : `Day-1 Post-EVLA Follow-up for ${patientName}:\n\nWarm regards from Al-Amal Vein Clinic team.\nKey reminders:\n✓ Keep wearing your Class II compression stockings continuously for 48 hours without removal.\n✓ Walk 10-15 minutes every 2 hours during daytime.\n✓ Avoid heavy lifting (> 15 kg) and hot baths for 7 days.\n\nWe look forward to seeing you at your 24-hour duplex check.`;
    } else if (tpl === 'twoweek') {
      text = isRtl
        ? `تذكير بموعد الفحص السوناري الدوري (أسبوعين) - ${patientName}:\n\nنود تذكيرك بموعد فحص السونار الملون (الدوبلكس) للمتابعة الدورية بعد العملية، وتقييم الحاجة لجلسة تصليب تكميلية للأوردة العنكبوتية المتبقية.\nنرجو التواصل لتأكيد وقت حضوركم.`
        : `2-Week Duplex Ultrasound Review for ${patientName}:\n\nThis is a reminder for your 2-week post-procedure ultrasound scan to confirm successful vein occlusion and evaluate any residual spider/reticular veins for complementary foam sclerotherapy.`;
    }

    setMessageText(text);
  };

  const handleLaunchWhatsApp = () => {
    const cleanPhone = customPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      alert(isRtl ? 'يرجى إدخال رقم هاتف صحيح' : 'Please provide a valid phone number');
      return;
    }
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');

    storage.logAudit({
      userId: 'st-4',
      userName: 'Receptionist / Coordinator',
      userRole: 'Receptionist',
      action: 'Sent WhatsApp Patient Notification',
      category: 'Patient',
      details: `Template: ${selectedTemplate} to ${activePatient?.fullName} (${cleanPhone})`,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.whatsappTitle}</h3>
            <p className="text-xs text-slate-500">
              {isRtl
                ? 'إرسال تعليمات التحضير، ومتابعات اليوم الأول، والتذكير بالمواعيد'
                : 'Direct WhatsApp communication with pre-formatted bilingual clinical templates'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Patient & Template Selector */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" />
              {t.patient} *
            </label>
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
            <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              WhatsApp Number
            </label>
            <input
              type="tel"
              value={customPhone}
              onChange={(e) => setCustomPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-semibold"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-2">
              {t.chooseTemplate}
            </label>
            <div className="space-y-2">
              {[
                { id: 'appointment', label: t.tplAppointmentReminder },
                { id: 'preop', label: t.tplPreOpPreparation },
                { id: 'postop', label: t.tplPostOpCheck },
                { id: 'twoweek', label: t.tplTwoWeekReview },
              ].map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setSelectedTemplate(tpl.id as typeof selectedTemplate)}
                  className={`w-full p-2.5 rounded-xl border text-left rtl:text-right font-medium transition cursor-pointer ${
                    selectedTemplate === tpl.id
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Message Preview & One-Click Sender */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                {t.customMessage}
              </span>
              <button
                onClick={copyToClipboard}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-semibold"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>

            <textarea
              rows={10}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="mt-3 w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">
              Target Phone: <strong className="text-slate-800 font-mono">{customPhone}</strong>
            </span>

            <button
              onClick={handleLaunchWhatsApp}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{t.sendToWhatsApp}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
