import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Clock,
  User,
  Shield,
  FileText,
  Lock,
} from 'lucide-react';
import { AuditLogEntry } from '../types/clinic';
import { translations, Language } from '../i18n/translations';

interface Props {
  lang: Language;
  auditLogs: AuditLogEntry[];
}

export const AuditView: React.FC<Props> = ({
  lang,
  auditLogs,
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredLogs = auditLogs.filter((log) => {
    const matchSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.userName.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || log.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.auditTitle}</h3>
            <p className="text-xs text-slate-500">
              {isRtl
                ? 'سجل غير قابل للتعديل لتوثيق جميع العمليات السريرية والمالية والأمنية'
                : 'Immutable audit trail tracking clinical modifications, laser procedures & payments'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>HIPAA & GDPR Grade Tamper-Evident</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 text-xs">
        <div className="relative flex-1 w-full">
          <Search
            className={`w-4 h-4 text-slate-400 absolute ${
              isRtl ? 'right-3' : 'left-3'
            } top-1/2 -translate-y-1/2`}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by operator, action, or patient..."
            className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
              isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
            }`}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
        >
          <option value="All">{t.all} Modules</option>
          <option value="Patient">Patient</option>
          <option value="Clinical">Clinical & CEAP</option>
          <option value="Ultrasound">Duplex Ultrasound</option>
          <option value="Procedure">Procedure</option>
          <option value="Finance">Finance & Billing</option>
          <option value="Inventory">Inventory</option>
          <option value="Security">Security & Access</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{t.timestamp}</th>
                <th className="py-3 px-4">{t.user}</th>
                <th className="py-3 px-4">{t.categoryAudit}</th>
                <th className="py-3 px-4">{t.actionTaken}</th>
                <th className="py-3 px-4">{t.details}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    <div>{log.userName}</div>
                    <span className="text-[10px] text-teal-700 font-normal">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.category === 'Security'
                          ? 'bg-purple-100 text-purple-800'
                          : log.category === 'Procedure'
                          ? 'bg-cyan-100 text-cyan-800'
                          : log.category === 'Finance'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.category === 'Clinical'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 leading-relaxed">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
