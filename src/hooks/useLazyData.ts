import { useState, useEffect, useCallback } from 'react';

interface UseLazyDataOptions<T> {
  fetchFn: () => Promise<T>;
  dependencies?: any[];
  delay?: number;
}

export const useLazyData = <T>({ 
  fetchFn, 
  dependencies = [], 
  delay = 0 
}: UseLazyDataOptions<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading data');
    } finally {
      setLoading(false);
    }
  }, [fetchFn, delay]);

  useEffect(() => {
    loadData();
  }, [loadData, ...dependencies]);

  const refetch = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refetch
  };
};