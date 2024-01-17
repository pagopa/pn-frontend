/// <reference types="react" />
import { SxProps } from '@mui/material';
import { PaginationData } from '../../models/Pagination';
type Props = {
    /** The actual paginationData */
    paginationData: PaginationData;
    /** The function to be invoked if the user change paginationData */
    onPageRequest: (r: PaginationData) => void;
    /** The list of numbers of the elements per page */
    elementsPerPage?: Array<number>;
    /** an array containing pages to show */
    pagesToShow?: Array<number>;
    /** custom style */
    sx?: SxProps;
    /** event tracking function callback for page size */
    eventTrackingCallbackPageSize?: (pageSize: number) => void;
    /** hide size selector */
    hideSizeSelector?: boolean;
};
/** Selfcare custom table available pages component */
export default function CustomPagination({ paginationData, onPageRequest, elementsPerPage, pagesToShow, sx, eventTrackingCallbackPageSize, hideSizeSelector, }: Props): JSX.Element;
export {};
