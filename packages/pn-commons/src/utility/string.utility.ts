/**
 * Initial proposal of regex for different kinds of info expressed as strings,
 * the current aim is just to avoid security issues and/or
 * security warnings in the static analysis of the source code.
 * In particular, the one for the phone number could be done *a lot* better.
 * ------------------------
 * Carlos Lombardi, 2022.08.05
 */
export const dataRegex = {
  phoneNumber: /^3\d{8,9}$/g,
  // was /^3\d{2}[. ]??\d{6,7}$/g before, but BE (for courtesy addresses) do not accept the space
  // between the former three digits and the rest,
  // so that the simple thing to do is not to accept it in the FE neither
  // ------------------------------------
  // Carlos Lombardi, 2023.01.23

  phoneNumberWithItalyPrefix: /^\+393\d{8,9}$/g,
  // in the modiifcation of a SMS courtesy address, the phone number is edited
  // prefixed with the Italy intl. prefix +39
  // (since it comes from BE as such, and to keep it untouched for the modification is the simplest thing to do)
  // ------------------------------------
  // Carlos Lombardi, 2023.01.23

  name: /^[A-Za-zÀ-ÿ\-'" 0-9\.]+$/,
  publicKeyName: /^[a-zA-Z0-9-\\s]+$/i,
  lettersAndNumbers: /^[A-Za-z0-9]+$/,
  // this for string that have numbers, characters, - and _
  lettersNumbersAndDashs: /^[A-Za-z0-9-_]+$/,
  noSpaceAtEdges: /^[^\s].*[^\s]$|^[^\s]$|^$/,
  htmlPageUrl: /^(?:http|https):\/\/[a-z0-9._?=\-/]+$/i,
  simpleServer: /^[A-Za-z0-9.\-/]+$/, // the server part of an URL, no protocol, no query params
  token: /^[A-Za-z0-9\-._~+/=]+$/, // cfr. https://stackoverflow.com/questions/50031993/what-characters-are-allowed-in-an-oauth2-access-token
  fiscalCode:
    /^([A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1})$/i,
  pIva: /^\d{11}$/,
  pIvaAndFiscalCode:
    /^\d{11}$|^([A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1})$/i,
  isoDate: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d{1,3})?)Z$/,
  taxonomyCode: /^(\d{6}[A-Z]{1})$/,
  denomination: /^([\x20-\xFF]{1,80})$/,
  denominationSearch: /([\x20-\xFF]*)/g,
  noticeCode: /^\d{18}$/,
  zipCode: /^(\w|\ |\-)*$/,
  email:
    /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x21\x23-\x5b\x5d-\x7f]|\\[\x20-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x21-\x5a\x53-\x7f]|\\[\x20-\x7f])+)\])$/,

  // Email RegEx pattern has been updated due to PN-7586 requests
  //
  // Nicola Giornetta 2023.09.20
  //
  // ===============================================================================================================
  //
  // We adopt a regex to validate email addresses, which is stricter than the one adopted by the BE
  // the difference being that other special characters besides dash and underscore are allowed BE-side.
  // We will raise the issue to the test team.
  // The regex specifies a list of chunks separated by dot, dash or underscore before the at symbol,
  // and another, analogous list, but allowing as separators only dot or dash, after the at symbol.
  // The chunks allow Latin, unaccented letters and digits only.
  // The number of chunks is limited (11 before the at, 12 after it) to be coherent with the BE, which establishes this limitation
  // in order to avoid the risk of backtrack explosion.
  // Of course, the at symbol is mandatory, as well as a final dot after it, so that the last separator must be a dot (and not a dash).
  // The last chunk must have length 2 to 10.
  //
  // There is one case in which we choose not to adopt this email regex pattern, but instead rely on
  // a more liberal specification.
  // Namely, this is the case for the email address that comes as part of the logged user data
  // in the response to token exchange.
  // Cfr. the comment in src/utility/user.utility.ts
  // ------------------------------------
  // Carlos Lombardi, 2023.01.24
  currency: /^(?:\d*(?:[.,]\d{1,2})?)$/,
  maxOneEuro: /^(?:0(?:[.,]\d*)?|1(?:[.,]0*)?)$/,
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
  if (
    ['src', 'href', 'xlink:href'].includes(name) &&
    (val.includes('javascript:') || val.includes('data:text/html'))
  ) {
    return true;
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
    if (!isPossiblyDangerous(name, value)) {
      continue;
    }
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
  // the textContent return only the text, so if we have a srt = "<p>Hello</p>"" the return value will be "Hello"
  // i18next by default converts string like the previous one in "&lt;p&gt;Hello&lt&#x2F;p&gt", so is not possible to have a result string with html tags
  // for this reason, this solution doesn't bring a loss of functionality, but instead it can increase the security against malicious code
  // Andrea Cimini, 2023.07.12
  return html.body.textContent ?? '';
}

/**
 * Convert string in base64
 * @param str input string
 * @returns base64 string
 */
export function fromStringToBase64(str: string): string {
  if (str.length === 0) {
    return '';
  }
  return window.btoa(str);
}
