import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

const NotFound = () => (
  <div className="section-padding flex flex-col items-center justify-center text-center !py-32">
    <motion.h1
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-display text-7xl font-bold gradient-text"
    >
      404
    </motion.h1>
    <p className="mt-4 max-w-sm text-slate-500 dark:text-slate-400">
      We couldn't find that page. It may have been moved or never existed.
    </p>
    <Link to="/" className="btn-primary mt-6">
      <FiArrowLeft /> Back home
    </Link>
  </div>
);

export default NotFound;
