export enum Key {
  User = 'user',
}

export function getLocalStorageValue<T>(key: Key): T | null {
  const value = localStorage.getItem(`parking::${key.toString()}`);

  if (value) {
    return JSON.parse(value);
  }

  return null;
}

export function setLocalStorageValue<T>(key: Key, value: T): void {
  const keyString = `parking::${key.toString()}`;

  localStorage.setItem(keyString, JSON.stringify(value));
}
