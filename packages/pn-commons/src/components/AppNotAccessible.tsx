import { Typography } from '@mui/material';
import { IllusInProgress } from '@pagopa/mui-italia';

import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
import FeedbackPage from './FeedbackPage';

export type AppNotAccessibleReason = 'not-accessible' | 'user-validation-failed';

type Props = {
  onAction: () => void;
  reason?: AppNotAccessibleReason;
};

const AppNotAccessible: React.FC<Props> = ({ onAction, reason = 'not-accessible' }) => {
  const isNotAccessible = reason === 'not-accessible';

  const title = getLocalizedOrDefaultLabel(
    'common',
    isNotAccessible ? 'not-accessible.title' : 'user-validation-failed.title'
  );

  const description = isNotAccessible ? (
    <>
      <Typography variant="body1" color="text.primary" display="inline">
        {getLocalizedOrDefaultLabel('common', 'not-accessible.description')}
      </Typography>
      &nbsp;
      <Typography
        variant="body1"
        color="primary"
        display="inline"
        fontWeight="700"
        sx={{ cursor: 'pointer', textDecoration: 'underline' }}
        onClick={onAction}
        data-testid="goToLanding-link"
      >
        {`${getLocalizedOrDefaultLabel('common', 'not-accessible.action')}.`}
      </Typography>
    </>
  ) : (
    getLocalizedOrDefaultLabel('common', 'user-validation-failed.description')
  );

  const slotProps = isNotAccessible ? { headingIcon: <IllusInProgress /> } : undefined;

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
      slots={slotProps}
      action={action}
    />
  );
};

export default AppNotAccessible;
