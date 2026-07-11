import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiLink2, FiMousePointer, FiActivity } from 'react-icons/fi';
import { fetchOverview } from '../utils/api';
import { formatNumber } from '../utils/helpers';

const cards = [
  { key: 'totalLinks', label: 'Total Links', icon: FiLink2 },
  { key: 'totalClicks', label: 'Total Clicks', icon: FiMousePointer },
  { key: 'activeLinks', label: 'Active Links', icon: FiActivity },
];

const AnalyticsPreviewSection = () => {
  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0, activeLinks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Trusted by the numbers</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            A live snapshot of activity across every link created with Snipp.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {cards.map(({ key, label, icon: Icon }, idx) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card relative overflow-hidden rounded-2xl p-8 text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient-soft text-brand-purple dark:text-purple-300">
                <Icon size={22} />
              </div>
              {loading ? (
                <div className="skeleton mx-auto h-9 w-24" />
              ) : (
                <p className="font-display text-4xl font-bold gradient-text">{formatNumber(stats[key])}</p>
              )}
              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnalyticsPreviewSection;
