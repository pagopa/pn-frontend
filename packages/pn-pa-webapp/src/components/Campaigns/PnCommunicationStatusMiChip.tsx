import { useTranslation } from 'react-i18next';

import { InformalNotificationStatus } from '@pagopa-pn/pn-commons';
import { MIChip } from '@pagopa/mui-italia';

import { communicationStatusOptions } from '../../models/Campaign';

type Props = {
  status?: InformalNotificationStatus;
};

const PnCommunicationStatusMIChip = ({ status }: Props) => {
  const { t } = useTranslation('campaigns');

  const statusInfo = communicationStatusOptions.find(({ value }) =>
    status ? value.includes(status) : false
  );

  if (!statusInfo) {
    return <MIChip label="-" color="default" />;
  }

  return <MIChip label={t(statusInfo.label)} color={statusInfo.color} />;
};

export default PnCommunicationStatusMIChip;
