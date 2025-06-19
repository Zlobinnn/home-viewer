// hooks/useApartments.ts
import { useState, useEffect } from 'react';

interface RatingType {
  id: number;
  userToken: string;
  rating: number;
  apartmentId: number;
  createdAt: string;
  updatedAt: string;
  ratings?: RatingType[];
}

interface ApartmentType {
  id?: number;
  title: string;
  url: string;
  price: number;
  address: string;
  pros: string[];
  cons: string[];
  city?: { name: string };
  isFeatured?: boolean;
}

export const useApartments = (cityId?: number) => {
  const [apartments, setApartments] = useState<ApartmentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApartments = async () => {
    try {
      setLoading(true);
      const url = `/api/apartments${cityId ? `?cityId=${cityId}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setApartments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, [cityId]);

  const addApartment = async (newApartment: ApartmentType) => {
    try {
      setLoading(true);
      const response = await fetch('/api/apartments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newApartment),
      });
      if (!response.ok) {
        throw new Error('Failed to add apartment');
      }
      await fetchApartments(); // Перезапрашиваем список после добавления
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add apartment');
    }
  };

  const updateApartment = async (updatedData: ApartmentType) => {
    try {
      setLoading(true);
      const dataToSend = {
        ...updatedData,
        price: Number(updatedData.price),
      };

      const response = await fetch(`/api/apartments/${updatedData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Failed to update apartment');
      }

      await fetchApartments(); // Перезапрашиваем список после обновления
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update apartment');
    }
  };

  const deleteApartment = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/apartments/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete apartment');
      }
      await fetchApartments(); // Перезапрашиваем список после удаления
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete apartment');
    }
  };

  const getAverageRating = (ratings: RatingType[] = []) => {
    if (ratings.length === 0) return null;
    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    return total / ratings.length;
  };

  const rateApartment = async (apartmentId: number, rating: number, userToken: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/ratings', {
        method: 'POST', // или PUT, если хотите обновлять
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apartmentId,
          rating,
          userToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to rate apartment');
      }

      await fetchApartments(); // Обновим список, чтобы подтянуть рейтинг
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to rate apartment');
    } finally {
      setLoading(false);
    }
  };


  return {
    apartments,
    loading,
    error,
    addApartment,
    updateApartment,
    deleteApartment,
    rateApartment,
    getAverageRating
  };
};