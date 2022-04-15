import { ChangeEvent, Fragment, memo, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TableCell, TableRow, TextField, Typography } from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';

import { CourtesyChannelType, LegalChannelType } from '../../models/contacts';
import { phoneRegExp } from '../../utils/contacts.utility';
import DigitalContactElem from './DigitalContactElem';

type Props = {
  address: {
    senderId: string;
    phone?: string;
    mail?: string;
    pec?: string;
  };
  senders: Array<{ id: string; value: string }>;
  recipientId: string;
};

type Field = {
  id: 'pec' | 'phone' | 'mail';
  contactType: LegalChannelType | CourtesyChannelType;
  label: string;
  labelRoot: string;
};

const SpecialContactElem = memo(({ address, senders, recipientId }: Props) => {
  const { t } = useTranslation(['recapiti']);
  const isMobile = useIsMobile();

  const initialValues = {
    pec: address.pec || '',
    phone: address.phone || '',
    mail: address.mail || '',
  };

  const fields: Array<Field> = useMemo(
    () => [
      {
        id: 'pec',
        contactType: LegalChannelType.PEC,
        label: t('special-contacts.pec', { ns: 'recapiti' }),
        labelRoot: 'legal-contacts',
      },
      {
        id: 'phone',
        contactType: CourtesyChannelType.SMS,
        label: t('special-contacts.phone', { ns: 'recapiti' }),
        labelRoot: 'courtesy-contacts',
      },
      {
        id: 'mail',
        contactType: CourtesyChannelType.EMAIL,
        label: t('special-contacts.mail', { ns: 'recapiti' }),
        labelRoot: 'courtesy-contacts',
      },
    ],
    []
  );

  const validationSchema = yup.object({
    pec: yup
      .string()
      .required(t('legal-contacts.valid-pec', { ns: 'recapiti' }))
      .email(t('legal-contacts.valid-pec', { ns: 'recapiti' })),
    phone: yup
      .string()
      .required(t('courtesy-contacts.valid-phone', { ns: 'recapiti' }))
      .matches(phoneRegExp, t('courtesy-contacts.valid-phone', { ns: 'recapiti' })),
    mail: yup
      .string()
      .required(t('courtesy-contacts.valid-email', { ns: 'recapiti' }))
      .email(t('courtesy-contacts.valid-email', { ns: 'recapiti' })),
  });

  const updateContact = (status: 'validated' | 'cancelled') => {
    if (status === 'cancelled') {
      formik.resetForm({ values: initialValues });
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
      pec: address.pec || '',
      phone: address.phone || '',
      mail: address.mail || '',
    });
  }, [address]);

  const jsxField = (f: Field) => (
    <Fragment>
      {address[f.id] && (
        <form data-testid="specialContactForm">
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
                    error={formik.touched[f.id] && Boolean(formik.errors[f.id])}
                    helperText={formik.touched[f.id] && formik.errors[f.id]}
                  />
                ),
                isEditable: true,
                size: 'variable',
              },
            ]}
            saveDisabled={!!formik.errors[f.id]}
            removeModalTitle={t(`${f.labelRoot}.remove-${f.id}-title`, { ns: 'recapiti' })}
            removeModalBody={t(`${f.labelRoot}.remove-${f.id}-message`, {
              value: formik.values[f.id],
              ns: 'recapiti',
            })}
            value={formik.values[f.id]}
            onConfirmClick={updateContact}
            forceMobileView
          />
        </form>
      )}
      {!address[f.id] && '-'}
    </Fragment>
  );

  if (isMobile) {
    return (
      <Fragment>
        <Typography fontWeight={600}>{t('special-contacts.sender', { ns: 'recapiti' })}</Typography>
        <Typography fontWeight={700} fontSize={16}>
          {senders.find((s) => s.id === address.senderId)?.value}
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
          {senders.find((s) => s.id === address.senderId)?.value}
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
