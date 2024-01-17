/// <reference types="react" />
import { DowntimeLogPage } from '../../models';
type Props = {
    downtimeLog: DowntimeLogPage;
    getDowntimeLegalFactDocumentDetails: (legalFactId: string) => any;
    handleTrackDownloadCertificateOpposable3dparties?: () => void;
};
declare const DesktopDowntimeLog: ({ downtimeLog, getDowntimeLegalFactDocumentDetails, handleTrackDownloadCertificateOpposable3dparties, }: Props) => JSX.Element;
export default DesktopDowntimeLog;
