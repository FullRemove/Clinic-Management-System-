import React, { useState } from 'react';
import {
  UserCheck,
  Stethoscope,
  Phone,
  Mail,
  Calendar,
  Shield,
  Plus,
  CheckCircle,
} from 'lucide-react';
import { StaffMember, UserRole } from '../types/clinic';
import { storage } from '../services/storageService';
import { translations, Language } from '../i18n/translations';

interface Props {
  lang: Language;
  staff: StaffMember[];
  activeRole: UserRole;
  onChangeRole: (role: UserRole) => void;
}

export const StaffView: React.FC<Props> = ({
  lang,
  staff,
  activeRole,
  onChangeRole,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.staffTitle}</h3>
            <p className="text-xs text-slate-500">
              {isRtl
                ? 'استشاريو جراحة الأوعية والقسطرة، الكوادر التمريضية والإدارية'
                : 'Vascular surgeons, phlebologists, interventional nurses, and clinic administrators'}
            </p>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => {
          const isCurrent = activeRole === member.role;
          return (
            <div
              key={member.id}
              className={`bg-white rounded-3xl border transition-all p-5 shadow-sm space-y-4 flex flex-col justify-between ${
                isCurrent
                  ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {isRtl ? member.nameAr : member.name}
                      </h4>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 mt-0.5">
                        {member.role}
                      </span>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-600 text-white">
                      Active
                    </span>
                  )}
                </div>

                <p className="text-slate-600 text-xs leading-relaxed">
                  {isRtl ? member.titleAr : member.title}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-slate-700">{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-700 truncate">{member.email}</span>
                  </div>
                  <div className="flex items-start gap-2 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] text-slate-600">
                      {member.workingDays.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action: Switch to this role for instant system preview */}
              <button
                onClick={() => onChangeRole(member.role)}
                className={`w-full py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  isCurrent
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{isCurrent ? 'Currently Operating As' : `Switch Role to ${member.role}`}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
