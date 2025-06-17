import React, { useState } from "react";

interface Props {
  onDelete?: (id: string) => Promise<void>;
  onSave?: (data: ApartmentType) => Promise<void>;
  className?: string;
  apartment: ApartmentType;
}

interface ApartmentType {
  id?: number;
  title: string;
  url: string;
  price: number;
  address: string;
  pros: string[];
  cons: string[];
  imageUrl?: string;
  city?: { name: string };
  isFeatured?: boolean;
}

export const ApartmentCard: React.FC<Props> = ({
  apartment,
  onDelete,
  onSave,
  className
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState<ApartmentType>({
    ...apartment,
  });

  const handleInputChange = (field: keyof typeof formData, value: string | string[] | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProsConsChange = (type: 'pros' | 'cons', index: number, value: string) => {
    const updatedItems = [...formData[type]];
    updatedItems[index] = value;
    handleInputChange(type, updatedItems);
  };

  const addItem = (type: 'pros' | 'cons') => {
    handleInputChange(type, [...formData[type], '']);
  };

  const removeItem = (type: 'pros' | 'cons', index: number) => {
    const updatedItems = formData[type].filter((_, i) => i !== index);
    handleInputChange(type, updatedItems);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setShowDeleteConfirm(false);
    if (!isEditing) {
      // Сброс формы при отмене редактирования
      setFormData({
        ...apartment,
      });
    }
  };

  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave({
        ...formData,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    try {
      await onDelete((apartment.id || 0).toString());
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    }
  };

  const formatPrice = (price?: number | null) => {
    if (!price) return "Цена не указана";
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleTitleClick = () => {
    if (!isEditing && formData.url) {
      window.open(formData.url, '_blank');
    }
  };

  return (
    <div 
  className={`relative flex items-start justify-start min-h-[400px] w-full bg-white p-6 rounded-xl shadow-md border border-gray-100 ${className} ${
    apartment.isFeatured ? "opacity-60" : ""
  }`}
>
      {/* Кнопки управления */}
      <div className="absolute top-4 right-4 flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="p-2 rounded-full hover:bg-green-100 transition-colors text-green-600 disabled:opacity-50"
              aria-label="Сохранить"
            >
              {isSaving ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <button
              onClick={toggleEdit}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
              aria-label="Отменить"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {onDelete && (
              <div className="relative">
                <button
                  onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                  className="p-2 rounded-full hover:bg-red-100 transition-colors text-red-500"
                  aria-label="Удалить"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                {showDeleteConfirm && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="p-2 text-sm text-gray-700">
                      <p className="mb-2">Удалить эту квартиру?</p>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                        >
                          Отмена
                        </button>
                        <button
                          onClick={handleDelete}
                          className="px-2 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <button
            onClick={toggleEdit}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-rose-500"
            aria-label="Редактировать"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex flex-col h-full w-[60%] pr-6">
        <div className="flex items-center justify-between mb-4">
          {isEditing ? (
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="text-2xl font-semibold text-gray-900 border-b border-rose-200 focus:border-rose-500 focus:outline-none w-full"
              placeholder="Название квартиры"
            />
          ) : (
            <h2
              className={`text-2xl font-semibold text-gray-900 ${formData.url ? 'cursor-pointer hover:text-rose-600' : ''}`}
              onClick={handleTitleClick}
            >
              {formData.title || "Без названия"}
            </h2>
          )}
          <span className="px-3 py-1 bg-rose-50 text-rose-600 text-sm font-medium rounded-full">
            {apartment.city?.name}
          </span>
        </div>
        <div className="flex-1 bg-gray-50 rounded-lg overflow-hidden">
          {isEditing ? (
            <div className="flex flex-col h-full p-4 space-y-4">
              <div className="w-full">
                <label className="text-gray-500 text-sm">URL квартиры:</label>
                <input
                  type="text"
                  value={formData.url || ''}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  placeholder="https://example.com"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <div className="w-full">
                <label className="text-gray-500 text-sm">URL изображения:</label>
                <input
                  type="text"
                  value={formData.imageUrl || ''}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
            </div>
          ) : formData.imageUrl ? (
            <img
              src={formData.imageUrl}
              alt={formData.title || 'Квартира'}
              className="w-full h-full object-cover hover:cursor-pointer"
              onClick={handleTitleClick}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-500">
              Фотография квартиры
            </div>
          )}
        </div>

        {isEditing && (
          <div className="flex items-center mx-4 my-10">
            <label className="flex items-center gap-2 text-md text-gray-600">
              <input
                type="checkbox"
                className="h-5 w-5"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              />
              Скрыть
            </label>
          </div>
        )}
      </div>

      <div className="flex flex-col h-full w-[40%]">
        <div className="bg-rose-50 p-4 rounded-lg mb-4 border border-rose-100">
          {isEditing ? (
            <>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', Number(e.target.value))}
                className="text-2xl font-bold text-rose-600 mb-1 w-full border-b border-rose-200 focus:border-rose-500 focus:outline-none"
                placeholder="Цена"
              />
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="text-gray-600 font-medium w-full border-b border-rose-200 focus:border-rose-500 focus:outline-none"
                placeholder="Адрес"
              />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-rose-600 mb-1">
                {formatPrice(apartment.price)}
              </div>
              <div className="text-gray-600">
                <span className="font-medium">{formData.address || "Адрес не указан"}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-1 gap-4">
          <div className="flex-1 bg-white p-4 rounded-lg border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-gray-800">Плюсы</h3>
              {isEditing && (
                <button
                  onClick={() => addItem('pros')}
                  className="text-rose-500 text-xs flex items-center hover:text-rose-600"
                >
                  <span className="mr-1">+</span> Добавить
                </button>
              )}
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              {formData.pros.map((pro, index) => (
                <li key={index} className="flex items-start group">
                  <span className="text-rose-500 mr-2">✓</span>
                  {isEditing ? (
                    <div className="flex items-center w-full">
                      <input
                        type="text"
                        value={pro}
                        onChange={(e) => handleProsConsChange('pros', index, e.target.value)}
                        className="w-full border-b border-rose-200 focus:border-rose-500 focus:outline-none"
                        placeholder="Преимущество"
                      />
                      <button
                        onClick={() => removeItem('pros', index)}
                        className="ml-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <span>{pro || <span className="text-gray-400">Не указано</span>}</span>
                  )}
                </li>
              ))}
              {formData.pros.length === 0 && !isEditing && (
                <li className="text-gray-400">Нет преимуществ</li>
              )}
            </ul>
          </div>

          <div className="flex-1 bg-white p-4 rounded-lg border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-gray-800">Минусы</h3>
              {isEditing && (
                <button
                  onClick={() => addItem('cons')}
                  className="text-rose-500 text-xs flex items-center hover:text-rose-600"
                >
                  <span className="mr-1">+</span> Добавить
                </button>
              )}
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              {formData.cons.map((con, index) => (
                <li key={index} className="flex items-start group">
                  <span className="text-gray-500 mr-2">•</span>
                  {isEditing ? (
                    <div className="flex items-center w-full">
                      <input
                        type="text"
                        value={con}
                        onChange={(e) => handleProsConsChange('cons', index, e.target.value)}
                        className="w-full border-b border-rose-200 focus:border-rose-500 focus:outline-none"
                        placeholder="Недостаток"
                      />
                      <button
                        onClick={() => removeItem('cons', index)}
                        className="ml-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <span>{con || <span className="text-gray-400">Не указано</span>}</span>
                  )}
                </li>
              ))}
              {formData.cons.length === 0 && !isEditing && (
                <li className="text-gray-400">Нет недостатков</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};