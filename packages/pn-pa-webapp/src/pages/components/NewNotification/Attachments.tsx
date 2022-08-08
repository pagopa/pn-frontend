import { ChangeEvent, Fragment } from 'react';
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
import NewNotificationCard from './NewNotificationCard';

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
    sha256?: { hashBase64: string; hashHex: string }
  ) => void;
  onRemoveFile: (id: string) => void;
};

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
          <DeleteIcon color="action" onClick={onDelete} sx={{ cursor: 'pointer' }} />
        )}
      </Box>
      <FileUpload
        uploadText={t('new-notification.drag-doc')}
        accept="application/pdf"
        onFileUploaded={(file, sha256) => onFileUploaded(`${id}.file`, file, sha256)}
        onRemoveFile={() => onRemoveFile(`${id}.file`)}
        sx={{ marginTop: '10px' }}
        fileFormat="uint8Array"
        calcSha256
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
};

const Attachments = ({ onConfirm }: Props) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.attachments',
  });
  const { t: tc } = useTranslation(['common']);
  const validationSchema = yup.object({
    documents: yup.array().of(
      yup.object({
        file: yup
          .object({
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
        name: yup.string().required(`${t('act-name')} ${tc('common:required')}`),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      documents: [
        {
          id: `documents.0`,
          idx: 0,
          file: { uint8Array: undefined, sha256: { hashBase64: '', hashHex: '' } },
          name: '',
        },
      ],
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      if (formik.isValid) {
        dispatch(
          uploadNotificationAttachment(
            values.documents.map((v) => ({
              key: v.name,
              file: v.file.uint8Array,
              sha256: v.file.sha256.hashBase64,
              contentType: 'application/pdf',
            }))
          )
        )
          .unwrap()
          .then(() => {
            onConfirm();
          })
          .catch(() => {});
      }
    },
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const fileUploadedHandler = async (
    id: string,
    file?: Uint8Array,
    sha256?: { hashBase64: string; hashHex: string }
  ) => {
    await formik.setFieldTouched(id, true, false);
    await formik.setFieldValue(id, { uint8Array: file, sha256 });
  };

  const removeFileHandler = async (id: string) => {
    await formik.setFieldValue(id, '');
  };

  const addDocumentHandler = async () => {
    const lastDocIdx = formik.values.documents[formik.values.documents.length - 1].idx;
    await formik.setValues({
      documents: [
        ...formik.values.documents,
        {
          id: `documents.${lastDocIdx + 1}`,
          idx: lastDocIdx + 1,
          file: { uint8Array: undefined, sha256: { hashBase64: '', hashHex: '' } },
          name: '',
        },
      ],
    });
  };

  const deleteDocumentHandler = async (index: number) => {
    const documents = formik.values.documents.filter((_d, i) => i !== index);

    documents.forEach((document, i) => {
      // eslint-disable-next-line functional/immutable-data
      document.idx = i;
      // eslint-disable-next-line functional/immutable-data
      document.id = document.id.indexOf('.file') !== -1 ?  `documents.${i}.file` : `documents.${i}`;
    });

    await formik.setValues({
      documents
    });
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <NewNotificationCard isContinueDisabled={!formik.isValid} title={t('attach-for-recipients')}>
        {formik.values.documents.map((d, i) => (
          <AttachmentBox
            key={d.id}
            id={d.id}
            title={i === 0 ? `${t('act-attachment')}*` : `${t('doc-attachment')}*`}
            canBeDeleted={i > 0}
            onDelete={() => deleteDocumentHandler(i)}
            fieldLabel={i === 0 ? `${t('act-name')}*` : `${t('doc-name')}*`}
            fieldValue={d.name}
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
            onFileUploaded={fileUploadedHandler}
            onRemoveFile={removeFileHandler}
            sx={{ marginTop: i > 0 ? '30px' : '10px' }}
          />
        ))}
        <ButtonNaked
          onClick={addDocumentHandler}
          color="primary"
          startIcon={<AddIcon />}
          sx={{ marginTop: '30px' }}
        >
          {formik.values.documents.length === 1 ? t('add-doc') : t('add-another-doc')}
        </ButtonNaked>
      </NewNotificationCard>
    </form>
  );
};

export default Attachments;
