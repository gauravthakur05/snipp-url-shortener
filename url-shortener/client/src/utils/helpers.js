/**
 * Quick client-side check before hitting the API — the backend still
 * re-validates, this just gives instant feedback in the UI.
 */
export const isLikelyValidUrl = (value) => {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return 'Never';
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const formatNumber = (num = 0) => new Intl.NumberFormat('en-US').format(num);

export const truncate = (str = '', max = 50) =>
  str.length > max ? `${str.slice(0, max)}…` : str;

/**
 * Builds a CSV file from the links array and triggers a browser download.
 */
export const exportToCsv = (urls) => {
  const headers = ['Title', 'Original URL', 'Short URL', 'Clicks', 'Created At', 'Last Visited'];
  const rows = urls.map((u) => [
    u.title || '',
    u.originalUrl,
    u.shortUrl,
    u.clicks,
    new Date(u.createdAt).toISOString(),
    u.lastVisited ? new Date(u.lastVisited).toISOString() : '',
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `links-export-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
