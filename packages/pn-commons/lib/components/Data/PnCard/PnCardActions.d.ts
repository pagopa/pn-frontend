import { ReactChild, ReactFragment } from 'react';
export interface IPnCardActionsProps {
    testId?: string;
    disableSpacing?: boolean;
    children: ReactChild | ReactFragment | Array<ReactChild>;
}
declare const PnCardActions: React.FC<IPnCardActionsProps>;
export default PnCardActions;
