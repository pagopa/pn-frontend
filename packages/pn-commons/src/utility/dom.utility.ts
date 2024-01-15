// DOM utilities

export enum WaitForElementResult {
  DOM_ELEMENT_ALREADY_EXISTS = 'DOM_ELEMENT_ALREADY_EXISTS',
  DOM_ELEMENT_FOUND = 'DOM_ELEMENT_FOUND',
}

/** Waits for existing element in DOM
 * @param {string} selector The selector to observe
 *
 * @example
 * // waits for myQuerySelector to be injected in the DOM.
 * waitForElem('.myQuerySelector').then(() => successCbk());
 */
export const waitForElement = (selector: string) =>
  new Promise((resolve) => {
    const intervalId = setInterval(() => {
      if (document.querySelector(selector)) {
        clearInterval(intervalId);
        resolve(WaitForElementResult.DOM_ELEMENT_FOUND);
      }
    }, 100);
  });
