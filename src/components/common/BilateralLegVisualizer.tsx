import React from 'react';
import { CEAPClinical } from '../../types/clinic';

interface Props {
  selectedLeg: 'Right' | 'Left' | 'Bilateral';
  onSelectLeg?: (leg: 'Right' | 'Left' | 'Bilateral') => void;
  ceapGrade?: CEAPClinical;
  hasUlcer?: boolean;
  hasEdema?: boolean;
  hasPigmentation?: boolean;
  isInteractive?: boolean;
  isRtl?: boolean;
}

export const BilateralLegVisualizer: React.FC<Props> = ({
  selectedLeg,
  onSelectLeg,
  ceapGrade = 'C2',
  hasUlcer = false,
  hasEdema = false,
  hasPigmentation = false,
  isInteractive = true,
  isRtl = false,
}) => {
  const isRightActive = selectedLeg === 'Right' || selectedLeg === 'Bilateral';
  const isLeftActive = selectedLeg === 'Left' || selectedLeg === 'Bilateral';

  return (
    <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with leg selector buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-teal-500/20">
        <div>
          <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            {isRtl ? 'المخطط التشريحي للأوردة السطحية والعميقة' : 'Venous Anatomy & Reflux Mapping'}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRtl
              ? 'الوريد الصافن الكبير (GSV) والصغير (SSV) ونقاط الاتصال والثواقب'
              : 'Sapheno-Femoral (SFJ) & Sapheno-Popliteal (SPJ) Axis'}
          </p>
        </div>

        {isInteractive && onSelectLeg && (
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-teal-500/30 text-xs">
            <button
              type="button"
              onClick={() => onSelectLeg('Right')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                selectedLeg === 'Right'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isRtl ? 'الطرف الأيمن' : 'Right Leg'}
            </button>
            <button
              type="button"
              onClick={() => onSelectLeg('Left')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                selectedLeg === 'Left'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isRtl ? 'الطرف الأيسر' : 'Left Leg'}
            </button>
            <button
              type="button"
              onClick={() => onSelectLeg('Bilateral')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                selectedLeg === 'Bilateral'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isRtl ? 'كلا الطرفين' : 'Bilateral'}
            </button>
          </div>
        )}
      </div>

      {/* SVG Diagram: Bilateral Legs */}
      <div className="flex items-center justify-center py-2">
        <svg
          viewBox="0 0 500 360"
          className="w-full max-w-lg h-auto drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="refluxGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
            <linearGradient id="normalVein" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
            <radialGradient id="ulcerGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="70%" stopColor="#991b1b" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </radialGradient>
          </defs>

          {/* Pelvis / Inguinal Reference */}
          <path
            d="M 120 40 Q 250 55 380 40"
            fill="none"
            stroke="#334155"
            strokeWidth="3"
            strokeDasharray="4 4"
          />
          <text x="250" y="32" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600">
            {isRtl ? 'الرباط الإربي / المغبن (Inguinal Ligament)' : 'Inguinal Ligament / Groin'}
          </text>

          {/* ================= RIGHT LEG (Left in anatomic perspective) ================= */}
          <g
            className={`transition-opacity duration-300 ${isRightActive ? 'opacity-100' : 'opacity-40'}`}
            onClick={() => onSelectLeg && onSelectLeg('Right')}
            style={{ cursor: isInteractive ? 'pointer' : 'default' }}
          >
            {/* Leg Contour Outline */}
            <path
              d="M 140 50 C 120 120 125 180 145 230 C 150 250 152 280 148 320 L 125 330 L 165 335 C 175 320 178 285 182 245 C 195 190 200 120 190 50 Z"
              fill={isRightActive ? '#1e293b' : '#0f172a'}
              stroke={isRightActive ? '#14b8a6' : '#334155'}
              strokeWidth={isRightActive ? '2.5' : '1.5'}
            />

            {/* Inguinal SFJ Node */}
            <circle
              cx="170"
              cy="65"
              r="7"
              fill={isRightActive ? '#ef4444' : '#0ea5e9'}
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text x="170" y="80" textAnchor="middle" fill="#fca5a5" fontSize="9" fontWeight="700">
              SFJ
            </text>

            {/* GSV Main Trunk Right */}
            <path
              d="M 170 65 Q 165 140 160 200 Q 155 240 152 305"
              fill="none"
              stroke={isRightActive ? 'url(#refluxGlow)' : 'url(#normalVein)'}
              strokeWidth={isRightActive ? '6' : '3.5'}
              strokeLinecap="round"
            />

            {/* Tortuous Varicose Tributaries Right (Calf/Thigh) */}
            {isRightActive && (
              <g stroke="#f43f5e" strokeWidth="3" fill="none" strokeLinecap="round">
                <path d="M 160 170 Q 145 178 152 195 Q 138 210 145 225" />
                <path d="M 158 220 Q 172 235 165 250 Q 175 265 168 280" />
                <path d="M 152 260 Q 138 270 142 285" />
              </g>
            )}

            {/* Perforators (Cockett & Boyd) */}
            <circle cx="157" cy="210" r="3.5" fill="#f59e0b" />
            <line x1="157" y1="210" x2="167" y2="210" stroke="#f59e0b" strokeWidth="2" />
            <text x="120" y="213" fill="#fbbf24" fontSize="8" fontWeight="600">
              Boyd's (4.1mm)
            </text>

            {/* Medial Malleolus Ulcer Spot if applicable */}
            {(hasUlcer || ceapGrade === 'C6') && isRightActive && (
              <g>
                <circle cx="152" cy="305" r="9" fill="url(#ulcerGrad)" stroke="#fee2e2" strokeWidth="2" />
                <circle cx="152" cy="305" r="14" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" className="animate-spin" />
                <text x="152" y="328" textAnchor="middle" fill="#f87171" fontSize="9" fontWeight="800">
                  {isRtl ? 'قرحة نشطة C6' : 'Active Ulcer C6'}
                </text>
              </g>
            )}

            {/* Hyperpigmentation / Stasis shadow */}
            {(hasPigmentation || ceapGrade === 'C4a' || ceapGrade === 'C4b') && isRightActive && !hasUlcer && (
              <ellipse cx="155" cy="285" rx="14" ry="18" fill="#78350f" fillOpacity="0.45" stroke="#b45309" strokeWidth="1" />
            )}

            <text x="160" y="352" textAnchor="middle" fill={isRightActive ? '#2dd4bf' : '#94a3b8'} fontSize="12" fontWeight="700">
              {isRtl ? 'الساق اليمنى (Right)' : 'Right Limb'}
            </text>
          </g>

          {/* ================= LEFT LEG ================= */}
          <g
            className={`transition-opacity duration-300 ${isLeftActive ? 'opacity-100' : 'opacity-40'}`}
            onClick={() => onSelectLeg && onSelectLeg('Left')}
            style={{ cursor: isInteractive ? 'pointer' : 'default' }}
          >
            {/* Leg Contour Outline */}
            <path
              d="M 310 50 C 300 120 305 190 318 245 C 322 285 325 320 335 335 L 375 330 L 352 320 C 348 280 350 250 355 230 C 375 180 380 120 360 50 Z"
              fill={isLeftActive ? '#1e293b' : '#0f172a'}
              stroke={isLeftActive ? '#06b6d4' : '#334155'}
              strokeWidth={isLeftActive ? '2.5' : '1.5'}
            />

            {/* Inguinal SFJ Node Left */}
            <circle
              cx="330"
              cy="65"
              r="7"
              fill={isLeftActive && (ceapGrade === 'C3' || selectedLeg === 'Left') ? '#0ea5e9' : '#14b8a6'}
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text x="330" y="80" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="700">
              SFJ
            </text>

            {/* GSV Main Trunk Left */}
            <path
              d="M 330 65 Q 335 140 340 200 Q 345 240 348 305"
              fill="none"
              stroke="url(#normalVein)"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Small spider/reticular veins */}
            {isLeftActive && (
              <g stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.8">
                <path d="M 342 165 Q 355 175 348 190" />
                <path d="M 338 230 Q 325 242 332 255" />
              </g>
            )}

            <text x="340" y="352" textAnchor="middle" fill={isLeftActive ? '#38bdf8' : '#94a3b8'} fontSize="12" fontWeight="700">
              {isRtl ? 'الساق اليسرى (Left)' : 'Left Limb'}
            </text>
          </g>
        </svg>
      </div>

      {/* Legend & CEAP indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 mt-2 border-t border-teal-500/20 text-xs">
        <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
          <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-300" />
          <span className="text-slate-300">
            {isRtl ? 'ارتجاع وريدي (Reflux > 0.5s)' : 'Venous Reflux (> 0.5s)'}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
          <span className="w-3 h-3 rounded-full bg-cyan-400 ring-2 ring-cyan-200" />
          <span className="text-slate-300">
            {isRtl ? 'وريد طبيعي سالك' : 'Patent / Competent'}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
          <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-300" />
          <span className="text-slate-300">
            {isRtl ? 'ثواقب متوسعة (Perforators)' : 'Incompetent Perforators'}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
          <span className="w-3 h-3 rounded-full bg-red-700 ring-2 ring-red-400" />
          <span className="text-slate-300">
            {isRtl ? 'قرحة وريدية C5/C6' : 'Stasis Ulcer (C5/C6)'}
          </span>
        </div>
      </div>
    </div>
  );
};
