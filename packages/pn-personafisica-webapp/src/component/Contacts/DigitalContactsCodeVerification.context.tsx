import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { AsyncThunk } from '@reduxjs/toolkit';
import _ from 'lodash';
import { appStateActions, CodeModal } from '@pagopa-pn/pn-commons';

import { useAppDispatch } from '../../redux/hooks';
import { CourtesyChannelType, LegalChannelType, SaveDigitalAddressParams } from '../../models/contacts';

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
    successMessage: ''
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
    dispatch(props.actionToBeDispatched(digitalAddressParams))
      .unwrap()
      .then((res) => {
        if (noCallback) {
          return;
        }
        if (res && res.code) {
          // show success message
          dispatch(appStateActions.addSuccess({ title: '', message: props.successMessage }));
          handleClose('validated');
        } else {
          // open code verification dialog
          setOpen(true);
        }
      }).catch(() => {
        setCodeNotValid(true);
      });
  };

  useEffect(() => {
    if (!_.isEqual(props, initialProps)) {
      handleCodeVerification();
    }
  }, [props]);

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
