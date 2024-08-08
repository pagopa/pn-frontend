import { useFormik } from 'formik';
import { ChangeEvent, Fragment, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { TableCell, TableRow, Typography } from '@mui/material';
import { useIsMobile, useSpecialContactsContext } from '@pagopa-pn/pn-commons';

import { ChannelType, DigitalAddress } from '../../models/contacts';
import { deleteAddress } from '../../redux/contact/actions';
import { useAppDispatch } from '../../redux/hooks';
import {
  allowedAddressTypes,
  emailValidationSchema,
  pecValidationSchema,
  phoneValidationSchema,
} from '../../utility/contacts.utility';
import DeleteDialog from './DeleteDialog';
import DigitalContactElem from './DigitalContactElem';

type Props = {
  addresses: Array<DigitalAddress>;
};

type Field = {
  id: string;
  label: string;
  labelRoot: string;
  address?: DigitalAddress;
};

const reduceAddresses = <TValue,>(senderId: string, value: (type: string) => TValue) =>
  allowedAddressTypes.reduce((obj, type) => {
    // eslint-disable-next-line functional/immutable-data
    obj[`${senderId}_${type.toLowerCase()}`] = value(type);
    return obj;
  }, {} as { [key: string]: TValue });

const SpecialContactElem: React.FC<Props> = ({ addresses }) => {
  const { t } = useTranslation(['recapiti']);
  const isMobile = useIsMobile();
  const { contextEditMode, setContextEditMode } = useSpecialContactsContext();
  const dispatch = useAppDispatch();

  const digitalElemRef = useRef<{
    [key: string]: { editContact: () => void };
  }>(reduceAddresses(addresses[0].senderId, () => ({ editContact: () => {} })));

  const [showDeleteModal, setShowDeleteModal] = useState(
    reduceAddresses(addresses[0].senderId, () => false)
  );

  const initialValues = reduceAddresses(
    addresses[0].senderId,
    (type) => addresses.find((a) => a.channelType === type)?.value ?? ''
  );

  const fields: Array<Field> = allowedAddressTypes.map((type) => ({
    id: `${addresses[0].senderId}_${type.toLowerCase()}`,
    label: t(`special-contacts.${type.toLowerCase()}`, { ns: 'recapiti' }),
    labelRoot: type === ChannelType.PEC ? 'legal-contacts' : 'courtesy-contacts',
    address: addresses.find((a) => a.channelType === type),
  }));

  const validationSchema = yup.object({
    [`${addresses[0].senderId}_pec`]: pecValidationSchema(t),
    [`${addresses[0].senderId}_sms`]: phoneValidationSchema(t, true),
    [`${addresses[0].senderId}_email`]: emailValidationSchema(t),
  });

  const updateContact = async (status: 'validated' | 'cancelled', id: string) => {
    if (status === 'cancelled') {
      await formik.setFieldValue(id, initialValues[id], true);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    /** onSubmit validate */
    onSubmit: () => {},
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const toggleDeleteModal = (key: string) => {
    setShowDeleteModal((oldValue) => ({ ...oldValue, [key]: !oldValue[key] }));
  };

  const deleteConfirmHandler = (f: Field) => {
    if (!f.address) {
      return;
    }
    toggleDeleteModal(f.id);
    void dispatch(
      deleteAddress({
        addressType: f.address.addressType,
        senderId: addresses[0].senderId,
        channelType: f.address.channelType,
      })
    );
  };

  const jsxField = (f: Field) => (
    <>
      {f.address ? (
        <>
          <DeleteDialog
            showModal={showDeleteModal[f.id]}
            removeModalTitle={t(
              `${f.labelRoot}.remove-${f.address.channelType.toLowerCase()}-title`,
              {
                ns: 'recapiti',
              }
            )}
            removeModalBody={t(
              `${f.labelRoot}.remove-${f.address.channelType.toLowerCase()}-message`,
              {
                value: formik.values[f.id],
                ns: 'recapiti',
              }
            )}
            handleModalClose={() => toggleDeleteModal(f.id)}
            confirmHandler={() => deleteConfirmHandler(f)}
          />
          <form
            data-testid="specialContactForm"
            onSubmit={(e) => {
              e.preventDefault();
              digitalElemRef.current[f.id].editContact();
            }}
          >
            <DigitalContactElem
              senderId={addresses[0].senderId}
              senderName={f.address.senderName}
              contactType={f.address.channelType}
              inputProps={{
                id: f.id,
                name: f.id,
                label: f.label,
                value: formik.values[f.id],
                onChange: handleChangeTouched,
                error:
                  (formik.touched[f.id] || formik.values[f.id].length > 0) &&
                  Boolean(formik.errors[f.id]),
                helperText:
                  (formik.touched[f.id] || formik.values[f.id].length > 0) && formik.errors[f.id],
              }}
              saveDisabled={!!formik.errors[f.id]}
              onConfirm={(status) => updateContact(status, f.id)}
              onEditCancel={() => updateContact('cancelled', f.id)}
              // eslint-disable-next-line functional/immutable-data
              ref={(node: { editContact: () => void }) => (digitalElemRef.current[f.id] = node)}
              editDisabled={contextEditMode}
              setContextEditMode={setContextEditMode}
              onDelete={() => toggleDeleteModal(f.id)}
            />
          </form>
        </>
      ) : (
        '-'
      )}
    </>
  );

  if (isMobile) {
    return (
      <>
        <Typography fontWeight={600}>{t('special-contacts.sender', { ns: 'recapiti' })}</Typography>
        <Typography fontWeight={700} fontSize={16}>
          {addresses[0].senderName}
        </Typography>
        {fields.map((f) => (
          <Fragment key={f.id}>
            <Typography fontWeight={600} sx={{ marginTop: '20px', marginBottom: '10px' }}>
              {f.label}
            </Typography>
            {jsxField(f)}
          </Fragment>
        ))}
      </>
    );
  }

  return (
    <TableRow>
      <TableCell width="25%" sx={{ borderBottomColor: 'divider' }}>
        <Typography fontWeight={700}>{addresses[0].senderName}</Typography>
      </TableCell>
      {fields.map((f) => (
        <TableCell width="25%" key={f.id} sx={{ borderBottomColor: 'divider' }}>
          {jsxField(f)}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default SpecialContactElem;
