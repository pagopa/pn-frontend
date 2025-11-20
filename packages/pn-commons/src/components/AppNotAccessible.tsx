import { Trans } from 'react-i18next';

import { Typography } from '@mui/material';
import { IllusInProgress } from '@pagopa/mui-italia';

import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
import FeedbackPage from './FeedbackPage';

type AppNotAccessibleVariant = 'not-accessible' | 'user-validation-failed';

type Props = {
  onAction: () => void;
  variant?: AppNotAccessibleVariant;
};

const AppNotAccessible: React.FC<Props> = ({ onAction, variant = 'not-accessible' }) => {
  const isNotAccessible = variant === 'not-accessible';

  const title = getLocalizedOrDefaultLabel(
    'common',
    isNotAccessible ? 'not-accessible.title' : 'user-validation-failed.title'
  );

  const description = isNotAccessible ? (
    <Trans
      ns="common"
      i18nKey="not-accessible.description"
      components={[
        <Typography key="text" variant="body1" color="text.primary" display="inline" />,
        <Typography
          key="link"
          variant="body1"
          color="primary"
          display="inline"
          fontWeight="700"
          sx={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={onAction}
          data-testid="assistance-button"
        />,
      ]}
    />
  ) : (
    getLocalizedOrDefaultLabel('common', 'user-validation-failed.description')
  );

  const slotProps = isNotAccessible ? { icon: <IllusInProgress /> } : undefined;

  const action = isNotAccessible
    ? undefined
    : {
        text: getLocalizedOrDefaultLabel('common', 'user-validation-failed.cta'),
        onClick: onAction,
      };

  return (
    <FeedbackPage
      outcome="error"
      title={title}
      description={description}
      slotProps={slotProps}
      action={action}
    />
  );
};

export default AppNotAccessible;
