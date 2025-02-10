import { useCallback, useEffect, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';
import { AppResponse, AppResponsePublisher, CodeModal, ErrorMessage } from '@pagopa-pn/pn-commons';

import { AddressType, ChannelType } from '../../models/contacts';

type Props = {
  value: string;
  addressType: AddressType;
  channelType: ChannelType;
  open: boolean;
  onDiscard: () => void;
  onConfirm: (code?: string) => void;
  onError?: () => void;
};

const ContactCodeDialog: React.FC<Props> = ({
  value,
  addressType,
  channelType,
  open = false,
  onDiscard,
  onConfirm,
  onError,
}) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const contactType = channelType.toLowerCase();
  const codeModalRef = useRef<{
    updateError: (error: ErrorMessage, codeNotValid: boolean) => void;
  }>(null);
  const labelRoot = `${addressType.toLowerCase()}-contacts`;

  const handleAddressUpdateError = useCallback(
    (responseError: AppResponse) => {
      if (!open) {
        // notify the publisher we are not handling the error
        return true;
      }
      if (Array.isArray(responseError.errors)) {
        const error = responseError.errors[0];
        codeModalRef.current?.updateError(
          {
            title: error.message.title,
            content: error.message.content,
          },
          true
        );
        onError?.();
      }
      return false;
    },
    [open]
  );

  useEffect(() => {
    AppResponsePublisher.error.subscribe('createOrUpdateAddress', handleAddressUpdateError);

    return () => {
      AppResponsePublisher.error.unsubscribe('createOrUpdateAddress', handleAddressUpdateError);
    };
  }, [handleAddressUpdateError]);

  return (
    <CodeModal
      title={open ? t(`${labelRoot}.${contactType}-verify`, { ns: 'recapiti', value }) : ''}
      subtitle={
        open ? <Trans i18nKey={`${labelRoot}.${contactType}-verify-descr`} ns="recapiti" /> : ''
      }
      open={open}
      initialValues={new Array(5).fill('')}
      codeSectionTitle={open ? t(`insert-code`, { ns: 'recapiti' }) : ''}
      codeSectionAdditional={
        open && (
          <Typography component={Box} variant="body2">
            <Trans
              i18nKey={`${labelRoot}.${contactType}-new-code`}
              ns="recapiti"
              components={[
                <Typography
                  key="newCodeBtn"
                  role="button"
                  tabIndex={0}
                  variant="body2"
                  onClick={() => onConfirm()}
                  color="primary"
                  sx={{ textDecoration: 'underline', display: 'inline', cursor: 'pointer' }}
                  data-testid="newCodeBtn"
                />,
              ]}
            />
          </Typography>
        )
      }
      cancelLabel={t('button.annulla')}
      confirmLabel={t('button.conferma')}
      cancelCallback={onDiscard}
      confirmCallback={(values: Array<string>) => onConfirm(values.join(''))}
      ref={codeModalRef}
    />
  );
};

export default ContactCodeDialog;
