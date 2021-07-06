import { useState } from 'react';

import type { ChangeEvent } from 'react';

export interface UseGenerateInputHook<T> {
  inputs: T[] | null;
  handleInputChange: (
    event: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => void;
  handleRemove: (index: number) => void;
  handleClick: () => void;
  reset: () => void;
}

export default function useGenerateInput<T>(
  initial: T,
): UseGenerateInputHook<T> {
  const [inputs, setInputs] = useState<T[] | null>(null);

  const reset = () => setInputs(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { name, value } = e.currentTarget;
    const list = [...inputs];
    list[index][name] = value;
    setInputs(list);
  };

  const handleRemove = (index: number) => {
    const list = [...inputs];
    list.splice(index, 1);
    setInputs(list);
  };

  const handleClick = () => {
    inputs?.length ? setInputs([...inputs, initial]) : setInputs([initial]);
  };

  return {
    inputs,
    handleInputChange,
    handleClick,
    handleRemove,
    reset,
  };
}
