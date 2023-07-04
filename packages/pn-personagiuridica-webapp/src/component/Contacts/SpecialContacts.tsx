import {
  Alert,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  ApiErrorWrapper,
  CustomDropdown,
  PnAutocomplete,
  SpecialContactsProvider,
  dataRegex,
  searchStringLimitReachedText,
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useFormik } from 'formik';
import { ChangeEvent, Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Party } from '../../models/party';
import { CONTACT_ACTIONS, getAllActivatedParties } from '../../redux/contact/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';

import { CourtesyChannelType, DigitalAddress, LegalChannelType } from '../../models/contacts';
import { internationalPhonePrefix } from '../../utils/contacts.utility';
import DropDownPartyMenuItem from '../Party/DropDownParty';
import DigitalContactsCard from './DigitalContactsCard';
import { useDigitalContactsCodeVerificationContext } from './DigitalContactsCodeVerification.context';
import SpecialContactElem from './SpecialContactElem';

type Props = {
  recipientId: string;
  legalAddresses: Array<DigitalAddress>;
  courtesyAddresses: Array<DigitalAddress>;
};

type Address = {
  senderId: string;
  senderName: string;
  phone?: string;
  mail?: string;
  pec?: string;
};

type SpecialContacts = {
  sender: Party;
  addressType: LegalChannelType | CourtesyChannelType | undefined;
  s_pec: string;
  s_mail: string;
  s_phone: string;
};

type AddressType = {
  id: LegalChannelType | CourtesyChannelType;
  value: string;
  show: boolean;
};

const SpecialContacts = ({ recipientId, legalAddresses, courtesyAddresses }: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const [addresses, setAddresses] = useState([] as Array<Address>);
  const [alreadyExistsMessage, setAlreadyExistsMessage] = useState('');
  const { initValidation } = useDigitalContactsCodeVerificationContext();
  const parties = useAppSelector((state: RootState) => state.contactsState.parties);
  const isMobile = useIsMobile();
  const [senderInputValue, setSenderInputValue] = useState('');

  const addressTypes = useMemo(
    (): Array<AddressType> => [
      {
        id: LegalChannelType.PEC,
        value: t('special-contacts.pec', { ns: 'recapiti' }),
        show: legalAddresses.some(
          (a) => a.senderId === 'default' && a.channelType === LegalChannelType.PEC
        ),
      },
      {
        id: CourtesyChannelType.SMS,
        value: t('special-contacts.phone', { ns: 'recapiti' }),
        show: courtesyAddresses.some(
          (a) => a.senderId === 'default' && a.channelType === CourtesyChannelType.SMS
        ),
      },
      {
        id: CourtesyChannelType.EMAIL,
        value: t('special-contacts.mail', { ns: 'recapiti' }),
        show: courtesyAddresses.some(
          (a) => a.senderId === 'default' && a.channelType === CourtesyChannelType.EMAIL
        ),
      },
    ],
    [legalAddresses, courtesyAddresses]
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

  const fetchAllActivatedParties = useCallback(() => {
    void dispatch(getAllActivatedParties({}));
  }, []);

  useEffect(() => {
    if (senderInputValue.length >= 4) {
      void dispatch(getAllActivatedParties({ paNameFilter: senderInputValue, blockLoading: true }));
    } else if (senderInputValue.length === 0) {
      void dispatch(getAllActivatedParties({ blockLoading: true }));
    }
  }, [senderInputValue]);

  const validationSchema = yup.object({
    sender: yup.object({ id: yup.string(), name: yup.string() }).required(),
    addressType: yup.string().required(),
    s_pec: yup.string().when('addressType', {
      is: LegalChannelType.PEC,
      then: yup
        .string()
        .required(t('legal-contacts.valid-pec', { ns: 'recapiti' }))
        .matches(dataRegex.email, t('legal-contacts.valid-pec', { ns: 'recapiti' })),
    }),
    s_mail: yup.string().when('addressType', {
      is: CourtesyChannelType.EMAIL,
      then: yup
        .string()
        .required(t('courtesy-contacts.valid-email', { ns: 'recapiti' }))
        .matches(dataRegex.email, t('courtesy-contacts.valid-email', { ns: 'recapiti' })),
    }),
    s_phone: yup.string().when('addressType', {
      is: CourtesyChannelType.SMS,
      then: yup
        .string()
        .required(t('courtesy-contacts.valid-phone', { ns: 'recapiti' }))
        .matches(dataRegex.phoneNumber, t('courtesy-contacts.valid-phone', { ns: 'recapiti' })),
    }),
  });

  const initialValues = useMemo(
    () => ({
      sender: { id: '', name: '' } as Party,
      addressType: addressTypes.find((a: AddressType) => a.show)?.id,
      s_pec: '',
      s_mail: '',
      s_phone: '',
    }),
    [addressTypes]
  );

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    validationSchema,
    onSubmit: (values) => {
      if (values.addressType) {
        initValidation(
          values.addressType,
          values.s_pec || values.s_mail || internationalPhonePrefix + values.s_phone,
          recipientId,
          values.sender.id,
          values.sender.name,
          async (status: 'validated' | 'cancelled') => {
            if (status === 'validated') {
              // reset form
              formik.resetForm();
              await formik.validateForm();
              setSenderInputValue('');
            }
          }
        );
      }
    },
  });

  const renderOption = (props: any, option: Party) => (
    <MenuItem {...props} value={option.id} key={option.id} role="option">
      <DropDownPartyMenuItem name={option.name} />
    </MenuItem>
  );

  const getOptionLabel = (option: Party) => option.name || '';

  // handling of search string for sender
  const entitySearchLabel: string = `${t('special-contacts.sender', {
    ns: 'recapiti',
  })}${searchStringLimitReachedText(senderInputValue)}`;

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const senderChangeHandler = async (_: any, newValue: Party | null) => {
    await formik.setFieldTouched('sender', true, false);
    await formik.setFieldValue('sender', newValue);
    // formik.handleChange(e);
    setSenderInputValue(newValue?.name || '');
    if (formik.values.addressType === LegalChannelType.PEC) {
      const alreadyExists = addresses.findIndex((a) => a.senderId === newValue?.id && a.pec) > -1;
      setAlreadyExistsMessage(
        alreadyExists ? t('special-contacts.pec-already-exists', { ns: 'recapiti' }) : ''
      );
    } else if (formik.values.addressType === CourtesyChannelType.EMAIL) {
      const alreadyExists = addresses.findIndex((a) => a.senderId === newValue?.id && a.mail) > -1;
      setAlreadyExistsMessage(
        alreadyExists ? t('special-contacts.email-already-exists', { ns: 'recapiti' }) : ''
      );
    } else {
      const alreadyExists = addresses.findIndex((a) => a.senderId === newValue?.id && a.phone) > -1;
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
        addresses.findIndex((a) => a.senderId === formik.values.sender.id && a.pec) > -1;
      setAlreadyExistsMessage(
        alreadyExists ? t('special-contacts.pec-already-exists', { ns: 'recapiti' }) : ''
      );
    } else if ((e.target as any).value === CourtesyChannelType.EMAIL) {
      await formik.setFieldValue('s_pec', '');
      await formik.setFieldValue('s_phone', '');
      const alreadyExists =
        addresses.findIndex((a) => a.senderId === formik.values.sender.id && a.mail) > -1;
      setAlreadyExistsMessage(
        alreadyExists ? t('special-contacts.email-already-exists', { ns: 'recapiti' }) : ''
      );
    } else {
      await formik.setFieldValue('s_pec', '');
      await formik.setFieldValue('s_mail', '');
      const alreadyExists =
        addresses.findIndex((a) => a.senderId === formik.values.sender.id && a.phone) > -1;
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
        senderName: a.senderName || a.senderId,
        channelType: a.channelType,
        pec: a.value,
      }));

    /* eslint-disable functional/immutable-data */
    const getAddress = (address: DigitalAddress) => ({
      senderId: address.senderId,
      senderName: address.senderName || address.senderId,
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

  useEffect(() => {
    // set form value
    if (!addressTypes.find((a) => a.show && a.id === formik.values.addressType)) {
      const type = addressTypes.find((a) => a.show)?.id as LegalChannelType | CourtesyChannelType;
      void formik.setFieldValue('addressType', type);
    }
  }, [addressTypes]);

  return (
    <ApiErrorWrapper
      apiId={CONTACT_ACTIONS.GET_ALL_ACTIVATED_PARTIES}
      reloadAction={fetchAllActivatedParties}
      mainText={t('special-contacts.fetch-party-error', { ns: 'recapiti' })}
    >
      <DigitalContactsCard
        sectionTitle=""
        title=""
        subtitle={t('special-contacts.subtitle', { ns: 'recapiti' })}
        avatar={null}
      >
        <Typography sx={{ marginTop: '20px' }}>{t('required-fields')}</Typography>
        <form style={{ margin: '20px 0' }} onSubmit={formik.handleSubmit}>
          <Grid container direction="row" spacing={2} alignItems="flex">
            <Grid item lg xs={12}>
              <PnAutocomplete
                id="sender"
                size="small"
                options={parties}
                fullWidth
                autoComplete
                noOptionsText={t('common.enti-not-found', { ns: 'recapiti' })}
                getOptionLabel={getOptionLabel}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={senderChangeHandler}
                inputValue={senderInputValue}
                onInputChange={(_event, newInputValue, reason) => {
                  if (reason === 'input') {
                    setSenderInputValue(newInputValue);
                  }
                }}
                filterOptions={(e) => e}
                renderOption={renderOption}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="sender"
                    label={entitySearchLabel}
                    error={senderInputValue.length > 80}
                    helperText={
                      senderInputValue.length > 80 && t('too-long-field-error', { maxLength: 80 })
                    }
                  />
                )}
              />
            </Grid>
            <Grid item lg xs={12}>
              <CustomDropdown
                id="addressType"
                label={`${t('special-contacts.address-type', { ns: 'recapiti' })}*`}
                name="addressType"
                value={formik.values.addressType}
                onChange={addressTypeChangeHandler}
                fullWidth
                size="small"
              >
                {addressTypes
                  .filter((a) => a.show)
                  .map((a) => (
                    <MenuItem key={a.id} value={a.id}>
                      {a.value}
                    </MenuItem>
                  ))}
              </CustomDropdown>
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">{internationalPhonePrefix}</InputAdornment>
                    ),
                  }}
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
                sx={{ marginLeft: 'auto', height: '40px' }}
                type="submit"
                disabled={
                  !formik.isValid || senderInputValue.length > 80 || senderInputValue.length === 0
                }
                color="primary"
                data-testid="Special contact add button"
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
        <SpecialContactsProvider>
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
                      <SpecialContactElem key={a.senderId} address={a} recipientId={recipientId} />
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
                      <SpecialContactElem address={a} recipientId={recipientId} />
                    </CardContent>
                  </Card>
                ))}
            </Fragment>
          )}
        </SpecialContactsProvider>
      </DigitalContactsCard>
    </ApiErrorWrapper>
  );
};

export default SpecialContacts;
