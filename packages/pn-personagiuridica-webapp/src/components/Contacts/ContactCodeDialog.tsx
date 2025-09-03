import { useCallback, useEffect, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';
import { AppResponse, AppResponsePublisher, CodeModal, ErrorMessage } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { AddressType, ChannelType } from '../../models/contacts';

type Props = {
  value: string;
  addressType: AddressType;
  channelType: ChannelType;
  open: boolean;
  onDiscard: () => void;
  onConfirm: (code?: string) => void;
};

const ContactCodeDialog: React.FC<Props> = ({
  value,
  addressType,
  channelType,
  open = false,
  onDiscard,
  onConfirm,
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
      title={t(`${labelRoot}.${contactType}-verify`, { ns: 'recapiti', value })}
      subtitle={<Trans i18nKey={`${labelRoot}.${contactType}-verify-descr`} ns="recapiti" />}
      open={open}
      codeLength={5}
      codeSectionTitle={t(`insert-code`, { ns: 'recapiti' })}
      codeSectionAdditional={
        <Typography component={Box} variant="body2">
          <Trans
            i18nKey={`${labelRoot}.${contactType}-new-code`}
            ns="recapiti"
            components={[
              <ButtonNaked
                key="newCodeBtn"
                size="medium"
                onClick={() => onConfirm()}
                color="primary"
                sx={{
                  textDecoration: 'underline',
                  display: 'inline',
                  fontWeight: 400,
                  verticalAlign: 'baseline',
                }}
                data-testid="newCodeBtn"
                component={Typography}
              />,
            ]}
          />
        </Typography>
      }
      cancelLabel={t('button.annulla')}
      confirmLabel={t('button.conferma')}
      cancelCallback={onDiscard}
      confirmCallback={(value: string) => onConfirm(value)}
      ref={codeModalRef}
    />
  );
};

export default ContactCodeDialog;
