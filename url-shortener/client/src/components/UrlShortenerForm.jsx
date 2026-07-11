import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiLink2, FiCopy, FiCheck, FiSettings, FiLoader } from 'react-icons/fi';
import { shortenUrl } from '../utils/api';
import { isLikelyValidUrl } from '../utils/helpers';
import QRCodeModal from './QRCodeModal';

/**
 * The primary "paste a link, get a short one" widget. Used on the
 * homepage hero and can be reused anywhere a quick-shorten box is needed.
 */
const UrlShortenerForm = ({ onCreated }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLikelyValidUrl(originalUrl)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await shortenUrl({
        originalUrl,
        customAlias: customAlias || undefined,
        password: password || undefined,
        expiresAt: expiresAt || undefined,
      });
      setResult(res.data);
      toast.success(res.reused ? 'You already shortened this link!' : 'Short link created!');
      onCreated?.(res.data);
      setCustomAlias('');
      setPassword('');
      setExpiresAt('');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <FiLink2 className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="Paste a long URL — https://example.com/your-really-long-link"
              className="input-field !pl-11"
              aria-label="Long URL to shorten"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary shrink-0">
            {loading ? (
              <>
                <FiLoader className="animate-spin" /> Shortening…
              </>
            ) : (
              'Shorten URL'
            )}
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-brand-purple transition-colors"
          >
            <FiSettings size={13} /> Advanced options
          </button>
          {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        </div>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 grid grid-cols-1 gap-3 border-t border-slate-100 dark:border-white/10 pt-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Custom alias
                  </label>
                  <input
                    type="text"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    placeholder="my-brand"
                    className="input-field !py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Password (optional)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="input-field !py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Expires on
                  </label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="input-field !py-2 text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass-card mt-4 flex flex-col items-center justify-between gap-4 rounded-2xl p-5 sm:flex-row"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Your short link</p>
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate font-display text-lg font-semibold gradient-text"
              >
                {result.shortUrl}
              </a>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button onClick={() => setQrOpen(true)} className="btn-secondary !px-4 !py-2 text-sm">
                QR Code
              </button>
              <button onClick={handleCopy} className="btn-primary !px-4 !py-2 text-sm">
                {copied ? <FiCheck /> : <FiCopy />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {result && <QRCodeModal open={qrOpen} onClose={() => setQrOpen(false)} url={result.shortUrl} />}
    </div>
  );
};

export default UrlShortenerForm;
