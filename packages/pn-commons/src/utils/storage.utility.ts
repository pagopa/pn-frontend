// eslint-disable-next-line @typescript-eslint/ban-types
type StorageValue = string | number | object;
type StorageValueType = 'string' | 'number' | 'object';

/** It will delete a key from the session storage. If local is true, it will use the local session storage instead. */
export function storageDelete(key: string, local?: boolean) {
  const storage: Storage = local ? window.localStorage : window.sessionStorage;
  storage.removeItem(key);
}

/** It will store a key/value pair in the session storage. If local is true, it will use the local session storage instead. */
export function storageWrite(
  key: string,
  value: StorageValue,
  type: StorageValueType,
  local?: boolean
) {
  const stringifyFn: { [key in StorageValueType]: () => string } = {
    string: () => value as string,
    number: () => String(value),
    object: () => JSON.stringify(value),
  };

  const stringified = stringifyFn[type]();

  const storage: Storage = local ? window.localStorage : window.sessionStorage;
  storage.setItem(key, stringified);
}

/** It will read a key from the session storage. If local is true, it will use the local session storage instead. */
export function storageRead(key: string, type: StorageValueType, local?: boolean) {
  const storage: Storage = local ? window.localStorage : window.sessionStorage;
  const value: string | null = storage.getItem(key);

  if (value === null) {
    return;
  }

  const parseFn = {
    string: () => value,
    number: () => Number(value),
    object: () => JSON.parse(value),
  };

  return parseFn[type]();
}

export type StorageOps<T> = {
  delete: () => void;
  read: () => T;
  write: (value: T) => void;
};

/** Build an object with a complete set of operation to perform on the same key */
export function storageOpsBuilder<T extends StorageValue>(
  key: string,
  type: StorageValueType,
  local: boolean
): StorageOps<T> {
  return {
    delete: () => storageDelete(key, local),
    read: () => storageRead(key, type, local),
    write: (value) => storageWrite(key, value, type, local),
  };
}
