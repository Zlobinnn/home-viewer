// hooks/useApartments.ts
import { useState, useEffect } from 'react';

interface ApartmentType {
  id?: number;
  title: string;
  url: string;
  price: number;
  address: string;
  pros: string[];
  cons: string[];
  city?: { name: string };
}

export const useApartments = (cityId?: number) => {
  const [apartments, setApartments] = useState<ApartmentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const url = `/api/apartments?cityId=${cityId}`

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

    fetchApartments();
  }, [cityId]);

  const addApartment = async (newApartment: ApartmentType) => {
    try {
      const response = await fetch('/api/apartments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newApartment),
      });
      const data = await response.json();
      setApartments(prev => [...prev, data]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add apartment');
    }
  };

  const updateApartment = async (updatedData: ApartmentType) => {
    try {
      // Преобразуем price в число, если он строковый
      const dataToSend = {
        ...updatedData,
        price: Number(updatedData.price), // Принудительно преобразуем в number
      };

      const response = await fetch(`/api/apartments/${updatedData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), // Отправляем исправленные данные
      });

      if (!response.ok) {
        throw new Error('Failed to update apartment');
      }

      const updatedApartment = await response.json();

      setApartments(prev =>
        prev.map(apt =>
          apt.id === updatedData.id ? { ...apt, ...updatedApartment } : apt
        )
      );

      return updatedApartment;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update apartment');
    }
  };

  const deleteApartment = async (id: number) => {
    try {
      await fetch(`/api/apartments/${id}`, {
        method: 'DELETE',
      });
      setApartments(prev => prev.filter(apt => apt.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete apartment');
    }
  };

  return {
    apartments,
    loading,
    error,
    addApartment,
    updateApartment,
    deleteApartment
  };
};