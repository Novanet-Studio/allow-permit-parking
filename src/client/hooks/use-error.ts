import { useState } from 'react';

// export type UseErrorHook<T> = {
//   error: T | null;
//   updateError: (params: T) => void;
// }

export type UseErrorHook<T> = [
  error: T,
  updateError: (params: T) => void,
];

export default function useError<T>(
  initial: T,
): UseErrorHook<T> {
  const [error, setError] = useState<T | null>(initial);

  const updateError = (params: T) => {
    setError(params);
    setTimeout(() => setError(initial), 3000);
  };

  return [error, updateError];
}
