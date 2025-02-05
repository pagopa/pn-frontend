import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Box, Typography } from '@mui/material';
import { PnWizard, PnWizardStep } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import LegalContactManager, {
  DigitalDomicileManagementAction,
} from '../../components/Contacts/LegalContactManager';
import { RECAPITI } from '../../navigation/routes.const';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import AddSpecialContact from './AddSpecialContact';
import DigitalContactActivation from './DigitalContactActivation';

interface AddSpecialContactRef {
  handleConfirm: () => Promise<void>;
}

const DigitalContactManagement: React.FC = () => {
  const { t } = useTranslation(['recapiti', 'common']);
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [specialContactError, setSpecialContactError] = useState(false);
  const [currentAction, setCurrentAction] = useState<DigitalDomicileManagementAction>(
    DigitalDomicileManagementAction.DEFAULT
  );
  const { defaultPECAddress, defaultSERCQ_SENDAddress } = useAppSelector(
    contactsSelectors.selectAddresses
  );
  const addSpecialContactRef = useRef<AddSpecialContactRef>(null);

  const handleConfirmClick = async () => {
    if (addSpecialContactRef.current) {
      await addSpecialContactRef.current.handleConfirm();
    }
  };

  const hasSercqSendActive = !!defaultSERCQ_SENDAddress;
  const isValidatingPec = defaultPECAddress?.pecValid === false;

  const isDigitalDomicileActive = !isValidatingPec && (hasSercqSendActive || defaultPECAddress);

  // Prevent the user from accessing the management page while digital domicile is not active or PEC is validating
  useEffect(() => {
    if (!isDigitalDomicileActive) {
      navigate(RECAPITI);
    }
  }, []);

  const getPreviouButton = () =>
    currentAction === DigitalDomicileManagementAction.ADD_SPECIAL_CONTACT ? (
      <ButtonNaked
        data-testid="prev-button"
        color={'primary'}
        fullWidth
        sx={{ fontSize: '16px', width: { xs: 'unset', md: 'auto' } }}
        onClick={handleSpecialContactDiscard}
        variant="naked"
      >
        {t('button.indietro', { ns: 'common' })}
      </ButtonNaked>
    ) : (
      <ButtonNaked
        onClick={() => navigate(-1)}
        color="primary"
        size="medium"
        sx={{ fontSize: '16px', width: { xs: 'unset', md: 'auto' }, mx: 'auto' }}
      >
        {t('button.indietro', { ns: 'common' })}
      </ButtonNaked>
    );

  const handleSpecialContactDiscard = () => {
    setCurrentAction(DigitalDomicileManagementAction.DEFAULT);
  };

  const handleSpecialContactAdded = () => {
    setActiveStep(1);
  };

  const handleSpecialContactError = (hasError: boolean) => {
    setSpecialContactError(hasError);
  };

  if (currentAction === DigitalDomicileManagementAction.DIGITAL_DOMICILE_TRANSFER) {
    return <DigitalContactActivation isTransferring />;
  }

  const title =
    currentAction === DigitalDomicileManagementAction.ADD_SPECIAL_CONTACT
      ? t('legal-contacts.digital-domicile-management.special_contacts.title', { ns: 'recapiti' })
      : t('legal-contacts.digital-domicile-management.title');

  return (
    <PnWizard
      activeStep={activeStep}
      title={
        <Typography fontSize="28px" fontWeight={700}>
          {title}
        </Typography>
      }
      slots={{
        stepContainer: Box,
        prevButton: getPreviouButton,
        nextButton:
          currentAction === DigitalDomicileManagementAction.ADD_SPECIAL_CONTACT
            ? undefined
            : () => <></>,
      }}
      slotsProps={{
        stepContainer: { sx: { p: 0, mb: '20px', mt: 3 } },
        nextButton: {
          onClick: () => handleConfirmClick(),
          variant: specialContactError ? 'outlined' : 'contained',
          color: specialContactError ? 'error' : 'primary',
        },
        feedback: {
          title: t(`legal-contacts.sercq-send-wizard.feedback.title-transfer`),
          buttonText: t('legal-contacts.sercq-send-wizard.feedback.back-to-contacts'),
          onClick: () => navigate(-1),
        },
      }}
    >
      <PnWizardStep>
        {currentAction === DigitalDomicileManagementAction.ADD_SPECIAL_CONTACT ? (
          <AddSpecialContact
            ref={addSpecialContactRef}
            handleError={handleSpecialContactError}
            handleContactAdded={handleSpecialContactAdded}
          />
        ) : (
          <LegalContactManager setAction={setCurrentAction} />
        )}
      </PnWizardStep>
    </PnWizard>
  );
};

export default DigitalContactManagement;
