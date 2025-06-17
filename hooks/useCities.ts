// hooks/useCities.ts
import { useState, useEffect } from 'react';

interface City {
  id: number; // или number, в зависимости от вашего API
  name: string;
  date: string;
}

export const useCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('/api/cities');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return { cities, loading, error };
};