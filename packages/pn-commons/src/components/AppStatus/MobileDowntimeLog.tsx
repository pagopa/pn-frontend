import { useMemo } from 'react';

import { DowntimeLogPage } from '../../models';
import { CardElement, Item } from '../../types';
import ItemsCard from '../Data/ItemsCard';
import ItemsCardBody from '../Data/ItemsCard/ItemsCardBody';
import ItemsCardContent from '../Data/ItemsCard/ItemsCardContent';
import ItemsCardContents from '../Data/ItemsCard/ItemsCardContents';
import ItemsCardHeader from '../Data/ItemsCard/ItemsCardHeader';
import ItemsCardHeaderTitle from '../Data/ItemsCard/ItemsCardHeaderTitle';
import { adaptFieldSpecToMobile, useFieldSpecs } from './downtimeLog.utils';

type Props = {
  downtimeLog: DowntimeLogPage;
  getDowntimeLegalFactDocumentDetails: (legalFactId: string) => any;
};

const MobileDowntimeLog = ({ downtimeLog, getDowntimeLegalFactDocumentDetails }: Props) => {
  const fieldSpecs = useFieldSpecs({ getDowntimeLegalFactDocumentDetails });
  const {
    getDateFieldSpec,
    getFunctionalityFieldSpec,
    getLegalFactIdFieldSpec,
    getStatusFieldSpec,
    getRows,
  } = fieldSpecs;

  const cardHeader: [CardElement, CardElement | null] = useMemo(
    () => [
      {
        ...adaptFieldSpecToMobile(getStatusFieldSpec()),
        label: '',
      },
      null,
    ],
    [getStatusFieldSpec]
  );

  const cardBody: Array<CardElement> = useMemo(
    () => [
      {
        ...adaptFieldSpecToMobile(getDateFieldSpec('startDate', false)),
        notWrappedInTypography: true,
      },
      {
        ...adaptFieldSpecToMobile(getDateFieldSpec('endDate', false)),
        notWrappedInTypography: true,
      },
      adaptFieldSpecToMobile(getFunctionalityFieldSpec()),
      { ...adaptFieldSpecToMobile(getLegalFactIdFieldSpec()), notWrappedInTypography: true },
    ],
    [getDateFieldSpec, getFunctionalityFieldSpec, getLegalFactIdFieldSpec]
  );

  /* eslint-disable-next-line sonarjs/no-identical-functions */
  const rows: Array<Item> = getRows(downtimeLog);

  return (
    <ItemsCard testId="mobileTableDowntimeLog">
      {rows.map((data) => (
        <ItemsCardBody key={data.id}>
          <ItemsCardHeader>
            <ItemsCardHeaderTitle
              cardHeader={cardHeader}
              item={data}
              headerGridProps={{ justifyContent: 'left' }}
            />
          </ItemsCardHeader>
          <ItemsCardContents>
            {cardBody.map((body) => (
              <ItemsCardContent key={body.id} body={body}>
                {body.getLabel(data[body.id], data)}
              </ItemsCardContent>
            ))}
          </ItemsCardContents>
        </ItemsCardBody>
      ))}
    </ItemsCard>
  );
};

export default MobileDowntimeLog;
