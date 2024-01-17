export declare enum WaitForElementResult {
    DOM_ELEMENT_ALREADY_EXISTS = "DOM_ELEMENT_ALREADY_EXISTS",
    DOM_ELEMENT_FOUND = "DOM_ELEMENT_FOUND"
}
/** Waits for existing element in DOM
 * @param {string} selector The selector to observe
 *
 * @example
 * // waits for myQuerySelector to be injected in the DOM.
 * waitForElem('.myQuerySelector').then(() => successCbk());
 */
export declare function waitForElement(selector: string): Promise<unknown>;
