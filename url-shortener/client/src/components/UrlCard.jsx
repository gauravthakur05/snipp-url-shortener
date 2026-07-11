import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiCopy,
  FiCheck,
  FiTrash2,
  FiStar,
  FiExternalLink,
  FiBarChart2,
  FiGrid,
  FiLock,
  FiClock,
} from 'react-icons/fi';
import { formatDate, formatNumber, truncate } from '../utils/helpers';
import QRCodeModal from './QRCodeModal';
import ConfirmDialog from './ConfirmDialog';

const UrlCard = ({ url, onDelete, onToggleFavorite, index = 0 }) => {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url.shortUrl);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date();

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.35, delay: index * 0.03 }}
        className="glass-card group rounded-2xl p-5 transition-shadow hover:shadow-glow"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={url.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-base font-semibold gradient-text hover:underline"
              >
                {url.shortUrl.replace(/^https?:\/\//, '')}
              </a>
              {url.password && (
                <span title="Password protected" className="text-amber-500">
                  <FiLock size={13} />
                </span>
              )}
              {isExpired && (
                <span className="rounded-full bg-red-100 dark:bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-500">
                  Expired
                </span>
              )}
            </div>
            <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400" title={url.originalUrl}>
              {truncate(url.originalUrl, 60)}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
              <span>Created {formatDate(url.createdAt)}</span>
              <span className="flex items-center gap-1">
                <FiBarChart2 size={12} /> {formatNumber(url.clicks)} clicks
              </span>
              {url.expiresAt && (
                <span className="flex items-center gap-1">
                  <FiClock size={12} /> Expires {formatDate(url.expiresAt)}
                </span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            <button
              onClick={() => onToggleFavorite(url._id)}
              aria-label={url.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                url.isFavorite
                  ? 'border-amber-300 bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:border-amber-500/30'
                  : 'border-slate-200 dark:border-white/10 text-slate-400 hover:text-amber-500'
              }`}
            >
              <FiStar size={15} fill={url.isFavorite ? 'currentColor' : 'none'} />
            </button>

            <Link
              to={`/analytics/${url._id}`}
              aria-label="View analytics"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 hover:text-brand-purple transition-colors"
            >
              <FiBarChart2 size={15} />
            </Link>

            <button
              onClick={() => setQrOpen(true)}
              aria-label="Show QR code"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 hover:text-brand-purple transition-colors"
            >
              <FiGrid size={15} />
            </button>

            <a
              href={url.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open original URL"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 hover:text-brand-purple transition-colors"
            >
              <FiExternalLink size={15} />
            </a>

            <button
              onClick={handleCopy}
              aria-label="Copy short URL"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 hover:text-brand-purple transition-colors"
            >
              {copied ? <FiCheck size={15} className="text-emerald-500" /> : <FiCopy size={15} />}
            </button>

            <button
              onClick={() => setConfirmOpen(true)}
              aria-label="Delete link"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 dark:border-red-500/20 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <FiTrash2 size={15} />
            </button>
          </div>
        </div>
      </motion.div>

      <QRCodeModal open={qrOpen} onClose={() => setQrOpen(false)} url={url.shortUrl} />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this link?"
        description="This can't be undone. The short link will stop working immediately."
        confirmLabel="Delete"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          onDelete(url._id);
          setConfirmOpen(false);
        }}
      />
    </>
  );
};

export default UrlCard;
