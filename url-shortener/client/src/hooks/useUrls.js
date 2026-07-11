import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchUrls, deleteUrl as deleteUrlApi, toggleFavorite as toggleFavoriteApi } from '../utils/api';

/**
 * Centralizes dashboard state: fetching, search, sort, pagination,
 * delete, and favorite-toggling, so pages stay declarative.
 */
const useUrls = ({ pageSize = 8, favoritesOnly = false } = {}) => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchUrls({
        search,
        sort,
        page,
        limit: pageSize,
        favorites: favoritesOnly ? 'true' : undefined,
      });
      setUrls(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, sort, page, pageSize, favoritesOnly]);

  useEffect(() => {
    load();
  }, [load]);

  const removeUrl = async (id) => {
    const previous = urls;
    setUrls((prev) => prev.filter((u) => u._id !== id));
    try {
      await deleteUrlApi(id);
      toast.success('Link deleted');
      load();
    } catch (err) {
      setUrls(previous);
      toast.error(err.message);
    }
  };

  const toggleFavorite = async (id) => {
    setUrls((prev) => prev.map((u) => (u._id === id ? { ...u, isFavorite: !u.isFavorite } : u)));
    try {
      await toggleFavoriteApi(id);
    } catch (err) {
      toast.error(err.message);
      load();
    }
  };

  return {
    urls,
    loading,
    search,
    setSearch: (v) => {
      setPage(1);
      setSearch(v);
    },
    sort,
    setSort: (v) => {
      setPage(1);
      setSort(v);
    },
    page,
    setPage,
    pagination,
    removeUrl,
    toggleFavorite,
    refresh: load,
  };
};

export default useUrls;
