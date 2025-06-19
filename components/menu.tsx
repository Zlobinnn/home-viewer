import React from "react";

interface Props {
    className?: string;
    handleAddApartment: () => void;
    showHidden: boolean;
    setShowHidden: (value: boolean) => void;
    activeTab: number;
}

export const Menu: React.FC<Props> = ({ handleAddApartment, showHidden, setShowHidden, activeTab }) => {
    return (
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
    );
};