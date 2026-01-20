import { ChangeEvent, DragEvent, ReactNode, useEffect, useMemo, useReducer, useRef } from 'react';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Box,
  Button,
  FormHelperText,
  Input,
  LinearProgress,
  Stack,
  SxProps,
  TextField,
  Typography,
} from '@mui/material';
import { ButtonNaked, CopyToClipboardButton } from '@pagopa/mui-italia';

import { useIsMobile } from '../hooks/useIsMobile';
import { calcSha256String, parseFileSize } from '../utility/file.utility';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';

type Props = {
  uploadText: string;
  vertical?: boolean;
  accept: string;
  uploadFn?: (file: File, sha256?: { hashBase64: string; hashHex: string }) => Promise<void>;
  onFileUploaded: (file: File, sha256?: { hashBase64: string; hashHex: string }) => void;
  onRemoveFile: () => void;
  isSending?: boolean;
  sx?: SxProps;
  calcSha256?: boolean;
  fileUploaded?: { file: { data?: File; sha256?: { hashBase64: string; hashHex: string } } };
  fileSizeLimit?: number;
  showHashCode?: boolean;
  externalError?: string;
};

enum UploadStatus {
  TO_UPLOAD = 'TO_UPLOAD',
  IN_PROGRESS = 'IN_PROGRESS',
  UPLOADED = 'UPLOADED',
  SENDING = 'SENDING',
}

type UploadState = {
  file: File;
  status: UploadStatus;
  error: string;
  sha256: string;
};

const reducer = (state: UploadState, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case 'ADD_FILE':
      return { ...state, status: UploadStatus.IN_PROGRESS, file: action.payload, error: '' };
    case 'FILE_TYPE_NOT_SUPPORTED':
      return {
        ...state,
        error: getLocalizedOrDefaultLabel(
          'common',
          'upload-file.ext-not-supported',
          'Estensione file non supportata. Riprovare con un altro file.'
        ),
      };
    case 'FILE_SIZE_EXCEEDED':
      return {
        ...state,
        ...action.payload,
        error: getLocalizedOrDefaultLabel(
          'common',
          'upload-file.file-size-exceeded',
          `Il file selezionato supera la dimensione massima di ${action.payload}.`,
          {
            limit: action.payload,
          }
        ),
      };
    case 'UPLOAD_IN_ERROR':
      return {
        ...state,
        file: null,
        status: UploadStatus.TO_UPLOAD,
        error: getLocalizedOrDefaultLabel(
          'common',
          'upload-file.loading-error',
          'Si è verificato un errore durante il caricamento del file. Si prega di riprovare.'
        ),
        sha256: '',
      };
    case 'FILE_PREVIOUSLY_UPLOADED':
      return {
        ...state,
        ...action.payload,
        status: UploadStatus.UPLOADED,
        error: '',
        sha256: action.payload.file.sha256.hashHex,
        file: action.payload.file.data,
      };
    case 'FILE_UPLOADED':
      return { ...state, status: UploadStatus.UPLOADED, error: '', sha256: action.payload };
    case 'REMOVE_FILE':
      return { ...state, status: UploadStatus.TO_UPLOAD, file: null, sha256: '' };
    case 'IS_SENDING':
      return { ...state, status: UploadStatus.SENDING };
    case 'EXTERNAL_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const OrientedBox = ({ vertical, children }: { vertical: boolean; children: ReactNode }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    flexDirection={vertical ? 'column' : 'row'}
    margin="auto"
  >
    {children}
  </Box>
);

const FilenameBox = ({ filename }: { filename: string }) => {
  const isMobile = useIsMobile();
  const [name, extension] = filename.split('.');
  return (
    <Stack direction="row" color="primary" width={isMobile ? 1 : 'auto'}>
      <Typography
        sx={{
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          justifyContent: 'start',
        }}
      >
        {name}.
      </Typography>
      <Typography>{extension}</Typography>
    </Stack>
  );
};

/**
 * This component allows file upload
 * @param uploadText text to display
 * @param vertical text orientation
 * @param accept file types accepted
 * @param uploadFn function called to upload file
 * @param onFileUploaded function called after file upload
 * @param onRemoveFile function called after file deletion
 * @param isSending flag for sending status
 * @param sx style to be addded to the component
 * @param calcSha256 flag to calculate the sha256
 * @param fileUploaded file previously uploaded
 * @param fileSizeLimit max file size limit - default is 209715200 (200MB)
 * @returns
 */
const FileUpload = ({
  uploadText,
  vertical = false,
  accept,
  uploadFn,
  onFileUploaded,
  onRemoveFile,
  isSending,
  sx,
  calcSha256 = false,
  fileUploaded,
  fileSizeLimit = 209715200,
  showHashCode = true,
  externalError,
}: Props) => {
  const [fileData, dispatch] = useReducer(reducer, {
    status: UploadStatus.TO_UPLOAD,
    file: null,
    error: '',
    sha256: '',
  });
  const uploadInputRef = useRef();

  const attachmentExists = fileUploaded?.file?.data;

  const isMobile = useIsMobile();

  const containerStyle = useMemo(() => {
    if (fileData.status === UploadStatus.IN_PROGRESS || fileData.status === UploadStatus.SENDING) {
      return {
        backgroundColor: 'white',
        '& > div': {
          height: '24px',
        },
      };
    } else if (fileData.status === UploadStatus.UPLOADED) {
      return {
        border: '1px solid',
        borderColor: 'primary.main',
        backgroundColor: 'white',
      };
    }
    return {
      border: '1px dashed',
      borderColor: fileData.error ? 'error.main' : 'primary.main',
      backgroundColor: fileData.error ? '#fe66661a' : 'primaryAction.selected',
    };
  }, [fileData.status, fileData.error]);

  const chooseFileHandler = () => {
    (uploadInputRef.current as any).click();
  };

  const uploadFile = async (file: File) => {
    if (file?.size > fileSizeLimit) {
      dispatch({ type: 'FILE_SIZE_EXCEEDED', payload: parseFileSize(fileSizeLimit) });
      return;
    }
    if (file?.type && accept.indexOf(file.type) > -1) {
      dispatch({ type: 'ADD_FILE', payload: file });
      try {
        /* eslint-disable-next-line functional/no-let */
        const sha256 = calcSha256 ? await calcSha256String(file) : undefined;
        if (uploadFn) {
          await uploadFn(file, sha256);
        }
        dispatch({ type: 'FILE_UPLOADED', payload: sha256?.hashHex });
        onFileUploaded(file, sha256);
      } catch {
        dispatch({ type: 'UPLOAD_IN_ERROR' });
      }
    } else {
      dispatch({ type: 'FILE_TYPE_NOT_SUPPORTED' });
    }
  };

  const uploadFileHandler = (e: ChangeEvent) => {
    void uploadFile((e.target as any).files[0]);
  };

  const removeFileHandler = () => {
    dispatch({ type: 'REMOVE_FILE' });
    onRemoveFile();
  };

  const handleDragEnter = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // eslint-disable-next-line functional/immutable-data
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void uploadFile(e.dataTransfer.files[0]);
    e.dataTransfer.clearData();
  };

  useEffect(() => {
    if (fileData.status !== UploadStatus.UPLOADED && fileData.status !== UploadStatus.SENDING) {
      return;
    }
    dispatch(isSending ? { type: 'IS_SENDING' } : { type: 'FILE_UPLOADED' });
  }, [isSending]);

  useEffect(() => {
    if (attachmentExists && fileData.status !== UploadStatus.UPLOADED) {
      dispatch({ type: 'FILE_PREVIOUSLY_UPLOADED', payload: fileUploaded });
    }
  }, [attachmentExists]);

  useEffect(() => {
    dispatch({ type: 'EXTERNAL_ERROR', payload: externalError });
  }, [externalError]);

  return (
    <>
      <Box
        sx={{ ...containerStyle, padding: '24px', borderRadius: '10px', ...sx }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        component="div"
      >
        {fileData.status === UploadStatus.TO_UPLOAD && (
          <OrientedBox vertical={isMobile}>
            <CloudUploadIcon
              color={fileData.error ? 'error' : 'primary'}
              sx={{ margin: '0 10px' }}
            />
            <Typography
              display="inline"
              variant="body2"
              textAlign="center"
              color={fileData.error ? 'error' : ''}
            >
              {uploadText}&nbsp;{getLocalizedOrDefaultLabel('common', 'upload-file.or')}
              &nbsp;
            </Typography>
            <Button
              variant="contained"
              onClick={chooseFileHandler}
              data-testid="loadFromPc"
              sx={{ margin: isMobile ? '10px 0' : '0 10px' }}
            >
              {getLocalizedOrDefaultLabel('common', 'upload-file.select-file')}
            </Button>
            <Input
              id="file-input"
              type="file"
              sx={{ display: 'none' }}
              inputRef={uploadInputRef}
              inputProps={{ accept }}
              onChange={uploadFileHandler}
              data-testid="fileInput"
            />
          </OrientedBox>
        )}
        {(fileData.status === UploadStatus.IN_PROGRESS ||
          fileData.status === UploadStatus.SENDING) && (
          <OrientedBox vertical={vertical}>
            <Typography display="inline" variant="body2">
              {fileData.status === UploadStatus.IN_PROGRESS
                ? getLocalizedOrDefaultLabel(
                    'common',
                    'upload-file.loading',
                    'Caricamento in corso...'
                  )
                : getLocalizedOrDefaultLabel('common', 'upload-file.sending', 'Invio in corso...')}
            </Typography>
            <Typography sx={{ margin: '0 20px', width: 'calc(100% - 200px)' }}>
              <LinearProgress />
            </Typography>
          </OrientedBox>
        )}
        {fileData.status === UploadStatus.UPLOADED && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: '100%' }}
          >
            <Box
              display={isMobile ? 'block' : 'flex'}
              alignItems="center"
              justifyContent="start"
              width={isMobile ? 0.85 : 'auto'}
            >
              <Box display="flex" width={isMobile ? 0.7 : 'auto'} justifyContent="start">
                <AttachFileIcon color="primary" />
                <FilenameBox filename={fileData.file.name} />
              </Box>
              <Typography fontWeight={600} sx={{ marginLeft: { lg: '30px' } }}>
                {parseFileSize(fileData.file.size)}
              </Typography>
            </Box>
            <ButtonNaked
              data-testid="removeDocument"
              onClick={removeFileHandler}
              aria-label={getLocalizedOrDefaultLabel(
                'common',
                'attachments.remove-attachment',
                'Elimina allegato'
              )}
            >
              <CloseIcon />
            </ButtonNaked>
          </Box>
        )}
      </Box>
      {fileData.sha256 && showHashCode && (
        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="body2" fontWeight={600} fontSize={'16px'} color="text.secondary">
            {getLocalizedOrDefaultLabel('common', 'upload-file.hash-code', 'Codice hash')}
          </Typography>
          <Typography variant="body2" fontSize={'14px'} marginTop={1}>
            {getLocalizedOrDefaultLabel(
              'common',
              'upload-file.hash-code-descr',
              'Il codice hash è un codice alfanumerico univoco utilizzato per identificare un determinato file'
            )}
          </Typography>
          <TextField
            fullWidth
            value={fileData.sha256}
            size="small"
            margin="dense"
            InputProps={{
              readOnly: true,
              endAdornment: <CopyToClipboardButton value={fileData.sha256} />,
            }}
          />
        </Box>
      )}
      {fileData.error && (
        <FormHelperText id="file-upload-error" error sx={{ mt: 0.5, mx: '14px' }}>
          {fileData.error}
        </FormHelperText>
      )}
    </>
  );
};

export default FileUpload;
