import { useState, useEffect, useCallback } from "react";

/**
 * useRouter — lightweight hash-based router (no external dependencies).
 * Works by reading/writing window.location.hash.
 * Usage: const { route, navigate } = useRouter();
 */
export function useRouter() {
  const [route, setRoute] = useState(
    () => window.location.hash.replace("#", "") || "/"
  );

  useEffect(() => {
    const handler = () =>
      setRoute(window.location.hash.replace("#", "") || "/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = useCallback((path) => {
    window.location.hash = path;
  }, []);

  return { route, navigate };
}
