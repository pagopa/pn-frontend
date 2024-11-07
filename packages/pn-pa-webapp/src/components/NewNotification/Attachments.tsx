import { FormikErrors, useFormik } from 'formik';
import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Alert, Box, SxProps, TextField, Typography } from '@mui/material';
import { FileUpload, useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { NewNotificationDocument } from '../../models/NewNotification';
import { useAppDispatch } from '../../redux/hooks';
import { uploadNotificationDocument } from '../../redux/newNotification/actions';
import { setAttachments } from '../../redux/newNotification/reducers';
import { getConfiguration } from '../../services/configuration.service';
import { requiredStringFieldValidation } from '../../utility/validation.utility';
import NewNotificationCard from './NewNotificationCard';
import { FormBox, FormBoxTitle } from './NewNotificationFormElelements';

type AttachmentBoxProps = {
  id: string;
  title: string;
  sx?: SxProps;
  canBeDeleted?: boolean;
  onDelete?: () => void;
  fieldLabel: string;
  fieldValue: string;
  fieldTouched?: boolean;
  fieldErrors?: string;
  onFieldTouched: (e: ChangeEvent) => void;
  onFileUploaded: (
    id: string,
    file?: File,
    sha256?: { hashBase64: string; hashHex: string }
  ) => void;
  onRemoveFile: (id: string) => void;
  fileUploaded?: NewNotificationDocument;
};

const MAX_NUMBER_OF_ATTACHMENTS = 10;

const AttachmentBox: React.FC<AttachmentBoxProps> = ({
  id,
  title,
  sx,
  canBeDeleted = false,
  onDelete,
  fieldLabel,
  fieldValue,
  fieldTouched,
  fieldErrors,
  onFieldTouched,
  onFileUploaded,
  onRemoveFile,
  fileUploaded,
}) => {
  const [focused, setFocused] = useState(false);
  const { t } = useTranslation(['notifiche']);
  const { t: tc } = useTranslation(['common']);

  const isMobile = useIsMobile('md');

  return (
    <Box data-testid="attachmentBox">
      <Box display="flex" alignItems="center" sx={sx}>
        <FormBoxTitle text={title} />
        {canBeDeleted && (
          <ButtonNaked
            onClick={onDelete}
            data-testid="deletebutton"
            aria-label={t('new-notification.steps.attachments.remove-document')}
            sx={{ marginLeft: 2 }}
          >
            <DeleteIcon color="error" />
          </ButtonNaked>
        )}
      </Box>
      <TextField
        id={`${id}.name`}
        label={fieldLabel}
        fullWidth
        name={`${id}.name`}
        value={fieldValue}
        onChange={onFieldTouched}
        error={fieldTouched && Boolean(fieldErrors)}
        helperText={
          (fieldTouched && fieldErrors) ||
          (focused && tc('too-long-field-error', { maxLength: 512 }))
        }
        size="small"
        margin="normal"
        data-testid="attachmentNameInput"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <FileUpload
        key={`${new Date()}`}
        uploadText={
          isMobile ? t('new-notification.drag-doc-mobile') : t('new-notification.drag-doc-pc')
        }
        accept="application/pdf"
        onFileUploaded={(file, sha256) => onFileUploaded(id, file, sha256)}
        onRemoveFile={() => onRemoveFile(id)}
        sx={{ marginTop: 2 }}
        calcSha256
        fileUploaded={fileUploaded}
      />
      <Typography variant="caption" color="text.secondary">
        {t('new-notification.steps.attachments.file-upload-helper', {
          format: '.PDF',
          size: '20 mb',
        })}
      </Typography>
    </Box>
  );
};

type Props = {
  onConfirm: () => void;
  onPreviousStep?: () => void;
  attachmentsData?: Array<NewNotificationDocument>;
  forwardedRef: ForwardedRef<unknown>;
  isCompleted: boolean;
  hasAdditionalLang?: boolean;
};

const emptyFileData = {
  data: undefined,
  sha256: { hashBase64: '', hashHex: '' },
};

const newAttachmentDocument = (id: string, idx: number): NewNotificationDocument => ({
  id,
  idx,
  contentType: 'application/pdf',
  file: emptyFileData,
  name: '',
  ref: {
    key: '',
    versionToken: '',
  },
});

const Attachments: React.FC<Props> = ({
  onConfirm,
  onPreviousStep,
  attachmentsData,
  forwardedRef,
  isCompleted,
  hasAdditionalLang,
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.attachments',
  });
  const { t: tc } = useTranslation(['common']);
  const { IS_PAYMENT_ENABLED } = useMemo(() => getConfiguration(), []);

  const validationSchema = yup.object({
    documents: yup.array().of(
      yup.object({
        file: yup
          .object({
            data: yup
              .mixed()
              .test((input) => input instanceof File)
              .required(),
            sha256: yup
              .object({
                hashBase64: yup.string().required(),
                hashHex: yup.string().required(),
              })
              .required(),
          })
          .required(),
        name: requiredStringFieldValidation(tc, 512),
      })
    ),
  });

  const attachmentsExists = attachmentsData && attachmentsData.length > 0;
  const initialValues = useMemo(
    () =>
      attachmentsExists
        ? {
            documents: attachmentsData,
          }
        : {
            documents: [newAttachmentDocument(`documents.0`, 0)],
          },
    []
  );

  const storeAttachments = (documents: Array<NewNotificationDocument>) => {
    dispatch(
      setAttachments({
        documents: documents.map((v) => ({
          ...v,
          id: v.id.indexOf('.file') !== -1 ? v.id.slice(0, -5) : v.id,
        })),
      })
    );
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      if (formik.isValid) {
        if (!IS_PAYMENT_ENABLED && isCompleted) {
          onConfirm();
        } else {
          storeAttachments(values.documents);
          // upload attachments
          dispatch(uploadNotificationDocument(values.documents))
            .unwrap()
            .then((docs) => {
              // update formik
              void formik.setFieldValue('documents', docs, false);
              onConfirm();
            })
            .catch(() => undefined);
        }
      }
    },
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const fileUploadedHandler = async (
    index: number,
    id: string,
    file?: File,
    sha256?: { hashBase64: string; hashHex: string }
  ) => {
    await formik.setFieldValue(
      id,
      {
        ...formik.values.documents[index],
        file: {
          data: file,
          sha256,
        },
        ref: {
          key: '',
          versionToken: '',
        },
      },
      false
    );
    await formik.setFieldTouched(`${id}.file`, true, true);
  };

  const removeFileHandler = async (id: string, index: number) => {
    await formik.setFieldValue(id, {
      ...formik.values.documents[index],
      file: emptyFileData,
      ref: {
        key: '',
        versionToken: '',
      },
      name: '',
    });

    await formik.setFieldTouched(`${id}.name`, false, false);
  };

  const addDocumentHandler = async () => {
    const lastDocIdx = formik.values.documents[formik.values.documents.length - 1].idx;
    await formik.setValues({
      documents: [
        ...formik.values.documents,
        newAttachmentDocument(`documents.${lastDocIdx + 1}`, lastDocIdx + 1),
      ],
    });
  };

  const deleteDocumentHandler = async (index: number) => {
    await formik.setFieldTouched(`documents.${index}`, false, false);

    const documents = formik.values.documents
      .filter((_d, i) => i !== index)
      .map((document, i) => ({
        ...document,
        idx: i,
        id: document.id.indexOf('.file') !== -1 ? `documents.${i}.file` : `documents.${i}`,
      }));

    await formik.setValues({
      documents,
    });
  };

  const handlePreviousStep = () => {
    if (onPreviousStep) {
      storeAttachments(formik.values.documents);
      onPreviousStep();
    }
  };

  useImperativeHandle(forwardedRef, () => ({
    confirm() {
      storeAttachments(formik.values.documents);
    },
  }));

  return (
    <form onSubmit={formik.handleSubmit} data-testid="attachmentsForm">
      <NewNotificationCard
        isContinueDisabled={!formik.isValid}
        title={t('attach-for-recipients')}
        submitLabel={IS_PAYMENT_ENABLED ? tc('button.continue') : tc('button.send')}
        previousStepLabel={t('back-to-recipient')}
        previousStepOnClick={() => handlePreviousStep()}
      >
        <Typography variant="body2">
          {t('max-attachments', { maxNumber: MAX_NUMBER_OF_ATTACHMENTS })}
        </Typography>
        {hasAdditionalLang && (
          <Alert severity="info" sx={{ mt: 2, mb: 2 }} data-testid="bannerAdditionalLanguages">
            {t('banner-additional-languages')}
          </Alert>
        )}
        <Typography variant="body2" mt={2}>
          {tc('required-fields')}
        </Typography>
        <FormBox data-testid="attachmentBox">
          {formik.values.documents.map((d, i) => (
            <AttachmentBox
              key={d.id}
              id={d.id}
              title={i === 0 ? `${t('act-attachment')}` : `${t('doc-attachment')}`}
              canBeDeleted={i > 0}
              onDelete={() => deleteDocumentHandler(i)}
              fieldLabel={`${t('doc-name')}*`}
              fieldValue={d.name}
              fileUploaded={d}
              fieldTouched={
                formik.touched.documents && formik.touched.documents[i]
                  ? formik.touched.documents[i].name
                  : undefined
              }
              fieldErrors={
                formik.errors.documents && formik.errors.documents[i]
                  ? (formik.errors.documents[i] as FormikErrors<{ file: string; name: string }>)
                      .name
                  : undefined
              }
              onFieldTouched={handleChangeTouched}
              onFileUploaded={(id, file, sha256) => fileUploadedHandler(i, id, file, sha256)}
              onRemoveFile={(id) => removeFileHandler(id, i)}
              sx={{ marginTop: i > 0 ? 4 : 0 }}
            />
          ))}
          {formik.values.documents.length <= MAX_NUMBER_OF_ATTACHMENTS && (
            <ButtonNaked
              onClick={addDocumentHandler}
              color="primary"
              startIcon={<AddIcon />}
              sx={{ marginTop: 4 }}
              data-testid="add-another-doc"
            >
              {t('add-another-doc')}
            </ButtonNaked>
          )}
        </FormBox>
      </NewNotificationCard>
    </form>
  );
};

// This is a workaorund to prevent cognitive complexity warning
export default forwardRef((props: Omit<Props, 'forwardedRef'>, ref) => (
  <Attachments {...props} forwardedRef={ref} />
));
