import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { AsyncThunk } from '@reduxjs/toolkit';
import _ from 'lodash';
import { appStateActions, CodeModal } from '@pagopa-pn/pn-commons';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  CourtesyChannelType,
  LegalChannelType,
  SaveDigitalAddressParams,
} from '../../models/contacts';
import { RootState } from '../../redux/store';

type ModalProps = {
  title: string;
  subtitle: ReactNode;
  initialValues: Array<string>;
  codeSectionTitle: string;
  codeSectionAdditional: ReactNode;
  cancelLabel: string;
  confirmLabel: string;
  errorMessage: string;
  recipientId: string;
  senderId: string;
  digitalDomicileType: LegalChannelType | CourtesyChannelType;
  value: string;
  successMessage: string;
  actionToBeDispatched?: AsyncThunk<any, any, any>;
  callbackOnValidation?: (status: 'validated' | 'cancelled') => void;
};

interface IDigitalContactsCodeVerificationContext {
  setProps: (props: ModalProps) => void;
  handleCodeVerification: (verificationCode?: string, noCallback?: boolean) => void;
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
    title: '',
    subtitle: '',
    initialValues: [],
    codeSectionTitle: '',
    codeSectionAdditional: '',
    cancelLabel: '',
    confirmLabel: '',
    errorMessage: '',
    recipientId: '',
    senderId: '',
    digitalDomicileType: LegalChannelType.PEC,
    value: '',
    successMessage: '',
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
    if (!props.actionToBeDispatched) {
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
      dispatch(props.actionToBeDispatched(digitalAddressParams))
        .unwrap()
        .then((res) => {
          if (noCallback) {
            return;
          }
          if (res && res.code) {
            // show success message
            setInsertDuplicateConfirmed(false);
            dispatch(appStateActions.addSuccess({ title: '', message: props.successMessage }));
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

  useEffect(() => {
    if (!_.isEqual(props, initialProps)) {
      handleCodeVerification();
    }
  }, [props]);

  if(insertDuplicateConfirmed) {
    handleCodeVerification();
  }

  return (
    <DigitalContactsCodeVerificationContext.Provider value={{ setProps, handleCodeVerification }}>
      {children}
      <CodeModal
        title={props.title}
        subtitle={props.subtitle}
        open={open}
        initialValues={props.initialValues}
        handleClose={() => setOpen(false)}
        codeSectionTitle={props.codeSectionTitle}
        codeSectionAdditional={props.codeSectionAdditional}
        cancelLabel={props.cancelLabel}
        confirmLabel={props.confirmLabel}
        cancelCallback={() => handleClose('cancelled')}
        confirmCallback={(values: Array<string>) => handleCodeVerification(values.join(''))}
        hasError={codeNotValid}
        errorMessage={props.errorMessage}
      />
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
