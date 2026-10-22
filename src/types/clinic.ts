export type CEAPClinical = 'C0' | 'C1' | 'C2' | 'C3' | 'C4a' | 'C4b' | 'C4c' | 'C5' | 'C6';
export type CEAPEtiologic = 'Ep' | 'Es' | 'Ec' | 'En';
export type CEAPAnatomic = 'As' | 'Ap' | 'Ad' | 'An';
export type CEAPPathophysiologic = 'Pr' | 'Po' | 'Pr,o' | 'Pn';

export type UserRole =
  | 'Vascular Surgeon'
  | 'Phlebologist'
  | 'Nurse'
  | 'Receptionist'
  | 'Accountant'
  | 'Clinic Admin'
  | 'Patient Portal';

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number e.g. "VV-2026-084"
  nationalId: string;
  fullName: string;
  fullNameAr: string;
  dob: string;
  gender: 'Male' | 'Female';
  phone: string;
  whatsapp: string;
  email?: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  medicalHistory: {
    priorDVT: boolean;
    thrombophilia: boolean;
    priorVeinSurgery: boolean;
    anticoagulantTherapy: boolean;
    diabetes: boolean;
    hypertension: boolean;
    smoker: boolean;
    familyHistoryVeins: boolean;
    prolongedStandingWork: boolean;
    otherConditions: string;
  };
  medications: string[];
  ceapGrade: CEAPClinical;
  affectedLeg: 'Right' | 'Left' | 'Bilateral';
  portalAccessCode?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus =
  | 'Scheduled'
  | 'Confirmed'
  | 'Checked In'
  | 'In Consultation'
  | 'In Procedure'
  | 'Completed'
  | 'Cancelled'
  | 'No Show';

export type AppointmentType =
  | 'Initial Consultation'
  | 'Duplex Ultrasound Scan'
  | 'EVLA Laser Procedure'
  | 'Foam Sclerotherapy'
  | 'Phlebectomy'
  | 'Post-Op Follow-up'
  | 'Stocking Fitting & Check';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  type: AppointmentType;
  status: AppointmentStatus;
  feeIQD: number;
  notes: string;
  whatsappReminderSent?: boolean;
  createdAt: string;
}

export interface QueueItem {
  id: string;
  ticketNumber: string; // e.g. "V-102"
  patientId: string;
  patientName: string;
  phone: string;
  arrivalTime: string;
  doctorId: string;
  doctorName: string;
  stage:
    | 'Waiting'
    | 'Triage'
    | 'In Consultation'
    | 'Duplex Exam'
    | 'Procedure Suite'
    | 'Recovery'
    | 'Completed';
  priority: 'Routine' | 'Urgent' | 'Post-Op Emergency';
  notes?: string;
}

export interface ClinicalAssessment {
  id: string;
  patientId: string;
  visitDate: string;
  doctorId: string;
  doctorName: string;
  legAffected: 'Right' | 'Left' | 'Bilateral';
  symptoms: {
    heaviness: boolean;
    achingPain: boolean;
    eveningSwelling: boolean;
    nightCramps: boolean;
    itching: boolean;
    restlessLegs: boolean;
    throbbing: boolean;
    burningSensation: boolean;
    bleedingHistory: boolean;
    painScale0to10: number;
  };
  physicalExam: {
    edemaGrade: 'None' | '1+ Mild' | '2+ Moderate' | '3+ Severe';
    edemaType: 'Pitting' | 'Non-pitting' | 'Brawny / Lymphedema';
    coronaPhlebectatica: boolean;
    hyperpigmentation: boolean;
    venousEczema: boolean;
    lipodermatosclerosis: boolean;
    atrophieBlanche: boolean;
    ulcerActive: boolean;
    ulcerHealed: boolean;
    ulcerDetails?: {
      leg: 'Right' | 'Left';
      location: string;
      sizeCm2: number;
      durationMonths: number;
      exudate: 'None' | 'Serous' | 'Purulent';
      granulatingBed: boolean;
      surroundingSkinStatus: string;
    };
  };
  ceap: {
    clinical: CEAPClinical;
    symptomatic: boolean; // 's' vs 'a'
    etiologic: CEAPEtiologic;
    anatomic: CEAPAnatomic[];
    pathophysiologic: CEAPPathophysiologic;
  };
  vcssScore: number; // 0-30
  doctorConfirmation: {
    confirmed: boolean;
    doctorName: string;
    confirmedAt: string;
    signatureNote: string;
  };
  clinicalSummary: string;
  createdAt: string;
}

export interface LegUltrasoundData {
  deepVeinsPatent: boolean; // CFV, FV, PopV patent & compressible
  cfvRefluxSec: number;
  fvRefluxSec: number;
  popvRefluxSec: number;
  gsvCompetence: 'Competent' | 'Incompetent';
  sfjDiameterMm: number;
  sfjRefluxSec: number;
  midThighDiameterMm: number;
  midThighRefluxSec: number;
  belowKneeDiameterMm: number;
  ssvCompetence: 'Competent' | 'Incompetent';
  ssvDiameterMm: number;
  ssvRefluxSec: number;
  aasvCompetence: 'Competent' | 'Incompetent';
  aasvDiameterMm: number;
  perforatorIncompetencies: {
    name: string; // e.g. "Dodd's", "Boyd's", "Cockett 2"
    location: string;
    diameterMm: number;
    refluxDurationSec: number;
  }[];
  thrombusPresent: boolean;
  thrombusLocation?: string;
  tortuousBranchesDescription: string;
}

export interface DuplexUltrasoundReport {
  id: string;
  patientId: string;
  examDate: string;
  sonographer: string;
  vascularSurgeon: string;
  verifiedBySurgeon: boolean;
  verifiedAt?: string;
  rightLeg: LegUltrasoundData;
  leftLeg: LegUltrasoundData;
  conclusion: string;
  recommendedAblationZone: string;
  images: {
    id: string;
    url: string;
    title: string;
    findings: string;
  }[];
  createdAt: string;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  dateCreated: string;
  targetLeg: 'Right' | 'Left' | 'Bilateral';
  modalities: {
    compressionTherapy: {
      prescribed: boolean;
      classGrade: 'Class I (18-21 mmHg)' | 'Class II (23-32 mmHg)' | 'Class III (34-46 mmHg)';
      style: 'Thigh-high' | 'Below-knee' | 'Pantyhose';
      durationWeeks: number;
    };
    evlaLaser: {
      prescribed: boolean;
      targetVeins: string[];
      wavelengthNm: 1470 | 980;
      fiberType: 'Radial 2-ring' | 'Bare-tip' | 'Slim radial';
    };
    foamSclerotherapy: {
      prescribed: boolean;
      targetBranches: string;
      agent: 'Polidocanol 1%' | 'Polidocanol 2%' | 'Polidocanol 3%' | 'STS 1%';
      sessionsPlanned: number;
    };
    phlebectomy: {
      prescribed: boolean;
      targetClusters: string;
    };
    woundCare: {
      prescribed: boolean;
      dressingType: string;
      compressionType: string;
    };
    medicalTherapy: {
      prescribed: boolean;
      drugName: string;
      instructions: string;
    };
  };
  stagingPlan: string;
  status: 'Draft' | 'Approved' | 'In-Progress' | 'Completed';
  clinicianApproved: boolean;
  approvingDoctor?: string;
  approvedAt?: string;
  notes: string;
}

export interface ProcedureRecord {
  id: string;
  patientId: string;
  patientName: string;
  procedureDate: string;
  procedureType:
    | 'EVLA (Endovenous Laser Ablation)'
    | 'Foam Sclerotherapy (UGFS)'
    | 'Ambulatory Phlebectomy'
    | 'Combined EVLA + Phlebectomy'
    | 'Ulcer Debridement & Multilayer Compression';
  leg: 'Right' | 'Left' | 'Bilateral';
  primarySurgeon: string;
  assistingStaff: string;
  roomNumber: string;
  preopChecklist: {
    npoFastingConfirmed: boolean;
    bloodThinnersAdjusted: boolean;
    allergiesVerified: boolean;
    duplexMarkingConfirmed: boolean;
    baselineVitalsNormal: boolean;
    compressionStockingsOnSite: boolean;
  };
  consentConfirmed: boolean;
  consentSignedBy: string;
  consentTimestamp: string;
  operativeDetails: {
    veinTreated: string;
    catheterAccessSite: string;
    treatedLengthCm: number;
    laserWavelengthNm?: number;
    laserPowerWatts?: number;
    totalEnergyJoules?: number;
    leedJPerCm?: number;
    pullbackRateMmPerSec?: number;
    tumescentFormula: string;
    tumescentVolumeMl: number;
    foamAgent?: string;
    foamVolumeMl?: number;
    incisionsPhlebectomyCount?: number;
    anesthesiaType: 'Tumescent Local' | 'Local Infiltration' | 'IV Sedation + Tumescent';
  };
  immediatePostOp: {
    toleratedWell: boolean;
    hemostasisAchieved: boolean;
    distalPulsesPalpable: boolean;
    compressionApplied: boolean;
    complications: string; // "None" or details
  };
  postOpInstructions: string[];
  followUpDate: string;
  status: 'Scheduled' | 'In-Progress' | 'Completed' | 'Recovered';
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  descriptionAr: string;
  quantity: number;
  unitPriceIQD: number;
  totalIQD: number;
}

export interface PaymentReceipt {
  id: string;
  receiptNumber: string;
  date: string;
  amountIQD: number;
  method: 'Cash' | 'Visa/MasterCard' | 'ZainCash' | 'FastPay' | 'QI Card';
  receivedBy: string;
  notes: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-0042"
  patientId: string;
  patientName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotalIQD: number;
  discountIQD: number;
  totalIQD: number;
  paidIQD: number;
  balanceIQD: number;
  status: 'Paid' | 'Partial' | 'Pending' | 'Refunded';
  payments: PaymentReceipt[];
  notes: string;
  createdAt: string;
}

export interface ClinicExpense {
  id: string;
  title: string;
  titleAr: string;
  category:
    | 'Laser Equipment & Fibers'
    | 'Ultrasound & Imaging Supplies'
    | 'Sclerosant & Pharmaceuticals'
    | 'Compression Stockings Inventory'
    | 'Clinic Rent & Utilities'
    | 'Staff Salaries & Commission'
    | 'Consumables & PPE';
  amountIQD: number;
  date: string;
  paymentMethod: string;
  receiptRef: string;
  recordedBy: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  nameAr: string;
  category:
    | 'Laser Fibers'
    | 'Introducer Sheaths'
    | 'Sclerosants'
    | 'Compression Stockings'
    | 'Tumescent Kits'
    | 'Wound Dressings'
    | 'General Consumables';
  currentStock: number;
  minThreshold: number;
  unit: string;
  batchNumber: string;
  expiryDate: string;
  unitCostIQD: number;
  supplier: string;
}

export interface StaffMember {
  id: string;
  name: string;
  nameAr: string;
  role: UserRole;
  title: string;
  titleAr: string;
  email: string;
  phone: string;
  active: boolean;
  workingDays: string[];
  avatarUrl: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  category: 'Patient' | 'Clinical' | 'Ultrasound' | 'Procedure' | 'Finance' | 'Inventory' | 'Security';
  details: string;
}

export interface ClinicSettings {
  clinicNameEn: string;
  clinicNameAr: string;
  sloganEn: string;
  sloganAr: string;
  phone: string;
  whatsapp: string;
  email: string;
  addressEn: string;
  addressAr: string;
  currency: string;
  currencySymbol: string;
  taxPercent: number;
  workingHoursEn: string;
  workingHoursAr: string;
  leadSurgeonEn: string;
  leadSurgeonAr: string;
  autoSendWhatsApp: boolean;
}

export type PatientDocumentCategory =
  | 'Duplex Ultrasound'
  | 'Clinical Leg Photos'
  | 'Lab Reports'
  | 'Signed Consent'
  | 'Referral & Medical History'
  | 'Prescription & Stockings';

export interface PatientDocument {
  id: string;
  patientId: string;
  title: string;
  titleAr: string;
  category: PatientDocumentCategory;
  fileName: string;
  fileType: string;
  fileSizeKb: number;
  fileUrl: string; // base64 / data URL or hosted image
  uploadedAt: string;
  uploadedBy: string;
  uploadedByRole: UserRole;
  notes?: string;
  isConfidential?: boolean;
}

export type PermissionKey =
  | 'view_patients'
  | 'create_patient'
  | 'edit_patient'
  | 'delete_patient'
  | 'upload_patient_document'
  | 'delete_patient_document'
  | 'schedule_appointments'
  | 'manage_queue'
  | 'clinical_assessment'
  | 'confirm_ceap_diagnosis'
  | 'duplex_ultrasound'
  | 'verify_ultrasound'
  | 'manage_treatment_plans'
  | 'perform_laser_procedures'
  | 'manage_billing'
  | 'record_payments'
  | 'manage_inventory'
  | 'manage_staff'
  | 'view_reports'
  | 'view_audit_logs'
  | 'manage_settings'
  | 'backup_restore';

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  password?: string;
  name: string;
  nameAr: string;
  role: UserRole;
  avatarUrl: string;
  title: string;
  titleAr: string;
  licenseNumber?: string;
}

