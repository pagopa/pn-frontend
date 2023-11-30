import { useMemo } from 'react';

import { useFieldSpecs } from '../../hooks/useFieldSpecs';
import { CardElement, Downtime, DowntimeLogPage } from '../../models';
import PnCard from '../Data/PnCard/PnCard';
import PnCardContent from '../Data/PnCard/PnCardContent';
import PnCardContentItem from '../Data/PnCard/PnCardContentItem';
import PnCardHeader from '../Data/PnCard/PnCardHeader';
import PnCardHeaderItem from '../Data/PnCard/PnCardHeaderItem';
import PnCardsList from '../Data/PnCardsList';
import DowntimeLogDataSwitch from './DowntimeLogDataSwitch';

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
        wrapValueInTypography: false,
      },
      {
        ...getField('endDate'),
        wrapValueInTypography: false,
      },
      getField('knownFunctionality'),
      { ...getField('legalFactId'), wrapValueInTypography: false },
    ],
    [getField]
  );

  const rows = getRows(downtimeLog);

  return (
    <PnCardsList testId="mobileTableDowntimeLog">
      {rows.map((row) => (
        <PnCard key={row.id} testId="mobileTableDowntimeLog.cards">
          <PnCardHeader>
            <PnCardHeaderItem
              key={cardHeader.id}
              gridProps={cardHeader.gridProps}
              testId={'cardHeaderLeft'}
            >
              <DowntimeLogDataSwitch
                data={row}
                type={cardHeader.id}
                inTwoLines
                getDowntimeLegalFactDocumentDetails={getDowntimeLegalFactDocumentDetails}
              />
            </PnCardHeaderItem>
          </PnCardHeader>
          <PnCardContent>
            {cardBody.map((body) => (
              <PnCardContentItem
                key={body.id}
                wrapValueInTypography={body.wrapValueInTypography}
                label={body.label}
                testId="cardBody"
              >
                <DowntimeLogDataSwitch
                  data={row}
                  type={body.id}
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
