import { Children, ReactElement, isValidElement } from 'react';

import { useIsMobile } from '../../../hooks/useIsMobile';
import { SlotProps, Sort } from '../../../models/PnTable';
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

type Props<T> = {
  children: React.ReactNode;
  /** SmartTable test id */
  testId?: string;
  /** Table title used in aria-label */
  ariaTitle?: string;
  /** current sort value */
  sort?: Sort<T>;
  /** the function to be invoked if the user change sorting */
  onChangeSorting?: (sort: Sort<T>) => void;
  /** Components props */
  slotProps?: SlotProps;
};

const calcTestId = (suffix: string, testId?: string): string | undefined =>
  testId ? `${testId}${suffix}` : undefined;

const SmartData = <T,>({
  children,
  testId,
  ariaTitle,
  sort,
  onChangeSorting,
  slotProps,
}: Props<T>) => {
  const isMobile = useIsMobile();
  const suffix = isMobile ? 'Mobile' : 'Desktop';

  const header = Children.toArray(children).find(
    (child) => (child as JSX.Element).type === SmartHeader
  ) as ReactElement;

  const body = Children.toArray(children).find(
    (child) => (child as JSX.Element).type === SmartBody
  ) as ReactElement;

  if (isMobile) {
    return (
      <PnCardsList>
        {Children.map(body.props.children, (card: ReactElement | null) => {
          if (!card || card.type !== SmartBodyRow) {
            return;
          }
          // carHeader are those SmartBodyCell with flag isCardHeader set to true
          const cardHeader = Children.toArray(card.props.children).filter(
            (child) =>
              isValidElement(child) && child.type === SmartBodyCell && child.props.isCardHeader
          ) as Array<ReactElement>;
          // cardBody are those SmartBodyCell with flag isCardHeader set to false
          const cardBody = Children.toArray(card.props.children).filter(
            (child) =>
              isValidElement(child) && child.type === SmartBodyCell && !child.props.isCardHeader
          ) as Array<ReactElement>;
          // cardActions are children of type SmartActions
          const cardActions = Children.toArray(card.props.children).find(
            (child) => isValidElement(child) && child.type === SmartActions
          ) as ReactElement;
          return (
            <PnCard key={card.props.id} testId={calcTestId(suffix, testId)}>
              {cardHeader.length > 0 && (
                <PnCardHeader testId={calcTestId(suffix, header.props.testId)}>
                  {cardHeader.map((headerItem) => (
                    <PnCardHeaderItem
                      key={headerItem.key}
                      {...headerItem.props.cardProps}
                      testId={calcTestId(suffix, headerItem.props.testId)}
                    >
                      {headerItem.props.children}
                    </PnCardHeaderItem>
                  ))}
                </PnCardHeader>
              )}
              <PnCardContent testId={calcTestId(suffix, body.props.testId)}>
                {cardBody.map((contentItem) => {
                  if (contentItem.props.hideInCard) {
                    return;
                  }
                  const label = Children.toArray(header.props.children).find(
                    (child) =>
                      isValidElement(child) && child.props.columnId === contentItem.props.columnId
                  ) as ReactElement;
                  return (
                    <PnCardContentItem
                      key={contentItem.key}
                      label={label ? label.props.children : null}
                      {...contentItem.props.cardProps}
                      testId={calcTestId(suffix, contentItem.props.testId)}
                    >
                      {contentItem.props.children}
                    </PnCardContentItem>
                  );
                })}
              </PnCardContent>
              {cardActions && <PnCardActions>{cardActions.props.children}</PnCardActions>}
            </PnCard>
          );
        })}
      </PnCardsList>
    );
  }

  return (
    <PnTable testId={calcTestId(suffix, testId)} ariaTitle={ariaTitle} slotProps={slotProps}>
      <PnTableHeader testId={calcTestId(suffix, header.props.testId)}>
        {Children.map(
          header.props.children,
          (headerCell: ReactElement | null) =>
            headerCell?.type === SmartHeaderCell && (
              <PnTableHeaderCell
                key={headerCell.key}
                {...headerCell.props}
                testId={calcTestId(suffix, headerCell.props.testId)}
                sort={sort}
                handleClick={onChangeSorting}
              >
                {headerCell.props.children}
              </PnTableHeaderCell>
            )
        )}
      </PnTableHeader>
      <PnTableBody testId={calcTestId(suffix, body.props.testId)}>
        {Children.map(
          body.props.children,
          (bodyRow: ReactElement | null) =>
            bodyRow?.type === SmartBodyRow && (
              <PnTableBodyRow
                key={bodyRow.key}
                {...bodyRow.props}
                testId={calcTestId(suffix, bodyRow.props.testId)}
              >
                {Children.map(
                  bodyRow.props.children,
                  (bodyCell: ReactElement | null) =>
                    bodyCell?.type === SmartBodyCell && (
                      <PnTableBodyCell
                        key={bodyCell.key}
                        {...bodyCell.props.tableProps}
                        testId={calcTestId(suffix, bodyCell.props.testId)}
                      >
                        {bodyCell.props.children}
                      </PnTableBodyCell>
                    )
                )}
              </PnTableBodyRow>
            )
        )}
      </PnTableBody>
    </PnTable>
  );
};

export default SmartData;
