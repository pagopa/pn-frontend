import { ChangeEvent, Fragment, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useIsMobile } from '@pagopa-pn/pn-commons';

import { CourtesyChannelType, DigitalAddress, LegalChannelType } from '../../models/contacts';
import { phoneRegExp } from '../../utils/contacts.utility';
import DigitalContactsCard from './DigitalContactsCard';
import SpecialContactElem from './SpecialContactElem';
import { useDigitalContactsCodeVerificationContext } from './DigitalContactsCodeVerification.context';

type Props = {
  recipientId: string;
  legalAddresses: Array<DigitalAddress>;
  courtesyAddresses: Array<DigitalAddress>;
};

type Address = {
  senderId: string;
  phone?: string;
  mail?: string;
  pec?: string;
};

const SpecialContacts = ({ recipientId, legalAddresses, courtesyAddresses }: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const [addresses, setAddresses] = useState([] as Array<Address>);
  const [alreadyExistsMessage, setAlreadyExistsMessage] = useState('');
  const { initValidation } = useDigitalContactsCodeVerificationContext();
  const isMobile = useIsMobile();
  const senders = useMemo(
    () => [
      { id: 'comune-milano', value: 'Comune di Milano' },
      { id: 'tribunale-milano', value: 'Tribunale di Milano' },
    ],
    []
  );
  const addressTypes = useMemo(
    () => [
      { id: LegalChannelType.PEC, value: t('special-contacts.pec', { ns: 'recapiti' }) },
      { id: CourtesyChannelType.SMS, value: t('special-contacts.phone', { ns: 'recapiti' }) },
      { id: CourtesyChannelType.EMAIL, value: t('special-contacts.mail', { ns: 'recapiti' }) },
    ],
    []
  );
  const listHeaders = useMemo(
    () => [
      {
        id: 'sender',
        label: t('special-contacts.sender', { ns: 'recapiti' }),
      },
      {
        id: 'pec',
        label: t('special-contacts.pec', { ns: 'recapiti' }),
      },
      {
        id: 'phone',
        label: t('special-contacts.phone', { ns: 'recapiti' }),
      },
      {
        id: 'mail',
        label: t('special-contacts.mail', { ns: 'recapiti' }),
      },
    ],
    []
  );

  const validationSchema = yup.object({
    sender: yup.string().required(),
    addressType: yup.string().required(),
    s_pec: yup.string().when('addressType', {
      is: LegalChannelType.PEC,
      then: yup
        .string()
        .required(t('legal-contacts.valid-pec', { ns: 'recapiti' }))
        .email(t('legal-contacts.valid-pec', { ns: 'recapiti' })),
    }),
    s_mail: yup.string().when('addressType', {
      is: CourtesyChannelType.EMAIL,
      then: yup
        .string()
        .required(t('courtesy-contacts.valid-email', { ns: 'recapiti' }))
        .email(t('courtesy-contacts.valid-email', { ns: 'recapiti' })),
    }),
    s_phone: yup.string().when('addressType', {
      is: CourtesyChannelType.SMS,
      then: yup
        .string()
        .required(t('courtesy-contacts.valid-phone', { ns: 'recapiti' }))
        .matches(phoneRegExp, t('courtesy-contacts.valid-phone', { ns: 'recapiti' })),
    }),
  });

  const formik = useFormik({
    initialValues: {
      sender: '',
      addressType: LegalChannelType.PEC as LegalChannelType | CourtesyChannelType,
      s_pec: '',
      s_mail: '',
      s_phone: '',
    },
    validateOnMount: true,
    validationSchema,
    onSubmit: (values) => {
      initValidation(
        values.addressType,
        values.s_pec || values.s_mail || values.s_phone,
        recipientId,
        values.sender,
        (status: 'validated' | 'cancelled') => {
          if (status === 'validated') {
            // reset form
            formik.resetForm();
          }
        }
      );
    },
  });

  const handleChangeTouched = (e: ChangeEvent) => {
    void formik.setFieldTouched(e.target.id, true, false);
    formik.handleChange(e);
  };

  const senderChangeHandler = (e: ChangeEvent) => {
    formik.handleChange(e);
    if (formik.values.addressType === LegalChannelType.PEC) {
      const alreadyExists =
        addresses.findIndex((a) => a.senderId === (e.target as any).value && a.pec) > -1;
      setAlreadyExistsMessage(
        alreadyExists ? t('special-contacts.pec-already-exists', { ns: 'recapiti' }) : ''
      );
    } else if (formik.values.addressType === CourtesyChannelType.EMAIL) {
      const alreadyExists =
        addresses.findIndex((a) => a.senderId === (e.target as any).value && a.mail) > -1;
      setAlreadyExistsMessage(
        alreadyExists ? t('special-contacts.email-already-exists', { ns: 'recapiti' }) : ''
      );
    } else {
      const alreadyExists =
        addresses.findIndex((a) => a.senderId === (e.target as any).value && a.phone) > -1;
      setAlreadyExistsMessage(
        alreadyExists ? t('special-contacts.phone-already-exists', { ns: 'recapiti' }) : ''
      );
    }
  };

  const addressTypeChangeHandler = async (e: ChangeEvent) => {
    if ((e.target as any).value === LegalChannelType.PEC) {
      await formik.setFieldValue('s_mail', '');
      await formik.setFieldValue('s_phone', '');
      const alreadyExists =
        addresses.findIndex((a) => a.senderId === formik.values.sender && a.pec) > -1;
      setAlreadyExistsMessage(
        alreadyExists ? t('special-contacts.pec-already-exists', { ns: 'recapiti' }) : ''
      );
    } else if ((e.target as any).value === CourtesyChannelType.EMAIL) {
      await formik.setFieldValue('s_pec', '');
      await formik.setFieldValue('s_phone', '');
      const alreadyExists =
        addresses.findIndex((a) => a.senderId === formik.values.sender && a.mail) > -1;
      setAlreadyExistsMessage(
        alreadyExists ? t('special-contacts.email-already-exists', { ns: 'recapiti' }) : ''
      );
    } else {
      await formik.setFieldValue('s_pec', '');
      await formik.setFieldValue('s_mail', '');
      const alreadyExists =
        addresses.findIndex((a) => a.senderId === formik.values.sender && a.phone) > -1;
      setAlreadyExistsMessage(
        alreadyExists ? t('special-contacts.phone-already-exists', { ns: 'recapiti' }) : ''
      );
    }
    formik.handleChange(e);
  };

  useEffect(() => {
    const addressesList: Array<Address> = legalAddresses
      .filter((a) => a.senderId !== 'default')
      .map((a) => ({
        senderId: a.senderId,
        channelType: a.channelType,
        pec: a.value,
      }));

    /* eslint-disable functional/immutable-data */
    const getAddress = (address: DigitalAddress) => ({
      senderId: address.senderId,
      phone: address.channelType === CourtesyChannelType.SMS ? address.value : undefined,
      mail: address.channelType === CourtesyChannelType.EMAIL ? address.value : undefined,
    });

    for (const address of courtesyAddresses.filter((a) => a.senderId !== 'default')) {
      // check if sender already exists in the list
      const addressIndex = addressesList.findIndex((a) => a.senderId === address.senderId);
      const newAddress = getAddress(address);
      if (addressIndex === -1) {
        addressesList.push(newAddress);
      } else if (address.channelType === CourtesyChannelType.SMS) {
        addressesList[addressIndex].phone = newAddress.phone;
      } else {
        addressesList[addressIndex].mail = newAddress.mail;
      }
    }
    /* eslint-enable functional/immutable-data */

    setAddresses(addressesList);
  }, [legalAddresses, courtesyAddresses]);

  return (
    <DigitalContactsCard
      sectionTitle=""
      title=""
      subtitle={t('special-contacts.subtitle', { ns: 'recapiti' })}
      avatar={null}
    >
      <Typography sx={{ marginTop: '20px' }}>
        {t('special-contacts.required-fileds', { ns: 'recapiti' })}
      </Typography>
      <form style={{ margin: '20px' }} onSubmit={formik.handleSubmit}>
        <Grid container direction="row" spacing={2} alignItems="center">
          <Grid item lg xs={12}>
            <TextField
              id="sender"
              label={`${t('special-contacts.sender', { ns: 'recapiti' })}*`}
              name="sender"
              value={formik.values.sender}
              onChange={senderChangeHandler}
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
              onChange={addressTypeChangeHandler}
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
                id="s_pec"
                label={`${t('special-contacts.pec', { ns: 'recapiti' })}*`}
                name="s_pec"
                value={formik.values.s_pec}
                onChange={handleChangeTouched}
                fullWidth
                variant="outlined"
                type="mail"
                size="small"
                error={formik.touched.s_pec && Boolean(formik.errors.s_pec)}
                helperText={formik.touched.s_pec && formik.errors.s_pec}
              />
            )}
            {formik.values.addressType === CourtesyChannelType.SMS && (
              <TextField
                id="s_phone"
                label={`${t('special-contacts.phone', { ns: 'recapiti' })}*`}
                name="s_phone"
                value={formik.values.s_phone}
                onChange={handleChangeTouched}
                fullWidth
                variant="outlined"
                type="tel"
                size="small"
                error={formik.touched.s_phone && Boolean(formik.errors.s_phone)}
                helperText={formik.touched.s_phone && formik.errors.s_phone}
              />
            )}
            {formik.values.addressType === CourtesyChannelType.EMAIL && (
              <TextField
                id="s_mail"
                label={`${t('special-contacts.mail', { ns: 'recapiti' })}*`}
                name="s_mail"
                value={formik.values.s_mail}
                onChange={handleChangeTouched}
                fullWidth
                variant="outlined"
                type="mail"
                size="small"
                error={formik.touched.s_mail && Boolean(formik.errors.s_mail)}
                helperText={formik.touched.s_mail && formik.errors.s_mail}
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
      {alreadyExistsMessage && (
        <Alert severity="warning" sx={{ marginBottom: '20px' }}>
          {alreadyExistsMessage}
        </Alert>
      )}
      {addresses.length > 0 && (
        <Fragment>
          <Typography fontWeight={600} sx={{ marginTop: '80px' }}>
            {t('special-contacts.associated', { ns: 'recapiti' })}
          </Typography>
          {!isMobile && (
            <Table aria-label={t('special-contacts.associated', { ns: 'recapiti' })}>
              <TableHead>
                <TableRow>
                  {listHeaders.map((h) => (
                    <TableCell width="25%" key={h.id} sx={{ borderBottomColor: 'divider' }}>
                      {h.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {addresses.map((a) => (
                  <SpecialContactElem
                    key={a.senderId}
                    address={a}
                    senders={senders}
                    recipientId={recipientId}
                  />
                ))}
              </TableBody>
            </Table>
          )}
          {isMobile &&
            addresses.map((a) => (
              <Card
                key={a.senderId}
                sx={{
                  border: '1px solid',
                  borderRadius: '8px',
                  borderColor: 'divider',
                  marginTop: '20px',
                }}
              >
                <CardContent>
                  <SpecialContactElem address={a} senders={senders} recipientId={recipientId} />
                </CardContent>
              </Card>
            ))}
        </Fragment>
      )}
    </DigitalContactsCard>
  );
};

export default SpecialContacts;
