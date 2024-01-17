import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Children, isValidElement } from 'react';
import { useIsMobile } from '../../../hooks';
import PnCard from '../PnCard/PnCard';
import PnCardActions from '../PnCard/PnCardActions';
import PnCardContent from '../PnCard/PnCardContent';
import PnCardContentItem from '../PnCard/PnCardContentItem';
import PnCardHeader from '../PnCard/PnCardHeader';
import PnCardHeaderItem from '../PnCard/PnCardHeaderItem';
import PnCardsList from '../PnCardsList';
import PnTable from '../PnTable';
import PnTableBody from '../PnTable/PnTableBody';
import PnTableBodyCell from '../PnTable/PnTableBodyCell';
import PnTableBodyRow from '../PnTable/PnTableBodyRow';
import PnTableHeader from '../PnTable/PnTableHeader';
import PnTableHeaderCell from '../PnTable/PnTableHeaderCell';
import SmartActions from './SmartActions';
import SmartBody from './SmartBody';
import SmartBodyCell from './SmartBodyCell';
import SmartBodyRow from './SmartBodyRow';
import SmartHeader from './SmartHeader';
import SmartHeaderCell from './SmartHeaderCell';
const calcTestId = (suffix, testId) => testId ? `${testId}${suffix}` : undefined;
const SmartData = ({ children, testId, ariaTitle, sort, onChangeSorting }) => {
    const isMobile = useIsMobile();
    const suffix = isMobile ? 'Mobile' : 'Desktop';
    const header = Children.toArray(children).find((child) => child.type === SmartHeader);
    const body = Children.toArray(children).find((child) => child.type === SmartBody);
    if (isMobile) {
        return (_jsx(PnCardsList, { children: Children.map(body.props.children, (card) => {
                if (!card || card.type !== SmartBodyRow) {
                    return;
                }
                // carHeader are those SmartBodyCell with flag isCardHeader set to true
                const cardHeader = Children.toArray(card.props.children).filter((child) => isValidElement(child) && child.type === SmartBodyCell && child.props.isCardHeader);
                // cardBody are those SmartBodyCell with flag isCardHeader set to false
                const cardBody = Children.toArray(card.props.children).filter((child) => isValidElement(child) && child.type === SmartBodyCell && !child.props.isCardHeader);
                // cardActions are children of type SmartActions
                const cardActions = Children.toArray(card.props.children).find((child) => isValidElement(child) && child.type === SmartActions);
                return (_jsxs(PnCard, { testId: calcTestId(suffix, testId), children: [cardHeader.length > 0 && (_jsx(PnCardHeader, { testId: calcTestId(suffix, header.props.testId), children: cardHeader.map((headerItem) => (_jsx(PnCardHeaderItem, { ...headerItem.props.cardProps, testId: calcTestId(suffix, headerItem.props.testId), children: headerItem.props.children }, headerItem.key))) })), _jsx(PnCardContent, { testId: calcTestId(suffix, body.props.testId), children: cardBody.map((contentItem) => {
                                if (contentItem.props.hideInCard) {
                                    return;
                                }
                                const label = Children.toArray(header.props.children).find((child) => isValidElement(child) && child.props.columnId === contentItem.props.columnId);
                                return (_jsx(PnCardContentItem, { label: label ? label.props.children : null, ...contentItem.props.cardProps, testId: calcTestId(suffix, contentItem.props.testId), children: contentItem.props.children }, contentItem.key));
                            }) }), cardActions && _jsx(PnCardActions, { children: cardActions.props.children })] }, card.props.id));
            }) }));
    }
    return (_jsxs(PnTable, { testId: calcTestId(suffix, testId), ariaTitle: ariaTitle, children: [_jsx(PnTableHeader, { testId: calcTestId(suffix, header.props.testId), children: Children.map(header.props.children, (headerCell) => headerCell?.type === SmartHeaderCell && (_jsx(PnTableHeaderCell, { ...headerCell.props, testId: calcTestId(suffix, headerCell.props.testId), sort: sort, handleClick: onChangeSorting, children: headerCell.props.children }, headerCell.key))) }), _jsx(PnTableBody, { testId: calcTestId(suffix, body.props.testId), children: Children.map(body.props.children, (bodyRow) => bodyRow?.type === SmartBodyRow && (_jsx(PnTableBodyRow, { ...bodyRow.props, testId: calcTestId(suffix, bodyRow.props.testId), children: Children.map(bodyRow.props.children, (bodyCell) => bodyCell?.type === SmartBodyCell && (_jsx(PnTableBodyCell, { ...bodyCell.props.tableProps, testId: calcTestId(suffix, bodyCell.props.testId), children: bodyCell.props.children }, bodyCell.key))) }, bodyRow.key))) })] }));
};
export default SmartData;
