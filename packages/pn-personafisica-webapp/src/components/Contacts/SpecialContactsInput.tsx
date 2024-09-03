import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Box, Chip, MenuItem, TextField } from '@mui/material';
import {
  ApiErrorWrapper,
  PnAutocomplete,
  searchStringLimitReachedText,
} from '@pagopa-pn/pn-commons';

import { ChannelType } from '../../models/contacts';
import { Party } from '../../models/party';
import { CONTACT_ACTIONS, getAllActivatedParties } from '../../redux/contact/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import DropDownPartyMenuItem from '../Party/DropDownParty';
import { SpecialAddress } from './SpecialDigitalContacts';

type Props = {
  formik: ReturnType<typeof useFormik<{
    senders: Array<Party>;
    s_value: string;
  }>>;
  value: string;
  digitalAddresses: Array<SpecialAddress>;
  contactType: ChannelType;
  senders: Array<Party>;
  senderInputValue: string;
  setSenderInputValue: (value: string) => void;
};

const SpecialContactsInput: React.FC<Props> = ({
  formik,
  value,
  digitalAddresses,
  contactType,
  senders,
  senderInputValue,
  setSenderInputValue,
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['common', 'recapiti']);
  const parties = useAppSelector((state: RootState) => state.contactsState.parties);

  const [alreadyExistsMessage, setAlreadyExistsMessage] = useState('');

  const entitySearchLabel: string = `${t('special-contacts.add-sender', {
    ns: 'recapiti',
  })}${searchStringLimitReachedText(senderInputValue)}`;

  const getOptionLabel = (option: Party) => option.name || '';

  const getParties = () => {
    if (senderInputValue.length >= 4) {
      void dispatch(getAllActivatedParties({ paNameFilter: senderInputValue, blockLoading: true }));
    } else if (senderInputValue.length === 0) {
      void dispatch(getAllActivatedParties({ blockLoading: true }));
    }
  };

  const senderChangeHandler = async (_: any, newValue: Party | null) => {
    setSenderInputValue('');
    if (newValue) {
      const senders = [...formik.values.senders, newValue];
      await formik.setFieldValue('senders', senders);
      checkIfSenderIsAlreadyAdded(senders);
      return;
    }
    checkIfSenderIsAlreadyAdded(formik.values.senders);
  };

  const handleSenderDelete = async (sender: Party) => {
    const senders = formik.values.senders.filter((s) => s.id !== sender.id);
    await formik.setFieldValue('senders', senders);
    checkIfSenderIsAlreadyAdded(senders);
  };

  const checkIfSenderIsAlreadyAdded = (senders: Array<Party>) => {
    const alreadyExists = digitalAddresses.some(
      (addr) =>
        addr.value !== value &&
        addr.senders.some((sender) => senders.some((s) => s.id === sender.senderId))
    );
    if (alreadyExists) {
      setAlreadyExistsMessage(
        t(`special-contacts.${contactType}-already-exists`, {
          ns: 'recapiti',
        })
      );
      return;
    }
    setAlreadyExistsMessage('');
  };

  const renderOption = (props: any, option: Party) => (
    <MenuItem
      {...props}
      value={option.id}
      key={option.id}
      disabled={senders.findIndex((sender) => sender.id === option.id) > -1}
    >
      <DropDownPartyMenuItem name={option.name} />
    </MenuItem>
  );

  return (
    <>
      <ApiErrorWrapper
        apiId={CONTACT_ACTIONS.GET_ALL_ACTIVATED_PARTIES}
        mainText={t('special-contacts.fetch-party-error', { ns: 'recapiti' })}
        reloadAction={getParties}
      >
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
      </ApiErrorWrapper>
      <Box sx={{ mt: 2 }}>
        {senders.map((sender) => (
          <Chip
            data-testid="sender_chip"
            key={`${sender.id}_chip`}
            label={sender.name}
            onDelete={() => handleSenderDelete(sender)}
            sx={{ mr: 1, mb: 1 }}
          />
        ))}
      </Box>
      {alreadyExistsMessage && (
        <Alert severity="warning" sx={{ marginBottom: '20px' }} data-testid="alreadyExistsAlert">
          {alreadyExistsMessage}
        </Alert>
      )}
    </>
  );
};

export default SpecialContactsInput;
