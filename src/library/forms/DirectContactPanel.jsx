import React, { useEffect, useState } from 'react';
import { Mail, MessageSquare, ArrowRight, ShieldCheck, Copy, Check } from 'lucide-react';

/**
 * DirectContactPanel
 * Adapted from sankofa-digital-za qualified discovery contact section.
 * Direct action links (mailto + WhatsApp) with zero-data-retention disclosure and safe clipboard copy fallback.
 */
export function DirectContactPanel({
  eyebrow = 'Qualified Discovery Enquiry',
  title = 'Bring one workflow that needs to work better.',
  description = 'A short description of your operating context is enough. Our first response outlines fit, missing information, and the most practical next step.',
  email = 'sankofa.digital.studios@gmail.com',
  emailSubject = 'Discovery Enquiry',
  whatsappNumber = '+27754654865',
  whatsappText = 'Hello Sankofa Digital, I would like to discuss a project enquiry.',
  privacyNote = 'This site does not store submissions or track user data. Communication takes place entirely through your chosen client.',
  className = '',
}) {
  const [copyStatus, setCopyStatus] = useState('');

  const cleanEmail = typeof email === 'string' ? email.trim() : '';
  const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);
  const mailtoUrl = hasValidEmail ? `mailto:${cleanEmail}?subject=${encodeURIComponent(emailSubject)}` : '';

  useEffect(() => {
    setCopyStatus('');
  }, [cleanEmail]);

  const cleanPhone = typeof whatsappNumber === 'string' ? whatsappNumber.replace(/[^0-9]/g, '') : '';
  const hasWhatsApp = cleanPhone.length >= 7;
  const whatsappUrl = hasWhatsApp ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappText)}` : '';

  const copyEmail = async () => {
    if (!hasValidEmail) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(cleanEmail);
        setCopyStatus(`Copied ${cleanEmail}`);
      } else {
        setCopyStatus(`Email: ${cleanEmail}`);
      }
    } catch {
      setCopyStatus(`Email: ${cleanEmail}`);
    }
  };

  return (
    <section
      className={`relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-slate-950 p-6 shadow-xl sm:p-8 ${className}`}
      aria-label="Direct contact enquiry"
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-amber-400">
            {eyebrow}
          </p>
        )}
        <h2 className="text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
            {description}
          </p>
        )}

        {(hasValidEmail || hasWhatsApp) ? (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {hasValidEmail && (
              <>
                <a
                  href={mailtoUrl}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 active:scale-95"
                >
                  <Mail size={15} aria-hidden="true" />
                  <span>Prepare an email</span>
                  <ArrowRight size={13} aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label={`Copy email address ${cleanEmail}`}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  {copyStatus.startsWith('Copied') ? <Check size={14} className="text-emerald-400" aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                  <span>{copyStatus.startsWith('Copied') ? 'Copied email' : 'Copy email'}</span>
                </button>
              </>
            )}

            {hasWhatsApp && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-2.5 text-xs font-semibold text-slate-100 transition-all hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 active:scale-95"
              >
                <MessageSquare size={15} className="text-emerald-400" aria-hidden="true" />
                <span>Open WhatsApp</span>
              </a>
            )}
          </div>
        ) : (
          <p role="status" className="mt-6 text-xs text-slate-400">
            Direct contact channels are currently unavailable.
          </p>
        )}

        {copyStatus && (
          <p role="status" className="mt-2 text-xs text-emerald-300">
            {copyStatus}
          </p>
        )}

        {privacyNote && (
          <div className="mt-6 flex items-start gap-2 border-t border-slate-800/80 pt-4 text-[11px] text-slate-400">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true" />
            <p>{privacyNote}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default DirectContactPanel;
