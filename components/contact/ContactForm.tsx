'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ContactSchema } from '@/lib/validate';

type State = 'idle' | 'loading' | 'success' | 'error';

interface Props {
  locale: string;
  initialMessage?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const INPUT =
  'w-full px-4 py-3.5 rounded-[8px] border border-border bg-surface-2 text-ink ' +
  'placeholder:text-text-muted/70 dark:placeholder:text-white/30 ' +
  'focus-visible:outline-none focus-visible:border-indigo ' +
  'focus-visible:shadow-[0_0_0_3px_rgba(79,70,229,0.12)] ' +
  'transition-all duration-200';

const INPUT_ERROR =
  'border-red-400 dark:border-red-500 focus-visible:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]';

const Checkmark = () => (
  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" strokeWidth="3.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden className="stroke-success">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function ContactForm({ locale, initialMessage = '' }: Props) {
  const t = useTranslations('contact');

  const [state, setState] = useState<State>('idle');
  const [values, setValues] = useState({ name: '', email: '', phone: '', message: initialMessage });
  const [errors, setErrors] = useState<Partial<Record<'name' | 'email' | 'message', string>>>({});

  function fieldError(field: 'name' | 'email' | 'message', v = values): string | undefined {
    const result = ContactSchema.safeParse({ ...v, locale });
    if (result.success) return undefined;
    const hit = result.error.issues.some((i) => i.path[0] === field);
    if (!hit) return undefined;
    if (field === 'name') return t('errors.nameMin');
    if (field === 'email') return t('errors.emailInvalid');
    if (field === 'message') return t('errors.messageMin');
  }

  const handleChange = (field: keyof typeof values, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    const f = field as 'name' | 'email' | 'message';
    if (errors[f]) {
      if (!fieldError(f, next)) {
        setErrors((prev) => { const c = { ...prev }; delete c[f]; return c; });
      }
    }
  };

  const handleBlur = (field: 'name' | 'email' | 'message') => {
    const err = fieldError(field);
    if (err) setErrors((prev) => ({ ...prev, [field]: err }));
    else setErrors((prev) => { const c = { ...prev }; delete c[field]; return c; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    const nameErr = fieldError('name');
    const emailErr = fieldError('email');
    const messageErr = fieldError('message');
    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (messageErr) newErrors.message = messageErr;
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setState('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, locale }),
      });
      if (!res.ok) throw new Error();
      setState('success');
    } catch {
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="bg-surface-2 border border-border rounded-2xl p-8 sm:p-10 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 dark:bg-success/20 mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden className="stroke-success">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-h3 text-ink dark:text-white mb-3">{t('success.title')}</h2>
        <p className="text-body text-text-muted dark:text-white/75 mx-auto mb-6">{t('success.body')}</p>
        <button
          onClick={() => { setState('idle'); setValues({ name: '', email: '', phone: '', message: '' }); setErrors({}); }}
          className="text-label text-indigo hover:text-indigo-deep dark:hover:text-indigo/80 underline transition-colors"
        >
          {t('success.again')}
        </button>
      </motion.div>
    );
  }

  const stripItems = [t('form.strip1'), t('form.strip2'), t('form.strip3'), t('form.strip4')];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
    >
      <div className="bg-surface-2 border border-border shadow-md rounded-2xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

          {/* Name */}
          <div>
            <label htmlFor="cf-name" className="block text-label font-medium text-ink dark:text-white mb-1.5">
              {t('form.name')}
            </label>
            <input
              id="cf-name" type="text" name="name" autoComplete="name"
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder={t('form.namePh')}
              className={`${INPUT}${errors.name ? ` ${INPUT_ERROR}` : ''}`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'cf-name-err' : undefined}
            />
            {errors.name && <p id="cf-name-err" className="text-sm text-red-500 dark:text-red-400 mt-1.5">{errors.name}</p>}
          </div>

          {/* Phone — second in order per UX brief */}
          <div>
            <label htmlFor="cf-phone" className="block text-label font-medium text-ink dark:text-white mb-1.5">
              {t('form.phone')}
            </label>
            <input
              id="cf-phone" type="tel" name="phone" autoComplete="tel"
              value={values.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder={t('form.phonePh')}
              className={INPUT}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="cf-email" className="block text-label font-medium text-ink dark:text-white mb-1.5">
              {t('form.email')}
            </label>
            <input
              id="cf-email" type="email" name="email" autoComplete="email"
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder={t('form.emailPh')}
              className={`${INPUT}${errors.email ? ` ${INPUT_ERROR}` : ''}`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'cf-email-err' : undefined}
            />
            {errors.email && <p id="cf-email-err" className="text-sm text-red-500 dark:text-red-400 mt-1.5">{errors.email}</p>}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="cf-message" className="block text-label font-medium text-ink dark:text-white mb-1.5">
              {t('form.message')}
            </label>
            <textarea
              id="cf-message" name="message" rows={5}
              value={values.message}
              onChange={(e) => handleChange('message', e.target.value)}
              onBlur={() => handleBlur('message')}
              placeholder={t('form.messagePh')}
              className={`${INPUT} resize-none${errors.message ? ` ${INPUT_ERROR}` : ''}`}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'cf-message-err' : undefined}
            />
            {errors.message && <p id="cf-message-err" className="text-sm text-red-500 dark:text-red-400 mt-1.5">{errors.message}</p>}
          </div>

          {/* API error */}
          {state === 'error' && (
            <div role="alert" className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-[8px] px-4 py-3">
              {t('errors.generic')}
            </div>
          )}

          {/* Submit — full width, taller, hover lift */}
          <button
            type="submit"
            disabled={state === 'loading'}
            className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 rounded-[10px] bg-accent text-white font-semibold text-[15px]
              hover:bg-accent-ink hover:-translate-y-[2px] hover:shadow-lg
              active:translate-y-0 active:scale-[0.97]
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-all duration-150 shadow-sm"
          >
            {state === 'loading' ? (
              <>
                <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t('form.submitting')}
              </>
            ) : t('form.submit')}
          </button>

          {/* Trust strip */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-2 border-t border-border/50">
            {stripItems.map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-xs text-text-muted dark:text-white/50">
                <span className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-success/15 dark:bg-success/20 flex items-center justify-center">
                  <Checkmark />
                </span>
                {item}
              </span>
            ))}
          </div>

        </form>
      </div>
    </motion.div>
  );
}
