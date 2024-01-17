import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Fragment, useEffect, useMemo, useReducer, useRef, } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Alert, Box, Grid, IconButton, Input, LinearProgress, Typography, } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useIsMobile } from '../hooks';
import { calcSha256String, parseFileSize } from '../utility/file.utility';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
import CustomTooltip from './CustomTooltip';
var UploadStatus;
(function (UploadStatus) {
    UploadStatus["TO_UPLOAD"] = "TO_UPLOAD";
    UploadStatus["IN_PROGRESS"] = "IN_PROGRESS";
    UploadStatus["UPLOADED"] = "UPLOADED";
    UploadStatus["SENDING"] = "SENDING";
})(UploadStatus || (UploadStatus = {}));
const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_FILE':
            return { ...state, status: UploadStatus.IN_PROGRESS, file: action.payload, error: '' };
        case 'FILE_TYPE_NOT_SUPPORTED':
            return {
                ...state,
                error: getLocalizedOrDefaultLabel('common', 'upload-file.ext-not-supported', 'Estensione file non supportata. Riprovare con un altro file.'),
            };
        case 'FILE_SIZE_EXCEEDED':
            return {
                ...state,
                ...action.payload,
                error: getLocalizedOrDefaultLabel('common', 'upload-file.file-size-exceeded', `Il file selezionato supera la dimensione massima di ${action.payload}.`, {
                    limit: action.payload,
                }),
            };
        case 'UPLOAD_IN_ERROR':
            return {
                ...state,
                file: null,
                status: UploadStatus.TO_UPLOAD,
                error: getLocalizedOrDefaultLabel('common', 'upload-file.loading-error', 'Si è verificato un errore durante il caricamento del file. Si prega di riprovare.'),
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
        default:
            return state;
    }
};
const OrientedBox = ({ vertical, children }) => (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", flexDirection: vertical ? 'column' : 'row', margin: "auto", children: children }));
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
const FileUpload = ({ uploadText, vertical = false, accept, uploadFn, onFileUploaded, onRemoveFile, isSending, sx, calcSha256 = false, fileUploaded, fileSizeLimit = 209715200, }) => {
    const [fileData, dispatch] = useReducer(reducer, {
        status: UploadStatus.TO_UPLOAD,
        file: null,
        error: '',
        sha256: '',
    });
    const uploadInputRef = useRef();
    const attachmentExists = fileUploaded?.file && fileUploaded?.file.data;
    const isMobile = useIsMobile();
    const containerStyle = useMemo(() => {
        if (fileData.status === UploadStatus.IN_PROGRESS || fileData.status === UploadStatus.SENDING) {
            return {
                backgroundColor: 'white',
                '& > div': {
                    height: '24px',
                },
            };
        }
        else if (fileData.status === UploadStatus.UPLOADED) {
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
    }, [fileData.status]);
    const chooseFileHandler = () => {
        uploadInputRef.current.click();
    };
    const uploadFile = async (file) => {
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
            }
            catch {
                dispatch({ type: 'UPLOAD_IN_ERROR' });
            }
        }
        else {
            dispatch({ type: 'FILE_TYPE_NOT_SUPPORTED' });
        }
    };
    const uploadFileHandler = (e) => {
        void uploadFile(e.target.files[0]);
    };
    const removeFileHandler = () => {
        dispatch({ type: 'REMOVE_FILE' });
        onRemoveFile();
    };
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // eslint-disable-next-line functional/immutable-data
        e.dataTransfer.dropEffect = 'copy';
    };
    const handleDrop = (e) => {
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
    const HashToolTip = () => (_jsx(CustomTooltip, { openOnClick: true, tooltipContent: getLocalizedOrDefaultLabel('common', 'upload-file.hash-code-descr', 'Il codice hash è un codice alfanumerico univoco utilizzato per identificare un determinato file'), sx: { display: 'inline-block', verticalAlign: 'middle', marginLeft: '10px' }, children: _jsx(IconButton, { children: _jsx(InfoOutlinedIcon, { color: "action" }) }) }));
    return (_jsxs(Box, { sx: { ...containerStyle, padding: '24px', borderRadius: '10px', ...sx }, onDragOver: handleDragOver, onDrop: handleDrop, onDragEnter: handleDragEnter, onDragLeave: handleDragLeave, component: "div", children: [fileData.status === UploadStatus.TO_UPLOAD && (_jsxs(OrientedBox, { vertical: vertical, children: [!isMobile && (_jsxs(_Fragment, { children: [_jsx(CloudUploadIcon, { color: "primary", sx: { margin: '0 10px' } }), _jsxs(Typography, { display: "inline", variant: "body2", children: [uploadText, "\u00A0", getLocalizedOrDefaultLabel('common', 'upload-file.or', 'oppure'), "\u00A0"] })] })), _jsx(ButtonNaked, { onClick: chooseFileHandler, "data-testid": "loadFromPc", children: _jsx(Typography, { display: "inline", variant: "body2", color: "primary", sx: { cursor: 'pointer' }, children: getLocalizedOrDefaultLabel('common', isMobile ? 'upload-file.select-from-mobile' : 'upload-file.select-from-pc', 'selezionalo dal tuo computer') }) }), _jsx(Input, { id: "file-input", type: "file", sx: { display: 'none' }, inputRef: uploadInputRef, inputProps: { accept }, onChange: uploadFileHandler, "data-testid": "fileInput" })] })), (fileData.status === UploadStatus.IN_PROGRESS ||
                fileData.status === UploadStatus.SENDING) && (_jsxs(OrientedBox, { vertical: vertical, children: [_jsx(Typography, { display: "inline", variant: "body2", children: fileData.status === UploadStatus.IN_PROGRESS
                            ? getLocalizedOrDefaultLabel('common', 'upload-file.loading', 'Caricamento in corso...')
                            : getLocalizedOrDefaultLabel('common', 'upload-file.sending', 'Invio in corso...') }), _jsx(Typography, { sx: { margin: '0 20px', width: 'calc(100% - 200px)' }, children: _jsx(LinearProgress, {}) })] })), fileData.status === UploadStatus.UPLOADED && (_jsxs(Fragment, { children: [_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", sx: { width: '100%' }, children: [_jsxs(Box, { display: isMobile ? 'block' : 'flex', alignItems: "center", children: [_jsxs(Box, { display: "flex", children: [_jsx(AttachFileIcon, { color: "primary" }), _jsx(Typography, { color: "primary", children: fileData.file.name })] }), _jsx(Typography, { fontWeight: 600, sx: { marginLeft: { lg: '30px' } }, children: parseFileSize(fileData.file.size) })] }), _jsx(IconButton, { "data-testid": "removeDocument", onClick: removeFileHandler, "aria-label": getLocalizedOrDefaultLabel('common', 'attachments.remove-attachment', 'Elimina allegato'), children: _jsx(CloseIcon, {}) })] }), fileData.sha256 && (_jsx(Box, { sx: { marginTop: '20px' }, children: _jsxs(Grid, { container: true, wrap: "nowrap", alignItems: 'center', children: [_jsx(Grid, { item: true, xs: "auto", children: _jsx(Typography, { id: "file-upload-hash-code", display: "inline", fontWeight: 700, children: getLocalizedOrDefaultLabel('common', 'upload-file.hash-code', 'Codice hash') }) }), _jsx(Grid, { item: true, zeroMinWidth: true, children: _jsx(Typography, { sx: {
                                            marginLeft: '10px',
                                            marginTop: '3px',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            display: 'block',
                                        }, variant: "caption", children: fileData.sha256 }) }), _jsx(Grid, { item: true, xs: "auto", children: _jsx(HashToolTip, {}) })] }) }))] })), fileData.error && (_jsx(Alert, { id: "file-upload-error", severity: "error", sx: { marginTop: '10px' }, children: fileData.error }))] }));
};
export default FileUpload;
