import _ from 'lodash';
import { FC, ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import {
  AppResponse,
  AppResponsePublisher,
  CodeModal,
  DisclaimerModal,
  ErrorMessage,
  appStateActions,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { CourtesyChannelType, LegalChannelType } from '../../models/contacts';
import {
  createOrUpdateCourtesyAddress,
  createOrUpdateLegalAddress,
} from '../../redux/contact/actions';
import { SaveDigitalAddressParams } from '../../redux/contact/types';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { TrackEventType } from '../../utility/events';
import { trackEventByType } from '../../utility/mixpanel';

type ModalProps = {
  labelRoot: string;
  labelType: string;
  recipientId: string;
  senderId: string;
  senderName?: string;
  digitalDomicileType: LegalChannelType | CourtesyChannelType;
  value: string;
  callbackOnValidation?: (status: 'validated' | 'cancelled') => void;
};

interface IDigitalContactsCodeVerificationContext {
  initValidation: (
    digitalDomicileType: LegalChannelType | CourtesyChannelType,
    value: string,
    recipientId: string,
    senderId: string,
    senderName?: string,
    callbackOnValidation?: (status: 'validated' | 'cancelled') => void,
    isSpecialContact?: boolean
  ) => void;
}

const DigitalContactsCodeVerificationContext = createContext<
  IDigitalContactsCodeVerificationContext | undefined
>(undefined);

const eventAttributes = (isSpecialContact?: boolean) => ({
  other_contact: isSpecialContact ? 'yes' : 'no',
});

const DigitalContactsCodeVerificationProvider: FC<ReactNode> = ({ children }) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const digitalAddresses = useAppSelector(
    (state: RootState) => state.contactsState.digitalAddresses
  );
  const addresses = digitalAddresses
    ? digitalAddresses.legal.concat(digitalAddresses.courtesy)
    : [];
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>();

  const [isSpecialContactMode, setIsSpecialContactMode] = useState(false);

  const initialProps = {
    labelRoot: '',
    labelType: '',
    recipientId: '',
    senderId: '',
    digitalDomicileType: LegalChannelType.PEC,
    value: '',
  } as ModalProps;

  const [open, setOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [pecValidationOpen, setPecValidationOpen] = useState(false);
  const [codeNotValid, setCodeNotValid] = useState(false);
  const dispatch = useAppDispatch();
  const [modalProps, setModalProps] = useState(initialProps);

  const handleClose = (status: 'validated' | 'cancelled' = 'cancelled') => {
    setCodeNotValid(false);
    setOpen(false);
    setModalProps(initialProps);
    if (modalProps.callbackOnValidation) {
      modalProps.callbackOnValidation(status);
    }
  };

  const handleConfirm = () => {
    setIsConfirmationModalVisible(false);
    handleDisclaimerVisibilityFirst();
  };

  const handleDiscard = () => {
    setIsConfirmationModalVisible(false);
  };

  const contactAlreadyExists = (): boolean =>
    !!addresses.find(
      (elem) =>
        elem.value !== '' &&
        elem.value === modalProps.value &&
        (elem.senderId !== modalProps.senderId ||
          elem.channelType !== modalProps.digitalDomicileType)
    );

  const sendSuccessEvent = (type: LegalChannelType | CourtesyChannelType) => {
    if (type === LegalChannelType.PEC) {
      trackEventByType(
        TrackEventType.SEND_ADD_PEC_UX_SUCCESS,
        eventAttributes(isSpecialContactMode)
      );
      return;
    }
    trackEventByType(
      type === CourtesyChannelType.SMS
        ? TrackEventType.SEND_ADD_SMS_UX_SUCCESS
        : TrackEventType.SEND_ADD_EMAIL_UX_SUCCESS,
      eventAttributes(isSpecialContactMode)
    );
  };
  const handleCodeVerification = (verificationCode?: string, noCallback: boolean = false) => {
    /* eslint-disable functional/no-let */
    let actionToBeDispatched;
    if (modalProps.digitalDomicileType === LegalChannelType.PEC) {
      actionToBeDispatched = createOrUpdateLegalAddress;
    } else {
      actionToBeDispatched = createOrUpdateCourtesyAddress;
    }
    if (verificationCode) {
      if (modalProps.digitalDomicileType === LegalChannelType.PEC) {
        trackEventByType(
          TrackEventType.SEND_ADD_PEC_UX_CONVERSION,
          eventAttributes(isSpecialContactMode)
        );
      } else if (modalProps.digitalDomicileType === CourtesyChannelType.SMS) {
        trackEventByType(
          TrackEventType.SEND_ADD_SMS_UX_CONVERSION,
          eventAttributes(isSpecialContactMode)
        );
      } else if (modalProps.digitalDomicileType === CourtesyChannelType.EMAIL) {
        trackEventByType(
          TrackEventType.SEND_ADD_EMAIL_UX_CONVERSION,
          eventAttributes(isSpecialContactMode)
        );
      }
    }
    if (!actionToBeDispatched) {
      return;
    }
    const digitalAddressParams: SaveDigitalAddressParams = {
      recipientId: modalProps.recipientId,
      senderId: modalProps.senderId,
      senderName: modalProps.senderName,
      channelType: modalProps.digitalDomicileType,
      value: modalProps.value,
      code: verificationCode,
    };

    void dispatch(actionToBeDispatched(digitalAddressParams))
      .unwrap()
      .then((res) => {
        if (noCallback) {
          return;
        }
        // contact to verify
        // open code modal
        if (!res) {
          setOpen(true);
          return;
        }

        sendSuccessEvent(modalProps.digitalDomicileType);

        // contact has already been verified
        if (res.pecValid || modalProps.digitalDomicileType !== LegalChannelType.PEC) {
          // show success message
          dispatch(
            appStateActions.addSuccess({
              title: '',
              message: t(`${modalProps.labelRoot}.${modalProps.labelType}-added-successfully`, {
                ns: 'recapiti',
              }),
            })
          );
          handleClose('validated');
          return;
        }
        // contact must be validated
        // open validation modal
        handleClose('validated');
        setPecValidationOpen(true);
      });
  };

  const initValidation = (
    digitalDomicileType: LegalChannelType | CourtesyChannelType,
    value: string,
    recipientId: string,
    senderId: string,
    senderName?: string,
    callbackOnValidation?: (status: 'validated' | 'cancelled') => void,
    isSpecialContact?: boolean
  ) => {
    setIsSpecialContactMode(!!isSpecialContact);
    /* eslint-disable functional/no-let */
    let labelRoot = '';
    let labelType = '';
    /* eslint-enable functional/no-let */
    if (digitalDomicileType === LegalChannelType.PEC) {
      labelRoot = 'legal-contacts';
      labelType = 'pec';
      trackEventByType(TrackEventType.SEND_ADD_PEC_START, eventAttributes(isSpecialContact));
    } else {
      labelRoot = 'courtesy-contacts';
      labelType = digitalDomicileType === CourtesyChannelType.SMS ? 'phone' : 'email';
      trackEventByType(
        digitalDomicileType === CourtesyChannelType.SMS
          ? TrackEventType.SEND_ADD_SMS_START
          : TrackEventType.SEND_ADD_EMAIL_START,
        eventAttributes(isSpecialContact)
      );
    }
    setModalProps({
      labelRoot,
      labelType,
      recipientId,
      senderId,
      senderName,
      digitalDomicileType,
      value,
      callbackOnValidation,
    });
  };

  useEffect(() => {
    if (!_.isEqual(modalProps, initialProps) && !contactAlreadyExists()) {
      handleDisclaimerVisibilityFirst();
    } else if (contactAlreadyExists()) {
      setIsConfirmationModalVisible(true);
    }
  }, [modalProps]);

  const handleDisclaimerVisibilityFirst = () => {
    // if senderId !== 'default' they are a special contact => don't show disclaimer
    // if modalProps.digitalDomicileType === LegalChannelType.PEC it's a legal contact => don't show disclaimer
    // if modalProps.digitalDomicileType !== LegalChannelType.PEC and senderId === 'default' it's a
    // courtesy contact => show disclaimer
    if (
      modalProps.digitalDomicileType === LegalChannelType.PEC ||
      modalProps.senderId !== 'default'
    ) {
      // open verification code dialog
      handleCodeVerification();
    } else {
      // open disclaimer dialog
      setDisclaimerOpen(true);
    }
  };

  const handleAddressUpdateError = useCallback(
    (responseError: AppResponse) => {
      if (!open) {
        // notify the publisher we are not handling the error
        return true;
      }
      if (Array.isArray(responseError.errors)) {
        const error = responseError.errors[0];
        setErrorMessage({
          title: error.message.title,
          content: error.message.content,
        });
        setCodeNotValid(true);
        if (modalProps.digitalDomicileType === LegalChannelType.PEC) {
          trackEventByType(TrackEventType.SEND_ADD_PEC_CODE_ERROR);
        } else if (modalProps.digitalDomicileType === CourtesyChannelType.SMS) {
          trackEventByType(TrackEventType.SEND_ADD_SMS_CODE_ERROR);
        } else if (modalProps.digitalDomicileType === CourtesyChannelType.EMAIL) {
          trackEventByType(TrackEventType.SEND_ADD_EMAIL_CODE_ERROR);
        }
      }
      return false;
    },
    [open]
  );

  useEffect(() => {
    AppResponsePublisher.error.subscribe('createOrUpdateLegalAddress', handleAddressUpdateError);
    AppResponsePublisher.error.subscribe('createOrUpdateCourtesyAddress', handleAddressUpdateError);

    return () => {
      AppResponsePublisher.error.unsubscribe(
        'createOrUpdateLegalAddress',
        handleAddressUpdateError
      );
      AppResponsePublisher.error.unsubscribe(
        'createOrUpdateCourtesyAddress',
        handleAddressUpdateError
      );
    };
  }, [handleAddressUpdateError]);

  return (
    <DigitalContactsCodeVerificationContext.Provider value={{ initValidation }}>
      {children}
      {disclaimerOpen && (
        <DisclaimerModal
          onConfirm={() => {
            setDisclaimerOpen(false);
            handleCodeVerification();
            setOpen(true);
          }}
          onCancel={() => setDisclaimerOpen(false)}
          confirmLabel={t('button.conferma')}
          checkboxLabel={t('button.capito')}
          content={t(`alert-dialog-${modalProps.digitalDomicileType}`, { ns: 'recapiti' })}
        />
      )}
      {!_.isEqual(modalProps, initialProps) && (
        <CodeModal
          title={
            t(`${modalProps.labelRoot}.${modalProps.labelType}-verify`, { ns: 'recapiti' }) +
            ` ${modalProps.value}`
          }
          subtitle={
            <Typography variant="body1">
              <Trans
                i18nKey={`${modalProps.labelRoot}.${modalProps.labelType}-verify-descr`}
                ns="recapiti"
              />
            </Typography>
          }
          open={open}
          initialValues={new Array(5).fill('')}
          codeSectionTitle={t(`${modalProps.labelRoot}.insert-code`, { ns: 'recapiti' })}
          codeSectionAdditional={
            <>
              <Typography variant="body2" display="inline">
                {t(`${modalProps.labelRoot}.${modalProps.labelType}-new-code`, { ns: 'recapiti' })}
                &nbsp;
              </Typography>
              <ButtonNaked
                component={Box}
                onClick={() => handleCodeVerification(undefined, true)}
                sx={{ verticalAlign: 'unset', display: 'inline' }}
              >
                <Typography
                  display="inline"
                  color="primary"
                  variant="body2"
                  sx={{ textDecoration: 'underline' }}
                >
                  {t(`${modalProps.labelRoot}.new-code-link`, { ns: 'recapiti' })}.
                </Typography>
              </ButtonNaked>
            </>
          }
          cancelLabel={t('button.annulla')}
          confirmLabel={t('button.conferma')}
          cancelCallback={() => handleClose('cancelled')}
          confirmCallback={(values: Array<string>) => handleCodeVerification(values.join(''))}
          hasError={codeNotValid}
          errorTitle={errorMessage?.title}
          errorMessage={errorMessage?.content}
        />
      )}
      <Dialog
        open={isConfirmationModalVisible}
        onClose={handleDiscard}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        data-testid="duplicateDialog"
      >
        <DialogTitle id="dialog-title">
          {t(`common.duplicate-contact-title`, { value: modalProps.value, ns: 'recapiti' })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            {t(`common.duplicate-contact-descr`, { value: modalProps.value, ns: 'recapiti' })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiscard} variant="outlined">
            {t('button.annulla')}
          </Button>
          <Button onClick={handleConfirm} variant="contained">
            {t('button.conferma')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={pecValidationOpen} data-testid="validationDialog">
        <DialogTitle id="dialog-title" sx={{ pt: 4, px: 4 }}>
          {t('legal-contacts.validation-progress-title', { ns: 'recapiti' })}
        </DialogTitle>
        <DialogContent sx={{ px: 4 }}>
          {t('legal-contacts.validation-progress-content', { ns: 'recapiti' })}
        </DialogContent>
        <DialogActions sx={{ pb: 4, px: 4 }}>
          <Button onClick={() => setPecValidationOpen(false)} variant="contained">
            {t('button.conferma')}
          </Button>
        </DialogActions>
      </Dialog>
    </DigitalContactsCodeVerificationContext.Provider>
  );
};

const useDigitalContactsCodeVerificationContext = () => {
  const context = useContext(DigitalContactsCodeVerificationContext);
  if (context === undefined) {
    throw new Error(
      'useDigitalContactsCodeVerificationContext must be used within a DigitalContactsCodeVerificationProvider'
    );
  }
  return context;
};

export { DigitalContactsCodeVerificationProvider, useDigitalContactsCodeVerificationContext };
