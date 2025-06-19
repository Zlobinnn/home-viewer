import { useEffect, useState } from "react";

export const useToken = () => {
  const [token, setToken] = useState<string | null>(null);

  const generateToken = () => {
    if (crypto.randomUUID) {
      return crypto.randomUUID(); // Современный способ
    }
  
    // Запасной вариант на случай старого браузера
    const array = new Uint32Array(4);
    crypto.getRandomValues(array);
    return Array.from(array, dec => dec.toString(16)).join("-");
  };

  useEffect(() => {
    // Проверяем наличие токена в localStorage
    let savedToken = localStorage.getItem("token");

    if (!savedToken) {
      // Генерация нового токена (можно заменить на uuid)
      savedToken = generateToken();
      localStorage.setItem("token", savedToken);
      console.log("✅ Новый токен создан:", savedToken);
    } else {
      console.log("🔐 Токен найден:", savedToken);
    }

    setToken(savedToken);
  }, []);

  // Функция для выхода (удаление токена)
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    console.log("🚪 Вышли из сессии");
  };

  return { token };
};
