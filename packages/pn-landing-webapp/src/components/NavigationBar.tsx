import { Box, Chip, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const NavigationBar = () => {
  const { pathname } = useRouter();
  const [index, setIndex] = useState(0);

  const isDev = process.env.NODE_ENV === "development";
  const pathEnding = isDev ? "" : "index.html";
  const cittadiniPath = "/cittadini/" + pathEnding;
  const paPath = "/pubbliche-amministrazioni/" + pathEnding;

  function a11yProps(index: number) {
    return {
      id: `page-${index}`,
      "aria-controls": `page-${index}`,
    };
  }

  useEffect(() => {
    if (pathname === cittadiniPath) {
      setIndex(0);
    }
    if (pathname === paPath) {
      setIndex(1);
    }
  }, [pathname]);

  return (
    <Box>
      <Stack direction={{ xs: "column", sm: "row" }}>
        <Stack direction="row" alignItems="center" mx={3} my={2}>
          <Typography variant="h5" mr={2}>
            Piattaforma Notifiche
          </Typography>
          <Chip label="Beta" size="small" color="primary" />
        </Stack>
        <Tabs value={index} component="nav">
          <Tab
            sx={{ paddingTop: 4, paddingBottom: 3 }}
            component="a"
            onClick={(
              event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => {
              if (pathname === cittadiniPath) {
                event.preventDefault();
              }
            }}
            key="Cittadini"
            label="Cittadini"
            href={cittadiniPath}
            {...a11yProps(0)}
          />
          <Tab
            sx={{ paddingTop: 4, paddingBottom: 3 }}
            component="a"
            onClick={(
              event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => {
              if (pathname === paPath) {
                event.preventDefault();
              }
            }}
            key="Enti"
            label="Enti"
            href={paPath}
            {...a11yProps(1)}
          />
        </Tabs>
      </Stack>
    </Box>
  );
};

export default NavigationBar;
