// DOM utilities
export var WaitForElementResult;
(function (WaitForElementResult) {
    WaitForElementResult["DOM_ELEMENT_ALREADY_EXISTS"] = "DOM_ELEMENT_ALREADY_EXISTS";
    WaitForElementResult["DOM_ELEMENT_FOUND"] = "DOM_ELEMENT_FOUND";
})(WaitForElementResult || (WaitForElementResult = {}));
/** Waits for existing element in DOM
 * @param {string} selector The selector to observe
 *
 * @example
 * // waits for myQuerySelector to be injected in the DOM.
 * waitForElem('.myQuerySelector').then(() => successCbk());
 */
export function waitForElement(selector) {
    return new Promise((resolve) => {
        if (document.querySelector(selector)) {
            return resolve(WaitForElementResult.DOM_ELEMENT_ALREADY_EXISTS);
        }
        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                return resolve(WaitForElementResult.DOM_ELEMENT_FOUND);
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}
