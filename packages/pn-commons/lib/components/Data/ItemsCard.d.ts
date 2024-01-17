/// <reference types="react" />
import { GridProps, SxProps } from '@mui/material';
import { CardAction, CardElement, Item } from '../../models';
type Props = {
    cardHeader: [CardElement, CardElement | null];
    cardBody: Array<CardElement>;
    cardData: Array<Item>;
    cardActions?: Array<CardAction>;
    /** Custom style */
    sx?: SxProps;
    /** Custom header grid props */
    headerGridProps?: GridProps;
    /** Cards test id */
    testId?: string;
};
declare const ItemsCard: React.FC<Props>;
export default ItemsCard;
