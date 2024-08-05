import { useFormik } from 'formik';
import { ChangeEvent, Fragment, memo, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { TableCell, TableRow, TextField, Typography } from '@mui/material';
import { dataRegex, useIsMobile, useSpecialContactsContext } from '@pagopa-pn/pn-commons';

import { AddressType, CourtesyChannelType, LegalChannelType } from '../../models/contacts';
import { deleteAddress } from '../../redux/contact/actions';
import { useAppDispatch } from '../../redux/hooks';
import DeleteDialog from './DeleteDialog';
import DigitalContactElem from './DigitalContactElem';

type Props = {
  address: {
    senderId: string;
    senderName: string;
    phone?: string;
    mail?: string;
    pec?: string;
  };
};

type Field = {
  addressId: 'pec' | 'mail' | 'phone';
  id: string;
  contactType: LegalChannelType | CourtesyChannelType;
  label: string;
  labelRoot: string;
};

const addressTypeToLabel = {
  mail: 'email',
  pec: 'pec',
  phone: 'phone',
};

// TODO: disable complexity for now.
// we will fix it when we will complete the rework
// eslint-disable-next-line sonarjs/cognitive-complexity
const SpecialContactElem = memo(({ address }: Props) => {
  const { t } = useTranslation(['recapiti']);
  const isMobile = useIsMobile();
  const { contextEditMode, setContextEditMode } = useSpecialContactsContext();
  const [showDeleteModal, setShowDeleteModal] = useState({
    [`${address.senderId}_pec`]: false,
    [`${address.senderId}_phone`]: false,
    [`${address.senderId}_mail`]: false,
  });
  const dispatch = useAppDispatch();
  const digitalElemRef = useRef<{
    [key: string]: { editContact: () => void };
  }>({
    [`${address.senderId}_pec`]: { editContact: () => {} },
    [`${address.senderId}_phone`]: { editContact: () => {} },
    [`${address.senderId}_mail`]: { editContact: () => {} },
  });

  const toggleDeleteModal = (key: string) => {
    setShowDeleteModal((oldValue) => ({ ...oldValue, [key]: !oldValue[key] }));
  };

  const deleteConfirmHandler = (f: Field) => {
    toggleDeleteModal(f.id);
    void dispatch(
      deleteAddress({
        addressType: f.addressId === 'pec' ? AddressType.LEGAL : AddressType.COURTESY,
        senderId: address.senderId,
        channelType: f.contactType,
      })
    );
  };

  const initialValues = {
    [`${address.senderId}_pec`]: address.pec ?? '',
    [`${address.senderId}_phone`]: address.phone ?? '',
    [`${address.senderId}_mail`]: address.mail ?? '',
  };

  const fields: Array<Field> = useMemo(
    () => [
      {
        addressId: 'pec',
        id: `${address.senderId}_pec`,
        contactType: LegalChannelType.PEC,
        label: t('special-contacts.pec', { ns: 'recapiti' }),
        labelRoot: 'legal-contacts',
      },
      {
        addressId: 'phone',
        id: `${address.senderId}_phone`,
        contactType: CourtesyChannelType.SMS,
        label: t('special-contacts.phone', { ns: 'recapiti' }),
        labelRoot: 'courtesy-contacts',
      },
      {
        addressId: 'mail',
        id: `${address.senderId}_mail`,
        contactType: CourtesyChannelType.EMAIL,
        label: t('special-contacts.mail', { ns: 'recapiti' }),
        labelRoot: 'courtesy-contacts',
      },
    ],
    []
  );

  const validationSchema = yup.object({
    [`${address.senderId}_pec`]: yup
      .string()
      .required(t('legal-contacts.valid-pec', { ns: 'recapiti' }))
      .max(254, t('common.too-long-field-error', { ns: 'recapiti', maxLength: 254 }))
      .matches(dataRegex.email, t('legal-contacts.valid-pec', { ns: 'recapiti' })),
    [`${address.senderId}_phone`]: yup
      .string()
      .required(t('courtesy-contacts.valid-phone', { ns: 'recapiti' }))
      .matches(
        dataRegex.phoneNumberWithItalyPrefix,
        t('courtesy-contacts.valid-phone', { ns: 'recapiti' })
      ),
    [`${address.senderId}_mail`]: yup
      .string()
      .required(t('courtesy-contacts.valid-email', { ns: 'recapiti' }))
      .max(254, t('common.too-long-field-error', { ns: 'recapiti', maxLength: 254 }))
      .matches(dataRegex.email, t('courtesy-contacts.valid-email', { ns: 'recapiti' })),
  });

  const updateContact = async (status: 'validated' | 'cancelled', id: string) => {
    if (status === 'cancelled') {
      await formik.setFieldValue(id, initialValues[id], true);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    /** onSubmit validate */
    onSubmit: () => {},
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  useEffect(() => {
    void formik.setValues({
      [`${address.senderId}_pec`]: address.pec ?? '',
      [`${address.senderId}_phone`]: address.phone ?? '',
      [`${address.senderId}_mail`]: address.mail ?? '',
    });
  }, [address]);

  const jsxField = (f: Field) => (
    <>
      {address[f.addressId] ? (
        <>
          <DeleteDialog
            showModal={showDeleteModal[f.id]}
            removeModalTitle={t(`${f.labelRoot}.remove-${addressTypeToLabel[f.addressId]}-title`, {
              ns: 'recapiti',
            })}
            removeModalBody={t(`${f.labelRoot}.remove-${addressTypeToLabel[f.addressId]}-message`, {
              value: formik.values[f.id],
              ns: 'recapiti',
            })}
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
              senderId={address.senderId}
              senderName={address.senderName}
              contactType={f.contactType}
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
              resetModifyValue={() => updateContact('cancelled', f.id)}
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
          {address.senderName}
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
        <Typography fontWeight={700}>{address.senderName}</Typography>
      </TableCell>
      {fields.map((f) => (
        <TableCell width="25%" key={f.id} sx={{ borderBottomColor: 'divider' }}>
          {jsxField(f)}
        </TableCell>
      ))}
    </TableRow>
  );
});

export default SpecialContactElem;
