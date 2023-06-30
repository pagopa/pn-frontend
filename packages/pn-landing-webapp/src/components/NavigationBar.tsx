import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Box, Chip, Stack, Tab, Tabs } from "@mui/material";
import { INavigationBarProps } from "model";

const NavigationBar = ({ title, chip, pf, pa, faq, image }: INavigationBarProps) => {
  const { pathname } = useRouter();
  const [index, setIndex] = useState<number | undefined>();

  const paths = ["/pubbliche-amministrazioni", "/cittadini", "/faq"];

  function a11yProps(index: number) {
    return {
      id: `page-${index}`,
      "aria-controls": `page-${index}`,
    };
  }

  useEffect(() => {
    setIndex(paths.indexOf(pathname));
  }, [pathname]);

  return (
    <Box>
      <Stack direction={{ xs: "column", sm: "row" }}>
        <Stack direction="row" alignItems="center" mx={3} my={2}>
          <Box sx={{ pr: 2 }}>
            <img src={image} alt={title} aria-label={title} />
          </Box>
          <Chip label={chip} size="small" color="primary" />
        </Stack>
        <Tabs value={index} component="nav">
          <Tab
            sx={{ paddingTop: 6, paddingBottom: 5 }}
            component="a"
            onClick={(
              event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => {
              if (pathname === `${paths[0]}/`) {
                event.preventDefault();
              }
            }}
            key="pubblica-amminstrazione"
            label={pa}
            href={paths[0]}
            {...a11yProps(0)}
          />
          <Tab
            sx={{ paddingTop: 6, paddingBottom: 5 }}
            component="a"
            onClick={(
              event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => {
              if (pathname === `${paths[1]}/`) {
                event.preventDefault();
              }
            }}
            key="persona-fisica"
            label={pf}
            href={paths[1]}
            {...a11yProps(1)}
          />

          <Tab
            sx={{ paddingTop: 6, paddingBottom: 5 }}
            component="a"
            onClick={(
              event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
            ) => {
              if (pathname === `${paths[2]}/`) {
                event.preventDefault();
              }
            }}
            key="faq"
            label={faq}
            href={paths[2]}
            {...a11yProps(2)}
          />
        </Tabs>
      </Stack>
    </Box>
  );
};

export default NavigationBar;
