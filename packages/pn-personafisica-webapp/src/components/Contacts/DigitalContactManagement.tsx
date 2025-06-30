import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Typography } from '@mui/material';
import { PnWizard, PnWizardStep } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import LegalContactManager, {
  DigitalDomicileManagementAction,
} from '../../components/Contacts/LegalContactManager';
import { RECAPITI } from '../../navigation/routes.const';
import AddSpecialContact, { AddSpecialContactRef } from './AddSpecialContact';
import DigitalContactActivation from './DigitalContactActivation';

const DigitalContactManagement: React.FC = () => {
  const { t } = useTranslation(['recapiti', 'common']);
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [specialContactError, setSpecialContactError] = useState(false);
  const [currentAction, setCurrentAction] = useState<DigitalDomicileManagementAction>(
    DigitalDomicileManagementAction.DEFAULT
  );

  const addSpecialContactRef = useRef<AddSpecialContactRef>(null);

  const handleConfirmClick = async () => {
    if (addSpecialContactRef.current) {
      await addSpecialContactRef.current.handleConfirm();
    }
  };

  const getPreviouButton = () =>
    currentAction === DigitalDomicileManagementAction.ADD_SPECIAL_CONTACT ? (
      <ButtonNaked
        data-testid="prev-button"
        color={'primary'}
        fullWidth
        sx={{ fontSize: '16px', width: { xs: 'unset', md: 'auto' }, mt: { xs: 3, md: 'unset' } }}
        onClick={() => setCurrentAction(DigitalDomicileManagementAction.DEFAULT)}
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

  const handleSpecialContactAdded = () => {
    setActiveStep(1);
  };

  const handleSpecialContactError = (hasError: boolean) => {
    setSpecialContactError(hasError);
  };

  if (currentAction === DigitalDomicileManagementAction.DIGITAL_DOMICILE_TRANSFER) {
    return (
      <DigitalContactActivation
        isTransferring
        onGoBack={() => setCurrentAction(DigitalDomicileManagementAction.DEFAULT)}
      />
    );
  }

  const title =
    currentAction === DigitalDomicileManagementAction.ADD_SPECIAL_CONTACT
      ? t('legal-contacts.digital-domicile-management.special_contacts.title')
      : t('legal-contacts.digital-domicile-management.title');

  return (
    <PnWizard
      title={
        <Typography fontSize="28px" fontWeight={700}>
          {title}
        </Typography>
      }
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      slots={{
        prevButton: getPreviouButton,
        nextButton:
          currentAction === DigitalDomicileManagementAction.ADD_SPECIAL_CONTACT
            ? undefined
            : () => <></>,
      }}
      slotsProps={{
        stepContainer: { sx: { p: 0, mb: '20px', mt: 3, background: 'transparent' } },
        nextButton: {
          onClick: handleConfirmClick,
          variant: specialContactError ? 'outlined' : 'contained',
          color: specialContactError ? 'error' : 'primary',
        },
        feedback: {
          title: t(`legal-contacts.sercq-send-wizard.feedback.title-transfer`),
          buttonText: t('legal-contacts.sercq-send-wizard.feedback.go-to-contacts'),
          onClick: () => navigate(RECAPITI),
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
