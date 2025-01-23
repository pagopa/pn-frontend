import { useFormik } from 'formik';
import { ChangeEvent, forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Button, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { ChannelType } from '../../models/contacts';
import {
  emailValidationSchema,
  pecValidationSchema,
  phoneValidationSchema,
} from '../../utility/contacts.utility';

type Props = {
  label: string;
  value: string;
  channelType: ChannelType;
  inputProps: { label: string; prefix?: string };
  insertButtonLabel: string;
  onSubmit: (value: string) => void;
  onDelete: () => void;
};

const DefaultDigitalContact = forwardRef<{ toggleEdit: () => void }, Props>(
  ({ label, value, channelType, inputProps, insertButtonLabel, onSubmit, onDelete }, ref) => {
    const { t } = useTranslation(['common', 'recapiti']);
    const isMobile = useIsMobile();
    const [editMode, setEditMode] = useState(false);
    const contactType = channelType.toLowerCase();

    // value contains the prefix
    const contactValue = inputProps.prefix ? value.replace(inputProps.prefix, '') : value;
    const initialValues = {
      [`default_${contactType}`]: contactValue,
    };

    const validationSchema = yup.object().shape({
      [`default_${contactType}`]: yup
        .string()
        .when([], {
          is: () => channelType === ChannelType.PEC,
          then: pecValidationSchema(t),
        })
        .when([], {
          is: () => channelType === ChannelType.EMAIL,
          then: emailValidationSchema(t),
        })
        .when([], {
          is: () => channelType === ChannelType.SMS,
          then: phoneValidationSchema(t),
        }),
    });

    const formik = useFormik({
      initialValues,
      validationSchema,
      validateOnMount: true,
      enableReinitialize: true,
      /** onSubmit validate */
      onSubmit: (values) => {
        if (formik.isValid) {
          onSubmit(values[`default_${contactType}`]);
        }
      },
    });

    const handleChangeTouched = async (e: ChangeEvent) => {
      formik.handleChange(e);
      await formik.setFieldTouched(e.target.id, true, false);
    };

    const toggleEdit = () => {
      setEditMode(!editMode);
    };

    const onCancel = () => {
      formik.resetForm({ values: initialValues });
      toggleEdit();
    };

    useImperativeHandle(ref, () => ({
      toggleEdit,
      resetForm: async () => {
        await formik.setFieldTouched(`default_${contactType}`, false, false);
        await formik.setFieldValue(
          `default_${contactType}`,
          initialValues[`default_${contactType}`],
          true
        );
      },
    }));

    // INSERT MODE
    if (!value) {
      return (
        <form
          onSubmit={formik.handleSubmit}
          data-testid={`default_${contactType}Contact`}
          style={{ width: isMobile ? '100%' : '50%' }}
        >
          <Typography
            id={`default_${contactType}-label`}
            variant="body2"
            mb={1}
            sx={{ fontWeight: 'bold' }}
          >
            {label}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              id={`default_${contactType}`}
              name={`default_${contactType}`}
              placeholder={inputProps.label}
              size="small"
              fullWidth
              sx={{ flexBasis: { xs: 'unset', lg: '66.66%' } }}
              InputProps={{
                startAdornment: inputProps.prefix ? (
                  <InputAdornment position="start">{inputProps.prefix}</InputAdornment>
                ) : null,
              }}
              value={formik.values[`default_${contactType}`]}
              onChange={handleChangeTouched}
              error={
                formik.touched[`default_${contactType}`] &&
                Boolean(formik.errors[`default_${contactType}`])
              }
              helperText={
                formik.touched[`default_${contactType}`] && formik.errors[`default_${contactType}`]
              }
            />
            <Button
              id={`default_${contactType}-button`}
              variant="outlined"
              fullWidth
              type="submit"
              data-testid={`default_${contactType}-button`}
              sx={{ flexBasis: { xs: 'unset', lg: '33.33%' }, height: '43px' }}
            >
              {insertButtonLabel}
            </Button>
          </Stack>
        </form>
      );
    }

    // EDIT MODE
    return (
      <form
        onSubmit={formik.handleSubmit}
        data-testid={`default_${contactType}Contact`}
        style={{ width: isMobile ? '100%' : '50%' }}
      >
        {editMode && (
          <>
            <TextField
              id={`default_${contactType}`}
              name={`default_${contactType}`}
              label={inputProps.label}
              fullWidth
              variant="outlined"
              size="small"
              data-testid={`default_${contactType}`}
              InputProps={{
                startAdornment: inputProps.prefix ? (
                  <InputAdornment position="start">{inputProps.prefix}</InputAdornment>
                ) : null,
              }}
              value={formik.values[`default_${contactType}`]}
              onChange={(e) => void handleChangeTouched(e)}
              error={
                formik.touched[`default_${contactType}`] &&
                Boolean(formik.errors[`default_${contactType}`])
              }
              helperText={
                formik.touched[`default_${contactType}`] && formik.errors[`default_${contactType}`]
              }
              sx={{ mb: 2 }}
            />
            <ButtonNaked
              key="saveButton"
              color="primary"
              type="submit"
              sx={{ mr: 2, fontWeight: 700 }}
              id={`saveContact-default_${contactType}`}
              size="medium"
            >
              {t('button.salva')}
            </ButtonNaked>
            <ButtonNaked color="error" onClick={onCancel} sx={{ fontWeight: 700 }} size="medium">
              {t('button.annulla')}
            </ButtonNaked>
          </>
        )}
        {!editMode && (
          <Stack direction="row" spacing={2}>
            <VerifiedIcon
              fontSize="small"
              color="primary"
              sx={{ position: 'relative', top: '2px' }}
            />
            <Box>
              <Typography
                sx={{
                  wordBreak: 'break-word',
                  fontWeight: 600,
                  mb: 2,
                }}
                variant="body2"
                id={`default_${contactType}-typography`}
              >
                {value}
              </Typography>
              <ButtonNaked
                key="editButton"
                color="primary"
                onClick={toggleEdit}
                sx={{ mr: 2, fontWeight: 700 }}
                id={`modifyContact-default_${contactType}`}
                size="medium"
              >
                {t('button.modifica')}
              </ButtonNaked>
              <ButtonNaked
                id={`cancelContact-default_${contactType}`}
                color="error"
                onClick={onDelete}
                sx={{ fontWeight: 700 }}
                size="medium"
              >
                {t('button.elimina')}
              </ButtonNaked>
            </Box>
          </Stack>
        )}
      </form>
    );
  }
);

export default DefaultDigitalContact;
