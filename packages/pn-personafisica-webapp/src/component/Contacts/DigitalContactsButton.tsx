import { Fragment, ReactNode, useState, forwardRef, useImperativeHandle } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";
import { appStateActions, CodeModal } from "@pagopa-pn/pn-commons";

import { LegalChannelType, SaveLegalAddressParams } from "../../models/contacts";
import { useAppDispatch } from "../../redux/hooks";
import { createOrUpdateLegalAddress } from "../../redux/contact/actions";

type Props = {
  children: ReactNode;
  recipientId: string;
  digitalDomicileType: LegalChannelType;
  pec: string;
  senderId?: string;
  successMessage: string;
};

const DigitalContactsButton = forwardRef(({children, recipientId, digitalDomicileType, pec, senderId = 'default', successMessage}: Props, ref) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const [open, setOpen] = useState(false);

  console.log(open, setOpen);
  const dispatch = useAppDispatch();

  const handleCodeConfirmation = (values: Array<string>) => {
    // save contact
    handleAddressCreation(values.join(''));
  };

  const handleAddressCreation = (verificationCode?: string, noCallback: boolean = false) => {
    const digitalAddressParams: SaveLegalAddressParams = {
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
        if (digitalDomicileType === LegalChannelType.PEC) {
          if (res && verificationCode) {
            // show success message
            dispatch(appStateActions.addSuccess({ title: '', message: successMessage }));
            setOpen(false);
          } else {
            // open code verification dialog
            setOpen(true);
          }
        }
      })
      .catch(() => {});
  };

  // export handleAddressCreation method
  useImperativeHandle(ref, () => ({
    handleAddressCreation
  }));
  
  return (
    <Fragment>
      {children}
      <CodeModal
        title={`${t('digital-contacts.pec-verify', { ns: 'recapiti' })} ${pec}`}
        subtitle={<Trans i18nKey="digital-contacts.pec-verify-descr" ns="recapiti" />}
        open={open}
        initialValues={new Array(5).fill('')}
        handleClose={() => setOpen(false)}
        codeSectionTitle={t('digital-contacts.insert-code', { ns: 'recapiti' })}
        codeSectionAdditional={
          <Box>
            <Typography variant="body2" display="inline">
              {t('digital-contacts.new-code', { ns: 'recapiti' })}&nbsp;
            </Typography>
            <Typography variant="body2" display="inline" color="primary" onClick={() => handleAddressCreation(undefined, true)}>
              {t('digital-contacts.new-code-link', { ns: 'recapiti' })}.
            </Typography>
          </Box>
        }
        cancelLabel={t('button.annulla')}
        confirmLabel={t('button.conferma')}
        cancelCallback={() => setOpen(false)}
        confirmCallback={handleCodeConfirmation}
      />
    </Fragment>
  );
});

export default DigitalContactsButton;