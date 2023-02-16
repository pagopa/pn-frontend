import { ChangeEvent, Fragment, memo, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TableCell, TableRow, TextField, Typography } from '@mui/material';
import { dataRegex, useIsMobile, useSpecialContactsContext } from '@pagopa-pn/pn-commons';

import { CourtesyChannelType, LegalChannelType } from '../../models/contacts';
import { Party } from '../../models/party';
import { trackEventByType } from "../../utils/mixpanel";
import { EventActions, TrackEventType } from "../../utils/events";
import DigitalContactElem from './DigitalContactElem';

type Props = {
  address: {
    senderId: string;
    phone?: string;
    mail?: string;
    pec?: string;
  };
  senders: Array<Party>;
  recipientId: string;
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

const SpecialContactElem = memo(({ address, senders, recipientId }: Props) => {
  const { t } = useTranslation(['recapiti']);
  const isMobile = useIsMobile();
  const { contextEditMode, setContextEditMode } = useSpecialContactsContext();
  const digitalElemRef = useRef<{
    [key: string]: { editContact: () => void};
  }>(
    { 
      [`${address.senderId}_pec`]: { editContact: () => {}},
      [`${address.senderId}_phone`]: { editContact: () => {}},
      [`${address.senderId}_mail`]: { editContact: () => {}},
    });

  const initialValues = {
    [`${address.senderId}_pec`]: address.pec || '',
    [`${address.senderId}_phone`]: address.phone || '',
    [`${address.senderId}_mail`]: address.mail || '',
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
      .matches(dataRegex.email, t('legal-contacts.valid-pec', { ns: 'recapiti' })),
    [`${address.senderId}_phone`]: yup
      .string()
      .required(t('courtesy-contacts.valid-phone', { ns: 'recapiti' }))
      .matches(dataRegex.phoneNumberWithItalyPrefix, t('courtesy-contacts.valid-phone', { ns: 'recapiti' })),
    [`${address.senderId}_mail`]: yup
      .string()
      .required(t('courtesy-contacts.valid-email', { ns: 'recapiti' }))
      .matches(dataRegex.email, t('courtesy-contacts.valid-email', { ns: 'recapiti' })),
  });

  const updateContact = async (status: 'validated' | 'cancelled', id: string) => {
    if (status === 'cancelled') {
      await formik.setFieldValue(id, initialValues[id], true);
    }
    trackEventByType(TrackEventType.CONTACT_SPECIAL_CONTACTS, { action: EventActions.ADD });
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
      [`${address.senderId}_pec`]: address.pec || '',
      [`${address.senderId}_phone`]: address.phone || '',
      [`${address.senderId}_mail`]: address.mail || '',
    });
  }, [address]);

  const jsxField = (f: Field) => (
    <Fragment>
      {address[f.addressId] ? (
        <form data-testid="specialContactForm" onSubmit={
          (e) => {
            e.preventDefault();
            digitalElemRef.current[f.id].editContact();
          }
        }>
          <DigitalContactElem
            recipientId={recipientId}
            senderId={address.senderId}
            contactType={f.contactType}
            fields={[
              {
                id: `value-${f.id}`,
                component: (
                  <TextField
                    id={f.id}
                    fullWidth
                    name={f.id}
                    label={f.label}
                    variant="outlined"
                    size="small"
                    value={formik.values[f.id]}
                    onChange={handleChangeTouched}
                    error={(formik.touched[f.id] || formik.values[f.id].length > 0) && Boolean(formik.errors[f.id])}
                    helperText={(formik.touched[f.id] || formik.values[f.id].length > 0) && formik.errors[f.id]}                  />
                ),
                isEditable: true,
                size: 'variable',
              },
            ]}
            saveDisabled={!!formik.errors[f.id]}
            removeModalTitle={t(`${f.labelRoot}.remove-${addressTypeToLabel[f.addressId]}-title`, {
              ns: 'recapiti',
            })}
            removeModalBody={t(`${f.labelRoot}.remove-${addressTypeToLabel[f.addressId]}-message`, {
              value: formik.values[f.id],
              ns: 'recapiti',
            })}
            value={formik.values[f.id]}
            onConfirmClick={(status) => updateContact(status, f.id)}
            resetModifyValue={() => updateContact('cancelled', f.id)}
            // eslint-disable-next-line functional/immutable-data
            ref={(node: { editContact: () => void}) => (digitalElemRef.current[f.id] = node)}
            editDisabled={contextEditMode}
            setContextEditMode={setContextEditMode}
          />
        </form>
      ) : (
        '-'
      )}
    </Fragment>
  );

  if (isMobile) {
    return (
      <Fragment>
        <Typography fontWeight={600}>{t('special-contacts.sender', { ns: 'recapiti' })}</Typography>
        <Typography fontWeight={700} fontSize={16}>
          {senders.find((s) => s.id === address.senderId)?.name}
        </Typography>
        {fields.map((f) => (
          <Fragment key={f.id}>
            <Typography fontWeight={600} sx={{ marginTop: '20px', marginBottom: '10px' }}>
              {f.label}
            </Typography>
            {jsxField(f)}
          </Fragment>
        ))}
      </Fragment>
    );
  }

  return (
    <TableRow>
      <TableCell width="25%" sx={{ borderBottomColor: 'divider' }}>
        <Typography fontWeight={700}>
          {senders.find((s) => s.id === address.senderId)?.name}
        </Typography>
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
