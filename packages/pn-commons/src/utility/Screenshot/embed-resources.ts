/* eslint-disable functional/immutable-data */
import { isDataUrl, makeDataUrl, resourceToDataURL } from './dataurl';
import { getMimeType } from './mimes';
import { Options } from './types';
import { resolveUrl } from './util';

const URL_REGEX = /url\((['"]?)([^'"]+?)\1\)/g;

function toRegex(url: string): RegExp {
  // eslint-disable-next-line no-useless-escape
  const escaped = url.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
  return new RegExp(`(url\\(['"]?)(${escaped})(['"]?\\))`, 'g');
}

export function parseURLs(cssText: string): Array<string> {
  const urls: Array<string> = [];

  cssText.replace(URL_REGEX, (raw, url) => {
    urls.push(url);
    return raw;
  });

  return urls.filter((url) => !isDataUrl(url));
}

export async function embed(
  cssText: string,
  resourceURL: string,
  baseURL: string | null,
  options: Options,
  getContentFromUrl?: (url: string) => Promise<string>
): Promise<string> {
  try {
    const resolvedURL = baseURL ? resolveUrl(resourceURL, baseURL) : resourceURL;
    const contentType = getMimeType(resourceURL);
    // eslint-disable-next-line functional/no-let
    let dataURL: string;
    if (getContentFromUrl) {
      const content = await getContentFromUrl(resolvedURL);
      dataURL = makeDataUrl(content, contentType);
    } else {
      dataURL = await resourceToDataURL(resolvedURL, contentType, options);
    }
    return cssText.replace(toRegex(resourceURL), `$1${dataURL}$3`);
  } catch (error) {
    // pass
  }
  return cssText;
}

function filterPreferredFontFormat(str: string): string {
  return str;
}

export function shouldEmbed(url: string): boolean {
  return url.search(URL_REGEX) !== -1;
}

export async function embedResources(
  cssText: string,
  baseUrl: string | null,
  options: Options
): Promise<string> {
  if (!shouldEmbed(cssText)) {
    return cssText;
  }

  const filteredCSSText = filterPreferredFontFormat(cssText);
  const urls = parseURLs(filteredCSSText);
  return urls.reduce(
    (deferred, url) => deferred.then((css) => embed(css, url, baseUrl, options)),
    Promise.resolve(filteredCSSText)
  );
}
