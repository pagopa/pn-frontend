import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Typography } from '@mui/material';
import { PnWizard, PnWizardStep, usePreviousLocation } from '@pagopa-pn/pn-commons';

import LegalContactManager, {
  DigitalDomicileManagementAction,
} from '../../components/Contacts/LegalContactManager';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import DigitalContactActivation from './DigitalContactActivation';

const DigitalContactManagement: React.FC = () => {
  const { t } = useTranslation(['recapiti', 'common']);
  const { navigateToPreviousLocation } = usePreviousLocation();
  const [currentAction, setCurrentAction] = useState<DigitalDomicileManagementAction>(
    DigitalDomicileManagementAction.DEFAULT
  );
  const { defaultPECAddress, defaultSERCQ_SENDAddress } = useAppSelector(
    contactsSelectors.selectAddresses
  );

  const hasSercqSendActive = !!defaultSERCQ_SENDAddress;
  const isValidatingPec = defaultPECAddress?.pecValid === false;

  const isDigitalDomicileActive = !isValidatingPec && (hasSercqSendActive || defaultPECAddress);

  // Prevent the user from accessing the management page while digital domicile is not active or PEC is validating
  useEffect(() => {
    if (!isDigitalDomicileActive) {
      navigateToPreviousLocation();
    }
  }, []);

  const getPreviouButton = () => (
    <Button
      onClick={navigateToPreviousLocation}
      color="primary"
      size="medium"
      sx={{ mx: 'auto' }}
      variant="outlined"
    >
      {t('button.indietro', { ns: 'common' })}
    </Button>
  );

  if (currentAction === DigitalDomicileManagementAction.DIGITAL_DOMICILE_TRANSFER) {
    return <DigitalContactActivation isTransferring />;
  } else if (currentAction === DigitalDomicileManagementAction.ADD_SPECIAL_CONTACT) {
    // TODO: return the addSpecialContact when its refactor is done
    return <></>;
  }

  return (
    <PnWizard
      title={
        <Typography fontSize="28px" fontWeight={700}>
          {t('legal-contacts.digital-domicile-management.title')}
        </Typography>
      }
      slots={{
        prevButton: getPreviouButton,
        nextButton: () => <></>,
      }}
      slotsProps={{
        stepContainer: { sx: { p: 0, mb: '20px', mt: 3 } },
      }}
    >
      <PnWizardStep>
        <LegalContactManager setAction={setCurrentAction} />
      </PnWizardStep>
    </PnWizard>
  );
};

export default DigitalContactManagement;
