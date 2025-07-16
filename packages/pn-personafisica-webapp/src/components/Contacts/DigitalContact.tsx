import { useFormik } from 'formik';
import {
  CSSProperties,
  ChangeEvent,
  JSXElementConstructor,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  ButtonProps,
  InputAdornment,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
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
  slotsProps?: {
    container?: CSSProperties;
    textField?: Partial<TextFieldProps>;
    button?: Partial<ButtonProps>;
  };
  slots?: {
    editButton?: JSXElementConstructor<ButtonProps>;
  };
  showLabelOnEdit?: boolean;
  senderId?: string;
  inputProps: { label: string; prefix?: string };
  insertButtonLabel: string;
  showVerifiedIcon?: boolean;
  onSubmit: (value: string) => void;
  onDelete?: () => void;
  onCancelInsert?: () => void;
};

const DigitalContact = forwardRef<{ toggleEdit: () => void }, Props>(
  (
    {
      label,
      value,
      channelType,
      slotsProps,
      slots,
      showLabelOnEdit = false,
      senderId = 'default',
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

    const EditButton = slots?.editButton || ButtonNaked;

    // value contains the prefix
    const contactValue = inputProps.prefix ? value.replace(inputProps.prefix, '') : value;
    const initialValues = {
      [`${senderId}_${contactType}`]: contactValue,
    };

    const validationSchema = yup.object().shape({
      [`${senderId}_${contactType}`]: yup
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
        onSubmit(values[`${senderId}_${contactType}`]);
      },
    });

    const handleChangeTouched = async (e: ChangeEvent) => {
      formik.handleChange(e);
      await formik.setFieldTouched(e.target.id, true, false);
    };

    const toggleEdit = () => {
      setEditMode((prevState) => !prevState);
    };

    const onCancelEdit = () => {
      formik.resetForm({ values: initialValues });
      toggleEdit();
    };

    useImperativeHandle(ref, () => ({
      toggleEdit,
      resetForm: async () => {
        await formik.setFieldTouched(`${senderId}_${contactType}`, false, false);
        await formik.setFieldValue(
          `${senderId}_${contactType}`,
          initialValues[`${senderId}_${contactType}`],
          true
        );
      },
    }));

    // INSERT MODE
    if (!value) {
      return (
        <form onSubmit={formik.handleSubmit} data-testid={`${senderId}_${contactType}Contact`}>
          <Typography
            id={`${senderId}_${contactType}-label`}
            variant="body2"
            mb={1}
            sx={{ fontWeight: 'bold' }}
          >
            {label}
          </Typography>
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
            <TextField
              id={`${senderId}_${contactType}`}
              name={`${senderId}_${contactType}`}
              placeholder={inputProps.label}
              size="small"
              fullWidth={isMobile}
              sx={{ flexBasis: { xs: 'unset', lg: '33.33%' } }}
              InputProps={{
                startAdornment: inputProps.prefix ? (
                  <InputAdornment position="start">{inputProps.prefix}</InputAdornment>
                ) : null,
              }}
              value={formik.values[`${senderId}_${contactType}`]}
              onChange={handleChangeTouched}
              error={
                formik.touched[`${senderId}_${contactType}`] &&
                Boolean(formik.errors[`${senderId}_${contactType}`])
              }
              helperText={
                formik.touched[`${senderId}_${contactType}`] &&
                formik.errors[`${senderId}_${contactType}`]
              }
              {...slotsProps?.textField}
            />
            <Button
              id={`${senderId}_${contactType}-button`}
              variant="contained"
              fullWidth={isMobile}
              type="submit"
              data-testid={`${senderId}_${contactType}-button`}
              sx={{ height: '43px', fontWeight: 700, flexBasis: { xs: 'unset', lg: '16.67%' } }}
              size="small"
              {...slotsProps?.button}
            >
              {insertButtonLabel}
            </Button>
            {onCancelInsert && (
              <ButtonNaked
                color="error"
                onClick={onCancelInsert}
                sx={{ fontWeight: 700, color: 'error.dark' }}
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
        data-testid={`${senderId}_${contactType}Contact`}
        style={{ width: isMobile ? '100%' : '50%', ...slotsProps?.container }}
      >
        {showLabelOnEdit && (
          <Typography
            id={`${senderId}_${contactType}-label`}
            variant="body2"
            mb={1}
            sx={{ fontWeight: 'bold' }}
          >
            {label}
          </Typography>
        )}
        {editMode && (
          <>
            <TextField
              id={`${senderId}_${contactType}`}
              name={`${senderId}_${contactType}`}
              label={inputProps.label}
              fullWidth
              variant="outlined"
              size="small"
              data-testid={`${senderId}_${contactType}`}
              InputProps={{
                startAdornment: inputProps.prefix ? (
                  <InputAdornment position="start">{inputProps.prefix}</InputAdornment>
                ) : null,
              }}
              value={formik.values[`${senderId}_${contactType}`]}
              onChange={(e) => void handleChangeTouched(e)}
              error={
                formik.touched[`${senderId}_${contactType}`] &&
                Boolean(formik.errors[`${senderId}_${contactType}`])
              }
              helperText={
                formik.touched[`${senderId}_${contactType}`] &&
                formik.errors[`${senderId}_${contactType}`]
              }
              sx={{ mb: 2 }}
              autoFocus
            />
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
              <ButtonNaked
                key="saveButton"
                color="primary"
                type="submit"
                sx={{ fontWeight: 700, justifyContent: 'left' }}
                id={`saveContact-${senderId}_${contactType}`}
                size="medium"
                startIcon={<CheckIcon />}
              >
                {t('button.conferma')}
              </ButtonNaked>
              <ButtonNaked
                color="error"
                onClick={onCancelEdit}
                sx={{
                  fontWeight: 700,
                  color: 'error.dark',
                  justifyContent: 'left',
                }}
                size="medium"
                startIcon={<CloseIcon />}
              >
                {t('button.annulla')}
              </ButtonNaked>
            </Stack>
          </>
        )}
        {!editMode && (
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={{ xs: 2, lg: 3 }}
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
                  fontSize: '18px',
                  fontWeight: 600,
                }}
                component="span"
                variant="body2"
                id={`${senderId}_${contactType}-typography`}
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
              <EditButton
                key="editButton"
                color="primary"
                onClick={toggleEdit}
                startIcon={<CreateIcon />}
                sx={{ fontWeight: 700, justifyContent: 'left' }}
                id={`modifyContact-${senderId}_${contactType}`}
                size="medium"
              >
                {t('button.modifica')}
              </EditButton>
              {onDelete && (
                <ButtonNaked
                  id={`cancelContact-${senderId}_${contactType}`}
                  color="error"
                  onClick={onDelete}
                  startIcon={<DeleteIcon />}
                  sx={{ fontWeight: 700, justifyContent: 'left', color: 'error.dark' }}
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

export default DigitalContact;
