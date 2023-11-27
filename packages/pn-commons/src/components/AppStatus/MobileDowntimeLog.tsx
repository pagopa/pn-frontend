import { useMemo } from 'react';

import { CardElement, DowntimeLogPage, Item } from '../../models';
import ItemsCard from '../Data/ItemsCard';
import { adaptFieldSpecToMobile, useFieldSpecs } from './downtimeLog.utils';

type Props = {
  downtimeLog: DowntimeLogPage;
  getDowntimeLegalFactDocumentDetails: (legalFactId: string) => any;
  handleTrackDownloadCertificateOpposable3dparties?: () => void;
};

const MobileDowntimeLog = ({
  downtimeLog,
  getDowntimeLegalFactDocumentDetails,
  handleTrackDownloadCertificateOpposable3dparties,
}: Props) => {
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
      {
        ...adaptFieldSpecToMobile(
          getLegalFactIdFieldSpec(handleTrackDownloadCertificateOpposable3dparties)
        ),
        notWrappedInTypography: true,
      },
    ],
    [getDateFieldSpec, getFunctionalityFieldSpec, getLegalFactIdFieldSpec]
  );

  /* eslint-disable-next-line sonarjs/no-identical-functions */
  const rows: Array<Item> = getRows(downtimeLog);

  return (
    <ItemsCard
      cardHeader={cardHeader}
      cardBody={cardBody}
      cardData={rows}
      testId="mobileTableDowntimeLog"
      headerGridProps={{ justifyContent: 'left' }}
    />
  );
};

export default MobileDowntimeLog;
