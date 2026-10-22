import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, CheckCircle, Smartphone } from 'lucide-react';

interface Props {
  isRtl?: boolean;
}

export const PWAInstallButton: React.FC<Props> = ({ isRtl }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-950/60 border border-teal-500/30 text-teal-300 text-xs font-medium">
        <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
        <span>{isRtl ? 'التطبيق مثبت' : 'PWA Installed'}</span>
      </div>
    );
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
        title="Install as Progressive Web App"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{isRtl ? 'تثبيت التطبيق' : 'Install App'}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-900/40 border border-teal-500/30 hover:bg-teal-900/70 text-teal-200 text-xs font-medium transition cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-teal-400" />
          <span>{isRtl ? 'تثبيت على iOS' : 'Install on iOS'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-teal-500/30 p-6 shadow-2xl text-white">
              <h3 className="text-lg font-bold text-teal-400 flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                {isRtl ? 'التثبيت على آيفون / آيباد' : 'Install on iPhone / iPad'}
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                {isRtl ? (
                  <>
                    1. اضغط على زر <strong>مشاركة (Share)</strong> في شريط متصفح سفاري.<br />
                    2. مرر للأسفل واختر <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.
                  </>
                ) : (
                  <>
                    1. Tap the <strong>Share</strong> button in the Safari toolbar.<br />
                    2. Scroll down and tap <strong>Add to Home Screen</strong>.
                  </>
                )}
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-teal-600 hover:bg-teal-500 py-2.5 text-sm font-semibold text-white transition cursor-pointer"
              >
                {isRtl ? 'تم' : 'Got it'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <button
      onClick={() => alert(isRtl ? 'التطبيق جاهز للعمل كـ PWA' : 'PWA is active and ready for offline use')}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-950/40 border border-teal-500/20 text-teal-400 text-xs hover:bg-teal-950/80 transition"
      title="PWA Ready"
    >
      <Download className="w-3.5 h-3.5" />
      <span>PWA</span>
    </button>
  );
};
