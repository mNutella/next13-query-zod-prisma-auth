import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import { parseJson, setSessionStorageItem } from "../utils/helpers";

type SetValue<T> = Dispatch<SetStateAction<T>>;

export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>] {
  const readValue = useCallback(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const itemValue = window.sessionStorage.getItem(key);
      return itemValue ? (parseJson(itemValue) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key ${key}:`, error);
      return initialValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const [storedValue, setStoredValue] = useState(readValue);

  useEffect(() => {
    setValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setValue: SetValue<T> = useCallback(
    (value) => {
      if (typeof window === "undefined") {
        console.warn(
          `Tried setting sessionStorage key “${key}” even though environment is not a client`
        );
      }

      try {
        const newValue = value instanceof Function ? value(storedValue) : value;

        setSessionStorageItem(key, newValue);

        setStoredValue(newValue);

        // TODO: dispatch custom event
      } catch (error) {
        console.warn(`Error reading sessionStorage key ${key}:`, error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );

  return [storedValue, setValue];
}
