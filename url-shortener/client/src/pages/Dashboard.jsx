import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiLink2, FiMousePointer, FiActivity, FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useUrls from '../hooks/useUrls';
import { fetchOverview } from '../utils/api';
import { exportToCsv, formatNumber } from '../utils/helpers';
import UrlShortenerForm from '../components/UrlShortenerForm';
import UrlCard from '../components/UrlCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import SearchSortBar from '../components/SearchSortBar';
import Pagination from '../components/Pagination';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [overview, setOverview] = useState({ totalLinks: 0, totalClicks: 0, activeLinks: 0 });

  const {
    urls,
    loading,
    search,
    setSearch,
    sort,
    setSort,
    page,
    setPage,
    pagination,
    removeUrl,
    toggleFavorite,
    refresh,
  } = useUrls({ pageSize: 8, favoritesOnly });

  const loadOverview = () => {
    fetchOverview()
      .then((res) => setOverview(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    loadOverview();
  }, [urls]);

  // Keyboard shortcut: "n" opens the new-link form, "Esc" closes it.
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
      if (!typing && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setShowForm(true);
      }
      if (e.key === 'Escape') setShowForm(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleExport = () => {
    if (!urls.length) {
      toast.error('Nothing to export yet.');
      return;
    }
    exportToCsv(urls);
    toast.success('CSV export started');
  };

  return (
    <div className="section-padding !pt-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage every link you've created, in one place.
            </p>
          </div>
          <button onClick={() => setShowForm((v) => !v)} className="btn-primary self-start sm:self-auto">
            {showForm ? <FiX /> : <FiPlus />}
            {showForm ? 'Close' : 'New link'}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={FiLink2} label="Total Links" value={formatNumber(overview.totalLinks)} />
          <StatCard icon={FiMousePointer} label="Total Clicks" value={formatNumber(overview.totalClicks)} delay={0.05} />
          <StatCard icon={FiActivity} label="Active Links" value={formatNumber(overview.activeLinks)} delay={0.1} />
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6">
                <UrlShortenerForm
                  onCreated={() => {
                    refresh();
                    loadOverview();
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8">
          <SearchSortBar
            search={search}
            onSearch={setSearch}
            sort={sort}
            onSort={setSort}
            onExport={handleExport}
            favoritesOnly={favoritesOnly}
            onToggleFavoritesOnly={() => setFavoritesOnly((v) => !v)}
          />
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : urls.length === 0 ? (
            <EmptyState
              title={search ? 'No matching links' : 'No links yet'}
              description={
                search
                  ? 'Try a different search term.'
                  : 'Click "New link" to shorten your first URL and see it appear here.'
              }
            />
          ) : (
            <AnimatePresence mode="popLayout">
              {urls.map((url, idx) => (
                <UrlCard
                  key={url._id}
                  url={url}
                  index={idx}
                  onDelete={removeUrl}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default Dashboard;
