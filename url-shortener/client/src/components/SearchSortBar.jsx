import { FiSearch, FiDownload, FiStar } from 'react-icons/fi';

const sortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'clicks', label: 'Most clicked' },
];

const SearchSortBar = ({ search, onSearch, sort, onSort, onExport, favoritesOnly, onToggleFavoritesOnly }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 sm:max-w-sm">
        <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by URL or title…"
          className="input-field !pl-10 !py-2.5 text-sm"
          aria-label="Search links"
        />
      </div>

      <div className="flex items-center gap-2">
        {onToggleFavoritesOnly && (
          <button
            onClick={onToggleFavoritesOnly}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
              favoritesOnly
                ? 'border-amber-300 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/30'
                : 'border-slate-200 dark:border-white/10 text-slate-500'
            }`}
          >
            <FiStar size={14} fill={favoritesOnly ? 'currentColor' : 'none'} />
            Favorites
          </button>
        )}

        <select
          value={sort}
          onChange={(e) => onSort(e.target.value)}
          className="input-field !w-auto !py-2.5 text-sm"
          aria-label="Sort links"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {onExport && (
          <button onClick={onExport} className="btn-secondary !px-4 !py-2.5 text-sm">
            <FiDownload size={14} /> Export CSV
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchSortBar;
