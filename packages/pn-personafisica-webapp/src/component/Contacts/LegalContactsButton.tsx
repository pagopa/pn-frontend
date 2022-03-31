import { Fragment, ReactNode, useState, forwardRef, useImperativeHandle } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { appStateActions, CodeModal } from '@pagopa-pn/pn-commons';

import { LegalChannelType, SaveDigitalAddressParams } from '../../models/contacts';
import { useAppDispatch } from '../../redux/hooks';
import { createOrUpdateLegalAddress } from '../../redux/contact/actions';

type Props = {
  children: ReactNode;
  recipientId: string;
  digitalDomicileType: LegalChannelType;
  pec: string;
  senderId?: string;
  successMessage: string;
  closeModalOnVerification?: boolean;
};

const LegalContactsButton = forwardRef(
  (
    {
      children,
      recipientId,
      digitalDomicileType,
      pec,
      senderId = 'default',
      successMessage,
      closeModalOnVerification = true,
    }: Props,
    ref
  ) => {
    const { t } = useTranslation(['common', 'recapiti']);
    const [open, setOpen] = useState(false);
    const [codeNotValid, setCodeNotValid] = useState(false);
    const dispatch = useAppDispatch();

    const handleAddressCreation = (verificationCode?: string, noCallback: boolean = false) => {
      const digitalAddressParams: SaveDigitalAddressParams = {
        recipientId,
        senderId,
        channelType: digitalDomicileType,
        value: digitalDomicileType === LegalChannelType.PEC ? pec : '',
        code: verificationCode,
      };
      dispatch(createOrUpdateLegalAddress(digitalAddressParams))
        .unwrap()
        .then((res) => {
          if (noCallback) {
            return;
          }
          if (res && verificationCode) {
            // show success message
            dispatch(appStateActions.addSuccess({ title: '', message: successMessage }));
            if (closeModalOnVerification) {
              setOpen(false);
            }
          } else {
            // open code verification dialog
            setOpen(true);
          }
        })
        .catch(() => {
          setCodeNotValid(true);
        });
    };

    const handleClose = () => {
      setCodeNotValid(false);
      setOpen(false);
    };

    // export handleAddressCreation method
    useImperativeHandle(ref, () => ({
      handleAddressCreation,
    }));

    return (
      <Fragment>
        {children}
        <CodeModal
          title={`${t('legal-contacts.pec-verify', { ns: 'recapiti' })} ${pec}`}
          subtitle={<Trans i18nKey="legal-contacts.pec-verify-descr" ns="recapiti" />}
          open={open}
          initialValues={new Array(5).fill('')}
          handleClose={() => setOpen(false)}
          codeSectionTitle={t('legal-contacts.insert-code', { ns: 'recapiti' })}
          codeSectionAdditional={
            <Box>
              <Typography variant="body2" display="inline">
                {t('legal-contacts.new-code', { ns: 'recapiti' })}&nbsp;
              </Typography>
              <Typography
                variant="body2"
                display="inline"
                color="primary"
                onClick={() => handleAddressCreation(undefined, true)}
                sx={{ cursor: 'pointer' }}
              >
                {t('legal-contacts.new-code-link', { ns: 'recapiti' })}.
              </Typography>
            </Box>
          }
          cancelLabel={t('button.annulla')}
          confirmLabel={t('button.conferma')}
          cancelCallback={handleClose}
          confirmCallback={(values: Array<string>) => handleAddressCreation(values.join(''))}
          hasError={codeNotValid}
          errorMessage={t('legal-contacts.wrong-code', { ns: 'recapiti' })}
        />
      </Fragment>
    );
  }
);

export default LegalContactsButton;
