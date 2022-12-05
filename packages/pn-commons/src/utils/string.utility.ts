/**
 * Initial proposal of regex for different kinds of info expressed as strings,
 * the current aim is just to avoid security issues and/or
 * security warnings in the static analysis of the source code.
 * In particular, the one for the phone number could be done *a lot* better.
 * ------------------------
 * Carlos Lombardi, 2022.08.05
 */
export const dataRegex = {
  phoneNumber: /^3\d{2}[. ]??\d{6,7}$/g,
  name: /^[A-Za-zÀ-ÿ\-'" 0-9\.]+$/,
  lettersAndNumbers: /^[A-Za-z0-9]+$/,
  simpleServer: /^[A-Za-z0-9.\-/]+$/, // the server part of an URL, no protocol, no query params
  token: /^[A-Za-z0-9\-._~+/]+$/, // cfr. https://stackoverflow.com/questions/50031993/what-characters-are-allowed-in-an-oauth2-access-token
  fiscalCode:
    /^([A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1})$/i,
  pIva: /^\d{11}$/,
  taxonomyCode: /^(\d{6}[A-Z]{1})$/,
};

/**
 * Returns the input fiscal code formatted as required by API.
 * @param  {string} fiscalCode
 * @returns string
 */
export function formatFiscalCode(fiscalCode: string): string {
  return fiscalCode.toUpperCase();
}

/**
 * Check if the attribute is potentially dangerous
 * @param  {String}  name  The attribute name
 * @param  {String}  value The attribute value
 * @return {Boolean}       If true, the attribute is potentially dangerous
 */
function isPossiblyDangerous(name: string, value: string): boolean {
  const val = value.replace(/\s+/g, '').toLowerCase();
  if (['src', 'href', 'xlink:href'].includes(name)) {
    if (val.includes('javascript:') || val.includes('data:text/html')) return true;
  }
  if (name.startsWith('on')) {
	return true;
  }
  return false;
}

/**
 * Remove potentially dangerous attributes from an element
 * @param  {Element} elem The element
 */
function removeAttributes(elem: Element) {
  // Loop through each attribute
  // If it's dangerous, remove it
  const atts = elem.attributes;
  for (const { name, value } of atts) {
    if (!isPossiblyDangerous(name, value)) continue;
    elem.removeAttribute(name);
  }
}

/**
 * Remove <script> elements
 * @param  {Document} html The HTML
 */
function removeScripts(html: Document) {
  const scripts = html.querySelectorAll('script');
  for (const script of scripts) {
    script.remove();
  }
}

/**
 * Remove dangerous stuff from the HTML document's nodes
 * @param  {Document | Element} html The HTML document
 */
function clean(html: Document | Element) {
  const nodes = html.children;
  for (const node of nodes) {
    removeAttributes(node);
    clean(node);
  }
}

/**
 * Remove dangerous code from a string.
 * @param  {string} srt
 * @returns string
 */
export function sanitizeString(srt: string): string {
  // convert string to html without rendering it
  const parser = new DOMParser();
  const html = parser.parseFromString(srt, 'text/html');
  // remove script
  removeScripts(html);
  // remove malicious attributes
  clean(html);
  // return sanitized string
  return html.body.innerHTML;
}
