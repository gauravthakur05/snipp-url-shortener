import { motion } from 'framer-motion';
import { FiZap, FiShield, FiBarChart2, FiGrid, FiGift, FiRepeat } from 'react-icons/fi';

const features = [
  {
    icon: FiZap,
    title: 'Fast',
    description: 'Links resolve in milliseconds with globally cached redirects — no waiting around.',
  },
  {
    icon: FiShield,
    title: 'Secure',
    description: 'Optional password protection and link expiration keep sensitive links locked down.',
  },
  {
    icon: FiBarChart2,
    title: 'Analytics',
    description: 'Track clicks, last-visited dates, and trends for every single link you create.',
  },
  {
    icon: FiGrid,
    title: 'QR Codes',
    description: 'Every short link comes with a downloadable QR code, ready for print or packaging.',
  },
  {
    icon: FiGift,
    title: 'Free',
    description: 'No hidden tiers, no credit card. Shorten and share as many links as you need.',
  },
  {
    icon: FiRepeat,
    title: 'Unlimited',
    description: 'Create unlimited short links and keep them organized in one clean dashboard.',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Everything you need, <span className="gradient-text">nothing you don't</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            A focused toolkit for shortening, sharing, and understanding your links.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={item}
              whileHover={{ y: -6 }}
              className="glass-card group rounded-2xl p-7 transition-shadow hover:shadow-glow"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient-soft text-brand-purple dark:text-purple-300 transition-transform group-hover:scale-110">
                <Icon size={22} />
              </div>
              <h3 className="font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
