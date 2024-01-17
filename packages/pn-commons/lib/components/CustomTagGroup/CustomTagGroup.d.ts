import React from 'react';
interface CustomTagGroupProps {
    /** how many items will be visible */
    visibleItems?: number;
    /** disable tooltip popup on tag +X */
    disableTooltip?: boolean;
    /** callback function when tooltip is opened */
    onOpen?: () => void;
}
declare const CustomTagGroup: React.FC<CustomTagGroupProps>;
export default CustomTagGroup;
