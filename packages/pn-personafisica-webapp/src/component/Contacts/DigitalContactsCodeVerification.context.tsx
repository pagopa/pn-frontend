import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
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
  const initialProps = {
    labelRoot: '',
    labelType: '',
    recipientId: '',
    senderId: '',
    digitalDomicileType: LegalChannelType.PEC,
    value: '',
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
    dispatch(actionToBeDispatched(digitalAddressParams))
      .unwrap()
      .then((res) => {
        if (noCallback) {
          return;
        }
        if (res && res.code) {
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

  return (
    <DigitalContactsCodeVerificationContext.Provider value={{ initValidation }}>
      {children}
      <CodeModal
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
