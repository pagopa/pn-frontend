import {
  ChangeEvent,
  forwardRef,
  Fragment,
  useMemo,
  ForwardedRef,
  useImperativeHandle,
} from 'react';
import { useTranslation } from 'react-i18next';
import { FormikErrors, useFormik } from 'formik';
import * as yup from 'yup';
import { Box, SxProps, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FileUpload } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { useAppDispatch } from '../../../redux/hooks';
import { uploadNotificationAttachment } from '../../../redux/newNotification/actions';
import { setAttachments } from '../../../redux/newNotification/reducers';
import { getConfiguration } from '../../../services/configuration.service';
import { NewNotificationDocument } from '../../../models/NewNotification';
import NewNotificationCard from './NewNotificationCard';
import { requiredStringFieldValidation } from './validation.utility';

type AttachmentBoxProps = {
  id: string;
  title: string;
  sx?: SxProps;
  canBeDeleted?: boolean;
  onDelete?: () => void;
  fieldLabel: string;
  fieldValue: string;
  fieldTouched?: boolean;
  fieldErros?: string;
  onFieldTouched: (e: ChangeEvent) => void;
  onFileUploaded: (
    id: string,
    file?: Uint8Array,
    sha256?: { hashBase64: string; hashHex: string },
    name?: string,
    size?: number
  ) => void;
  onRemoveFile: (id: string) => void;
  fileUploaded?: NewNotificationDocument;
};

const MAX_NUMBER_OF_ATTACHMENTS = 10;

const AttachmentBox = ({
  id,
  title,
  sx,
  canBeDeleted = false,
  onDelete,
  fieldLabel,
  fieldValue,
  fieldTouched,
  fieldErros,
  onFieldTouched,
  onFileUploaded,
  onRemoveFile,
  fileUploaded,
}: AttachmentBoxProps) => {
  const { t } = useTranslation(['notifiche']);

  return (
    <Fragment>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={sx}
        data-testid="attachmentBox"
      >
        <Typography fontWeight={600}>{title}</Typography>
        {canBeDeleted && (
          <ButtonNaked
            onClick={onDelete}
            data-testid="deletebutton"
            aria-label={t('new-notification.steps.remove-document')}
          >
            <DeleteIcon color="action" sx={{ cursor: 'pointer' }} />
          </ButtonNaked>
        )}
      </Box>
      <FileUpload
        key={`${new Date()}`}
        uploadText={t('new-notification.drag-doc')}
        accept="application/pdf"
        onFileUploaded={(file, sha256, name, size) => onFileUploaded(id, file, sha256, name, size)}
        onRemoveFile={() => onRemoveFile(id)}
        sx={{ marginTop: '10px' }}
        fileFormat="uint8Array"
        calcSha256
        fileUploaded={fileUploaded}
      />
      <TextField
        id={`${id}.name`}
        label={fieldLabel}
        fullWidth
        name={`${id}.name`}
        value={fieldValue}
        onChange={onFieldTouched}
        error={fieldTouched && Boolean(fieldErros)}
        helperText={fieldTouched && fieldErros}
        size="small"
        margin="normal"
      />
    </Fragment>
  );
};

type Props = {
  onConfirm: () => void;
  onPreviousStep?: () => void;
  attachmentsData?: Array<NewNotificationDocument>;
  forwardedRef: ForwardedRef<unknown>;
  isCompleted: boolean;
};

const emptyFileData = {
  uint8Array: undefined,
  sha256: { hashBase64: '', hashHex: '' },
  name: '',
  size: 0,
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

const Attachments = ({
  onConfirm,
  onPreviousStep,
  attachmentsData,
  forwardedRef,
  isCompleted,
}: Props) => {
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
            size: yup.number().required(),
            name: yup.string().required(),
            uint8Array: yup
              .mixed()
              .test((input) => input instanceof Uint8Array)
              .required(),
            sha256: yup
              .object({
                hashBase64: yup.string().required(),
                hashHex: yup.string().required(),
              })
              .required(),
          })
          .required(),
        name: requiredStringFieldValidation(tc),
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

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      if (formik.isValid) {
        if (!IS_PAYMENT_ENABLED && isCompleted) {
          onConfirm();
        } else {
          dispatch(
            setAttachments({
              documents: values.documents.map((v) => ({
                ...v,
                id: v.id.indexOf('.file') !== -1 ? v.id.slice(0, -5) : v.id,
              })),
            })
          );
          // upload attachments
          dispatch(uploadNotificationAttachment(values.documents))
            .unwrap()
            .then(() => {
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
    file?: Uint8Array,
    sha256?: { hashBase64: string; hashHex: string },
    name?: string,
    size?: number
  ) => {
    await formik.setFieldValue(
      id,
      {
        ...formik.values.documents[index],
        file: {
          size,
          uint8Array: file,
          sha256,
          name,
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
    });
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
      dispatch(
        setAttachments({
          documents: formik.values.documents.map((v) => ({
            ...v,
            id: v.id.indexOf('.file') !== -1 ? v.id.slice(0, -5) : v.id,
          })),
        })
      );
      onPreviousStep();
    }
  };

  useImperativeHandle(forwardedRef, () => ({
    confirm() {
      dispatch(
        setAttachments({
          documents: formik.values.documents.map((v) => ({
            ...v,
            id: v.id.indexOf('.file') !== -1 ? v.id.slice(0, -5) : v.id,
          })),
        })
      );
    },
  }));

  return (
    <form onSubmit={formik.handleSubmit}>
      <NewNotificationCard
        isContinueDisabled={!formik.isValid}
        title={t('attach-for-recipients')}
        subtitle={t('max-attachments', { maxNumber: MAX_NUMBER_OF_ATTACHMENTS })}
        submitLabel={IS_PAYMENT_ENABLED ? tc('button.continue') : tc('button.send')}
        previousStepLabel={t('back-to-recipient')}
        previousStepOnClick={() => handlePreviousStep()}
      >
        {formik.values.documents.map((d, i) => (
          <AttachmentBox
            key={d.id}
            id={d.id}
            title={i === 0 ? `${t('act-attachment')}*` : `${t('doc-attachment')}*`}
            canBeDeleted={i > 0}
            onDelete={() => deleteDocumentHandler(i)}
            fieldLabel={i === 0 ? `${t('act-name')}*` : `${t('doc-name')}*`}
            fieldValue={d.name}
            fileUploaded={d}
            fieldTouched={
              formik.touched.documents && formik.touched.documents[i]
                ? formik.touched.documents[i].name
                : undefined
            }
            fieldErros={
              formik.errors.documents && formik.errors.documents[i]
                ? (formik.errors.documents[i] as FormikErrors<{ file: string; name: string }>).name
                : undefined
            }
            onFieldTouched={handleChangeTouched}
            onFileUploaded={(id, file, sha256, name, size) =>
              fileUploadedHandler(i, id, file, sha256, name, size)
            }
            onRemoveFile={(id) => removeFileHandler(id, i)}
            sx={{ marginTop: i > 0 ? '30px' : '10px' }}
          />
        ))}
        {formik.values.documents.length <= MAX_NUMBER_OF_ATTACHMENTS && (
          <ButtonNaked
            onClick={addDocumentHandler}
            color="primary"
            startIcon={<AddIcon />}
            sx={{ marginTop: '30px' }}
            data-testid="add-another-doc"
          >
            {formik.values.documents.length === 1 ? t('add-doc') : t('add-another-doc')}
          </ButtonNaked>
        )}
      </NewNotificationCard>
    </form>
  );
};

// This is a workaorund to prevent cognitive complexity warning
export default forwardRef((props: Omit<Props, 'forwardedRef'>, ref) => (
  <Attachments {...props} forwardedRef={ref} />
));
