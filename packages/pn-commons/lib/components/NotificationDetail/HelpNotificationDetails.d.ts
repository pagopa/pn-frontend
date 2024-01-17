/// <reference types="react" />
interface HelpNotificationDetailsProps {
    title: string;
    subtitle: string;
    courtName: string;
    phoneNumber: string;
    mail: string;
    website: string;
}
/**
 * Getting help for the user's notification
 * @param title card title
 * @param subtitle card subtitle
 * @param courtName court name that user need to contact in order to get help
 * @param phoneNumber the phone number of the court
 * @param mail the email of the court
 * @param website the website of the court
 */
declare const HelpNotificationDetails: React.FC<HelpNotificationDetailsProps>;
export default HelpNotificationDetails;
