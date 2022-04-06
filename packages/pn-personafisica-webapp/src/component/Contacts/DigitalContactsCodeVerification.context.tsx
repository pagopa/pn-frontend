import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { AsyncThunk } from '@reduxjs/toolkit';
import { Trans, useTranslation } from 'react-i18next';
import _ from 'lodash';
import { Box, Typography } from '@mui/material';
import { appStateActions, CodeModal } from '@pagopa-pn/pn-commons';

import { useAppDispatch } from '../../redux/hooks';
import {
  CourtesyChannelType,
  LegalChannelType,
  SaveDigitalAddressParams,
} from '../../models/contacts';
import {
  createOrUpdateCourtesyAddress,
  createOrUpdateLegalAddress,
} from '../../redux/contact/actions';

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

  const { t } = useTranslation(['common', 'recapiti']);
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
      })
      .catch(() => {
        setCodeNotValid(true);
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
    let title = '';
    let subtitle = null;
    let codeSectionTitle = '';
    let newCode = '';
    let newCodeLink = '';
    let errorMessage = '';
    let successMessage = '';
    let actionToBeDispatched;
    /* eslint-enable functional/no-let */
    if (digitalDomicileType === LegalChannelType.PEC) {
      title = `${t('legal-contacts.pec-verify', { ns: 'recapiti' })} ${value}`;
      subtitle = <Trans i18nKey="legal-contacts.pec-verify-descr" ns="recapiti"/>;
      codeSectionTitle = t('legal-contacts.insert-code', { ns: 'recapiti' });
      newCode = t('legal-contacts.new-code', { ns: 'recapiti' });
      newCodeLink = t('legal-contacts.new-code-link', { ns: 'recapiti' });
      errorMessage = t('legal-contacts.wrong-code', { ns: 'recapiti' });
      successMessage = t('legal-contacts.pec-added', { ns: 'recapiti' });
      actionToBeDispatched = createOrUpdateLegalAddress;
    } else {
      const type = digitalDomicileType === CourtesyChannelType.SMS ? 'phone' : 'email';
      title = t(`courtesy-contacts.${type}-verify`, { ns: 'recapiti' }) + ` ${value}`;
      subtitle = <Trans i18nKey={`courtesy-contacts.${type}-verify-descr`} ns="recapiti" />;
      codeSectionTitle = t(`courtesy-contacts.insert-code`, { ns: 'recapiti' });
      newCode = t(`courtesy-contacts.${type}-new-code`, { ns: 'recapiti' });
      newCodeLink = t(`courtesy-contacts.new-code-link`, { ns: 'recapiti' });
      errorMessage = t(`courtesy-contacts.wrong-code`, { ns: 'recapiti' });
      successMessage = t(`courtesy-contacts.${type}-added-successfully`, {
        ns: 'recapiti',
      });
      actionToBeDispatched = createOrUpdateCourtesyAddress;
    }
    setProps({
      title,
      subtitle,
      initialValues: new Array(5).fill(''),
      codeSectionTitle,
      codeSectionAdditional: (
        <Box>
          <Typography variant="body2" display="inline">
            {newCode}&nbsp;
          </Typography>
          <Typography
            variant="body2"
            display="inline"
            color="primary"
            onClick={() => handleCodeVerification(undefined, true)}
            sx={{ cursor: 'pointer' }}
          >
            {newCodeLink}.
          </Typography>
        </Box>
      ),
      cancelLabel: t('button.annulla'),
      confirmLabel: t('button.conferma'),
      errorMessage,
      recipientId,
      senderId,
      digitalDomicileType,
      value,
      successMessage,
      actionToBeDispatched,
      callbackOnValidation
    });
  };

  useEffect(() => {
    if (!_.isEqual(props, initialProps)) {
      handleCodeVerification();
    }
  }, [props]);

  return (
    <DigitalContactsCodeVerificationContext.Provider value={{ initValidation }}>
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
