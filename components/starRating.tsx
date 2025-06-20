import { FaRegStar, FaStar } from "react-icons/fa";

export const StarRating: React.FC<{
  editable?: boolean;
  value: number;
  onChange?: (value: number) => void;
}> = ({ editable = false, value, onChange }) => {
  const handleClick = (index: number) => {
    if (editable && onChange) {
      onChange(index + 1);
    }
  };

  return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, index) => {
          const filledPercentage = Math.max(0, Math.min(1, value - index));
          return (
            <div
              key={index}
              className={`relative transition-transform duration-200 ${editable ? "hover:scale-110" : ""}`}
              onClick={() => handleClick(index)}
              style={{ cursor: editable ? "pointer" : "default" }}
            >
              {/* Пустая звезда (фон) */}
              <FaRegStar 
                size={40}
                className="text-yellow-400"
              />

              {/* Заполненная часть звезды */}
              <div
                className="absolute top-0 left-0 transition-all duration-300"
                style={{
                  width: `${filledPercentage * 100}%`,
                  overflow: "hidden"
                }}
              >
                <FaStar 
                  size={40}
                  className="text-yellow-400"
                />
              </div>
            </div>
          );
        })}
      </div>
  );
};
