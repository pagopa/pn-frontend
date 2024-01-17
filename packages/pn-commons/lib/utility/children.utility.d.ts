/// <reference types="react" />
type AllowedTypes = {
    cmp: React.FC<any>;
    maxCount?: number;
    required?: boolean;
};
/**
 * Check if component has valid children
 * @param children list of children
 * @param allowedTypes array of obect with allowed children types, required flag and maxCount for each component
 * @param parentCmp name of parent component (this is for error message)
 */
declare function checkChildren(children: React.ReactNode, allowedTypes: Array<AllowedTypes>, parentCmp: string): void;
export default checkChildren;
