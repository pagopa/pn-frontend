import { ChangeEvent, Fragment } from 'react';
import { FormikErrors, useFormik } from 'formik';
import * as yup from 'yup';
import { Box, SxProps, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FileUpload } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

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
  uploadAttachment: (id: string, file: any) => Promise<any>;
  onFileUploaded: () => void;
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
  uploadAttachment,
  onFileUploaded,
  onRemoveFile,
}: AttachmentBoxProps) => (
  <Fragment>
    <Box display="flex" justifyContent="space-between" alignItems="center" sx={sx} data-testid="attachmentBox">
      <Typography fontWeight={600}>
        {title}
      </Typography>
      {canBeDeleted && <DeleteIcon color="action" onClick={onDelete} sx={{cursor: 'pointer'}}/>}
    </Box>
    <FileUpload
      uploadText="Trascina qui il documento"
      accept="application/pdf"
      uploadFn={(file) => uploadAttachment(`${id}.file`, file)}
      onFileUploaded={onFileUploaded}
      onRemoveFile={() => onRemoveFile(`${id}.file`)}
      sx={{ marginTop: '10px' }}
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

type Props = {
  onConfirm: () => void;
};

const Attachments = ({ onConfirm }: Props) => {
  const validationSchema = yup.object({
    documents: yup.array().of(
      yup.object({
        file: yup.mixed().required(),
        name: yup.string().required("Nome dell'atto obbligatorio"),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      documents: [
        {
          id: `documents.0`,
          idx: 0,
          file: '',
          name: '',
        },
      ],
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      if (formik.isValid) {
        console.log(values);
        // dispatch(setPreliminaryInformations(values));
        onConfirm();
      }
    },
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const uploadAttachment = async (id: string, file: any) => {
    await formik.setFieldTouched(id, true, false);
    await formik.setFieldValue(id, file);
    return Promise.resolve();
  };

  const fileUploadedHandler = () => {};

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
          file: '',
          name: '',
        },
      ],
    });
  };

  const deleteDocumentHandler = async (index: number) => {
    await formik.setValues({
      /* eslint-disable-next-line functional/immutable-data */
      documents: formik.values.documents.filter((_d, i) => i !== index),
    });
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <NewNotificationCard
        isContinueDisabled={!formik.isValid}
        title="Allegati per tutti i destinatari"
      >
        {formik.values.documents.map((d, i) => (
          <AttachmentBox
            key={d.id}
            id={d.id}
            title={i === 0 ? "Allega l'Atto *" : 'Allega un altro documento *'}
            canBeDeleted={i > 0}
            onDelete={() => deleteDocumentHandler(i)}
            fieldLabel={i === 0 ? "Nome dell'Atto *" : 'Nome del documento *'}
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
            uploadAttachment={uploadAttachment}
            onFileUploaded={fileUploadedHandler}
            onRemoveFile={removeFileHandler}
            sx={{marginTop: i > 0 ? '30px' : '10px'}}
          />
        ))}
        <ButtonNaked onClick={addDocumentHandler} color="primary" startIcon={<AddIcon />} sx={{marginTop: '30px'}}>
          {formik.values.documents.length === 1
            ? 'Aggiungi un documento (per esempio, la lettera d’accompagnamento)'
            : 'Aggiungi un altro documento (per esempio, la lettera d’accompagnamento)'}
        </ButtonNaked>
      </NewNotificationCard>
    </form>
  );
};

export default Attachments;
