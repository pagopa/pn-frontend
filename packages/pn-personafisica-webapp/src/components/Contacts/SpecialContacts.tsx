import { useFormik } from 'formik';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import {
  Alert,
  Box,
  Card,
  CardContent,
  InputAdornment,
  MenuItem,
  Stack,
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
  searchStringLimitReachedText,
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { ChannelType, DigitalAddress } from '../../models/contacts';
import { Party } from '../../models/party';
import { CONTACT_ACTIONS, getAllActivatedParties } from '../../redux/contact/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import {
  allowedAddressTypes,
  emailValidationSchema,
  internationalPhonePrefix,
  pecValidationSchema,
  phoneValidationSchema,
} from '../../utility/contacts.utility';
import DropDownPartyMenuItem from '../Party/DropDownParty';
import DigitalContactsCard from './DigitalContactsCard';
import { useDigitalContactsCodeVerificationContext } from './DigitalContactsCodeVerification.context';
import SpecialContactElem from './SpecialContactElem';

type Props = {
  digitalAddresses: Array<DigitalAddress>;
};

type Addresses = {
  [senderId: string]: Array<DigitalAddress>;
};

type AddressType = {
  id: ChannelType;
  value: string;
};

const SpecialContacts = ({ digitalAddresses }: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const [alreadyExistsMessage, setAlreadyExistsMessage] = useState('');
  const { initValidation } = useDigitalContactsCodeVerificationContext();
  const parties = useAppSelector((state: RootState) => state.contactsState.parties);
  const isMobile = useIsMobile();
  const [senderInputValue, setSenderInputValue] = useState('');

  const addressTypes: Array<AddressType> = digitalAddresses
    .filter((a) => a.senderId === 'default' && allowedAddressTypes.includes(a.channelType))
    .map((a) => ({
      id: a.channelType,
      value: t(`special-contacts.${a.channelType.toLowerCase()}`, { ns: 'recapiti' }),
    }));

  const listHeaders = [
    {
      id: 'sender',
      label: t('special-contacts.sender', { ns: 'recapiti' }),
    },
    ...allowedAddressTypes.map((type) => ({
      id: type.toLowerCase(),
      label: t(`special-contacts.${type.toLowerCase()}`, { ns: 'recapiti' }),
    })),
  ];

  const addresses: Addresses = digitalAddresses
    .filter((a) => a.senderId !== 'default')
    .reduce((obj, a) => {
      if (!obj[a.senderId]) {
        // eslint-disable-next-line functional/immutable-data
        obj[a.senderId] = [];
      }
      // eslint-disable-next-line functional/immutable-data
      obj[a.senderId].push(a);
      return obj;
    }, {} as Addresses);

  const fetchAllActivatedParties = useCallback(() => {
    void dispatch(getAllActivatedParties({}));
  }, []);

  const validationSchema = yup.object({
    sender: yup.object({ id: yup.string(), name: yup.string() }).required(),
    addressType: yup.string().required(),
    s_value: yup
      .string()
      .when('addressType', {
        is: ChannelType.PEC,
        then: pecValidationSchema(t),
      })
      .when('addressType', {
        is: ChannelType.EMAIL,
        then: emailValidationSchema(t),
      })
      .when('addressType', {
        is: ChannelType.SMS,
        then: phoneValidationSchema(t),
      }),
  });

  const initialValues = {
    sender: { id: '', name: '' },
    addressType: addressTypes[0]?.id,
    s_value: '',
  };

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (values.addressType) {
        initValidation(
          values.addressType,
          values.addressType === ChannelType.SMS
            ? internationalPhonePrefix + values.s_value
            : values.s_value,
          values.sender.id,
          values.sender.name,
          async (status: 'validated' | 'cancelled') => {
            if (status === 'validated') {
              // reset form
              formik.resetForm();
              await formik.validateForm();
              setSenderInputValue('');
            }
          },
          true
        );
      }
    },
  });

  const renderOption = (props: any, option: Party) => (
    <MenuItem {...props} value={option.id} key={option.id}>
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
    setSenderInputValue(newValue?.name ?? '');
    if (newValue && addresses[newValue.id]) {
      const alreadyExists =
        addresses[newValue.id].findIndex((a) => a.channelType === formik.values.addressType) > -1;
      setAlreadyExistsMessage(
        alreadyExists
          ? t(`special-contacts.${formik.values.addressType.toLowerCase()}-already-exists`, {
              ns: 'recapiti',
            })
          : ''
      );
      return;
    }
    setAlreadyExistsMessage('');
  };

  const addressTypeChangeHandler = async (e: ChangeEvent) => {
    await formik.setFieldValue('s_value', '');
    formik.handleChange(e);
    if (addresses[formik.values.sender.id]) {
      const alreadyExists =
        addresses[formik.values.sender.id].findIndex(
          (a) => a.channelType === (e.target as any).value
        ) > -1;
      setAlreadyExistsMessage(
        alreadyExists
          ? t(`special-contacts.${(e.target as any).value.toLowerCase()}-already-exists`, {
              ns: 'recapiti',
            })
          : ''
      );
      return;
    }
    setAlreadyExistsMessage('');
  };

  useEffect(() => {
    if (senderInputValue.length >= 4) {
      void dispatch(getAllActivatedParties({ paNameFilter: senderInputValue, blockLoading: true }));
    } else if (senderInputValue.length === 0) {
      void dispatch(getAllActivatedParties({ blockLoading: true }));
    }
  }, [senderInputValue]);

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
        <form
          style={{ margin: '20px 0' }}
          onSubmit={formik.handleSubmit}
          data-testid="specialContact"
        >
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
            <PnAutocomplete
              id="sender"
              data-testid="sender"
              size="small"
              options={parties ?? []}
              autoComplete
              getOptionLabel={getOptionLabel}
              noOptionsText={t('common.enti-not-found', { ns: 'recapiti' })}
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
              sx={{ flexGrow: 1, flexBasis: 0 }}
            />
            <CustomDropdown
              id="addressType"
              label={`${t('special-contacts.address-type', { ns: 'recapiti' })}*`}
              name="addressType"
              value={formik.values.addressType}
              onChange={addressTypeChangeHandler}
              size="small"
              sx={{ flexGrow: 1, flexBasis: 0 }}
            >
              {addressTypes.map((a) => (
                <MenuItem id={`dropdown-${a.id}`} key={a.id} value={a.id}>
                  {a.value}
                </MenuItem>
              ))}
            </CustomDropdown>
            <TextField
              id="s_value"
              label={
                t(`special-contacts.${formik.values.addressType.toLowerCase()}`, {
                  ns: 'recapiti',
                }) + '*'
              }
              name="s_value"
              value={formik.values.s_value}
              onChange={handleChangeTouched}
              variant="outlined"
              size="small"
              error={formik.touched.s_value && Boolean(formik.errors.s_value)}
              helperText={formik.touched.s_value && formik.errors.s_value}
              InputProps={
                formik.values.addressType === ChannelType.SMS
                  ? {
                      startAdornment: (
                        <InputAdornment position="start">{internationalPhonePrefix}</InputAdornment>
                      ),
                    }
                  : {}
              }
              sx={{ flexGrow: 1, flexBasis: 0 }}
            />
            <Box sx={{ textAlign: 'right' }}>
              <ButtonNaked
                sx={{ marginLeft: 'auto', height: '40px' }}
                type="submit"
                disabled={
                  !formik.isValid || senderInputValue.length > 80 || senderInputValue.length === 0
                }
                color="primary"
                data-testid="addSpecialButton"
                id="addSpecialButton"
              >
                {t('button.associa')}
              </ButtonNaked>
            </Box>
          </Stack>
        </form>
        {alreadyExistsMessage && (
          <Alert severity="warning" sx={{ marginBottom: '20px' }} data-testid="alreadyExistsAlert">
            {alreadyExistsMessage}
          </Alert>
        )}
        <SpecialContactsProvider>
          {Object.keys(addresses).length > 0 && (
            <>
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
                    {Object.entries(addresses).map(([senderId, addr]) => (
                      <SpecialContactElem key={senderId} addresses={addr} />
                    ))}
                  </TableBody>
                </Table>
              )}
              {isMobile &&
                Object.entries(addresses).map(([senderId, addr]) => (
                  <Card
                    key={senderId}
                    sx={{
                      border: '1px solid',
                      borderRadius: '8px',
                      borderColor: 'divider',
                      marginTop: '20px',
                    }}
                  >
                    <CardContent>
                      <SpecialContactElem key={senderId} addresses={addr} />
                    </CardContent>
                  </Card>
                ))}
            </>
          )}
        </SpecialContactsProvider>
      </DigitalContactsCard>
    </ApiErrorWrapper>
  );
};

export default SpecialContacts;
