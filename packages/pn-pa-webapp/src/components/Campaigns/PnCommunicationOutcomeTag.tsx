import { useTranslation } from 'react-i18next';

import { DraftsOutlined, MarkEmailReadOutlined } from '@mui/icons-material';
import { useTheme } from '@mui/material';
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
  const theme = useTheme();

  const getTagProps = () => {
    if (outcomes?.viewed) {
      return {
        icon: DraftsOutlined,
        value: t('detail.communications.outcomes.viewed'),
      };
    }

    if (outcomes?.delivered) {
      return {
        icon: MarkEmailReadOutlined,
        value: t('detail.communications.outcomes.delivered'),
      };
    }

    return {
      value: '-',
      'aria-label': String(t('detail.communications.outcomes.not-available')),
    };
  };

  const tagProps = getTagProps();

  return (
    <Tag
      {...tagProps}
      variant="default"
      slotProps={{
        icon: {
          color: theme.colors.success[700],
        },
      }}
    />
  );
};

export default PnCommunicationOutcomeTag;
