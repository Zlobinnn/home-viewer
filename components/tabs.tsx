import React from "react";

interface City {
  id: number; // или number, в зависимости от вашего API
  name: string;
  date: string;
}

interface Props {
    className?: string;
    cities: City[];
    activeTab: number;
    setActiveTab: (id: number) => void;
}

export const Tabs: React.FC<Props> = ({ cities, activeTab, setActiveTab }) => {
    return (
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
    );
};