import { useState, useEffect, useCallback } from "react";

/**
 * Hook générique pour les appels API avec gestion loading / error / data.
 *
 * @param {Function} apiFn   - fonction API à appeler
 * @param {Array}    deps    - dépendances pour re-fetch (optionnel)
 * @param {boolean}  immediate - exécuter immédiatement (default: true)
 */
export default function useApi(apiFn, deps = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFn, ...deps]);

  useEffect(() => {
    if (immediate) {
      // Prevent unhandled promise rejections in effects.
      execute().catch(() => null);
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, setData };
}
