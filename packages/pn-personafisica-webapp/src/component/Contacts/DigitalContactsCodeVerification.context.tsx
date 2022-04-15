import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import _ from 'lodash';
import { Box, Typography } from '@mui/material';
import { appStateActions, CodeModal } from '@pagopa-pn/pn-commons';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  CourtesyChannelType,
  LegalChannelType,
  SaveDigitalAddressParams,
} from '../../models/contacts';
import { RootState } from '../../redux/store';
import {
  createOrUpdateCourtesyAddress,
  createOrUpdateLegalAddress,
} from '../../redux/contact/actions';

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
  const addresses = digitalAddresses ? digitalAddresses.legal.concat(digitalAddresses.courtesy) : [];
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [insertDuplicateConfirmed, setInsertDuplicateConfirmed] = useState(false);

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
    setInsertDuplicateConfirmed(false);
    setIsConfirmationModalVisible(false);
    setCodeNotValid(false);
    setOpen(false);
    setProps(initialProps);
    if (props.callbackOnValidation) {
      props.callbackOnValidation(status);
    }
  };

  const handleConfirm = () => {
    setInsertDuplicateConfirmed(true);
    setIsConfirmationModalVisible(false);
  };

  const handleDiscard = () => {
    setIsConfirmationModalVisible(false);
  };

  const contactAlreadyExists = (): boolean => {
    if(addresses.find((elem) => elem.value === props.value && (elem.senderId !== props.senderId || elem.channelType !== props.digitalDomicileType))){
      return true;
    }
    return false;
  };

  const handleCodeVerification = (verificationCode?: string, noCallback: boolean = false) => {
    /* eslint-disable functional/no-let */
    let actionToBeDispatched;
    /* eslint-enable functional/no-let */
    if (props.digitalDomicileType === LegalChannelType.PEC) {
      actionToBeDispatched = createOrUpdateLegalAddress;
    } else {
      actionToBeDispatched = createOrUpdateCourtesyAddress;
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
    if(contactAlreadyExists() && !insertDuplicateConfirmed) {
      setIsConfirmationModalVisible(true);
    } else {
      dispatch(actionToBeDispatched(digitalAddressParams))
      .unwrap()
      .then((res) => {
        if (noCallback) {
          return;
        }
        if (res && res.code) {
          setInsertDuplicateConfirmed(false);
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
        } else if (!open) {
          // open code verification dialog
          setOpen(true);
        }
      })
      .catch(() => {
        setCodeNotValid(true);
      });
    }
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
    if (!_.isEqual(props, initialProps)) {
      handleCodeVerification();
    }
  }, [props]);

  if(insertDuplicateConfirmed) {
    handleCodeVerification();
  }

  return (
    <DigitalContactsCodeVerificationContext.Provider value={{ initValidation }}>
      {children}
      {!_.isEqual(props, initialProps) && <CodeModal
        title={
          t(`${props.labelRoot}.${props.labelType}-verify`, { ns: 'recapiti' }) + ` ${props.value}`
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
        errorMessage={t(`${props.labelRoot}.wrong-code`, { ns: 'recapiti' })}
      />}
      <Dialog
        open={isConfirmationModalVisible}
        onClose={handleDiscard}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">{t(`common.duplicate-contact-title`, { value: props.value, ns: 'recapiti' })}</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">{t(`common.duplicate-contact-descr`, { value: props.value, ns: 'recapiti' })}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiscard} variant="outlined">{t('button.annulla')}</Button>
          <Button onClick={handleConfirm} variant="contained">{t('button.conferma')}</Button>
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
