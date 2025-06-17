"use client";
import { useCities } from "@/hooks/useCities";
import { useApartments } from "@/hooks/useApartments";
import { useState, useEffect } from "react";
import { ApartmentCard } from "@/components/apartmentCard";

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
    updateApartment
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
      <div className="flex justify-between items-center w-full max-w-4xl mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Каталог квартир</h1>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handleAddApartment}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            disabled={!activeTab}
          >
            Добавить квартиру
          </button>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showHidden}
              onChange={(e) => setShowHidden(e.target.checked)}
              className="rounded text-rose-500 focus:ring-rose-500"
            />
            Показывать скрытые
          </label>
        </div>
      </div>

      {/* Вкладки */}
      <div className="flex gap-2 mb-6 w-full max-w-4xl">
        {cities.map((city) => (
          <button
            key={city.id}
            className={`px-6 py-3 rounded-lg font-medium text-lg transition-colors ${activeTab === city.id
              ? "bg-amber-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => setActiveTab(city.id)}
          >
            <div className="flex flex-col">
              {city.name}
              <div className="text-sm">
                {city.date}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Список квартир */}
      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-4xl">
        {apartmentsLoading ? (
          <div className="text-center py-10">
            {/* Можно заменить на любой спиннер или анимацию загрузки */}
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
            />
          ))
        )}
      </div>
    </div>
  );
}