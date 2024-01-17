/// <reference types="react" />
import { DowntimeLogPage } from '../../models';
type Props = {
    downtimeLog: DowntimeLogPage;
    getDowntimeLegalFactDocumentDetails: (legalFactId: string) => any;
    handleTrackDownloadCertificateOpposable3dparties?: () => void;
};
declare const MobileDowntimeLog: ({ downtimeLog, getDowntimeLegalFactDocumentDetails, handleTrackDownloadCertificateOpposable3dparties, }: Props) => JSX.Element;
export default MobileDowntimeLog;
