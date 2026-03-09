import { useState, useEffect, useCallback } from "react";
import { API_BASE } from "../context/AuthContext";

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.search) params.set("search", filters.search);
    if (filters.farmerId) params.set("farmerId", filters.farmerId);

    fetch(`${API_BASE}/products?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setProducts(d.products);
        else setError(d.error);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filters.category, filters.search, filters.farmerId]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}
