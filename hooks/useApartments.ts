// hooks/useApartments.ts
import { useState, useEffect } from 'react';

export interface Apartment {
  id: string;
  url?: string;
  title?: string;
  price?: number;
  address?: string;
  cityId: string;
  pros: string[];
  cons: string[];
  imageUrl?: string;
}

export const useApartments = (cityId?: string) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const url = cityId 
          ? `/api/apartments?cityId=${cityId}`
          : '/api/apartments';
        
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

  const addApartment = async (newApartment: Omit<Apartment, 'id'>) => {
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

  const updateApartment = async (updatedData: Partial<Apartment>) => {
    try {
      const response = await fetch(`/api/apartments/${updatedData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
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

  const deleteApartment = async (id: string) => {
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