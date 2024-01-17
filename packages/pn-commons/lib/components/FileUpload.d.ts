/// <reference types="react" />
import { SxProps } from '@mui/material';
type Props = {
    uploadText: string;
    vertical?: boolean;
    accept: string;
    uploadFn?: (file: File, sha256?: {
        hashBase64: string;
        hashHex: string;
    }) => Promise<void>;
    onFileUploaded: (file: File, sha256?: {
        hashBase64: string;
        hashHex: string;
    }) => void;
    onRemoveFile: () => void;
    isSending?: boolean;
    sx?: SxProps;
    calcSha256?: boolean;
    fileUploaded?: {
        file: {
            data?: File;
            sha256?: {
                hashBase64: string;
                hashHex: string;
            };
        };
    };
    fileSizeLimit?: number;
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
declare const FileUpload: ({ uploadText, vertical, accept, uploadFn, onFileUploaded, onRemoveFile, isSending, sx, calcSha256, fileUploaded, fileSizeLimit, }: Props) => JSX.Element;
export default FileUpload;
