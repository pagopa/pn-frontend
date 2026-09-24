import { useTranslation } from 'react-i18next';

import { DraftsOutlined, MarkEmailReadOutlined } from '@mui/icons-material';
import { Tag } from '@pagopa/mui-italia';

const PnCommunicationOutcomeTag = ({
  outcomes,
}: {
  outcomes?: {
    viewed?: boolean;
    delivered?: boolean;
  };
}) => {
  const { t } = useTranslation('campaigns');

  if (outcomes?.viewed) {
    return (
      <Tag
        icon={DraftsOutlined}
        value={t('detail.communications.outcomes.viewed')}
        variant="default"
        slotProps={{
          icon: {
            // TODO prendere colore da palette
            color: '#427940',
          },
        }}
      />
    );
  }

  if (outcomes?.delivered) {
    return (
      <Tag
        icon={MarkEmailReadOutlined}
        value={t('detail.communications.outcomes.delivered')}
        variant="default"
        slotProps={{
          icon: {
            // TODO prendere colore da palette
            color: '#427940',
          },
        }}
      />
    );
  }

  return (
    <Tag
      value="-"
      variant="default"
      aria-label={String(t('detail.communications.outcomes.not-available'))}
    />
  );
};

export default PnCommunicationOutcomeTag;
