/* eslint-disable functional/immutable-data */

/* eslint-disable functional/no-let */
import { Options } from './types';

function getContentFromDataUrl(dataURL: string) {
  return dataURL.split(/,/)[1];
}

export function isDataUrl(url: string) {
  return url.search(/^(data:)/) !== -1;
}

export function makeDataUrl(content: string, mimeType: string) {
  return `data:${mimeType};base64,${content}`;
}

export async function fetchAsDataURL<T>(
  url: string,
  process: (data: { result: string; res: Response }) => T
): Promise<T> {
  const res = await fetch(url);
  if (res.status === 404) {
    throw new Error(`Resource "${res.url}" not found`);
  }
  const blob = await res.blob();
  return new Promise<T>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onloadend = () => {
      try {
        resolve(process({ res, result: reader.result as string }));
      } catch (error) {
        console.log(`${error}`);
      }
    };

    reader.readAsDataURL(blob);
  });
}

const cache: { [url: string]: string } = {};

function getCacheKey(url: string, contentType: string | undefined) {
  let key = url.replace(/\?.*/, '');

  // font resource
  if (/ttf|otf|eot|woff2?/i.test(key)) {
    key = key.replace(/.*\//, '');
  }

  return contentType ? `[${contentType}]${key}` : key;
}

export async function resourceToDataURL(
  resourceUrl: string,
  contentType: string | undefined,
  options: Options
) {
  const cacheKey = getCacheKey(resourceUrl, contentType);

  if (cache[cacheKey] != null) {
    return cache[cacheKey];
  }

  return getDataUrl(resourceUrl, contentType, options, cacheKey);
}

async function getDataUrl(
  resourceUrl: string,
  contentType: string | undefined,
  options: Options,
  cacheKey: string
): Promise<string> {
  let dataURL: string;
  try {
    const content = await fetchAsDataURL(resourceUrl, ({ res, result }) => {
      if (!contentType) {
        // eslint-disable-next-line no-param-reassign
        contentType = res.headers.get('Content-Type') ?? '';
      }
      return getContentFromDataUrl(result);
    });
    dataURL = makeDataUrl(content, contentType!);
  } catch (error: any) {
    dataURL = options.imagePlaceholder ?? '';

    let msg = `Failed to fetch resource: ${resourceUrl}`;
    if (error) {
      msg = typeof error === 'string' ? error : error.message;
    }

    if (msg) {
      console.warn(msg);
    }
  }

  cache[cacheKey] = dataURL;
  return dataURL;
}
