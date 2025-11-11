import * as React from 'react';

import ThankYouPage from '../components/ThankYouPage';
// <-- aggiorna il path se necessario
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';

type Props = {
  onAssistanceClick: () => void;
};

const UserValidationFailed: React.FC<Props> = ({ onAssistanceClick }) => (
  <ThankYouPage
    outcome="error"
    title={getLocalizedOrDefaultLabel(
      'common',
      'user-validation-failed.title',
      'Validazione utente fallita'
    )}
    description={getLocalizedOrDefaultLabel(
      'common',
      'user-validation-failed.description',
      'Uno o più dati associati alla tua utenza non sono validi.'
    )}
    action={{
      text: getLocalizedOrDefaultLabel(
        'common',
        'user-validation-failed.cta',
        "Contatta l'assistenza"
      ),
      onClick: onAssistanceClick,
    }}
  />
);

export default UserValidationFailed;
