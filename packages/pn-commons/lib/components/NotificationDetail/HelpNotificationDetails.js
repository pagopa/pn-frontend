import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { Grid, Typography, Divider } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import WebIcon from '@mui/icons-material/Web';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import { dataRegex } from '../../utils/string.utility';
/**
 * Getting help for the user's notification
 * @param title card title
 * @param subtitle card subtitle
 * @param courtName court name that user need to contact in order to get help
 * @param phoneNumber the phone number of the court
 * @param mail the email of the court
 * @param website the website of the court
 */
const HelpNotificationDetails = ({ title, subtitle, courtName, phoneNumber, mail, website, }) => {
    const [validatedContactChannels, setValidatedContactChannels] = useState({
        phoneNumber: null,
        mail: null,
        website: null,
    });
    useEffect(() => {
        const fetchValidatedContactChannels = async () => {
            const validatedPhoneNumber = (await yup.string().matches(dataRegex.phoneNumber).isValid(phoneNumber)) ? phoneNumber : null;
            const validatedMail = (await yup.string().matches(dataRegex.email).isValid(mail)) ? mail : null;
            const validatedWebsite = (await yup.string().url().isValid(website)) ? website : null;
            setValidatedContactChannels({
                phoneNumber: validatedPhoneNumber,
                mail: validatedMail,
                website: validatedWebsite,
            });
        };
        void fetchValidatedContactChannels();
    }, [phoneNumber, mail, website]);
    const someContactChannelPresent = useMemo(() => validatedContactChannels.phoneNumber || validatedContactChannels.mail || validatedContactChannels.website, [validatedContactChannels]);
    return _jsxs(_Fragment, { children: [_jsx(Grid, { container: true, direction: "row", justifyContent: "space-between", alignItems: "center", children: _jsx(Grid, { item: true, children: _jsx(Typography, { color: "text.primary", fontWeight: 700, textTransform: "uppercase", fontSize: 14, children: title.toUpperCase() }, void 0) }, void 0) }, void 0), _jsxs(Typography, { variant: "body1", sx: { mt: 1 }, children: [subtitle, " ", courtName, "."] }, void 0), someContactChannelPresent &&
                _jsxs(Grid, { container: true, direction: "row", alignItems: "center", mt: 2, children: [validatedContactChannels.phoneNumber &&
                            _jsx(ButtonNaked, { color: "primary", startIcon: _jsx(LocalPhoneIcon, {}, void 0), href: `tel:${validatedContactChannels.phoneNumber}`, children: validatedContactChannels.phoneNumber }, void 0), validatedContactChannels.mail && _jsx(ButtonNaked, { color: "primary", startIcon: _jsx(MailOutlineIcon, {}, void 0), sx: { ml: 2 }, href: `mailto:${validatedContactChannels.mail}`, target: "_blank", children: validatedContactChannels.mail }, void 0), validatedContactChannels.website &&
                            _jsx(ButtonNaked, { color: "primary", startIcon: _jsx(WebIcon, {}, void 0), sx: { ml: 2 }, href: validatedContactChannels.website, children: getLocalizedOrDefaultLabel('notifications', 'detail.help.goto', 'Vai al sito') }, void 0)] }, void 0), !someContactChannelPresent && _jsx(Typography, { variant: "body1", children: "(non ci sono trovati dati di contatto)" }, void 0), _jsx(Divider, { sx: { mt: 2 } }, void 0), _jsx(Typography, { variant: "body1", sx: { mt: 2 }, children: getLocalizedOrDefaultLabel('notifications', 'detail.help.assistance', 'Per problemi tecnici o domande relative a SEND, premi su “Assisistenza” in alto a destra.') }, void 0)] }, void 0);
};
export default HelpNotificationDetails;
