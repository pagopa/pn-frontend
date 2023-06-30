import { ReactNode, useContext } from "react";

import { Box, Stack } from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import { Footer, ButtonNaked } from "@pagopa/mui-italia";

import NavigationBar from "../components/NavigationBar";
import { LANGUAGES } from "./constants";
import LangContext from "provider/lang-context";
import { getAppData } from "api";
import { useRouter } from "next/router";
import { SEND_PF_HELP_EMAIL, PAGOPA_HELP_EMAIL } from "@utils/constants";


interface Props {
  children?: ReactNode;
}

const LandingLayout = ({ children }: Props) => {
  const lang = useContext(LangContext);
  const { pathname } = useRouter();
  const appData = getAppData();
  const assistanceEmail = pathname !== "/pubbliche-amministrazioni" ? SEND_PF_HELP_EMAIL : PAGOPA_HELP_EMAIL;

  return (
    <Box sx={{ height: "100vh" }}>
      <Stack
        direction="column"
        sx={{ minHeight: "100vh" }} // 100vh per sticky footer
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            justifyContent: "center",
            borderBottom: "1px solid",
            borderColor: "#E3E7EB",
            backgroundColor: "#FFFFFF",
            minHeight: "48px",
            flexDirection: "column",
          }}
        >
          <Stack direction="row" justifyContent="space-between" px={3}>
            <ButtonNaked
              sx={{
                fontWeight: "bold",
              }}
              size="small"
              aria-label={appData.common.pagoPALink.ariaLabel}
              href={appData.common.pagoPALink.href}
              color="text"
              target="_blank"
              rel="noopener noreferrer"
              disableRipple
              disableTouchRipple
            >
              {appData.common.pagoPALink.label}
            </ButtonNaked>
            <ButtonNaked
              size="small"
              aria-label={appData.common.assistance.ariaLabel}
              href={`mailto:${assistanceEmail}`}
              color="text"
              target="_blank"
              rel="noopener noreferrer"
              disableRipple
              disableTouchRipple
              startIcon={<HelpOutlineOutlinedIcon fontSize="inherit" />}
            >
              {appData.common.assistance.label}
            </ButtonNaked>
          </Stack>
        </Stack>
        <NavigationBar {...appData.common.navigation} />
        <Box sx={{ flexGrow: 1 }} component="main">
          {children}
        </Box>
        <Footer
          loggedUser={false}
          companyLink={{
            ...appData.common.pagoPALink,
            onClick: () => window.open(appData.common.pagoPALink.href, "_blank"),
          }}
          legalInfo={appData.common.companyLegalInfo}
          postLoginLinks={appData.common.postLoginLinks}
          preLoginLinks={appData.common.preLoginLinks}
          currentLangCode={lang.selectedLanguage}
          onLanguageChanged={lang.changeLanguage}
          languages={LANGUAGES}
          productsJsonUrl={appData.common.productJson}
        />
      </Stack>
    </Box>
  );
};

export default LandingLayout;
