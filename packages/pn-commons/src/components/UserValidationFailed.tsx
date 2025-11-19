import * as React from 'react';

import FeedbackPage from '../components/FeedbackPage';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';

type Props = {
  onAssistanceClick: () => void;
};

const UserValidationFailed: React.FC<Props> = ({ onAssistanceClick }) => (
  <FeedbackPage
    outcome="error"
    title={getLocalizedOrDefaultLabel('common', 'user-validation-failed.title')}
    description={getLocalizedOrDefaultLabel('common', 'user-validation-failed.description')}
    action={{
      text: getLocalizedOrDefaultLabel('common', 'user-validation-failed.cta'),
      onClick: onAssistanceClick,
    }}
  />
);

export default UserValidationFailed;
