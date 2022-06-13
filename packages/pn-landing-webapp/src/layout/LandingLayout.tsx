import {Box, Stack} from "@mui/material";
import { HeaderAccount } from "@pagopa/mui-italia";
import {Footer} from "@pagopa-pn/pn-commons";
import {ReactNode} from "react";

interface Props {
    children?: ReactNode;
}

// TODO: implement correct Header
const LandingLayout = ({children}: Props) => {
    const homeLink = {
        label: 'PagoPA S.p.A.',
        href: '#',
        ariaLabel: 'Titolo',
        title: 'PagoPa S.p.A.'
    };

    const handleAssistanceClick = () => {
        console.log('go to assistance');
    };

    return (
        <Box sx={{ height: '100vh' }}>
            <Stack
                direction="column"
                sx={{ minHeight: '100vh'}} // 100vh per sticky footer
            >
                <HeaderAccount rootLink={homeLink} onAssistanceClick={handleAssistanceClick} />
                <Box
                  sx={{ flexGrow: 1 }}
                  component="main"
                >
                    {children}
                </Box>
            </Stack>
        </Box>);
};

export default LandingLayout;