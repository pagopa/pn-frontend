import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import _ from 'lodash';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from '@mui/material';
import { appStateActions, CodeModal } from '@pagopa-pn/pn-commons';
import AppErrorPublisher from '@pagopa-pn/pn-commons/src/utils/AppError/AppErrorPublisher';
import { AppResponse, ServerResponseErrorCode } from '@pagopa-pn/pn-commons/src/types/AppError';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { CourtesyChannelType, LegalChannelType } from '../../models/contacts';
import { RootState } from '../../redux/store';
import { createOrUpdateCourtesyAddress, createOrUpdateLegalAddress, } from '../../redux/contact/actions';
import { trackEventByType } from "../../utils/mixpanel";
import { EventActions, TrackEventType } from "../../utils/events";
import { getContactEventType } from "../../utils/contacts.utility";
import { SaveDigitalAddressParams } from '../../redux/contact/types';

type ModalProps = {
  labelRoot: string;
  labelType: string;
  recipientId: string;
  senderId: string;
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
    callbackOnValidation?: (status: 'validated' | 'cancelled') => void
  ) => void;
}

const DigitalContactsCodeVerificationContext = createContext<
  IDigitalContactsCodeVerificationContext | undefined
>(undefined);

const DigitalContactsCodeVerificationProvider: FC<ReactNode> = ({ children }) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const digitalAddresses = useAppSelector(
    (state: RootState) => state.contactsState.digitalAddresses
  );
  const addresses = digitalAddresses
    ? digitalAddresses.legal.concat(digitalAddresses.courtesy)
    : [];
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);

  const initialProps = {
    labelRoot: '',
    labelType: '',
    recipientId: '',
    senderId: '',
    digitalDomicileType: LegalChannelType.PEC,
    value: '',
  } as ModalProps;

  const [open, setOpen] = useState(false);
  const [codeNotValid, setCodeNotValid] = useState(false);
  const dispatch = useAppDispatch();
  const [props, setProps] = useState(initialProps);

  const handleClose = (status: 'validated' | 'cancelled' = 'cancelled') => {
    setCodeNotValid(false);
    setOpen(false);
    setProps(initialProps);
    if (props.callbackOnValidation) {
      props.callbackOnValidation(status);
    }
  };

  const handleConfirm = () => {
    setIsConfirmationModalVisible(false);
    handleCodeVerification();
  };

  const handleDiscard = () => {
    setIsConfirmationModalVisible(false);
  };

  const contactAlreadyExists = (): boolean =>
    !!addresses.find(
      (elem) =>
        elem.value === props.value &&
        (elem.senderId !== props.senderId || elem.channelType !== props.digitalDomicileType)
    );

  const handleCodeVerification = (verificationCode?: string, noCallback: boolean = false) => {
    /* eslint-disable functional/no-let */
    let actionToBeDispatched;
    let eventTypeByChannel;
    /* eslint-enable functional/no-let */
    if (props.digitalDomicileType === LegalChannelType.PEC) {
      actionToBeDispatched = createOrUpdateLegalAddress;
      eventTypeByChannel = TrackEventType.CONTACT_LEGAL_CONTACT;
    } else {
      actionToBeDispatched = createOrUpdateCourtesyAddress;
      eventTypeByChannel = getContactEventType(props.digitalDomicileType);
    }
    if (!actionToBeDispatched) {
      return;
    }
    const digitalAddressParams: SaveDigitalAddressParams = {
      recipientId: props.recipientId,
      senderId: props.senderId,
      channelType: props.digitalDomicileType,
      value: props.value,
      code: verificationCode,
    };

    trackEventByType(eventTypeByChannel, { action: EventActions.ADD });
    dispatch(actionToBeDispatched(digitalAddressParams))
      .unwrap()
      .then((res) => {
        if (noCallback) {
          return;
        }
        if (res && res.code === 'verified') {
          // contact has already been verified
          // show success message
          dispatch(
            appStateActions.addSuccess({
              title: '',
              message: t(`${props.labelRoot}.${props.labelType}-added-successfully`, {
                ns: 'recapiti',
              }),
            })
          );
          handleClose('validated');
        } else {
          // open code verification dialog
          setOpen(true);
        }
      })
      .catch(() => {
      // .catch((error) => {
        // if(error.response.status === 422) {
        //   setCodeNotValid(true);
        // }
      });
  };

  const initValidation = (
    digitalDomicileType: LegalChannelType | CourtesyChannelType,
    value: string,
    recipientId: string,
    senderId: string,
    callbackOnValidation?: (status: 'validated' | 'cancelled') => void
  ) => {
    /* eslint-disable functional/no-let */
    let labelRoot = '';
    let labelType = '';
    /* eslint-enable functional/no-let */
    if (digitalDomicileType === LegalChannelType.PEC) {
      labelRoot = 'legal-contacts';
      labelType = 'pec';
    } else {
      labelRoot = 'courtesy-contacts';
      labelType = digitalDomicileType === CourtesyChannelType.SMS ? 'phone' : 'email';
    }
    setProps({
      labelRoot,
      labelType,
      recipientId,
      senderId,
      digitalDomicileType,
      value,
      callbackOnValidation,
    });
  };

  useEffect(() => {
    if (!_.isEqual(props, initialProps) && !contactAlreadyExists()) {
      handleCodeVerification();
    } else if (contactAlreadyExists()) {
      setIsConfirmationModalVisible(true);
    }
  }, [props]);
  
  const handleAddressUpdateError = (responseError: AppResponse) => {
    if(Array.isArray(responseError.errors)){
      const err_code = responseError.errors[0].getErrorDetail().code;
      if (err_code === ServerResponseErrorCode.PN_USERATTRIBUTES_INVALIDVERIFICATIONCODE) {
        setCodeNotValid(true);
      }
    }
  };
  
  useEffect(() => {
    AppErrorPublisher.subscribe("createOrUpdateLegalAddress", handleAddressUpdateError);
    AppErrorPublisher.subscribe("createOrUpdateCourtesyAddress", handleAddressUpdateError);
    
    return () => {
      AppErrorPublisher.unsubscribe("createOrUpdateCourtesyAddress", handleAddressUpdateError);
      AppErrorPublisher.unsubscribe("createOrUpdateCourtesyAddress", handleAddressUpdateError);
    };
  }, []);

  return (
    <DigitalContactsCodeVerificationContext.Provider value={{ initValidation }}>
      {children}
      {!_.isEqual(props, initialProps) && (
        <CodeModal
          title={
            t(`${props.labelRoot}.${props.labelType}-verify`, { ns: 'recapiti' }) +
            ` ${props.value}`
          }
          subtitle={
            <Trans i18nKey={`${props.labelRoot}.${props.labelType}-verify-descr`} ns="recapiti" />
          }
          open={open}
          initialValues={new Array(5).fill('')}
          handleClose={() => setOpen(false)}
          codeSectionTitle={t(`${props.labelRoot}.insert-code`, { ns: 'recapiti' })}
          codeSectionAdditional={
            <Box>
              <Typography variant="body2" display="inline">
                {t(`${props.labelRoot}.${props.labelType}-new-code`, { ns: 'recapiti' })}&nbsp;
              </Typography>
              <Typography
                variant="body2"
                display="inline"
                color="primary"
                onClick={() => handleCodeVerification(undefined, true)}
                sx={{ cursor: 'pointer' }}
              >
                {t(`${props.labelRoot}.new-code-link`, { ns: 'recapiti' })}.
              </Typography>
            </Box>
          }
          cancelLabel={t('button.annulla')}
          confirmLabel={t('button.conferma')}
          cancelCallback={() => handleClose('cancelled')}
          confirmCallback={(values: Array<string>) => handleCodeVerification(values.join(''))}
          hasError={codeNotValid}
          errorTitle={t(`${props.labelRoot}.wrong-code`, { ns: 'recapiti' })}
          errorMessage={t(`${props.labelRoot}.wrong-code-message`, { ns: 'recapiti' })}
        />
      )}
      <Dialog
        open={isConfirmationModalVisible}
        onClose={handleDiscard}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">
          {t(`common.duplicate-contact-title`, { value: props.value, ns: 'recapiti' })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            {t(`common.duplicate-contact-descr`, { value: props.value, ns: 'recapiti' })}
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
