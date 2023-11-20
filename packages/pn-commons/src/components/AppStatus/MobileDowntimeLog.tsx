import { useMemo } from 'react';

import { CardElement, Downtime, DowntimeLogPage } from '../../models';
import PnCard from '../Data/PnCard/PnCard';
import PnCardContent from '../Data/PnCard/PnCardContent';
import PnCardContentItem from '../Data/PnCard/PnCardContentItem';
import PnCardHeader from '../Data/PnCard/PnCardHeader';
import PnCardHeaderTitle from '../Data/PnCard/PnCardHeaderItem';
import PnCardsList from '../Data/PnCardsList';
import { DowntimeCell, useFieldSpecs } from './downtimeLog.utils';

type Props = {
  downtimeLog: DowntimeLogPage;
  getDowntimeLegalFactDocumentDetails: (legalFactId: string) => any;
};

const MobileDowntimeLog = ({ downtimeLog, getDowntimeLegalFactDocumentDetails }: Props) => {
  const fieldSpecs = useFieldSpecs();
  const { getField, getRows } = fieldSpecs;

  const cardHeader: CardElement<Downtime> = useMemo(() => getField('status'), [getField]);

  const cardBody: Array<CardElement<Downtime>> = useMemo(
    () => [
      {
        ...getField('startDate'),
        wrappedInTypography: false,
      },
      {
        ...getField('endDate'),
        wrappedInTypography: true,
      },
      getField('knownFunctionality'),
      { ...getField('legalFactId'), wrappedInTypography: false },
    ],
    [getField]
  );

  const rows = getRows(downtimeLog);

  return (
    <PnCardsList testId="mobileTableDowntimeLog">
      {rows.map((row) => (
        <PnCard key={row.id}>
          <PnCardHeader>
            <PnCardHeaderTitle
              key={cardHeader.id}
              gridProps={cardHeader.gridProps}
              position={cardHeader.position}
            >
              <DowntimeCell
                row={row}
                column={cardHeader}
                inTwoLines
                getDowntimeLegalFactDocumentDetails={getDowntimeLegalFactDocumentDetails}
              />
            </PnCardHeaderTitle>
          </PnCardHeader>
          <PnCardContent>
            {cardBody.map((body) => (
              <PnCardContentItem
                key={body.id}
                wrappedInTypography={body.wrappedInTypography}
                label={body.label}
              >
                <DowntimeCell
                  row={row}
                  column={body}
                  inTwoLines={false}
                  getDowntimeLegalFactDocumentDetails={getDowntimeLegalFactDocumentDetails}
                />
              </PnCardContentItem>
            ))}
          </PnCardContent>
        </PnCard>
      ))}
    </PnCardsList>
  );
};

export default MobileDowntimeLog;
