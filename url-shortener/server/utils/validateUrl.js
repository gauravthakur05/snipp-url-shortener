/**
 * Validates that a string is a well-formed http(s) URL.
 * Kept dependency-free so it behaves predictably across Node versions.
 */
const isValidUrl = (value) => {
  if (!value || typeof value !== 'string') return false;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validates a custom alias: 3-30 chars, letters/numbers/hyphens/underscores only.
 */
const isValidAlias = (alias) => /^[a-zA-Z0-9_-]{3,30}$/.test(alias);

export { isValidUrl, isValidAlias };
