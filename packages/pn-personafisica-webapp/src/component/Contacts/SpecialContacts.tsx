import { ChangeEvent, Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ButtonNaked } from '@pagopa/mui-italia';

import { CourtesyChannelType, DigitalAddress, LegalChannelType } from '../../models/contacts';
import DigitalContactsCard from './DigitalContactsCard';

type Props = {
  recipientId: string;
  legalAddresses: Array<DigitalAddress>;
  courtesyAddresses: Array<DigitalAddress>;
};

const SpecialContacts = ({ recipientId, legalAddresses, courtesyAddresses }: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const senders = [
    { id: 'comune-milano', value: 'Comune di Milano' },
    { id: 'tribunale-milano', value: 'Tribunale di Milano' },
  ];
  const addressTypes = [
    { id: LegalChannelType.PEC, value: t('special-contacts.pec', { ns: 'recapiti' }) },
    { id: CourtesyChannelType.SMS, value: t('special-contacts.phone', { ns: 'recapiti' }) },
    { id: CourtesyChannelType.EMAIL, value: t('special-contacts.mail', { ns: 'recapiti' }) },
  ];
  const phoneRegExp = /^(38[890]|34[7-90]|36[680]|33[3-90]|32[89])\d{7}$/;

  const validationSchema = yup.object({
    sender: yup.string().required(),
    addressType: yup.string().required(),
    pec: yup.string().when('addressType', {
      is: LegalChannelType.PEC,
      then: yup
        .string()
        .required(t('legal-contacts.valid-pec', { ns: 'recapiti' }))
        .email(t('legal-contacts.valid-pec', { ns: 'recapiti' })),
    }),
    mail: yup.string().when('addressType', {
      is: CourtesyChannelType.EMAIL,
      then: yup
        .string()
        .required(t('special-contacts.valid-mail', { ns: 'recapiti' }))
        .email(t('special-contacts.valid-mail', { ns: 'recapiti' })),
    }),
    phone: yup.string().when('addressType', {
      is: CourtesyChannelType.SMS,
      then: yup
        .string()
        .required(t('special-contacts.valid-tel', { ns: 'recapiti' }))
        .matches(phoneRegExp, t('special-contacts.valid-tel', { ns: 'recapiti' })),
    }),
  });

  const formik = useFormik({
    initialValues: {
      sender: '',
      addressType: LegalChannelType.PEC as LegalChannelType | CourtesyChannelType,
      pec: '',
      mail: '',
      phone: '',
    },
    validationSchema,
    onSubmit: () => {},
  });

  const handleChangeTouched = (e: ChangeEvent) => {
    void formik.setFieldTouched(e.target.id, true, false);
    formik.handleChange(e);
  };

  const addresses: Array<{
    senderId: string;
    channelType: LegalChannelType | CourtesyChannelType;
    phone?: string;
    mail?: string;
    pec?: string;
  }> = legalAddresses
    .filter((a) => a.senderId !== 'default')
    .map((a) => ({
      senderId: a.senderId,
      channelType: a.channelType,
      pec: a.value,
    }));

  /* eslint-disable functional/immutable-data */
  const getAddress = (address: DigitalAddress) => ({
    senderId: address.senderId,
    channelType: address.channelType,
    phone: address.channelType === CourtesyChannelType.SMS ? address.value : undefined,
    mail: address.channelType === CourtesyChannelType.EMAIL ? address.value : undefined,
  });

  for (const address of courtesyAddresses.filter((a) => a.senderId !== 'default')) {
    // check if sender already exists in the list
    const addressIndex = addresses.findIndex((a) => a.senderId === address.senderId);
    const newAddress = getAddress(address);
    if (addressIndex === -1) {
      addresses.push(newAddress);
    } else {
      addresses[addressIndex].phone = newAddress.phone;
      addresses[addressIndex].mail = newAddress.mail;
    }
  }
  /* eslint-enable functional/immutable-data */

  console.log(recipientId);

  useEffect(() => {
    void formik.validateForm();
  }, []);

  return (
    <DigitalContactsCard
      sectionTitle=""
      title={t('special-contacts.title', { ns: 'recapiti' })}
      subtitle={t('special-contacts.subtitle', { ns: 'recapiti' })}
      avatar={null}
    >
      <Typography sx={{ marginTop: '20px' }}>
        {t('special-contacts.required-fileds', { ns: 'recapiti' })}
      </Typography>
      <form onSubmit={formik.handleSubmit} style={{ margin: '20px 0' }}>
        <Grid container direction="row" spacing={2} alignItems="center">
          <Grid item lg xs={12}>
            <TextField
              id="sender"
              label={`${t('special-contacts.sender', { ns: 'recapiti' })}*`}
              name="sender"
              value={formik.values.sender}
              onChange={formik.handleChange}
              select
              fullWidth
              size="small"
            >
              {senders.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.value}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item lg xs={12}>
            <TextField
              id="addressType"
              label={`${t('special-contacts.address-type', { ns: 'recapiti' })}*`}
              name="addressType"
              value={formik.values.addressType}
              onChange={formik.handleChange}
              select
              fullWidth
              size="small"
            >
              {addressTypes.map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  {a.value}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item lg xs={12}>
            {formik.values.addressType === LegalChannelType.PEC && (
              <TextField
                id="pec"
                label={`${t('special-contacts.pec', { ns: 'recapiti' })}*`}
                name="pec"
                value={formik.values.pec}
                onChange={handleChangeTouched}
                fullWidth
                variant="outlined"
                type="mail"
                size="small"
                error={formik.touched.pec && Boolean(formik.errors.pec)}
                helperText={formik.touched.pec && formik.errors.pec}
              />
            )}
            {formik.values.addressType === CourtesyChannelType.SMS && (
              <TextField
                id="phone"
                label={`${t('special-contacts.phone', { ns: 'recapiti' })}*`}
                name="phone"
                value={formik.values.phone}
                onChange={handleChangeTouched}
                fullWidth
                variant="outlined"
                type="tel"
                size="small"
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            )}
            {formik.values.addressType === CourtesyChannelType.EMAIL && (
              <TextField
                id="mail"
                label={`${t('special-contacts.mail', { ns: 'recapiti' })}*`}
                name="mail"
                value={formik.values.mail}
                onChange={handleChangeTouched}
                fullWidth
                variant="outlined"
                type="mail"
                size="small"
                error={formik.touched.mail && Boolean(formik.errors.mail)}
                helperText={formik.touched.mail && formik.errors.mail}
              />
            )}
          </Grid>
          <Grid item lg="auto" xs={12} textAlign="right">
            <ButtonNaked
              sx={{ marginLeft: 'auto' }}
              type="submit"
              disabled={!formik.isValid}
              color="primary"
            >
              {t('button.associa')}
            </ButtonNaked>
          </Grid>
        </Grid>
      </form>
      {addresses.length > 0 && (
        <Fragment>
          <Divider />
        </Fragment>
      )}
    </DigitalContactsCard>
  );
};

export default SpecialContacts;
