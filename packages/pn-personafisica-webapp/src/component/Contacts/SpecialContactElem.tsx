import { ChangeEvent, memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Grid, TextField } from '@mui/material';

import { CourtesyChannelType, LegalChannelType } from '../../models/contacts';
import { useDigitalContactsCodeVerificationContext } from './DigitalContactsCodeVerification.context';
import DigitalContactElem from './DigitalContactElem';

type Props = {
  address: {
    senderId: string;
    phone?: string;
    mail?: string;
    pec?: string;
  };
  senders: Array<{ id: string; value: string }>;
  phoneRegExp: RegExp;
  recipientId: string;
};

const SpecialContactElem = memo(({ address, senders, phoneRegExp, recipientId }: Props) => {
  const { initValidation } = useDigitalContactsCodeVerificationContext();
  const { t } = useTranslation(['recapiti']);
  const pecContactRef = useRef();
  const phoneContactRef = useRef();
  const mailContactRef = useRef();

  const initialValues = {
    pec: address.pec || '',
    phone: address.phone || '',
    mail: address.mail || '',
  };

  const resetForm = (addressType: LegalChannelType | CourtesyChannelType) => {
    if (addressType === LegalChannelType.PEC) {
      pecFormik.resetForm({ values: { pec: initialValues.pec } });
    } else if (addressType === CourtesyChannelType.SMS) {
      phoneFormik.resetForm({ values: { phone: initialValues.phone } });
    } else {
      mailFormik.resetForm({ values: { mail: initialValues.mail } });
    }
  };

  const updateInitalValues = (addressType: LegalChannelType | CourtesyChannelType) => {
    /* eslint-disable functional/immutable-data */
    if (addressType === LegalChannelType.PEC) {
      initialValues.pec = pecFormik.values.pec;
    } else if (addressType === CourtesyChannelType.SMS) {
      initialValues.phone = phoneFormik.values.phone;
    } else {
      initialValues.mail = mailFormik.values.mail;
    }
    /* eslint-enable functional/immutable-data */
  };

  const toggleEdit = (addressType: LegalChannelType | CourtesyChannelType) => {
    if (addressType === LegalChannelType.PEC) {
      (pecContactRef.current as any).toggleEdit();
    } else if (addressType === CourtesyChannelType.SMS) {
      (phoneContactRef.current as any).toggleEdit();
    } else {
      (mailContactRef.current as any).toggleEdit();
    }
  };

  const updateContact = (value: string, addressType: LegalChannelType | CourtesyChannelType) => {
    initValidation(
      addressType,
      value,
      recipientId,
      address.senderId,
      (status: 'validated' | 'cancelled') => {
        if (status === 'cancelled') {
          resetForm(addressType);
        } else {
          updateInitalValues(addressType);
        }
        toggleEdit(addressType);
      }
    );
  };

  const pecFormik = useFormik({
    initialValues: {
      pec: initialValues.pec,
    },
    validationSchema: yup.object({
      pec: yup
        .string()
        .required(t('legal-contacts.valid-pec', { ns: 'recapiti' }))
        .email(t('legal-contacts.valid-pec', { ns: 'recapiti' })),
    }),
    /** onSubmit validate */
    onSubmit: (values) => {
      updateContact(values.pec, LegalChannelType.PEC);
    },
  });

  const phoneFormik = useFormik({
    initialValues: {
      phone: initialValues.phone,
    },
    validationSchema: yup.object({
      phone: yup
        .string()
        .required(t('courtesy-contacts.valid-phone', { ns: 'recapiti' }))
        .matches(phoneRegExp, t('courtesy-contacts.valid-phone', { ns: 'recapiti' })),
    }),
    /** onSubmit validate */
    onSubmit: (values) => {
      updateContact(values.phone, CourtesyChannelType.SMS);
    },
  });

  const mailFormik = useFormik({
    initialValues: {
      mail: initialValues.mail,
    },
    validationSchema: yup.object({
      mail: yup
        .string()
        .required(t('courtesy-contacts.valid-email', { ns: 'recapiti' }))
        .email(t('courtesy-contacts.valid-email', { ns: 'recapiti' })),
    }),
    /** onSubmit validate */
    onSubmit: (values) => {
      updateContact(values.mail, CourtesyChannelType.EMAIL);
    },
  });

  const handleChangeTouched = async (
    e: ChangeEvent,
    digitalAddressType: LegalChannelType | CourtesyChannelType
  ) => {
    if (digitalAddressType === LegalChannelType.PEC) {
      pecFormik.handleChange(e);
      await pecFormik.setFieldTouched(e.target.id, true, false);
    } else if (digitalAddressType === CourtesyChannelType.SMS) {
      phoneFormik.handleChange(e);
      await phoneFormik.setFieldTouched(e.target.id, true, false);
    } else {
      mailFormik.handleChange(e);
      await mailFormik.setFieldTouched(e.target.id, true, false);
    }
  };

  useEffect(() => {
    void pecFormik.setFieldValue('pec', address.pec);
    void phoneFormik.setFieldValue('phone', address.phone);
    void mailFormik.setFieldValue('mail', address.mail);
  }, [address]);

  return (
    <Grid container direction="row" spacing={2} alignItems="center" sx={{ marginTop: '20px' }}>
      <Grid item lg xs={12}>
        {senders.find((s) => s.id === address.senderId)?.value}
      </Grid>
      <Grid item lg xs={12}>
        {address.pec && (
          <form onSubmit={pecFormik.handleSubmit}>
            <DigitalContactElem
              ref={pecContactRef}
              fields={[
                {
                  id: 'value',
                  component: (
                    <TextField
                      id="pec"
                      fullWidth
                      name="pec"
                      label="PEC"
                      variant="outlined"
                      size="small"
                      value={pecFormik.values.pec}
                      onChange={(e) => handleChangeTouched(e, LegalChannelType.PEC)}
                      error={pecFormik.touched.pec && Boolean(pecFormik.errors.pec)}
                      helperText={pecFormik.touched.pec && pecFormik.errors.pec}
                    />
                  ),
                  isEditable: true,
                  size: 'variable',
                },
              ]}
              saveDisabled={!pecFormik.isValid}
              onRemoveClick={() => {}}
              removeModalTitle={t('legal-contacts.remove-pec-title', { ns: 'recapiti' })}
              removeModalBody={t('legal-contacts.remove-pec-message', {
                pec: pecFormik.values.pec,
                ns: 'recapiti',
              })}
            />
          </form>
        )}
        {!address.pec && '-'}
      </Grid>
      <Grid item lg xs={12}>
        {address.phone && (
          <form onSubmit={phoneFormik.handleSubmit}>
            <DigitalContactElem
              ref={phoneContactRef}
              fields={[
                {
                  id: 'value',
                  component: (
                    <TextField
                      id="phone"
                      fullWidth
                      name="phone"
                      label={`${t('special-contacts.phone', { ns: 'recapiti' })}`}
                      variant="outlined"
                      size="small"
                      value={phoneFormik.values.phone}
                      onChange={(e) => handleChangeTouched(e, CourtesyChannelType.SMS)}
                      error={phoneFormik.touched.phone && Boolean(phoneFormik.errors.phone)}
                      helperText={phoneFormik.touched.phone && phoneFormik.errors.phone}
                    />
                  ),
                  isEditable: true,
                  size: 'variable',
                },
              ]}
              saveDisabled={!phoneFormik.isValid}
              onRemoveClick={() => {}}
              removeModalTitle={t('courtesy-contacts.remove-phone-title', { ns: 'recapiti' })}
              removeModalBody={t('courtesy-contacts.remove-phone-message', {
                phone: phoneFormik.values.phone,
                ns: 'recapiti',
              })}
            />
          </form>
        )}
        {!address.phone && '-'}
      </Grid>
      <Grid item lg xs={12}>
        {address.mail && (
          <form onSubmit={mailFormik.handleSubmit}>
            <DigitalContactElem
              ref={mailContactRef}
              fields={[
                {
                  id: 'value',
                  component: (
                    <TextField
                      id="mail"
                      fullWidth
                      name="mail"
                      label={`${t('special-contacts.mail', { ns: 'recapiti' })}`}
                      variant="outlined"
                      size="small"
                      value={mailFormik.values.mail}
                      onChange={(e) => handleChangeTouched(e, CourtesyChannelType.EMAIL)}
                      error={mailFormik.touched.mail && Boolean(mailFormik.errors.mail)}
                      helperText={mailFormik.touched.mail && mailFormik.errors.mail}
                    />
                  ),
                  isEditable: true,
                  size: 'variable',
                },
              ]}
              saveDisabled={!mailFormik.isValid}
              onRemoveClick={() => {}}
              removeModalTitle={t('courtesy-contacts.remove-email-title', { ns: 'recapiti' })}
              removeModalBody={t('courtesy-contacts.remove-email-message', {
                mail: mailFormik.values.mail,
                ns: 'recapiti',
              })}
            />
          </form>
        )}
        {!address.mail && '-'}
      </Grid>
    </Grid>
  );
});

export default SpecialContactElem;
