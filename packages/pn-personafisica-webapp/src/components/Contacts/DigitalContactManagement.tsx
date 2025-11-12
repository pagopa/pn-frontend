import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Typography } from '@mui/material';
import { EventAction, PnWizard, PnWizardStep } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import LegalContactManager, {
  DigitalDomicileManagementAction,
} from '../../components/Contacts/LegalContactManager';
import { PFEventsType } from '../../models/PFEventsType';
import { ChannelType } from '../../models/contacts';
import { RECAPITI } from '../../navigation/routes.const';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import AddSpecialContact, { AddSpecialContactRef } from './AddSpecialContact';
import DigitalContactActivation from './DigitalContactActivation';

const DigitalContactManagement: React.FC = () => {
  const { t } = useTranslation(['recapiti', 'common']);
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [currentAction, setCurrentAction] = useState<DigitalDomicileManagementAction>(
    DigitalDomicileManagementAction.DEFAULT
  );
  const { legalAddresses, addresses } = useAppSelector(contactsSelectors.selectAddresses);

  const addSpecialContactRef = useRef<AddSpecialContactRef>(null);
  const lastAddedMetaRef = useRef<{ channelType: ChannelType; senderName: string } | null>(null);

  useEffect(() => {
    if (currentAction === DigitalDomicileManagementAction.DEFAULT) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_DIGITAL_DOMICILE_MANAGEMENT, {
        legal_addresses: legalAddresses,
        event_type: EventAction.SCREEN_VIEW,
      });
    }
  }, [currentAction]);

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

  const handleSpecialContactAdded = (meta: { channelType: ChannelType; senderName: string }) => {
    // eslint-disable-next-line functional/immutable-data
    lastAddedMetaRef.current = meta;
    setActiveStep(1);
  };

  const handleClickFeedback = () => {
    if (currentAction === DigitalDomicileManagementAction.ADD_SPECIAL_CONTACT) {
      PFEventStrategyFactory.triggerEvent(
        PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_THANK_YOU_PAGE_CLOSE
      );
    }
    navigate(RECAPITI);
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
        exitButton: () => <></>,
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
        },
        feedback: {
          title: t(`legal-contacts.sercq-send-wizard.feedback.title-transfer`),
          buttonText: t('legal-contacts.sercq-send-wizard.feedback.go-to-contacts'),
          onClick: handleClickFeedback,
          onFeedbackShow: () => {
            const meta = lastAddedMetaRef.current;
            if (!meta) {
              return;
            }
            PFEventStrategyFactory.triggerEvent(
              PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_THANK_YOU_PAGE,
              {
                event_type: EventAction.SCREEN_VIEW,
                addresses,
                customized_contact_type: meta.channelType,
                organization_name: meta.senderName,
              }
            );
          },
        },
      }}
    >
      <PnWizardStep>
        {currentAction === DigitalDomicileManagementAction.ADD_SPECIAL_CONTACT ? (
          <AddSpecialContact
            ref={addSpecialContactRef}
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
