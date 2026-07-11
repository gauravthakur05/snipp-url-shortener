import { motion } from 'framer-motion';
import UrlShortenerForm from './UrlShortenerForm';

const HeroSection = ({ onCreated }) => {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
      {/* Ambient gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-indigo/20 blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-brand-purple/20 blur-3xl animate-float [animation-delay:2s]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-brand-blue/20 blur-3xl animate-float [animation-delay:4s]" />
      </div>

      <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 backdrop-blur"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Free, fast, and built for teams that ship links daily
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
        >
          Shorten Your Long URLs <span className="gradient-text">Instantly</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-5 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg"
        >
          Turn messy, unwieldy links into clean short URLs with built-in QR codes, click
          analytics, and custom branding — all in a couple of seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-10 max-w-2xl"
        >
          <UrlShortenerForm onCreated={onCreated} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-4 text-xs text-slate-400"
        >
          No sign-up required · Unlimited free links · Instant QR codes
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSection;
