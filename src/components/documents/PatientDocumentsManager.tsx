import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Trash2,
  Download,
  Eye,
  Plus,
  Filter,
  CheckCircle,
  AlertCircle,
  X,
  Printer,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { PatientDocument, PatientDocumentCategory, Patient, UserRole } from '../../types/clinic';
import { storage } from '../../services/storageService';
import { translations, Language } from '../../i18n/translations';

interface Props {
  lang: Language;
  patient: Patient;
  currentUserRole?: UserRole;
  onDocumentCountChange?: () => void;
}

export const PatientDocumentsManager: React.FC<Props> = ({
  lang,
  patient,
  currentUserRole = 'Vascular Surgeon',
  onDocumentCountChange,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [documents, setDocuments] = useState<PatientDocument[]>(() =>
    storage.getPatientDocuments(patient.id)
  );

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<PatientDocument | null>(null);

  // Upload Form State
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [category, setCategory] = useState<PatientDocumentCategory>('Clinical Leg Photos');
  const [notes, setNotes] = useState('');
  const [isConfidential, setIsConfidential] = useState(false);
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [fileName, setFileName] = useState('');
  const [fileSizeKb, setFileSizeKb] = useState(120);
  const [fileType, setFileType] = useState('image/jpeg');
  const [isDragging, setIsDragging] = useState(false);

  const reloadDocuments = () => {
    const list = storage.getPatientDocuments(patient.id);
    setDocuments(list);
    if (onDocumentCountChange) onDocumentCountChange();
  };

  const categories: PatientDocumentCategory[] = [
    'Clinical Leg Photos',
    'Duplex Ultrasound',
    'Signed Consent',
    'Lab Reports',
    'Referral & Medical History',
    'Prescription & Stockings',
  ];

  const handleFileChange = (file: File) => {
    setFileName(file.name);
    setFileSizeKb(Math.round(file.size / 1024));
    setFileType(file.type || 'image/jpeg');

    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName);
      setTitleAr(cleanName);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFileDataUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSaveUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert(isRtl ? 'يرجى إدخال عنوان المستند أو الصورة' : 'Please provide document title');
      return;
    }

    // Default sample image if no file was picked
    const finalUrl =
      fileDataUrl ||
      (category === 'Clinical Leg Photos'
        ? 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80'
        : category === 'Duplex Ultrasound'
        ? 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80');

    const currentUser = storage.getCurrentUser();

    const newDoc: PatientDocument = {
      id: `doc-${Date.now()}`,
      patientId: patient.id,
      title: title.trim(),
      titleAr: titleAr.trim() || title.trim(),
      category,
      fileName: fileName || `${category.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.jpg`,
      fileType: fileType || 'image/jpeg',
      fileSizeKb: fileSizeKb || 240,
      fileUrl: finalUrl,
      uploadedAt: new Date().toLocaleString(),
      uploadedBy: currentUser?.name || 'Staff Member',
      uploadedByRole: currentUser?.role || currentUserRole,
      notes: notes.trim(),
      isConfidential,
    };

    storage.savePatientDocument(newDoc);
    reloadDocuments();
    setShowUploadModal(false);

    // Reset fields
    setTitle('');
    setTitleAr('');
    setNotes('');
    setFileDataUrl('');
    setFileName('');
  };

  const handleDelete = (docId: string, docTitle: string) => {
    const canDelete = storage.hasPermission(currentUserRole, 'delete_patient_document');
    if (!canDelete) {
      alert(isRtl ? 'عذراً، يتطلب حذف المستندات صلاحية جراح أو مدير نظام.' : 'Permission denied: Requires Surgeon or Admin role to delete patient documents.');
      return;
    }

    if (confirm(`${t.confirmDelete}\n${docTitle}`)) {
      storage.deletePatientDocument(docId);
      reloadDocuments();
      if (previewDoc?.id === docId) setPreviewDoc(null);
    }
  };

  const filteredDocs = documents.filter(
    (doc) => categoryFilter === 'All' || doc.category === categoryFilter
  );

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-teal-600" />
            <span>{isRtl ? 'سجل الوثائق والصور الطبية للمريض' : 'Patient Clinical Documents & Imaging'}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
              {documents.length}
            </span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {isRtl
              ? 'صور الساقين وقوفاً، لقطات الدوبلكس، تقارير المختبر، واستمارات الموافقة'
              : 'Standing vein photos, duplex ultrasound stills, signed consents & lab sheets'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{isRtl ? 'رفع وثيقة / صورة جديدة' : 'Upload Document / Photo'}</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setCategoryFilter('All')}
          className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
            categoryFilter === 'All'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {isRtl ? 'الكل' : 'All Files'} ({documents.length})
        </button>
        {categories.map((cat) => {
          const count = documents.filter((d) => d.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-teal-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <Upload className="w-6 h-6" />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {isRtl ? 'لا توجد وثائق مرفوعة في هذا التصنيف' : 'No clinical documents attached in this category.'}
          </div>
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="text-xs text-teal-600 hover:text-teal-700 font-bold underline cursor-pointer"
          >
            {isRtl ? 'اضغط هنا لرفع أول ملف' : 'Click here to upload the first file'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const isImage = doc.fileType.startsWith('image/');
            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
              >
                {/* File Thumbnail Preview */}
                <div
                  onClick={() => setPreviewDoc(doc)}
                  className="relative h-40 bg-slate-900 overflow-hidden cursor-pointer flex items-center justify-center"
                >
                  {isImage ? (
                    <img
                      src={doc.fileUrl}
                      alt={doc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-300 space-y-1">
                      <FileText className="w-10 h-10 text-teal-400" />
                      <span className="text-[10px] font-mono uppercase bg-slate-800 px-2 py-0.5 rounded">
                        PDF Document
                      </span>
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 text-white backdrop-blur-xs">
                      {doc.category}
                    </span>
                    {doc.isConfidential && (
                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-purple-900/80 text-purple-200 flex items-center gap-1">
                        <Shield className="w-2.5 h-2.5" /> Confidential
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <span className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition">
                      <Eye className="w-5 h-5" />
                    </span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-3.5 space-y-2 text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900 truncate" title={doc.title}>
                      {isRtl ? doc.titleAr : doc.title}
                    </h5>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                      {doc.fileName} • {doc.fileSizeKb} KB
                    </div>
                  </div>

                  {doc.notes && (
                    <p className="text-[11px] text-slate-600 line-clamp-2 italic bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      "{doc.notes}"
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                    <span className="truncate">By {doc.uploadedBy}</span>
                    <span className="font-mono">{doc.uploadedAt.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Bottom Action Strip */}
                <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-[11px] transition cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{isRtl ? 'معاينة' : 'View'}</span>
                    </button>
                    <a
                      href={doc.fileUrl}
                      download={doc.fileName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                      title="Download File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(doc.id, doc.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title={t.delete}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload New Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg my-8 bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {isRtl ? 'رفع وثيقة أو صورة جديدة للمريض' : 'Upload Patient Clinical Document'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUpload} className="space-y-4">
              {/* Drag and Drop Box */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`p-6 rounded-2xl border-2 border-dashed transition text-center cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                  isDragging
                    ? 'border-teal-500 bg-teal-50/50'
                    : 'border-slate-300 hover:border-teal-400 bg-slate-50/60'
                }`}
              >
                <input
                  type="file"
                  id="patientDocInput"
                  accept="image/*,application/pdf"
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  className="hidden"
                />
                <label htmlFor="patientDocInput" className="cursor-pointer space-y-1">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-1">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-slate-800">
                    {fileName ? fileName : isRtl ? 'اسحب الملف هنا أو انقر للاختيار' : 'Drag & drop image or PDF, or click to browse'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Supports high-resolution JPG, PNG leg photos, Ultrasound Doppler stills & PDF reports
                  </div>
                </label>
              </div>

              {/* Document Metadata Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isRtl ? 'عنوان الوثيقة أو الصورة *' : 'Document Title *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setTitleAr(e.target.value);
                    }}
                    placeholder="e.g. Right Calf Varicosities - Pre-Op Standing Photo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      {isRtl ? 'التصنيف الطبي' : 'Document Category'}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as PatientDocumentCategory)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:ring-2 focus:ring-teal-500 cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-800 font-medium">
                      <input
                        type="checkbox"
                        checked={isConfidential}
                        onChange={(e) => setIsConfidential(e.target.checked)}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span>{isRtl ? 'وثيقة سرية مقيدة' : 'Confidential Medical Record'}</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {isRtl ? 'ملاحظات سريرية توضيحية' : 'Clinical Notes / Findings Description'}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Visible C4a tortuous cluster along GSV territory before laser ablation"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isRtl ? 'حفظ ورفع للملف' : 'Save to Patient File'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Resolution Document / Photo Preview Viewer */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl border border-teal-500/40 text-white overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-900 text-teal-300 border border-teal-500/30">
                  {previewDoc.category}
                </span>
                <div>
                  <h4 className="font-bold text-sm text-white">{previewDoc.title}</h4>
                  <div className="text-[11px] text-slate-400">
                    Uploaded by {previewDoc.uploadedBy} on {previewDoc.uploadedAt}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewDoc.fileUrl}
                  download={previewDoc.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                  title="Print"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Viewer Body */}
            <div className="flex-1 bg-black p-4 flex items-center justify-center overflow-auto">
              {previewDoc.fileType.startsWith('image/') ? (
                <img
                  src={previewDoc.fileUrl}
                  alt={previewDoc.title}
                  className="max-h-[65vh] w-auto object-contain rounded-xl shadow-2xl"
                />
              ) : (
                <div className="w-full h-80 flex flex-col items-center justify-center space-y-3 text-slate-300">
                  <FileText className="w-16 h-16 text-teal-400" />
                  <p className="text-sm font-semibold">{previewDoc.fileName}</p>
                  <a
                    href={previewDoc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
                  >
                    Open PDF in New Tab
                  </a>
                </div>
              )}
            </div>

            {/* Footer with Notes */}
            {previewDoc.notes && (
              <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-teal-400 block mb-0.5">Clinical Note:</span>
                <p className="leading-relaxed">{previewDoc.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
