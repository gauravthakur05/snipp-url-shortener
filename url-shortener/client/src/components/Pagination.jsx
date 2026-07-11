import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1
  );

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-40"
      >
        <FiChevronLeft size={15} />
      </button>

      {pageNumbers.map((n, idx) => (
        <span key={n} className="flex items-center">
          {idx > 0 && n - pageNumbers[idx - 1] > 1 && <span className="px-1 text-slate-400">…</span>}
          <button
            onClick={() => onPageChange(n)}
            aria-current={n === page ? 'page' : undefined}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              n === page
                ? 'bg-brand-gradient text-white shadow-glow'
                : 'border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
            }`}
          >
            {n}
          </button>
        </span>
      ))}

      <button
        onClick={() => onPageChange(Math.min(pages, page + 1))}
        disabled={page === pages}
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-40"
      >
        <FiChevronRight size={15} />
      </button>
    </nav>
  );
};

export default Pagination;
