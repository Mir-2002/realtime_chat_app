import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

export const useUsername = () => {
  const [username, setUsername] = useState("");
  const ANIMALS = [
    "Wolf",
    "Tiger",
    "Eagle",
    "Shark",
    "Panther",
    "Falcon",
    "Dragon",
    "Leopard",
    "Cobra",
    "Hawk",
  ];
  const STORAGE_KEY = "chat_username";

  const generateUsername = () => {
    const word = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    return `Anonymous-${word}-${nanoid(6)}`;
  };
  useEffect(() => {
    const main = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUsername(stored);
        return;
      }
      const newUsername = generateUsername();
      localStorage.setItem(STORAGE_KEY, newUsername);
      setUsername(newUsername);
    };

    main();
  }, []);

  return { username };
};
