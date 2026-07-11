import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import useTheme from '../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-colors"
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-lg"
      >
        {isDark ? <FiSun className="text-amber-400" /> : <FiMoon className="text-indigo-600" />}
      </motion.span>
    </button>
  );
};

export default ThemeToggle;
