"use client";
import { useCities } from "@/hooks/useCities";
import { useApartments } from "@/hooks/useApartments";
import { useState, useEffect } from "react";
import { ApartmentCard } from "@/components/apartmentCard";
import { Menu } from "@/components/menu";
import { Tabs } from "@/components/tabs";

export default function Home() {
  const { cities, loading: citiesLoading, error: citiesError } = useCities();
  const [activeTab, setActiveTab] = useState<number>(1);
  const [showHidden, setShowHidden] = useState<boolean>(false);

  const {
    apartments,
    loading: apartmentsLoading,
    error: apartmentsError,
    addApartment,
    deleteApartment,
    updateApartment,
    getAverageRating,
    rateApartment,
  } = useApartments(activeTab);

  // Установим активную вкладку после загрузки городов
  useEffect(() => {
    if (cities.length > 0 && !activeTab) {
      setActiveTab(cities[0].id);
    }
  }, [cities, activeTab]);

  const handleAddApartment = async () => {
    const newApartment = {
      title: "Новая квартира",
      url: "",
      price: 0,
      address: "",
      pros: [],
      cons: [],
      cityId: activeTab,
    };

    try {
      await addApartment(newApartment);
    } catch (err) {
      console.error("Ошибка при добавлении квартиры:", err);
    }
  };

  // Фильтрация квартир в зависимости от состояния чекбокса
  const filteredApartments = showHidden
    ? apartments
    : apartments.filter(apartment => !apartment.isFeatured);

  if (citiesLoading) {
    return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
  }

  if (citiesError) {
    return <div className="flex justify-center items-center h-screen text-red-500">Ошибка: {citiesError}</div>;
  }

  if (apartmentsError) {
    return <div className="flex justify-center items-center h-screen text-red-500">Ошибка квартир: {apartmentsError}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Заголовок и кнопка добавления */}
      <Menu handleAddApartment={handleAddApartment} showHidden={showHidden} setShowHidden={setShowHidden} activeTab={activeTab} />

      {/* Вкладки */}
      <Tabs cities={cities} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Список квартир */}
      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-4xl">
        {apartmentsLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto flex items-center justify-center">
              <span className="text-2xl">🍆</span><span className="text-2xl">🍆</span>
            </div>
            <p className="mt-2 text-gray-500">Загрузка данных...</p>
          </div>
        ) : filteredApartments.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Нет квартир в выбранном городе
          </div>
        ) : (
          filteredApartments.map((apartment) => (
            <ApartmentCard
              key={apartment.id}
              apartment={apartment}
              onDelete={() => deleteApartment(apartment.id || 0)}
              onSave={(data) => updateApartment(data)}
              rateApartment={rateApartment}
              getAverageRating={getAverageRating}
            />
          ))
        )}
      </div>
    </div>
  );
}