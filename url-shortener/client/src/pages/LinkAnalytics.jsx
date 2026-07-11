import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FiArrowLeft, FiMousePointer, FiClock, FiCalendar, FiCopy, FiLock } from 'react-icons/fi';
import { fetchAnalytics } from '../utils/api';
import { formatDate, formatDateTime, truncate } from '../utils/helpers';
import StatCard from '../components/StatCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const LinkAnalytics = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics(id)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(data.shortUrl);
    toast.success('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="section-padding !pt-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="skeleton h-8 w-52" />
          <div className="skeleton h-40 w-full rounded-2xl" />
          <div className="skeleton h-72 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="section-padding !pt-10 text-center">
        <p className="text-slate-500">{error || 'Link not found.'}</p>
        <Link to="/dashboard" className="btn-secondary mt-4 inline-flex">
          <FiArrowLeft /> Back to dashboard
        </Link>
      </div>
    );
  }

  const chartData = {
    labels: data.series.map((s) =>
      new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Clicks',
        data: data.series.map((s) => s.clicks),
        borderColor: '#7C3AED',
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 260);
          gradient.addColorStop(0, 'rgba(124,58,237,0.35)');
          gradient.addColorStop(1, 'rgba(124,58,237,0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#4F46E5',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: 'rgba(148,163,184,0.15)' } },
    },
  };

  return (
    <div className="section-padding !pt-10">
      <div className="mx-auto max-w-4xl">
        <Link to="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-purple">
          <FiArrowLeft /> Back to dashboard
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold gradient-text truncate">{data.shortUrl}</h1>
                {data.hasPassword && <FiLock className="shrink-0 text-amber-500" size={16} title="Password protected" />}
              </div>
              <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400" title={data.originalUrl}>
                {truncate(data.originalUrl, 80)}
              </p>
            </div>
            <button onClick={handleCopy} className="btn-secondary !px-4 !py-2 text-sm">
              <FiCopy size={14} /> Copy
            </button>
          </div>
        </motion.div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={FiMousePointer} label="Total Clicks" value={data.clicks} />
          <StatCard icon={FiClock} label="Last Visited" value={formatDateTime(data.lastVisited)} delay={0.05} />
          <StatCard icon={FiCalendar} label="Created" value={formatDate(data.createdAt)} delay={0.1} />
        </div>

        <div className="glass-card mt-6 rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold">Clicks — last 14 days</h2>
          <div className="mt-4 h-72">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkAnalytics;
