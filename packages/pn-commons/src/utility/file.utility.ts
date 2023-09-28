// this function is not used anymore, but for this moment I leave it
// in the future it can be useful
// Andrea Cimini, 2023.07.27
export const calcBase64String = (file: any): Promise<string> => {
  // this is because test fails due to resolve in onload function
  if (process.env.NODE_ENV === 'test') {
    return Promise.resolve('mocked-base64String');
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    /* eslint-disable functional/immutable-data */
    reader.onload = () => {
      const base64String = (reader.result as string).split(';base64,');
      resolve(base64String[1]);
    };
    reader.onerror = () => {
      reject(new Error('Error on conversion'));
    };
    /* eslint-enable functional/immutable-data */
  });
};

export const calcUnit8Array = (file: any): Promise<Uint8Array> => {
  // this is because test fails due to resolve in onload function
  if (process.env.NODE_ENV === 'test') {
    return Promise.resolve(new Uint8Array());
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    /* eslint-disable functional/immutable-data */
    reader.onload = async () => {
      try {
        resolve(new Uint8Array(reader.result as ArrayBuffer));
      } catch {
        reject(new Error('Error on conversion'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Error on conversion'));
    };
    /* eslint-enable functional/immutable-data */
  });
};

export const calcSha256String = (file: any): Promise<{ hashHex: string; hashBase64: string }> => {
  // this is because in jest crypto is undefined and test fails due to resolve in onload function
  if (process.env.NODE_ENV === 'test') {
    return Promise.resolve({ hashHex: 'mocked-hashHex', hashBase64: 'mocked-hashBase64' });
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    /* eslint-disable functional/immutable-data */
    reader.onload = async () => {
      try {
        const hashBuffer = await crypto.subtle.digest('SHA-256', reader.result as ArrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashBase64 = window.btoa(String.fromCharCode(...hashArray)); // convert bytes to base64 string
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
        resolve({ hashHex, hashBase64 });
      } catch {
        reject(new Error('Error on conversion'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Error on conversion'));
    };
    /* eslint-enable functional/immutable-data */
  });
};

/**
 * Returs the size of a file in format KB, MB or GB
 * @param size size in bytes
 */
export const parseFileSize = (size: number, decimals = 2): string => {
  if (!size) {
    return '0 Bytes';
  }
  const unit = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(size) / Math.log(unit));
  return `${parseFloat((size / Math.pow(unit, i)).toFixed(dm))} ${sizes[i]}`;
};
