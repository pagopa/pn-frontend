import { Box, Chip, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {useRouter} from "next/router";

interface LinkTabProps {
    label?: string;
    href?: string;
}

function LinkTab(props: LinkTabProps) {
    return (
        <Tab
            sx={{ paddingTop: 4, paddingBottom: 3 }}
            component="a"
            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                event.preventDefault();
            }}
            {...props}
        />
    );
}

const NavigationBar = () => {
    const { pathname, push } = useRouter();
    const [index, setIndex] = useState(0);

    function a11yProps(index: number) {
        return {
            id: `page-${index}`,
            'aria-controls': `page-${index}`,
        };
    }

    useEffect(() => {
        if (pathname === "/cittadini") {
            setIndex(0);
        }
        if (pathname === "/pubbliche-amministrazioni") {
            setIndex(1);
        }
    }, [pathname]);

    return (
        <Box >
            <Stack direction="row">
                <Stack direction="row" alignItems="center" mx={3} my={2}>
                    <Typography variant="h5" mr={2}>Piattaforma Notifiche</Typography>
                    <Chip label="Beta" size="small" color="primary" />
                </Stack>
                <Tabs
                    value={index}
                    aria-label="Navigazione"
                >
                    <LinkTab
                        key="Cittadini"
                        label="Cittadini"
                        href="/cittadini"
                        {...a11yProps(0)}
                    />
                    <LinkTab
                        key="Enti"
                        label="Enti"
                        href="/pubbliche-amministrazioni"
                        {...a11yProps(1)}
                    />
                </Tabs>
            </Stack>
        </Box>
    );
};

export default NavigationBar;