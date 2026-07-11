import { motion } from 'framer-motion';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ title = 'No links yet', description = 'Shorten your first URL to see it here.' }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card flex flex-col items-center justify-center rounded-2xl py-20 text-center"
  >
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient-soft text-brand-purple dark:text-purple-300">
      <FiInbox size={28} />
    </div>
    <h3 className="font-display text-lg font-semibold">{title}</h3>
    <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">{description}</p>
  </motion.div>
);

export default EmptyState;
