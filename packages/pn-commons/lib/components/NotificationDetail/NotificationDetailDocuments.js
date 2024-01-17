import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Box, Grid, Stack, Typography } from '@mui/material';
// import DownloadIcon from '@mui/icons-material/Download';
import { ButtonNaked } from '@pagopa/mui-italia';
/**
 * Notification detail documents
 * @param title title to show
 * @param documents data to show
 * @param clickHandler function called when user clicks on the download button
 * @param documentsAvailable flag that allows download file or not (after 120 days)
 * @param downloadFilesMessage disclaimer to show about downloadable acts
 * @param downloadFilesLink text to bring to
 * @param disableDownloads if notification is cancelled button naked is disabled
 */
const NotificationDetailDocuments = ({ title, documents = [], clickHandler, documentsAvailable = true, downloadFilesMessage, disableDownloads = false, titleVariant = 'overline', } // TODO: remove comment when link ready downloadFilesLink
) => {
    const mapOtherDocuments = (documents) => documents.map((d) => {
        const document = {
            key: d.digests && d.digests.sha256 ? d.digests.sha256 : d.documentId,
            name: d.title || d.ref.key,
            downloadHandler: d.documentId
                ? {
                    documentId: d.documentId,
                    documentType: d.documentType,
                }
                : d.docIdx,
        };
        return (_jsx(Box, { "data-testid": "notificationDetailDocuments", children: !documentsAvailable ? (_jsxs(Typography, { sx: { display: 'flex', alignItems: 'center' }, variant: "button", color: "text.disabled", fontSize: 14, children: [_jsx(AttachFileIcon, { sx: { mr: 1 }, fontSize: "inherit", color: "inherit" }), document.name] })) : (_jsxs(ButtonNaked, { id: "document-button", "data-testid": "documentButton", color: 'primary', startIcon: _jsx(AttachFileIcon, {}), onClick: () => clickHandler(document.downloadHandler), disabled: disableDownloads, children: [_jsx(Box, { sx: {
                            textOverflow: 'ellipsis',
                            maxWidth: {
                                xs: '15rem',
                                sm: '20rem',
                                md: '30rem',
                                lg: '24rem',
                                xl: '34rem',
                            },
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                        }, children: document.name }), _jsxs(Typography, { sx: { fontWeight: 600, ml: 1 }, children: ['', " "] })] })) }, document.key));
    });
    return (_jsxs(_Fragment, { children: [_jsx(Grid, { container: true, direction: "row", justifyContent: "space-between", alignItems: "center", children: _jsx(Grid, { item: true, sx: { mb: 3 }, children: _jsx(Typography, { id: "notification-detail-document-attached", color: "text.primary", variant: titleVariant, children: title }) }, "detail-documents-title") }, "files-section"), _jsx(Grid, { item: true, "data-testid": "documentsMessage", children: _jsx(Stack, { direction: "row", children: downloadFilesMessage && (_jsx(Typography, { variant: "body2", sx: { mb: 3 }, children: downloadFilesMessage })) }) }, "detail-documents-message"), _jsx(Grid, { item: true, children: documents && mapOtherDocuments(documents) }, "download-files-section")] }));
};
export default NotificationDetailDocuments;
