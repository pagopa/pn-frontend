import { useFormik } from 'formik';
import { ChangeEvent, forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, InputAdornment, Stack, TextField, Typography } from '@mui/material';
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
  showVerifiedIcon?: boolean;
  onSubmit: (value: string) => void;
  onDelete?: () => void;
  onCancelInsert?: () => void;
};

const DefaultDigitalContact = forwardRef<{ toggleEdit: () => void }, Props>(
  (
    {
      label,
      value,
      channelType,
      inputProps,
      insertButtonLabel,
      showVerifiedIcon = false,
      onSubmit,
      onDelete,
      onCancelInsert,
    },
    ref
  ) => {
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
        onSubmit(values[`default_${contactType}`]);
      },
    });

    const handleChangeTouched = async (e: ChangeEvent) => {
      formik.handleChange(e);
      await formik.setFieldTouched(e.target.id, true, false);
    };

    const toggleEdit = () => {
      setEditMode(!editMode);
    };

    const onCancelEdit = () => {
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
              variant="contained"
              fullWidth
              type="submit"
              data-testid={`default_${contactType}-button`}
              sx={{ flexBasis: { xs: 'unset', lg: '33.33%' }, height: '43px' }}
              size="medium"
            >
              {insertButtonLabel}
            </Button>
            {onCancelInsert && (
              <ButtonNaked
                color="error"
                onClick={onCancelInsert}
                sx={{ fontWeight: 700 }}
                size="medium"
              >
                {t('button.annulla')}
              </ButtonNaked>
            )}
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
              disabled={!formik.isValid}
              type="submit"
              sx={{ mr: 2, fontWeight: 700 }}
              id={`saveContact-default_${contactType}`}
              size="medium"
            >
              {t('button.salva')}
            </ButtonNaked>
            <ButtonNaked
              color="error"
              onClick={onCancelEdit}
              sx={{ fontWeight: 700 }}
              size="medium"
            >
              {t('button.annulla')}
            </ButtonNaked>
          </>
        )}
        {!editMode && (
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={3}
            alignItems="start"
            sx={{ mb: 2 }}
          >
            <Stack
              width={{ xs: '100%', lg: 'auto' }}
              direction="row"
              justifyContent={{ xs: 'space-between', lg: 'auto' }}
            >
              <Typography
                sx={{
                  wordBreak: 'break-word',
                  fontWeight: 600,
                }}
                component="span"
                variant="body2"
                id={`default_${contactType}-typography`}
              >
                {value}
              </Typography>
              {showVerifiedIcon && (
                <CheckCircleIcon sx={{ ml: 1 }} fontSize="small" color="success" />
              )}
            </Stack>
            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              justifyContent="left"
              alignItems="left"
              textAlign="left"
              spacing={{ xs: 2, lg: 3 }}
            >
              <ButtonNaked
                key="editButton"
                color="primary"
                onClick={toggleEdit}
                startIcon={<CreateIcon />}
                sx={{ fontWeight: 700, justifyContent: 'left' }}
                id={`modifyContact-default_${contactType}`}
                size="medium"
              >
                {t('button.modifica')}
              </ButtonNaked>
              {onDelete && (
                <ButtonNaked
                  id={`cancelContact-default_${contactType}`}
                  color="error"
                  onClick={onDelete}
                  startIcon={<DeleteIcon />}
                  sx={{ fontWeight: 700, justifyContent: 'left' }}
                  size="medium"
                >
                  {t('button.elimina')}
                </ButtonNaked>
              )}
            </Stack>
          </Stack>
        )}
      </form>
    );
  }
);

export default DefaultDigitalContact;
