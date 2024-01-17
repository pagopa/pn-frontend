/// <reference types="react" />
import { Downtime, Row } from '../../models';
declare const DowntimeLogDataSwitch: React.FC<{
    data: Row<Downtime>;
    type: keyof Downtime;
    inTwoLines: boolean;
    getDowntimeLegalFactDocumentDetails: (legalFactId: string) => any;
    handleTrackDownloadCertificateOpposable3dparties?: () => void;
}>;
export default DowntimeLogDataSwitch;
