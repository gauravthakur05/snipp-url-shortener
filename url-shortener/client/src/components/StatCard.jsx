import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="glass-card flex items-center gap-4 rounded-2xl p-5"
  >
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient-soft text-brand-purple dark:text-purple-300">
      <Icon size={20} />
    </div>
    <div>
      <p className="font-display text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  </motion.div>
);

export default StatCard;
