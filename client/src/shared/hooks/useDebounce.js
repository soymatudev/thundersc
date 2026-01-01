import { useState, useEffect } from 'react';

/**
 * Hook personalizado para debounce.
 * Retrasa la actualización de un valor hasta que ha pasado un tiempo determinado
 * sin que este haya cambiado.
 *
 * @param {any} value El valor a "debouncear".
 * @param {number} delay El tiempo de retraso en milisegundos.
 * @returns {any} El valor "debounceado".
 */
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
