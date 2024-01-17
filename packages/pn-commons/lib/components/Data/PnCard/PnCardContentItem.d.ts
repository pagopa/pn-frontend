import React, { ReactChild, ReactFragment } from 'react';
type Props = {
    children: ReactChild | ReactFragment;
    label: ReactChild | ReactFragment;
    wrapValueInTypography?: boolean;
    testId?: string;
};
declare const PnCardContentItem: React.FC<Props>;
export default PnCardContentItem;
