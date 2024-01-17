import { Children, isValidElement } from 'react';
function getForbiddenMsg(parentCmp, cmpCount) {
    // eslint-disable-next-line functional/no-let
    let forbiddenTypeMessage = `${parentCmp} can have only`;
    Object.entries(cmpCount).forEach((el, index, arr) => {
        const seprator = index === arr.length - 1 ? ' and' : ',';
        forbiddenTypeMessage += `${index === 0 ? '' : seprator}${el[1].maxCount ? ' ' + el[1].maxCount : ''} ${el[1].maxCount === 1 ? 'child' : 'children'} of type ${el[0]}`;
    });
    return forbiddenTypeMessage;
}
function getCountError(cmpCount, parentCmp) {
    for (const [key, value] of Object.entries(cmpCount)) {
        if ((value.required && value.currentCount === 0) ||
            (value.maxCount && value.currentCount > value.maxCount)) {
            throw new Error(`${parentCmp} can have only ${value.maxCount} ${value.maxCount === 1 ? 'child' : 'children'} of type ${key}`);
        }
    }
}
/**
 * Check if component has valid children
 * @param children list of children
 * @param allowedTypes array of obect with allowed children types, required flag and maxCount for each component
 * @param parentCmp name of parent component (this is for error message)
 */
function checkChildren(children, allowedTypes, parentCmp) {
    const allowedCmp = allowedTypes.map((type) => type.cmp);
    const cmpCount = allowedTypes.reduce((obj, type) => {
        // eslint-disable-next-line functional/immutable-data
        obj[type.cmp.name] = {
            maxCount: type.maxCount,
            currentCount: 0,
            required: type.required,
        };
        return obj;
    }, {});
    const forbiddenTypeMessage = getForbiddenMsg(parentCmp, cmpCount);
    // check on children
    Children.forEach(children, (element) => {
        // element is null when we have condition like {condition && <Component />}
        if (element === null) {
            return;
        }
        if (!isValidElement(element) || allowedCmp.findIndex((el) => element.type === el) === -1) {
            throw new Error(forbiddenTypeMessage);
        }
        if (typeof element.type !== 'string') {
            // eslint-disable-next-line functional/immutable-data
            cmpCount[element.type.name].currentCount += 1;
        }
    });
    getCountError(cmpCount, parentCmp);
}
export default checkChildren;
