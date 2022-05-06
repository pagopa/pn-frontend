import { useMemo, useReducer, Fragment, useRef, ChangeEvent, DragEvent, useEffect } from 'react';
import { Alert, Box, Input, LinearProgress, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  uploadText: string;
  vertical?: boolean;
  accept: string;
  uploadFn: (file: any) => Promise<any>;
  onFileUploaded: (data: any) => void;
  onRemoveFile: () => void;
  isSending?: boolean;
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
};

const reducer = (state: UploadState, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case 'ADD_FILE':
      return { ...state, status: UploadStatus.IN_PROGRESS, file: action.payload, error: '' };
    case 'FILE_TYPE_NOT_SUPPORTED':
      return {
        ...state,
        file: action.payload,
        error: 'Estensione file non supportata. Riprovare con un altro file.',
      };
    case 'UPLOAD_IN_ERROR':
      return {
        ...state,
        file: action.payload,
        error: 'Si è verificato un errore durante il caricamento del file. Si prega di riprovare.',
      };
    case 'FILE_UPLOADED':
      return { ...state, status: UploadStatus.UPLOADED, error: '' };
    case 'REMOVE_FILE':
      return { ...state, status: UploadStatus.TO_UPLOAD, file: null };
    case 'IS_SENDING':
      return { ...state, status: UploadStatus.SENDING };
    default:
      return state;
  }
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
 * @returns
 */
const FileUpload = ({ uploadText, vertical = false, accept, uploadFn, onFileUploaded, onRemoveFile, isSending }: Props) => {
  const [data, dispatch] = useReducer(reducer, {
    status: UploadStatus.TO_UPLOAD,
    file: null,
    error: '',
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

  const uploadFile = (file: any) => {
    if (file && file.type && accept.indexOf(file.type) > -1) {
      dispatch({ type: 'ADD_FILE', payload: file });
      uploadFn(file)
        .then((res: any) => {
          dispatch({ type: 'FILE_UPLOADED' });
          onFileUploaded(res);
        })
        .catch(() => {
          dispatch({ type: 'UPLOAD_IN_ERROR' });
        });
    } else {
      dispatch({ type: 'FILE_TYPE_NOT_SUPPORTED' });
    }
  };

  const uploadFileHandler = (e: ChangeEvent) => {
    uploadFile((e.target as any).files[0]);
  };

  const removeFileHandler = () => {
    dispatch({type: 'REMOVE_FILE'});
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
    dispatch(isSending ? {type: 'IS_SENDING'} : {type: 'FILE_UPLOADED'})
  }, [isSending])

  return (
    <Box
      sx={{ ...containerStyle, padding: '24px', borderRadius: '10px' }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      component="div"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection={vertical ? 'column' : 'row'}
        margin="auto"
      >
        {data.status === UploadStatus.TO_UPLOAD && (
          <Fragment>
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
          </Fragment>
        )}
        {(data.status === UploadStatus.IN_PROGRESS || data.status === UploadStatus.SENDING) && (
          <Fragment>
            <Typography display="inline" variant="body2">
              {data.status === UploadStatus.IN_PROGRESS ? 'Caricamento in corso...' : 'Invio in corso...'}
            </Typography>
            <Typography sx={{ margin: '0 20px', width: '80%' }}>
              <LinearProgress />
            </Typography>
          </Fragment>
        )}
        {data.status === UploadStatus.UPLOADED && (
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{width: '100%'}}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <AttachFileIcon color="primary" />
              <Typography color="primary">{data.file.name}</Typography>
              <Typography fontWeight={600} sx={{ marginLeft: '30px' }}>
                {(data.file.size / 1024).toFixed(2)}&nbsp;KB
              </Typography>
            </Box>
            <CloseIcon sx={{ cursor: 'pointer' }} onClick={removeFileHandler}/>
          </Box>
        )}
      </Box>
      {data.error && (
        <Alert severity="error" sx={{ marginTop: '10px' }}>
          {data.error}
        </Alert>
      )}
    </Box>
  );
};

export default FileUpload;
