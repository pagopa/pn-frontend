import { ChangeEvent, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { IllusEmailValidation } from '@pagopa/mui-italia';
import { Divider, Grid, Box, Typography, TextField } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { DigitalAddress, LegalChannelType } from '../../models/contacts';
import { createOrUpdateLegalAddress, deleteLegalAddress } from '../../redux/contact/actions';
import { useAppDispatch } from '../../redux/hooks';
import { useDigitalContactsCodeVerificationContext } from './DigitalContactsCodeVerification.context';
import DigitalContactsCard from './DigitalContactsCard';
import LegalContactsDisclosure from './LegalContactsDisclosure';
import DigitalContactElem from './DigitalContactElem';

type Props = {
  recipientId: string;
  legalAddresses: Array<DigitalAddress>;
};

const LegalContactsList = ({ recipientId, legalAddresses }: Props) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['common', 'recapiti']);
  const { setProps, handleCodeVerification } = useDigitalContactsCodeVerificationContext();
  const [disclosureCollapsed, setDisclosureCollapsed] = useState(true);
  const contactRef = useRef();

  const handleCollapse = () => {
    setDisclosureCollapsed(!disclosureCollapsed);
  };

  const title = (
    <Grid container spacing={1} alignItems="flex-end" direction="row">
      <Grid item xs="auto">
        {t('legal-contacts.subtitle-2', { ns: 'recapiti' })}
      </Grid>
      <Grid item xs="auto">
        <ErrorOutlineIcon
          onClick={handleCollapse}
          sx={{ cursor: 'pointer', position: 'relative', top: '4px', color: 'action.active' }}
        />
      </Grid>
    </Grid>
  );

  const defaultAddress = legalAddresses.find((a) => a.senderId === 'default');
  const validationSchema = yup.object({
    pec: yup
      .string()
      .required(t('legal-contacts.valid-pec', { ns: 'recapiti' }))
      .email(t('legal-contacts.valid-pec', { ns: 'recapiti' })),
  });
  const initialValues = {
    pec: defaultAddress?.value || '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    /** onSubmit validate */
    onSubmit: () => {
      handleEditConfirm();
    },
  });

  const handleChangeTouched = (e: ChangeEvent) => {
    void formik.setFieldTouched(e.target.id, true, false);
    formik.handleChange(e);
  };

  const handleEditConfirm = () => {
    setProps({
      title: `${t('legal-contacts.pec-verify', { ns: 'recapiti' })} ${formik.values.pec}`,
      subtitle: <Trans i18nKey="legal-contacts.pec-verify-descr" ns="recapiti" />,
      initialValues: new Array(5).fill(''),
      codeSectionTitle: t('legal-contacts.insert-code', { ns: 'recapiti' }),
      codeSectionAdditional: (
        <Box>
          <Typography variant="body2" display="inline">
            {t('legal-contacts.new-code', { ns: 'recapiti' })}&nbsp;
          </Typography>
          <Typography
            variant="body2"
            display="inline"
            color="primary"
            onClick={() => handleCodeVerification(undefined, true)}
            sx={{ cursor: 'pointer' }}
          >
            {t('legal-contacts.new-code-link', { ns: 'recapiti' })}.
          </Typography>
        </Box>
      ),
      cancelLabel: t('button.annulla'),
      confirmLabel: t('button.conferma'),
      errorMessage: t('legal-contacts.wrong-code', { ns: 'recapiti' }),
      recipientId,
      senderId: 'default',
      digitalDomicileType: defaultAddress?.channelType as LegalChannelType,
      value: formik.values.pec,
      successMessage: t('legal-contacts.pec-added', { ns: 'recapiti' }),
      actionToBeDispatched: createOrUpdateLegalAddress,
      callbackOnValidation: (status: 'validated' | 'cancelled') => {
        if (status === 'cancelled') {
          formik.resetForm({ values: initialValues });
        } else {
          /* eslint-disable functional/immutable-data */
          initialValues.pec = formik.values.pec;
          /* eslint-enable functional/immutable-data */
        }
        (contactRef.current as any).toggleEdit();
      },
    });
  };

  const removeElemHandler = () => {
    void dispatch(deleteLegalAddress({recipientId, senderId: 'default', channelType: LegalChannelType.PEC}));
  };

  return (
    <DigitalContactsCard
      sectionTitle={t('legal-contacts.title', { ns: 'recapiti' })}
      title={title}
      subtitle={disclosureCollapsed ? '' : t('legal-contacts.description-2', { ns: 'recapiti' })}
      avatar={<IllusEmailValidation />}
    >
      {!disclosureCollapsed && <LegalContactsDisclosure />}
      <Divider />
      <Box sx={{ marginTop: '20px' }}>
        <form onSubmit={formik.handleSubmit}>
          <DigitalContactElem
            ref={contactRef}
            fields={[
              {
                id: 'label',
                component: (
                  <Typography>{t('legal-contacts.pec-added', { ns: 'recapiti' })}</Typography>
                ),
                size: 'variable',
              },
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
                    value={formik.values.pec}
                    onChange={handleChangeTouched}
                    error={formik.touched.pec && Boolean(formik.errors.pec)}
                    helperText={formik.touched.pec && formik.errors.pec}
                  />
                ),
                isEditable: true,
                size: 'auto',
              },
            ]}
            saveDisabled={!formik.isValid}
            onRemoveClick={removeElemHandler}
            removeModalTitle={t('legal-contacts.remove-pec-title', { ns: 'recapiti' })}
            removeModalBody={t('legal-contacts.remove-pec-message', { pec: formik.values.pec, ns: 'recapiti'})}
          />
        </form>
      </Box>
    </DigitalContactsCard>
  );
};

export default LegalContactsList;
