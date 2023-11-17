import { useMemo } from 'react';

import { CardElement, Downtime, DowntimeLogPage } from '../../models';
import ItemsCard from '../Data/ItemsCard';
import ItemsCardBody from '../Data/ItemsCard/ItemsCardBody';
import ItemsCardContent from '../Data/ItemsCard/ItemsCardContent';
import ItemsCardContents from '../Data/ItemsCard/ItemsCardContents';
import ItemsCardHeader from '../Data/ItemsCard/ItemsCardHeader';
import ItemsCardHeaderTitle from '../Data/ItemsCard/ItemsCardHeaderTitle';
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
        notWrappedInTypography: true,
      },
      {
        ...getField('endDate'),
        notWrappedInTypography: true,
      },
      getField('knownFunctionality'),
      { ...getField('legalFactId'), notWrappedInTypography: true },
    ],
    [getField]
  );

  /* eslint-disable-next-line sonarjs/no-identical-functions */
  const rows = getRows(downtimeLog);

  return (
    <ItemsCard testId="mobileTableDowntimeLog">
      {rows.map((row) => (
        <ItemsCardBody key={row.id}>
          <ItemsCardHeader>
            <ItemsCardHeaderTitle
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
            </ItemsCardHeaderTitle>
          </ItemsCardHeader>
          <ItemsCardContents>
            {cardBody.map((body) => (
              <ItemsCardContent key={body.id} body={body}>
                <DowntimeCell
                  row={row}
                  column={body}
                  inTwoLines
                  getDowntimeLegalFactDocumentDetails={getDowntimeLegalFactDocumentDetails}
                />
              </ItemsCardContent>
            ))}
          </ItemsCardContents>
        </ItemsCardBody>
      ))}
    </ItemsCard>
  );
};

export default MobileDowntimeLog;
