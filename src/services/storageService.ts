import {
  Patient,
  Appointment,
  QueueItem,
  ClinicalAssessment,
  DuplexUltrasoundReport,
  TreatmentPlan,
  ProcedureRecord,
  Invoice,
  ClinicExpense,
  InventoryItem,
  StaffMember,
  AuditLogEntry,
  ClinicSettings,
  UserRole,
  PatientDocument,
  UserAccount,
  PermissionKey,
} from '../types/clinic';

const STORAGE_KEYS = {
  PATIENTS: 'vv_clinic_patients',
  APPOINTMENTS: 'vv_clinic_appointments',
  QUEUE: 'vv_clinic_queue',
  ASSESSMENTS: 'vv_clinic_assessments',
  ULTRASOUND: 'vv_clinic_ultrasound',
  TREATMENTS: 'vv_clinic_treatments',
  PROCEDURES: 'vv_clinic_procedures',
  INVOICES: 'vv_clinic_invoices',
  EXPENSES: 'vv_clinic_expenses',
  INVENTORY: 'vv_clinic_inventory',
  STAFF: 'vv_clinic_staff',
  AUDIT: 'vv_clinic_audit',
  SETTINGS: 'vv_clinic_settings',
  ACTIVE_ROLE: 'vv_clinic_active_role',
  LANGUAGE: 'vv_clinic_language',
  AUTH_USER: 'vv_clinic_current_user',
  DOCUMENTS: 'vv_clinic_patient_documents',
  USER_ACCOUNTS: 'vv_clinic_user_accounts',
};

// Seed Data
const DEFAULT_SETTINGS: ClinicSettings = {
  clinicNameEn: 'Al-Amal Vein & Vascular Center',
  clinicNameAr: 'مركز الأمل التخصصي لعلاج دوالي الساقين',
  sloganEn: 'Excellence in Endovenous Laser Therapy & Advanced Venous Care',
  sloganAr: 'الريادة في القسطرة الليزرية الموجهة بالسونار وعلاج أمراض الأوردة',
  phone: '+964 750 123 4567',
  whatsapp: '+9647501234567',
  email: 'info@alamal-veins.iq',
  addressEn: 'Medical District, Al-Kindi Street, Suite 402, Baghdad, Iraq',
  addressAr: 'المجمع الطبي التخصصي، شارع الكندي، جناح 402، بغداد، العراق',
  currency: 'IQD',
  currencySymbol: 'د.ع',
  taxPercent: 0,
  workingHoursEn: 'Sat - Thu: 9:00 AM - 8:00 PM (Friday Closed)',
  workingHoursAr: 'السبت - الخميس: 9:00 صباحاً - 8:00 مساءً (الجمعة عطلة)',
  leadSurgeonEn: 'Dr. Karwan Kareem Kurd (FRCSEd, Vascular & Endovascular)',
  leadSurgeonAr: 'د. كاروان كريم كورد (استشاري جراحة الأوعية والقسطرة الوريدية)',
  autoSendWhatsApp: true,
};

const DEFAULT_STAFF: StaffMember[] = [
  {
    id: 'st-1',
    name: 'Dr. Karwan Kareem Kurd',
    nameAr: 'د. كاروان كريم كورد',
    role: 'Vascular Surgeon',
    title: 'Consultant Vascular & Endovascular Surgeon, FRCSEd',
    titleAr: 'استشاري جراحة الأوعية الدموية والقسطرة التداخلية',
    email: 'karwan.kurd@alamal-veins.iq',
    phone: '+964 750 111 2233',
    active: true,
    workingDays: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'st-2',
    name: 'Dr. Sarah Al-Bayati',
    nameAr: 'د. سارة البياتي',
    role: 'Phlebologist',
    title: 'Specialist Phlebologist & Vascular Sonographer',
    titleAr: 'اختصاصية طب الأوردة وسونار الدوبلكس الوعائي',
    email: 'sarah.bayati@alamal-veins.iq',
    phone: '+964 750 222 3344',
    active: true,
    workingDays: ['Saturday', 'Sunday', 'Monday', 'Wednesday', 'Thursday'],
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'st-3',
    name: 'Nurse Zainab Hassan',
    nameAr: 'الممرضة زينب حسن',
    role: 'Nurse',
    title: 'Senior Vascular Interventional Scrub Nurse',
    titleAr: 'ممرضة أقدم لجراحة وقسطرة الأوعية الدموية',
    email: 'zainab.h@alamal-veins.iq',
    phone: '+964 750 333 4455',
    active: true,
    workingDays: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    avatarUrl: 'https://images.unsplash.com/photo-1594824813576-96a1a1f498ba?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'st-4',
    name: 'Ahmed Al-Jaf',
    nameAr: 'أحمد الجاف',
    role: 'Receptionist',
    title: 'Chief Patient Relations & Triage Coordinator',
    titleAr: 'مسؤول الاستقبال وشؤون المرضى وتنظيم الدور',
    email: 'ahmed.j@alamal-veins.iq',
    phone: '+964 750 444 5566',
    active: true,
    workingDays: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'st-5',
    name: 'Noor Al-Huda',
    nameAr: 'نور الهدى',
    role: 'Accountant',
    title: 'Finance & Medical Billing Officer',
    titleAr: 'مسؤولة الحسابات والفوترة الطبية',
    email: 'noor.finance@alamal-veins.iq',
    phone: '+964 750 555 6677',
    active: true,
    workingDays: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
];

const DEFAULT_PATIENTS: Patient[] = [
  {
    id: 'pt-1',
    mrn: 'VV-2026-001',
    nationalId: '197489201944',
    fullName: 'Ali Mohammed Hassan',
    fullNameAr: 'علي محمد حسن',
    dob: '1974-06-15',
    gender: 'Male',
    phone: '+9647701234567',
    whatsapp: '+9647701234567',
    email: 'ali.m.hassan@example.com',
    bloodGroup: 'B+',
    address: 'Karrada, Baghdad',
    emergencyContact: {
      name: 'Hussein Mohammed (Son)',
      relationship: 'Son',
      phone: '+9647709876543',
    },
    allergies: ['Penicillin (Mild rash)'],
    medicalHistory: {
      priorDVT: false,
      thrombophilia: false,
      priorVeinSurgery: false,
      anticoagulantTherapy: false,
      diabetes: false,
      hypertension: true,
      smoker: true,
      familyHistoryVeins: true,
      prolongedStandingWork: true,
      otherConditions: 'Secondary school teacher, standing 6+ hours daily',
    },
    medications: ['Amlodipine 5mg', 'Daflon 500mg (2 tabs daily)'],
    ceapGrade: 'C4a',
    affectedLeg: 'Right',
    portalAccessCode: 'AL7491',
    notes: 'Severe right GSV incompetence, hyperpigmentation on right lower medial calf.',
    createdAt: '2026-09-10T10:00:00Z',
    updatedAt: '2026-10-20T14:30:00Z',
  },
  {
    id: 'pt-2',
    mrn: 'VV-2026-002',
    nationalId: '198240192831',
    fullName: 'Fatima Qasim Al-Zubaidi',
    fullNameAr: 'فاطمة قاسم الزبيدي',
    dob: '1982-11-20',
    gender: 'Female',
    phone: '+9647802345678',
    whatsapp: '+9647802345678',
    email: 'fatima.zubaidi@example.com',
    bloodGroup: 'O+',
    address: 'Mansour, Baghdad',
    emergencyContact: {
      name: 'Zaid Tariq (Husband)',
      relationship: 'Husband',
      phone: '+9647808765432',
    },
    allergies: ['None known'],
    medicalHistory: {
      priorDVT: false,
      thrombophilia: false,
      priorVeinSurgery: false,
      anticoagulantTherapy: false,
      diabetes: false,
      hypertension: false,
      smoker: false,
      familyHistoryVeins: true,
      prolongedStandingWork: true,
      otherConditions: '3 full-term pregnancies; ICU nurse',
    },
    medications: ['Multivitamins'],
    ceapGrade: 'C3',
    affectedLeg: 'Bilateral',
    portalAccessCode: 'FA8243',
    notes: 'Bilateral evening ankle edema, heaviness, reticular varices.',
    createdAt: '2026-09-14T11:20:00Z',
    updatedAt: '2026-10-18T09:15:00Z',
  },
  {
    id: 'pt-3',
    mrn: 'VV-2026-003',
    nationalId: '196510293847',
    fullName: 'Omar Tariq Al-Nuaimi',
    fullNameAr: 'عمر طارق النعيمي',
    dob: '1965-03-08',
    gender: 'Male',
    phone: '+9647713456789',
    whatsapp: '+9647713456789',
    bloodGroup: 'A+',
    address: 'Adhamiya, Baghdad',
    emergencyContact: {
      name: 'Bilal Omar (Son)',
      relationship: 'Son',
      phone: '+9647719998877',
    },
    allergies: ['Lidocaine (Mild tachycardia, use low epi)'],
    medicalHistory: {
      priorDVT: true,
      thrombophilia: false,
      priorVeinSurgery: false,
      anticoagulantTherapy: true,
      diabetes: true,
      hypertension: true,
      smoker: false,
      familyHistoryVeins: true,
      prolongedStandingWork: false,
      otherConditions: 'Right calf DVT 8 years ago post-cholecystectomy. Post-thrombotic syndrome.',
    },
    medications: ['Rivaroxaban 20mg', 'Metformin 850mg', 'Lisinopril 10mg'],
    ceapGrade: 'C6',
    affectedLeg: 'Right',
    portalAccessCode: 'OM6528',
    notes: 'Active medial malleolar venous ulcer 3.8 cm², serous exudate, granulating floor.',
    createdAt: '2026-08-01T08:30:00Z',
    updatedAt: '2026-10-21T16:00:00Z',
  },
  {
    id: 'pt-4',
    mrn: 'VV-2026-004',
    nationalId: '198892019485',
    fullName: 'Layla Kheder Barzani',
    fullNameAr: 'ليلى خضر بارزاني',
    dob: '1988-04-12',
    gender: 'Female',
    phone: '+9647504567890',
    whatsapp: '+9647504567890',
    email: 'layla.barzani@example.com',
    bloodGroup: 'O-',
    address: 'Erbil Central, Kurdistan',
    emergencyContact: {
      name: 'Rezan Barzani (Brother)',
      relationship: 'Brother',
      phone: '+9647503332211',
    },
    allergies: ['Latex'],
    medicalHistory: {
      priorDVT: false,
      thrombophilia: false,
      priorVeinSurgery: false,
      anticoagulantTherapy: false,
      diabetes: false,
      hypertension: false,
      smoker: false,
      familyHistoryVeins: true,
      prolongedStandingWork: false,
      otherConditions: 'Cosmetic & symptomatic varices, burning pain after 2 PM',
    },
    medications: ['Daflon 1000mg'],
    ceapGrade: 'C2',
    affectedLeg: 'Left',
    portalAccessCode: 'LA8812',
    notes: 'Left GSV tributary tortuosities, scheduled for EVLA laser ablation.',
    createdAt: '2026-10-02T13:45:00Z',
    updatedAt: '2026-10-21T11:00:00Z',
  },
  {
    id: 'pt-5',
    mrn: 'VV-2026-005',
    nationalId: '196819283746',
    fullName: 'Haidar Jalal Al-Khafaji',
    fullNameAr: 'حيدر جلال الخفاجي',
    dob: '1968-09-25',
    gender: 'Male',
    phone: '+9647725678901',
    whatsapp: '+9647725678901',
    bloodGroup: 'AB+',
    address: 'Babylon / Hilla',
    emergencyContact: {
      name: 'Ali Haidar (Son)',
      relationship: 'Son',
      phone: '+9647721112223',
    },
    allergies: ['Sulfa drugs'],
    medicalHistory: {
      priorDVT: false,
      thrombophilia: false,
      priorVeinSurgery: true,
      anticoagulantTherapy: false,
      diabetes: false,
      hypertension: true,
      smoker: true,
      familyHistoryVeins: true,
      prolongedStandingWork: true,
      otherConditions: 'Open surgery vein stripping 12 years ago with recurrent neovascularization.',
    },
    medications: ['Valsartan 80mg'],
    ceapGrade: 'C4b',
    affectedLeg: 'Bilateral',
    portalAccessCode: 'HA6899',
    notes: 'Severe bilateral lipodermatosclerosis (inverted bottle neck), recurrent groin tributaries.',
    createdAt: '2026-09-22T09:00:00Z',
    updatedAt: '2026-10-19T10:00:00Z',
  },
  {
    id: 'pt-6',
    mrn: 'VV-2026-006',
    nationalId: '197728394857',
    fullName: 'Shireen Rostam Aziz',
    fullNameAr: 'شيرين رستم عزيز',
    dob: '1977-12-04',
    gender: 'Female',
    phone: '+9647506789012',
    whatsapp: '+9647506789012',
    bloodGroup: 'A-',
    address: 'Sulaymaniyah',
    emergencyContact: {
      name: 'Rostam Aziz (Father)',
      relationship: 'Father',
      phone: '+9647504445566',
    },
    allergies: ['None'],
    medicalHistory: {
      priorDVT: false,
      thrombophilia: false,
      priorVeinSurgery: false,
      anticoagulantTherapy: false,
      diabetes: false,
      hypertension: false,
      smoker: false,
      familyHistoryVeins: true,
      prolongedStandingWork: false,
      otherConditions: 'Spider veins, minor calf fullness',
    },
    medications: [],
    ceapGrade: 'C1',
    affectedLeg: 'Bilateral',
    portalAccessCode: 'SH7712',
    notes: 'Extensive lateral subdermal reticular net, desires liquid/foam sclerotherapy.',
    createdAt: '2026-10-15T15:10:00Z',
    updatedAt: '2026-10-22T08:00:00Z',
  },
];

const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    patientId: 'pt-1',
    patientName: 'Ali Mohammed Hassan',
    patientPhone: '+9647701234567',
    doctorId: 'st-1',
    doctorName: 'Dr. Karwan Kareem Kurd',
    date: '2026-10-22',
    time: '11:30',
    durationMinutes: 45,
    type: 'EVLA Laser Procedure',
    status: 'Checked In',
    feeIQD: 1500000,
    notes: 'Right GSV 1470nm Radial Laser + Tumescent anesthesia',
    whatsappReminderSent: true,
    createdAt: '2026-10-20T10:00:00Z',
  },
  {
    id: 'apt-2',
    patientId: 'pt-2',
    patientName: 'Fatima Qasim Al-Zubaidi',
    patientPhone: '+9647802345678',
    doctorId: 'st-2',
    doctorName: 'Dr. Sarah Al-Bayati',
    date: '2026-10-22',
    time: '12:15',
    durationMinutes: 30,
    type: 'Duplex Ultrasound Scan',
    status: 'Scheduled',
    feeIQD: 100000,
    notes: 'Bilateral venous duplex mapping for SFJ/SPJ reflux',
    whatsappReminderSent: true,
    createdAt: '2026-10-18T14:00:00Z',
  },
  {
    id: 'apt-3',
    patientId: 'pt-3',
    patientName: 'Omar Tariq Al-Nuaimi',
    patientPhone: '+9647713456789',
    doctorId: 'st-1',
    doctorName: 'Dr. Karwan Kareem Kurd',
    date: '2026-10-22',
    time: '13:00',
    durationMinutes: 40,
    type: 'Post-Op Follow-up',
    status: 'Confirmed',
    feeIQD: 60000,
    notes: 'Ulcer dressing change + Multilayer Unna boot compression',
    whatsappReminderSent: true,
    createdAt: '2026-10-19T09:30:00Z',
  },
  {
    id: 'apt-4',
    patientId: 'pt-4',
    patientName: 'Layla Kheder Barzani',
    patientPhone: '+9647504567890',
    doctorId: 'st-1',
    doctorName: 'Dr. Karwan Kareem Kurd',
    date: '2026-10-22',
    time: '14:00',
    durationMinutes: 45,
    type: 'EVLA Laser Procedure',
    status: 'Scheduled',
    feeIQD: 1500000,
    notes: 'Left GSV thermal ablation',
    whatsappReminderSent: false,
    createdAt: '2026-10-20T16:00:00Z',
  },
  {
    id: 'apt-5',
    patientId: 'pt-6',
    patientName: 'Shireen Rostam Aziz',
    patientPhone: '+9647506789012',
    doctorId: 'st-2',
    doctorName: 'Dr. Sarah Al-Bayati',
    date: '2026-10-23',
    time: '10:00',
    durationMinutes: 30,
    type: 'Foam Sclerotherapy',
    status: 'Scheduled',
    feeIQD: 250000,
    notes: 'Bilateral reticular and spider vein foam injection (Polidocanol 1%)',
    whatsappReminderSent: false,
    createdAt: '2026-10-21T12:00:00Z',
  },
];

const DEFAULT_QUEUE: QueueItem[] = [
  {
    id: 'q-1',
    ticketNumber: 'V-101',
    patientId: 'pt-1',
    patientName: 'Ali Mohammed Hassan',
    phone: '+9647701234567',
    arrivalTime: '11:05',
    doctorId: 'st-1',
    doctorName: 'Dr. Karwan Kareem Kurd',
    stage: 'Procedure Suite',
    priority: 'Routine',
    notes: 'Pre-op marked, laser unit calibrated, ready for tumescent infusion',
  },
  {
    id: 'q-2',
    ticketNumber: 'V-102',
    patientId: 'pt-2',
    patientName: 'Fatima Qasim Al-Zubaidi',
    phone: '+9647802345678',
    arrivalTime: '11:15',
    doctorId: 'st-2',
    doctorName: 'Dr. Sarah Al-Bayati',
    stage: 'Triage',
    priority: 'Routine',
    notes: 'Vitals taken (BP 125/80), awaiting Duplex room preparation',
  },
  {
    id: 'q-3',
    ticketNumber: 'V-103',
    patientId: 'pt-5',
    patientName: 'Haidar Jalal Al-Khafaji',
    phone: '+9647725678901',
    arrivalTime: '11:20',
    doctorId: 'st-1',
    doctorName: 'Dr. Karwan Kareem Kurd',
    stage: 'Waiting',
    priority: 'Routine',
    notes: 'Walk-in follow-up for tight compression stocking replacement',
  },
];

const DEFAULT_ASSESSMENTS: ClinicalAssessment[] = [
  {
    id: 'ca-1',
    patientId: 'pt-1',
    visitDate: '2026-10-18',
    doctorId: 'st-1',
    doctorName: 'Dr. Karwan Kareem Kurd',
    legAffected: 'Right',
    symptoms: {
      heaviness: true,
      achingPain: true,
      eveningSwelling: true,
      nightCramps: true,
      itching: true,
      restlessLegs: false,
      throbbing: true,
      burningSensation: true,
      bleedingHistory: false,
      painScale0to10: 7,
    },
    physicalExam: {
      edemaGrade: '2+ Moderate',
      edemaType: 'Pitting',
      coronaPhlebectatica: true,
      hyperpigmentation: true,
      venousEczema: true,
      lipodermatosclerosis: false,
      atrophieBlanche: false,
      ulcerActive: false,
      ulcerHealed: false,
    },
    ceap: {
      clinical: 'C4a',
      symptomatic: true,
      etiologic: 'Ep',
      anatomic: ['As', 'Ap'],
      pathophysiologic: 'Pr',
    },
    vcssScore: 12,
    doctorConfirmation: {
      confirmed: true,
      doctorName: 'Dr. Karwan Kareem Kurd',
      confirmedAt: '2026-10-18T11:45:00Z',
      signatureNote: 'Validated clinical staging. Indicated for right GSV laser ablation.',
    },
    clinicalSummary:
      '52-year-old schoolteacher presenting with right leg C4a,s Ep As,p Pr. Prominent bulging GSV trunk and stasis dermatitis.',
    createdAt: '2026-10-18T11:45:00Z',
  },
  {
    id: 'ca-2',
    patientId: 'pt-3',
    visitDate: '2026-10-10',
    doctorId: 'st-1',
    doctorName: 'Dr. Karwan Kareem Kurd',
    legAffected: 'Right',
    symptoms: {
      heaviness: true,
      achingPain: true,
      eveningSwelling: true,
      nightCramps: true,
      itching: true,
      restlessLegs: true,
      throbbing: true,
      burningSensation: true,
      bleedingHistory: true,
      painScale0to10: 8,
    },
    physicalExam: {
      edemaGrade: '3+ Severe',
      edemaType: 'Brawny / Lymphedema',
      coronaPhlebectatica: true,
      hyperpigmentation: true,
      venousEczema: true,
      lipodermatosclerosis: true,
      atrophieBlanche: true,
      ulcerActive: true,
      ulcerHealed: false,
      ulcerDetails: {
        leg: 'Right',
        location: 'Medial gaiter zone superior to malleolus',
        sizeCm2: 3.8,
        durationMonths: 4,
        exudate: 'Serous',
        granulatingBed: true,
        surroundingSkinStatus: 'Indurated, dark hyperpigmentation, warm',
      },
    },
    ceap: {
      clinical: 'C6',
      symptomatic: true,
      etiologic: 'Es',
      anatomic: ['As', 'Ad', 'Ap'],
      pathophysiologic: 'Pr,o',
    },
    vcssScore: 21,
    doctorConfirmation: {
      confirmed: true,
      doctorName: 'Dr. Karwan Kareem Kurd',
      confirmedAt: '2026-10-10T15:30:00Z',
      signatureNote: 'Active C6 venous ulcer. Combined deep post-thrombotic & superficial reflux.',
    },
    clinicalSummary:
      'Right leg C6,s Es As,d,p Pr,o. Requires strict compression bandaging, wound debridement, followed by staged superficial ablation.',
    createdAt: '2026-10-10T15:30:00Z',
  },
];

const DEFAULT_ULTRASOUND: DuplexUltrasoundReport[] = [
  {
    id: 'us-1',
    patientId: 'pt-1',
    examDate: '2026-10-18',
    sonographer: 'Dr. Sarah Al-Bayati',
    vascularSurgeon: 'Dr. Karwan Kareem Kurd',
    verifiedBySurgeon: true,
    verifiedAt: '2026-10-18T12:30:00Z',
    rightLeg: {
      deepVeinsPatent: true,
      cfvRefluxSec: 0.1,
      fvRefluxSec: 0.2,
      popvRefluxSec: 0.2,
      gsvCompetence: 'Incompetent',
      sfjDiameterMm: 9.8,
      sfjRefluxSec: 3.2,
      midThighDiameterMm: 7.4,
      midThighRefluxSec: 2.8,
      belowKneeDiameterMm: 5.6,
      ssvCompetence: 'Competent',
      ssvDiameterMm: 3.1,
      ssvRefluxSec: 0.2,
      aasvCompetence: 'Incompetent',
      aasvDiameterMm: 4.8,
      perforatorIncompetencies: [
        {
          name: "Boyd's Perforator",
          location: 'Medial upper calf',
          diameterMm: 4.1,
          refluxDurationSec: 1.4,
        },
      ],
      thrombusPresent: false,
      tortuousBranchesDescription: 'Multiple tortuous calf tributaries 4-6mm extending across medial shin.',
    },
    leftLeg: {
      deepVeinsPatent: true,
      cfvRefluxSec: 0.1,
      fvRefluxSec: 0.1,
      popvRefluxSec: 0.1,
      gsvCompetence: 'Competent',
      sfjDiameterMm: 5.1,
      sfjRefluxSec: 0.3,
      midThighDiameterMm: 4.0,
      midThighRefluxSec: 0.2,
      belowKneeDiameterMm: 3.2,
      ssvCompetence: 'Competent',
      ssvDiameterMm: 2.8,
      ssvRefluxSec: 0.1,
      aasvCompetence: 'Competent',
      aasvDiameterMm: 2.5,
      perforatorIncompetencies: [],
      thrombusPresent: false,
      tortuousBranchesDescription: 'No significant varicose clusters.',
    },
    conclusion:
      'Right SFJ and GSV trunk severe reflux (>3s) with dilation up to 9.8mm. Normal deep system with no DVT. Left venous duplex within normal limits.',
    recommendedAblationZone:
      'Right GSV thermal ablation from SFJ (2cm distal to junction) to below-knee level (approx. 42 cm), combined with foam sclerotherapy of calf branches.',
    images: [
      {
        id: 'img-1',
        url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=80',
        title: 'Right SFJ Duplex Doppler',
        findings: 'Retrograde flow > 3.2 seconds upon manual calf release. Diameter 9.8mm.',
      },
    ],
    createdAt: '2026-10-18T12:30:00Z',
  },
];

const DEFAULT_PROCEDURES: ProcedureRecord[] = [
  {
    id: 'pr-1',
    patientId: 'pt-1',
    patientName: 'Ali Mohammed Hassan',
    procedureDate: '2026-10-22',
    procedureType: 'EVLA (Endovenous Laser Ablation)',
    leg: 'Right',
    primarySurgeon: 'Dr. Karwan Kareem Kurd',
    assistingStaff: 'Nurse Zainab Hassan',
    roomNumber: 'Interventional Suite 1',
    preopChecklist: {
      npoFastingConfirmed: true,
      bloodThinnersAdjusted: true,
      allergiesVerified: true,
      duplexMarkingConfirmed: true,
      baselineVitalsNormal: true,
      compressionStockingsOnSite: true,
    },
    consentConfirmed: true,
    consentSignedBy: 'Ali Mohammed Hassan',
    consentTimestamp: '2026-10-22T10:45:00Z',
    operativeDetails: {
      veinTreated: 'Right GSV (Sapheno-femoral junction to below knee)',
      catheterAccessSite: 'Below knee GSV percutaneous puncture with 21G echogenic needle',
      treatedLengthCm: 42,
      laserWavelengthNm: 1470,
      laserPowerWatts: 8,
      totalEnergyJoules: 3150,
      leedJPerCm: 75,
      pullbackRateMmPerSec: 1.0,
      tumescentFormula: 'Cold Normal Saline 500mL + Lidocaine 2% 25mL + Epinephrine 1:1000 0.5mL + NaHCO3 8.4% 5mL',
      tumescentVolumeMl: 380,
      anesthesiaType: 'Tumescent Local',
    },
    immediatePostOp: {
      toleratedWell: true,
      hemostasisAchieved: true,
      distalPulsesPalpable: true,
      compressionApplied: true,
      complications: 'None. No skin burn, no neurological paresthesia.',
    },
    postOpInstructions: [
      'Wear Class II compression stockings 48 hours continuously without removal.',
      'Walk for 30 minutes immediately after leaving the procedure suite.',
      'Walk 10-15 minutes every 2 hours during daytime.',
      'Avoid heavy lifting (> 15 kg), hot baths, saunas, and strenuous gym for 7 days.',
      'Call emergency hotline immediately if experiencing severe sudden calf pain, chest pain, or shortness of breath.',
    ],
    followUpDate: '2026-10-24',
    status: 'In-Progress',
    createdAt: '2026-10-22T10:45:00Z',
  },
];

const DEFAULT_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-001',
    patientId: 'pt-1',
    patientName: 'Ali Mohammed Hassan',
    date: '2026-10-22',
    dueDate: '2026-10-22',
    items: [
      {
        id: 'ii-1',
        description: 'Right Leg EVLA Laser Ablation (1470nm Radial) + Tumescent Anesthesia',
        descriptionAr: 'قسطرة ليزر وريدي للطرف الأيمن مع تخدير انتفاخي',
        quantity: 1,
        unitPriceIQD: 1500000,
        totalIQD: 1500000,
      },
      {
        id: 'ii-2',
        description: 'Medical Compression Stockings Class II (Thigh-High German standard)',
        descriptionAr: 'جوارب طبية ضاغطة فئة ثانية قياس فخذي',
        quantity: 1,
        unitPriceIQD: 75000,
        totalIQD: 75000,
      },
    ],
    subtotalIQD: 1575000,
    discountIQD: 75000,
    totalIQD: 1500000,
    paidIQD: 1000000,
    balanceIQD: 500000,
    status: 'Partial',
    payments: [
      {
        id: 'pay-1',
        receiptNumber: 'REC-2026-0101',
        date: '2026-10-22 10:30',
        amountIQD: 1000000,
        method: 'Cash',
        receivedBy: 'Noor Al-Huda (Accountant)',
        notes: 'Initial deposit prior to procedure',
      },
    ],
    notes: 'Remaining 500,000 IQD balance due at 24h duplex follow-up.',
    createdAt: '2026-10-22T10:30:00Z',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-002',
    patientId: 'pt-2',
    patientName: 'Fatima Qasim Al-Zubaidi',
    date: '2026-10-18',
    dueDate: '2026-10-18',
    items: [
      {
        id: 'ii-3',
        description: 'Bilateral Venous Duplex Ultrasound Complete Examination',
        descriptionAr: 'فحص سونار الدوبلكس الملون الشامل لكلا الساقين',
        quantity: 1,
        unitPriceIQD: 100000,
        totalIQD: 100000,
      },
      {
        id: 'ii-4',
        description: 'Specialist Clinical Consultation & CEAP Staging',
        descriptionAr: 'كشف واستشارة اختصاصي وتصنيف سريري',
        quantity: 1,
        unitPriceIQD: 50000,
        totalIQD: 50000,
      },
    ],
    subtotalIQD: 150000,
    discountIQD: 0,
    totalIQD: 150000,
    paidIQD: 150000,
    balanceIQD: 0,
    status: 'Paid',
    payments: [
      {
        id: 'pay-2',
        receiptNumber: 'REC-2026-0095',
        date: '2026-10-18 11:30',
        amountIQD: 150000,
        method: 'ZainCash',
        receivedBy: 'Noor Al-Huda (Accountant)',
        notes: 'Paid in full via ZainCash wallet',
      },
    ],
    notes: 'Paid in full',
    createdAt: '2026-10-18T11:30:00Z',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-003',
    patientId: 'pt-3',
    patientName: 'Omar Tariq Al-Nuaimi',
    date: '2026-10-10',
    dueDate: '2026-10-24',
    items: [
      {
        id: 'ii-5',
        description: 'Venous Ulcer Debridement & Silver Foam Dressing',
        descriptionAr: 'تنظيف قرحة وريدية وضماد رغوي فضي معقم',
        quantity: 1,
        unitPriceIQD: 60000,
        totalIQD: 60000,
      },
      {
        id: 'ii-6',
        description: 'Unna Boot Multilayer Compression Bandaging Kit',
        descriptionAr: 'طقم ضماد ضاغط متعدد الطبقات (حذاء أونا)',
        quantity: 1,
        unitPriceIQD: 40000,
        totalIQD: 40000,
      },
    ],
    subtotalIQD: 100000,
    discountIQD: 0,
    totalIQD: 100000,
    paidIQD: 0,
    balanceIQD: 100000,
    status: 'Pending',
    payments: [],
    notes: 'Payment scheduled during upcoming dressing review.',
    createdAt: '2026-10-10T16:00:00Z',
  },
];

const DEFAULT_EXPENSES: ClinicExpense[] = [
  {
    id: 'exp-1',
    title: 'Biolitec Radial 2-Ring Laser Fibers (Pack of 10)',
    titleAr: 'ألياف ليزر شعاعية ألمانية (حزمة 10 قطع)',
    category: 'Laser Equipment & Fibers',
    amountIQD: 3250000,
    date: '2026-10-15',
    paymentMethod: 'Bank Transfer',
    receiptRef: 'PO-2026-881',
    recordedBy: 'Noor Al-Huda',
  },
  {
    id: 'exp-2',
    title: 'Aethoxysklerol (Polidocanol 1% & 3%) Ampoules Batch',
    titleAr: 'أمبولات مادة مصلبة (بوليدوكانول 1% و 3%)',
    category: 'Sclerosant & Pharmaceuticals',
    amountIQD: 850000,
    date: '2026-10-16',
    paymentMethod: 'Cash',
    receiptRef: 'PH-4091',
    recordedBy: 'Noor Al-Huda',
  },
  {
    id: 'exp-3',
    title: 'Ultrasound Acoustic Gel 5L Jugs & Sterile Probe Sheaths',
    titleAr: 'جل سونار 5 لتر وأغطية مجس معقمة',
    category: 'Ultrasound & Imaging Supplies',
    amountIQD: 240000,
    date: '2026-10-19',
    paymentMethod: 'Cash',
    receiptRef: 'MED-1102',
    recordedBy: 'Ahmed Al-Jaf',
  },
];

const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'FIB-1470-RAD',
    name: '1470nm Radial 2-Ring Laser Fiber 2.5m',
    nameAr: 'ألياف ليزر شعاعية 1470 نانومتر حلقتين',
    category: 'Laser Fibers',
    currentStock: 8,
    minThreshold: 5,
    unit: 'pcs',
    batchNumber: 'RAD-2026-B81',
    expiryDate: '2027-12-31',
    unitCostIQD: 325000,
    supplier: 'Biolitec MedTech Europe',
  },
  {
    id: 'inv-2',
    sku: 'SHE-06F-45',
    name: '6F 45cm Introducer Sheath with Dilator & Guidewire',
    nameAr: 'قسطرة مدخل 6F طول 45 سم مع سلك توجيه',
    category: 'Introducer Sheaths',
    currentStock: 12,
    minThreshold: 6,
    unit: 'sets',
    batchNumber: 'INT-6F-902',
    expiryDate: '2028-06-30',
    unitCostIQD: 65000,
    supplier: 'Merit Medical Systems',
  },
  {
    id: 'inv-3',
    sku: 'POL-01-2ML',
    name: 'Aethoxysklerol 1% (Polidocanol) 2ml Ampoules',
    nameAr: 'أمبولات مصلب أيثوكسي سكليرول 1% حجم 2 مل',
    category: 'Sclerosants',
    currentStock: 4,
    minThreshold: 10, // will show low stock warning!
    unit: 'ampoules',
    batchNumber: 'KR-9941A',
    expiryDate: '2027-03-31',
    unitCostIQD: 35000,
    supplier: 'Kreussler Pharma',
  },
  {
    id: 'inv-4',
    sku: 'POL-03-2ML',
    name: 'Aethoxysklerol 3% (Polidocanol) 2ml Ampoules',
    nameAr: 'أمبولات مصلب أيثوكسي سكليرول 3% حجم 2 مل',
    category: 'Sclerosants',
    currentStock: 18,
    minThreshold: 8,
    unit: 'ampoules',
    batchNumber: 'KR-8820B',
    expiryDate: '2027-05-15',
    unitCostIQD: 40000,
    supplier: 'Kreussler Pharma',
  },
  {
    id: 'inv-5',
    sku: 'STK-C2-TH-M',
    name: 'Medical Compression Stocking Class II Thigh-High (Size M)',
    nameAr: 'جوارب طبية ضاغطة فئة ثانية فخذية (قياس متوسط)',
    category: 'Compression Stockings',
    currentStock: 14,
    minThreshold: 6,
    unit: 'pairs',
    batchNumber: 'SIG-2026-M',
    expiryDate: '2029-01-01',
    unitCostIQD: 48000,
    supplier: 'Sigvaris Medical',
  },
  {
    id: 'inv-6',
    sku: 'TUM-SET-500',
    name: 'Tumescent Infiltration Infiltration Pump Tubing Set',
    nameAr: 'مجموعة أنابيب مضخة التخدير الانتفاخي 500 مل',
    category: 'Tumescent Kits',
    currentStock: 15,
    minThreshold: 5,
    unit: 'sets',
    batchNumber: 'TUM-1049',
    expiryDate: '2028-11-20',
    unitCostIQD: 22000,
    supplier: 'Nouvag AG',
  },
];

const DEFAULT_AUDIT: AuditLogEntry[] = [
  {
    id: 'aud-1',
    timestamp: '2026-10-22 10:45:12',
    userId: 'st-1',
    userName: 'Dr. Karwan Kareem Kurd',
    userRole: 'Vascular Surgeon',
    action: 'Confirmed Pre-Op Checklist & Started Laser Procedure',
    category: 'Procedure',
    details: 'Patient: Ali Mohammed Hassan (VV-2026-001) - Right GSV 1470nm Radial EVLA',
  },
  {
    id: 'aud-2',
    timestamp: '2026-10-22 10:30:40',
    userId: 'st-5',
    userName: 'Noor Al-Huda',
    userRole: 'Accountant',
    action: 'Recorded Deposit Payment of 1,000,000 IQD',
    category: 'Finance',
    details: 'Invoice #INV-2026-001 - Receipt REC-2026-0101 (Ali Mohammed Hassan)',
  },
  {
    id: 'aud-3',
    timestamp: '2026-10-22 09:15:00',
    userId: 'st-4',
    userName: 'Ahmed Al-Jaf',
    userRole: 'Receptionist',
    action: 'Checked-in Patient into Queue',
    category: 'Patient',
    details: 'Assigned Ticket V-101 to Ali Mohammed Hassan',
  },
];

export const ROLE_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  'Vascular Surgeon': [
    'view_patients',
    'create_patient',
    'edit_patient',
    'delete_patient',
    'upload_patient_document',
    'delete_patient_document',
    'schedule_appointments',
    'manage_queue',
    'clinical_assessment',
    'confirm_ceap_diagnosis',
    'duplex_ultrasound',
    'verify_ultrasound',
    'manage_treatment_plans',
    'perform_laser_procedures',
    'view_reports',
  ],
  'Phlebologist': [
    'view_patients',
    'create_patient',
    'edit_patient',
    'upload_patient_document',
    'schedule_appointments',
    'manage_queue',
    'clinical_assessment',
    'confirm_ceap_diagnosis',
    'duplex_ultrasound',
    'manage_treatment_plans',
    'perform_laser_procedures',
    'view_reports',
  ],
  'Nurse': [
    'view_patients',
    'upload_patient_document',
    'schedule_appointments',
    'manage_queue',
    'manage_inventory',
  ],
  'Receptionist': [
    'view_patients',
    'create_patient',
    'edit_patient',
    'schedule_appointments',
    'manage_queue',
    'record_payments',
  ],
  'Accountant': [
    'view_patients',
    'manage_billing',
    'record_payments',
    'view_reports',
    'view_audit_logs',
  ],
  'Clinic Admin': [
    'view_patients',
    'create_patient',
    'edit_patient',
    'delete_patient',
    'upload_patient_document',
    'delete_patient_document',
    'schedule_appointments',
    'manage_queue',
    'clinical_assessment',
    'confirm_ceap_diagnosis',
    'duplex_ultrasound',
    'verify_ultrasound',
    'manage_treatment_plans',
    'perform_laser_procedures',
    'manage_billing',
    'record_payments',
    'manage_inventory',
    'manage_staff',
    'view_reports',
    'view_audit_logs',
    'manage_settings',
    'backup_restore',
  ],
  'Patient Portal': [
    'view_patients',
  ],
};

const DEFAULT_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-1',
    username: 'dr.karwan',
    email: 'karwan.kurd@alamal-veins.iq',
    password: 'doctor123',
    name: 'Dr. Karwan Kareem Kurd',
    nameAr: 'د. كاروان كريم كورد',
    role: 'Vascular Surgeon',
    title: 'Consultant Vascular & Endovascular Surgeon, FRCSEd',
    titleAr: 'استشاري جراحة الأوعية والقسطرة التداخلية',
    licenseNumber: 'IRQ-MED-19948',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-2',
    username: 'dr.sarah',
    email: 'sarah.bayati@alamal-veins.iq',
    password: 'sonographer123',
    name: 'Dr. Sarah Al-Bayati',
    nameAr: 'د. سارة البياتي',
    role: 'Phlebologist',
    title: 'Specialist Phlebologist & Vascular Sonographer',
    titleAr: 'اختصاصية طب الأوردة وسونار الدوبلكس الوعائي',
    licenseNumber: 'IRQ-MED-22014',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-3',
    username: 'nurse.zainab',
    email: 'zainab.h@alamal-veins.iq',
    password: 'nurse123',
    name: 'Nurse Zainab Hassan',
    nameAr: 'الممرضة زينب حسن',
    role: 'Nurse',
    title: 'Senior Interventional Scrub Nurse',
    titleAr: 'ممرضة أقدم لقسطرة وجراحة الأوردة',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813576-96a1a1f498ba?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-4',
    username: 'reception.ahmed',
    email: 'ahmed.j@alamal-veins.iq',
    password: 'reception123',
    name: 'Ahmed Al-Jaf',
    nameAr: 'أحمد الجاف',
    role: 'Receptionist',
    title: 'Chief Patient Relations & Triage Coordinator',
    titleAr: 'مسؤول الاستقبال وشؤون المرضى',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-5',
    username: 'accountant.noor',
    email: 'noor.finance@alamal-veins.iq',
    password: 'finance123',
    name: 'Noor Al-Huda',
    nameAr: 'نور الهدى',
    role: 'Accountant',
    title: 'Medical Billing & Finance Officer',
    titleAr: 'مسؤولة الحسابات والفوترة الطبية',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-6',
    username: 'admin',
    email: 'admin@alamal-veins.iq',
    password: 'admin123',
    name: 'System Administrator',
    nameAr: 'مدير النظام التنفيذي',
    role: 'Clinic Admin',
    title: 'Executive Clinic Operations Manager',
    titleAr: 'مدير إدارة العمليات والأنظمة الطبية',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
];

const DEFAULT_DOCUMENTS: PatientDocument[] = [
  {
    id: 'doc-1',
    patientId: 'pt-1',
    title: 'Pre-EVLA Standing Leg Photograph (Right Calf Varices)',
    titleAr: 'صورة سريرية وقوفاً لدوالي الساق اليمنى قبل الليزر',
    category: 'Clinical Leg Photos',
    fileName: 'pt1_right_leg_preop_standing.jpg',
    fileType: 'image/jpeg',
    fileSizeKb: 342,
    fileUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-10-18 11:20:00',
    uploadedBy: 'Dr. Sarah Al-Bayati',
    uploadedByRole: 'Phlebologist',
    notes: 'Prominent bulging medial calf branch varicosities with mild hemosiderin stasis pigmentation.',
    isConfidential: false,
  },
  {
    id: 'doc-2',
    patientId: 'pt-1',
    title: 'Sapheno-Femoral Junction (SFJ) Duplex Doppler Spectrum',
    titleAr: 'مخطط الدوبلكس الطيفي للاتصال الصافني الفخذي',
    category: 'Duplex Ultrasound',
    fileName: 'pt1_sfj_doppler_trace.png',
    fileType: 'image/png',
    fileSizeKb: 512,
    fileUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-10-18 12:15:00',
    uploadedBy: 'Dr. Sarah Al-Bayati',
    uploadedByRole: 'Phlebologist',
    notes: 'Retrograde pathological reflux exceeding 3.2 seconds upon manual calf release. SFJ diameter 9.8mm.',
    isConfidential: false,
  },
  {
    id: 'doc-3',
    patientId: 'pt-1',
    title: 'Signed Informed Consent Form - 1470nm Radial EVLA',
    titleAr: 'استمارة الموافقة المستنيرة الموقعة لقسطرة الليزر الوريدي',
    category: 'Signed Consent',
    fileName: 'pt1_consent_signed_evla.pdf',
    fileType: 'application/pdf',
    fileSizeKb: 210,
    fileUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-10-22 10:40:00',
    uploadedBy: 'Nurse Zainab Hassan',
    uploadedByRole: 'Nurse',
    notes: 'Signed and dated by patient in presence of attending nurse.',
    isConfidential: true,
  },
  {
    id: 'doc-4',
    patientId: 'pt-1',
    title: 'Pre-Procedure Coagulation & Hematology Lab Report',
    titleAr: 'تحاليل تجلط الدم وصورة الدم الكاملة قبل العملية',
    category: 'Lab Reports',
    fileName: 'pt1_lab_coagulation_profile.pdf',
    fileType: 'application/pdf',
    fileSizeKb: 180,
    fileUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-10-20 09:30:00',
    uploadedBy: 'Ahmed Al-Jaf',
    uploadedByRole: 'Receptionist',
    notes: 'PT: 12.4s, INR: 1.02, Platelets: 260,000/uL. Normal limits.',
    isConfidential: false,
  },
  {
    id: 'doc-5',
    patientId: 'pt-3',
    title: 'Active C6 Medial Malleolar Ulcer Baseline Photo',
    titleAr: 'صورة سريرية مبدئية للقرحة الوريدية النشطة فوق الكاحل',
    category: 'Clinical Leg Photos',
    fileName: 'pt3_active_ulcer_c6_baseline.jpg',
    fileType: 'image/jpeg',
    fileSizeKb: 420,
    fileUrl: 'https://images.unsplash.com/photo-1583912267670-6575ad4736f8?w=800&auto=format&fit=crop&q=80',
    uploadedAt: '2026-10-10 15:10:00',
    uploadedBy: 'Dr. Karwan Kareem Kurd',
    uploadedByRole: 'Vascular Surgeon',
    notes: 'Size 3.8 cm² with granulating bed and surrounding dark stasis hyperpigmentation.',
    isConfidential: false,
  },
];

class StorageService {
  private listeners: (() => void)[] = [];

  constructor() {
    this.initIfEmpty();
  }

  private initIfEmpty() {
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.resetToDefaults();
    } else {
      if (!localStorage.getItem(STORAGE_KEYS.USER_ACCOUNTS)) {
        localStorage.setItem(STORAGE_KEYS.USER_ACCOUNTS, JSON.stringify(DEFAULT_USER_ACCOUNTS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(DEFAULT_DOCUMENTS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.AUTH_USER)) {
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(DEFAULT_USER_ACCOUNTS[0]));
      }
    }
  }

  public resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(DEFAULT_STAFF));
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(DEFAULT_PATIENTS));
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(DEFAULT_APPOINTMENTS));
    localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(DEFAULT_QUEUE));
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(DEFAULT_ASSESSMENTS));
    localStorage.setItem(STORAGE_KEYS.ULTRASOUND, JSON.stringify(DEFAULT_ULTRASOUND));
    localStorage.setItem(STORAGE_KEYS.PROCEDURES, JSON.stringify(DEFAULT_PROCEDURES));
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(DEFAULT_INVOICES));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(DEFAULT_EXPENSES));
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(DEFAULT_INVENTORY));
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(DEFAULT_AUDIT));
    localStorage.setItem(STORAGE_KEYS.USER_ACCOUNTS, JSON.stringify(DEFAULT_USER_ACCOUNTS));
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(DEFAULT_DOCUMENTS));
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(DEFAULT_USER_ACCOUNTS[0]));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, JSON.stringify('Vascular Surgeon'));
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, JSON.stringify('en'));
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // Active Role & Language
  public getActiveRole(): UserRole {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE);
      return data ? JSON.parse(data) : 'Vascular Surgeon';
    } catch {
      return 'Vascular Surgeon';
    }
  }

  public setActiveRole(role: UserRole) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, JSON.stringify(role));
    this.logAudit({
      userId: 'system',
      userName: 'Current Operator',
      userRole: role,
      action: `Switched Active Role to ${role}`,
      category: 'Security',
      details: `Session role updated to ${role}`,
    });
    this.notify();
  }

  public getLanguage(): 'en' | 'ar' {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      return data ? JSON.parse(data) : 'en';
    } catch {
      return 'en';
    }
  }

  public setLanguage(lang: 'en' | 'ar') {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, JSON.stringify(lang));
    this.notify();
  }

  // Settings
  public getSettings(): ClinicSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public saveSettings(settings: ClinicSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    this.logAudit({
      userId: 'st-1',
      userName: 'Administrator',
      userRole: 'Clinic Admin',
      action: 'Updated Clinic Settings',
      category: 'Security',
      details: `Updated clinic identity, contact, and working hours`,
    });
    this.notify();
  }

  // Patients
  public getPatients(): Patient[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public getPatientById(id: string): Patient | undefined {
    return this.getPatients().find((p) => p.id === id);
  }

  public savePatient(patient: Patient) {
    const patients = this.getPatients();
    const existingIndex = patients.findIndex((p) => p.id === patient.id);
    const isNew = existingIndex === -1;
    if (isNew) {
      patients.unshift(patient);
    } else {
      patients[existingIndex] = { ...patient, updatedAt: new Date().toISOString() };
    }
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    this.logAudit({
      userId: 'st-1',
      userName: 'Clinical Operator',
      userRole: this.getActiveRole(),
      action: isNew ? 'Registered New Patient' : 'Updated Patient Profile',
      category: 'Patient',
      details: `${patient.fullName} (${patient.mrn}) - CEAP: ${patient.ceapGrade}`,
    });
    this.notify();
  }

  public deletePatient(id: string) {
    const patient = this.getPatientById(id);
    const patients = this.getPatients().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    this.logAudit({
      userId: 'st-1',
      userName: 'Clinical Operator',
      userRole: this.getActiveRole(),
      action: 'Deleted Patient Record',
      category: 'Patient',
      details: `Removed record for ${patient?.fullName || id}`,
    });
    this.notify();
  }

  // Appointments
  public getAppointments(): Appointment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveAppointment(apt: Appointment) {
    const list = this.getAppointments();
    const idx = list.findIndex((a) => a.id === apt.id);
    if (idx === -1) {
      list.unshift(apt);
    } else {
      list[idx] = apt;
    }
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
    this.logAudit({
      userId: 'st-4',
      userName: 'Appointment Scheduler',
      userRole: this.getActiveRole(),
      action: 'Saved Appointment',
      category: 'Patient',
      details: `${apt.patientName} - ${apt.type} on ${apt.date} at ${apt.time}`,
    });
    this.notify();
  }

  public deleteAppointment(id: string) {
    const list = this.getAppointments().filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
    this.notify();
  }

  // Queue
  public getQueue(): QueueItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUEUE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveQueueItem(item: QueueItem) {
    const queue = this.getQueue();
    const idx = queue.findIndex((q) => q.id === item.id);
    if (idx === -1) {
      queue.push(item);
    } else {
      queue[idx] = item;
    }
    localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(queue));
    this.notify();
  }

  public advanceQueueStage(id: string) {
    const queue = this.getQueue();
    const item = queue.find((q) => q.id === id);
    if (!item) return;

    const stages: QueueItem['stage'][] = [
      'Waiting',
      'Triage',
      'In Consultation',
      'Duplex Exam',
      'Procedure Suite',
      'Recovery',
      'Completed',
    ];
    const currentIndex = stages.indexOf(item.stage);
    if (currentIndex < stages.length - 1) {
      item.stage = stages[currentIndex + 1];
      localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(queue));
      this.logAudit({
        userId: 'st-4',
        userName: 'Queue Manager',
        userRole: this.getActiveRole(),
        action: `Moved Patient in Queue: ${item.ticketNumber} to ${item.stage}`,
        category: 'Patient',
        details: `${item.patientName} advanced to ${item.stage}`,
      });
      this.notify();
    }
  }

  public removeFromQueue(id: string) {
    const queue = this.getQueue().filter((q) => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(queue));
    this.notify();
  }

  // Clinical Assessments
  public getAssessments(): ClinicalAssessment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveAssessment(assessment: ClinicalAssessment) {
    const list = this.getAssessments();
    const idx = list.findIndex((a) => a.id === assessment.id);
    if (idx === -1) {
      list.unshift(assessment);
    } else {
      list[idx] = assessment;
    }
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(list));

    // Also sync the patient's top-level CEAP grade
    const patient = this.getPatientById(assessment.patientId);
    if (patient) {
      patient.ceapGrade = assessment.ceap.clinical;
      patient.affectedLeg = assessment.legAffected;
      this.savePatient(patient);
    }

    this.logAudit({
      userId: assessment.doctorId || 'st-1',
      userName: assessment.doctorName,
      userRole: 'Vascular Surgeon',
      action: 'Recorded Clinical CEAP Assessment',
      category: 'Clinical',
      details: `Patient ID: ${assessment.patientId} - CEAP: ${assessment.ceap.clinical}, VCSS: ${assessment.vcssScore}`,
    });
    this.notify();
  }

  // Duplex Ultrasound Reports
  public getUltrasoundReports(): DuplexUltrasoundReport[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ULTRASOUND);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveUltrasoundReport(report: DuplexUltrasoundReport) {
    const list = this.getUltrasoundReports();
    const idx = list.findIndex((r) => r.id === report.id);
    if (idx === -1) {
      list.unshift(report);
    } else {
      list[idx] = report;
    }
    localStorage.setItem(STORAGE_KEYS.ULTRASOUND, JSON.stringify(list));
    this.logAudit({
      userId: 'st-2',
      userName: report.sonographer,
      userRole: 'Phlebologist',
      action: 'Saved Duplex Ultrasound Scan',
      category: 'Ultrasound',
      details: `Duplex report for patient ${report.patientId} - GSV Right: ${report.rightLeg.gsvCompetence}, Left: ${report.leftLeg.gsvCompetence}`,
    });
    this.notify();
  }

  // Procedures
  public getProcedures(): ProcedureRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROCEDURES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveProcedure(procedure: ProcedureRecord) {
    const list = this.getProcedures();
    const idx = list.findIndex((p) => p.id === procedure.id);
    if (idx === -1) {
      list.unshift(procedure);
    } else {
      list[idx] = procedure;
    }
    localStorage.setItem(STORAGE_KEYS.PROCEDURES, JSON.stringify(list));
    this.logAudit({
      userId: 'st-1',
      userName: procedure.primarySurgeon,
      userRole: 'Vascular Surgeon',
      action: 'Saved Interventional Procedure Record',
      category: 'Procedure',
      details: `${procedure.procedureType} on ${procedure.leg} leg for ${procedure.patientName}. Joules: ${procedure.operativeDetails.totalEnergyJoules || 'N/A'}`,
    });
    this.notify();
  }

  // Invoices & Finance
  public getInvoices(): Invoice[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveInvoice(invoice: Invoice) {
    const list = this.getInvoices();
    const idx = list.findIndex((i) => i.id === invoice.id);
    if (idx === -1) {
      list.unshift(invoice);
    } else {
      list[idx] = invoice;
    }
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(list));
    this.logAudit({
      userId: 'st-5',
      userName: 'Noor Al-Huda',
      userRole: 'Accountant',
      action: 'Saved Invoice Record',
      category: 'Finance',
      details: `${invoice.invoiceNumber} - Total: ${invoice.totalIQD.toLocaleString()} IQD (Balance: ${invoice.balanceIQD.toLocaleString()} IQD)`,
    });
    this.notify();
  }

  public getExpenses(): ClinicExpense[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveExpense(expense: ClinicExpense) {
    const list = this.getExpenses();
    list.unshift(expense);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(list));
    this.logAudit({
      userId: 'st-5',
      userName: expense.recordedBy,
      userRole: 'Accountant',
      action: 'Recorded Clinic Expense',
      category: 'Finance',
      details: `${expense.title}: ${expense.amountIQD.toLocaleString()} IQD`,
    });
    this.notify();
  }

  // Inventory
  public getInventory(): InventoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveInventoryItem(item: InventoryItem) {
    const list = this.getInventory();
    const idx = list.findIndex((i) => i.id === item.id);
    if (idx === -1) {
      list.unshift(item);
    } else {
      list[idx] = item;
    }
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(list));
    this.logAudit({
      userId: 'st-4',
      userName: 'Supply Coordinator',
      userRole: this.getActiveRole(),
      action: 'Updated Inventory Item',
      category: 'Inventory',
      details: `${item.name} (${item.sku}) - Stock: ${item.currentStock} ${item.unit}`,
    });
    this.notify();
  }

  public deleteInventoryItem(id: string) {
    const list = this.getInventory().filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(list));
    this.notify();
  }

  // Staff
  public getStaff(): StaffMember[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STAFF);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveStaff(member: StaffMember) {
    const list = this.getStaff();
    const idx = list.findIndex((s) => s.id === member.id);
    if (idx === -1) {
      list.unshift(member);
    } else {
      list[idx] = member;
    }
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(list));
    this.notify();
  }

  // Audit Log
  public getAuditLog(): AuditLogEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public logAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const list = this.getAuditLog();
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleString(),
      ...entry,
    };
    list.unshift(newEntry);
    if (list.length > 500) list.pop(); // keep last 500
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(list));
  }

  // Authentication & Users
  public getCurrentUser(): UserAccount | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  public getUserByRole(role: UserRole): UserAccount | undefined {
    const accounts = this.getUserAccounts();
    return accounts.find((a) => a.role === role);
  }

  public getUserAccounts(): UserAccount[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_ACCOUNTS);
      return data ? JSON.parse(data) : DEFAULT_USER_ACCOUNTS;
    } catch {
      return DEFAULT_USER_ACCOUNTS;
    }
  }

  public login(identifier: string, password?: string): UserAccount | null {
    const accounts = this.getUserAccounts();
    const clean = identifier.trim().toLowerCase();
    const user = accounts.find(
      (u) =>
        u.email.toLowerCase() === clean ||
        u.username.toLowerCase() === clean ||
        u.name.toLowerCase() === clean
    );

    if (user) {
      if (password && user.password && user.password !== password) {
        return null;
      }
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
      this.setActiveRole(user.role);
      this.logAudit({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: 'User Logged In',
        category: 'Security',
        details: `Successful authenticated session for ${user.name} (${user.role})`,
      });
      this.notify();
      return user;
    }
    return null;
  }

  public logout(): void {
    const current = this.getCurrentUser();
    if (current) {
      this.logAudit({
        userId: current.id,
        userName: current.name,
        userRole: current.role,
        action: 'User Logged Out',
        category: 'Security',
        details: `Session ended for ${current.name}`,
      });
    }
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    this.notify();
  }

  public hasPermission(roleOrUser: UserRole | UserAccount | null, permission: PermissionKey): boolean {
    if (!roleOrUser) return false;
    const role: UserRole = typeof roleOrUser === 'string' ? roleOrUser : roleOrUser.role;
    if (role === 'Clinic Admin') return true;
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  }

  // Patient Documents
  public getAllDocuments(): PatientDocument[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      return data ? JSON.parse(data) : DEFAULT_DOCUMENTS;
    } catch {
      return DEFAULT_DOCUMENTS;
    }
  }

  public getPatientDocuments(patientId: string): PatientDocument[] {
    return this.getAllDocuments().filter((d) => d.patientId === patientId);
  }

  public savePatientDocument(doc: PatientDocument): void {
    const docs = this.getAllDocuments();
    const idx = docs.findIndex((d) => d.id === doc.id);
    const isNew = idx === -1;
    if (isNew) {
      docs.unshift(doc);
    } else {
      docs[idx] = doc;
    }
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));

    const patient = this.getPatientById(doc.patientId);
    this.logAudit({
      userId: this.getCurrentUser()?.id || 'system',
      userName: doc.uploadedBy,
      userRole: doc.uploadedByRole,
      action: isNew ? 'Uploaded Patient Document' : 'Updated Patient Document',
      category: 'Patient',
      details: `${doc.title} (${doc.category}) uploaded for ${patient?.fullName || doc.patientId}`,
    });
    this.notify();
  }

  public deletePatientDocument(docId: string): void {
    const docs = this.getAllDocuments();
    const doc = docs.find((d) => d.id === docId);
    const filtered = docs.filter((d) => d.id !== docId);
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(filtered));

    if (doc) {
      this.logAudit({
        userId: this.getCurrentUser()?.id || 'system',
        userName: this.getCurrentUser()?.name || 'Authorized User',
        userRole: this.getActiveRole(),
        action: 'Deleted Patient Document',
        category: 'Patient',
        details: `Deleted ${doc.title} (${doc.fileName}) from patient file`,
      });
    }
    this.notify();
  }

  // Full Database Backup & Restore
  public exportFullBackup(): string {
    const backup = {
      exportTimestamp: new Date().toISOString(),
      clinic: 'Al-Amal Vein & Vascular Center',
      system: 'Varicose Veins Clinic Management System',
      version: '2.4.0',
      data: {
        settings: this.getSettings(),
        staff: this.getStaff(),
        patients: this.getPatients(),
        appointments: this.getAppointments(),
        queue: this.getQueue(),
        assessments: this.getAssessments(),
        ultrasound: this.getUltrasoundReports(),
        procedures: this.getProcedures(),
        invoices: this.getInvoices(),
        expenses: this.getExpenses(),
        inventory: this.getInventory(),
        audit: this.getAuditLog(),
        documents: this.getAllDocuments(),
        userAccounts: this.getUserAccounts(),
      },
    };
    return JSON.stringify(backup, null, 2);
  }

  public importFullBackup(jsonContent: string): boolean {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed || !parsed.data) {
        throw new Error('Invalid backup structure');
      }
      const { data } = parsed;
      if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      if (data.staff) localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(data.staff));
      if (data.patients) localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(data.patients));
      if (data.appointments) localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(data.appointments));
      if (data.queue) localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(data.queue));
      if (data.assessments) localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(data.assessments));
      if (data.ultrasound) localStorage.setItem(STORAGE_KEYS.ULTRASOUND, JSON.stringify(data.ultrasound));
      if (data.procedures) localStorage.setItem(STORAGE_KEYS.PROCEDURES, JSON.stringify(data.procedures));
      if (data.invoices) localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(data.invoices));
      if (data.expenses) localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(data.expenses));
      if (data.inventory) localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(data.inventory));
      if (data.audit) localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(data.audit));
      if (data.documents) localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(data.documents));
      if (data.userAccounts) localStorage.setItem(STORAGE_KEYS.USER_ACCOUNTS, JSON.stringify(data.userAccounts));

      this.logAudit({
        userId: 'admin',
        userName: 'System Administrator',
        userRole: 'Clinic Admin',
        action: 'Restored Full Database Backup',
        category: 'Security',
        details: `Backup dated ${parsed.exportTimestamp || 'Unknown'} restored successfully.`,
      });
      this.notify();
      return true;
    } catch (err) {
      console.error('Failed to import backup:', err);
      return false;
    }
  }
}

export const storage = new StorageService();
