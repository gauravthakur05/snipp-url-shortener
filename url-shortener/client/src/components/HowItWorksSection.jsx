import { motion } from 'framer-motion';
import { FiClipboard, FiLink, FiShare2, FiArrowRight } from 'react-icons/fi';

const steps = [
  {
    icon: FiClipboard,
    title: 'Paste URL',
    description: 'Drop in any long link you want to shorten — no formatting needed.',
  },
  {
    icon: FiLink,
    title: 'Generate Short Link',
    description: 'We instantly create a clean, unique short link and QR code for it.',
  },
  {
    icon: FiShare2,
    title: 'Share Anywhere',
    description: 'Copy, scan, or share your link on any platform in one tap.',
  },
];

const HowItWorksSection = () => {
  return (
    <section className="section-padding bg-slate-50 dark:bg-white/[0.02]">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">How it works</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Three simple steps between a messy URL and a link worth sharing.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 items-start gap-6 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, idx) => (
            <div key={title} className="flex items-center gap-4 sm:flex-col sm:gap-0 sm:text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow sm:mx-auto"
              >
                <Icon size={26} />
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-brand-surface text-xs font-bold text-brand-purple shadow">
                  {idx + 1}
                </span>
              </motion.div>

              <div className="sm:mt-5">
                <h3 className="font-display text-lg font-semibold">{title}</h3>
                <p className="mt-1 max-w-[220px] text-sm text-slate-600 dark:text-slate-400 sm:mx-auto">
                  {description}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <FiArrowRight className="mx-auto mt-6 hidden text-2xl text-slate-300 dark:text-slate-600 sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
