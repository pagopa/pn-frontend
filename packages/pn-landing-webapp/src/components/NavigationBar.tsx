import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Box, Chip, Stack, Tab, Tabs, Typography } from "@mui/material";
import { INavigationBarProps } from "model";

const NavigationBar = ({ title, chip, pa }: INavigationBarProps) => {
  const { pathname } = useRouter();
  const [index, setIndex] = useState<number | undefined>();

  // const pfPath = "/cittadini";
  const paPath = "/pubbliche-amministrazioni";

  function a11yProps(index: number) {
    return {
      id: `page-${index}`,
      "aria-controls": `page-${index}`,
    };
  }

  useEffect(() => {
    // if (pathname === pfPath) {
    //   setIndex(0);
    // }
    if (pathname === paPath) {
      setIndex(1);
    }
  }, [pathname]);

  return (
    <Box>
      <Stack direction={{ xs: "column", sm: "row" }}>
        <Stack direction="row" alignItems="center" mx={3} my={2}>
          <Typography variant="h5" mr={2}>
            {title}
          </Typography>
          <Chip label={chip} size="small" color="primary" />
        </Stack>
        <Tabs value={index} component="nav">
          {/* <Tab
            sx={{ paddingTop: 4, paddingBottom: 3 }}
            component="a"
            onClick={(
              event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => {
              if (pathname === `${pfPath}/`) {
                event.preventDefault();
              }
            }}
            key="persona-fisica"
            label={pf}
            href={pfPath}
            {...a11yProps(0)}
          /> */}
          <Tab
            sx={{ paddingTop: 4, paddingBottom: 3 }}
            component="a"
            onClick={(
              event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => {
              if (pathname === `${paPath}/`) {
                event.preventDefault();
              }
            }}
            key="pubblica-amminstrazione"
            label={pa}
            href={paPath}
            {...a11yProps(1)}
          />
        </Tabs>
      </Stack>
    </Box>
  );
};

export default NavigationBar;
