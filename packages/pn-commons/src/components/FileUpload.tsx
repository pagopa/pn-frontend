import {
  useMemo,
  useReducer,
  Fragment,
  useRef,
  ChangeEvent,
  DragEvent,
  useEffect,
  ReactNode,
} from 'react';
import { Alert, Box, IconButton, Input, LinearProgress, SxProps, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { calcUnit8Array, calcSha256String, calcBase64String } from '../utils/file.utility';
import CustomTooltip from './CustomTooltip';

type Props = {
  uploadText: string;
  vertical?: boolean;
  accept: string;
  uploadFn?: (
    file: any,
    sha256?: { hashBase64: string; hashHex: string }
  ) => Promise<void>;
  onFileUploaded: (
    file: any,
    sha256?: { hashBase64: string; hashHex: string }
  ) => void;
  onRemoveFile: () => void;
  isSending?: boolean;
  sx?: SxProps;
  calcSha256?: boolean;
  fileFormat?: 'base64' | 'uint8Array';
};

enum UploadStatus {
  TO_UPLOAD = 'TO_UPLOAD',
  IN_PROGRESS = 'IN_PROGRESS',
  UPLOADED = 'UPLOADED',
  SENDING = 'SENDING',
}

type UploadState = {
  file: any;
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
        error: 'Estensione file non supportata. Riprovare con un altro file.',
      };
    case 'UPLOAD_IN_ERROR':
      return {
        ...state,
        file: null,
        status: UploadStatus.TO_UPLOAD,
        error: 'Si è verificato un errore durante il caricamento del file. Si prega di riprovare.',
        sha256: '',
      };
    case 'FILE_UPLOADED':
      return { ...state, status: UploadStatus.UPLOADED, error: '', sha256: action.payload };
    case 'REMOVE_FILE':
      return { ...state, status: UploadStatus.TO_UPLOAD, file: null, sha256: '' };
    case 'IS_SENDING':
      return { ...state, status: UploadStatus.SENDING };
    default:
      return state;
  }
};

const OrientedBox = ({ vertical, children }: { vertical: boolean; children: ReactNode }) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    flexDirection={vertical ? 'column' : 'row'}
    margin="auto"
  >
    {children}
  </Box>
);

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
 * @param fileFormat format of the file after loading
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
  fileFormat,
}: Props) => {
  const [data, dispatch] = useReducer(reducer, {
    status: UploadStatus.TO_UPLOAD,
    file: null,
    error: '',
    sha256: '',
  });
  const uploadInputRef = useRef();

  const containerStyle = useMemo(() => {
    if (data.status === UploadStatus.IN_PROGRESS || data.status === UploadStatus.SENDING) {
      return {
        backgroundColor: 'white',
        '& > div': {
          height: '24px',
        },
      };
    } else if (data.status === UploadStatus.UPLOADED) {
      return {
        border: '1px solid',
        borderColor: 'primary.main',
        backgroundColor: 'white',
      };
    }
    return {
      border: '1px dashed',
      borderColor: 'primary.main',
      backgroundColor: 'primaryAction.selected',
    };
  }, [data.status]);

  const chooseFileHandler = () => {
    (uploadInputRef.current as any).click();
  };

  const uploadFile = async (file: any) => {
    if (file && file.type && accept.indexOf(file.type) > -1) {
      dispatch({ type: 'ADD_FILE', payload: file });
      try {
        /* eslint-disable-next-line functional/no-let */
        let fileFormatted = file;
        if (fileFormat === 'base64') {
          fileFormatted = await calcBase64String(file);
        } else if (fileFormat === 'uint8Array') {
          fileFormatted = await calcUnit8Array(file);
        }
        const sha256 = calcSha256 ? await calcSha256String(file) : undefined;
        if (uploadFn) {
          await uploadFn(fileFormatted, sha256);
        }
        dispatch({ type: 'FILE_UPLOADED', payload: sha256?.hashHex });
        onFileUploaded(fileFormatted, sha256);
      } catch {
        dispatch({ type: 'UPLOAD_IN_ERROR' });
      }
    } else {
      dispatch({ type: 'FILE_TYPE_NOT_SUPPORTED' });
    }
  };

  const uploadFileHandler = (e: ChangeEvent) => {
    uploadFile((e.target as any).files[0]);
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
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    uploadFile(e.dataTransfer.files[0]);
    e.dataTransfer.clearData();
  };

  useEffect(() => {
    if (data.status !== UploadStatus.UPLOADED && data.status !== UploadStatus.SENDING) {
      return;
    }
    dispatch(isSending ? { type: 'IS_SENDING' } : { type: 'FILE_UPLOADED' });
  }, [isSending]);

  return (
    <Box
      sx={{ ...containerStyle, padding: '24px', borderRadius: '10px', ...sx }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      component="div"
    >
      {data.status === UploadStatus.TO_UPLOAD && (
        <OrientedBox vertical={vertical}>
          <CloudUploadIcon color="primary" sx={{ margin: '0 10px' }} />
          <Typography display="inline" variant="body2">
            {uploadText}&nbsp;oppure&nbsp;
          </Typography>
          <Typography
            display="inline"
            variant="body2"
            color="primary"
            sx={{ cursor: 'pointer' }}
            onClick={chooseFileHandler}
            data-testid="loadFromPc"
          >
            selezionalo dal tuo computer
          </Typography>
          <Input
            type="file"
            sx={{ display: 'none' }}
            inputRef={uploadInputRef}
            inputProps={{ accept }}
            onChange={uploadFileHandler}
            data-testid="fileInput"
          />
        </OrientedBox>
      )}
      {(data.status === UploadStatus.IN_PROGRESS || data.status === UploadStatus.SENDING) && (
        <OrientedBox vertical={vertical}>
          <Typography display="inline" variant="body2">
            {data.status === UploadStatus.IN_PROGRESS
              ? 'Caricamento in corso...'
              : 'Invio in corso...'}
          </Typography>
          <Typography sx={{ margin: '0 20px', width: 'calc(100% - 200px)' }}>
            <LinearProgress />
          </Typography>
        </OrientedBox>
      )}
      {data.status === UploadStatus.UPLOADED && (
        <Fragment>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: '100%' }}
          >
            <Box display="flex" justifyContent="center" alignItems="center">
              <AttachFileIcon color="primary" />
              <Typography color="primary">{data.file.name}</Typography>
              <Typography fontWeight={600} sx={{ marginLeft: '30px' }}>
                {(data.file.size / 1024).toFixed(2)}&nbsp;KB
              </Typography>
            </Box>
            <IconButton onClick={removeFileHandler}>
              <CloseIcon />
            </IconButton>
          </Box>
          {data.sha256 && (
            <Box sx={{ marginTop: '20px' }}>
              <Typography display="inline" fontWeight={700}>
                Codice hash
              </Typography>
              <Typography sx={{ marginLeft: '10px' }} variant="caption" display="inline">
                {data.sha256}
              </Typography>
              <CustomTooltip
                openOnClick
                tooltipContent="Il codice hash è un codice alfanumerico univoco utilizzato per identificare un determinato file"
                sx={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '10px' }}
              >
                <IconButton>
                  <InfoOutlinedIcon color="action" />
                </IconButton>
              </CustomTooltip>
            </Box>
          )}
        </Fragment>
      )}
      {data.error && (
        <Alert severity="error" sx={{ marginTop: '10px' }}>
          {data.error}
        </Alert>
      )}
    </Box>
  );
};

export default FileUpload;
