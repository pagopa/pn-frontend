import { Alert, Box, Stack } from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { Footer, ButtonNaked } from "@pagopa/mui-italia";
import { ReactNode, useContext } from "react";
import { useRouter } from "next/router";

import LangContext from "../../provider/lang-context";
import NavigationBar from "../components/NavigationBar";
import { getAppData } from "../../api";
import {
  companyLegalInfo,
  LANGUAGES,
  pagoPALink,
  postLoginLinks,
  preLoginLinks,
} from "./footer.constants";
import { PAGOPA_HOME } from "@utils/constants";

interface Props {
  children?: ReactNode;
}

const LandingLayout = ({ children }: Props) => {
  const lang = useContext(LangContext);
  const { pathname } = useRouter();
  const pageType = pathname.split("/")[1];

  const homeLink = {
    label: "PagoPA S.p.A.",
    href: PAGOPA_HOME ?? "",
    ariaLabel: "Titolo",
    title: "PagoPa S.p.A.",
  };

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
              aria-label={homeLink.ariaLabel}
              href={homeLink.href}
              color="text"
              target="_blank"
              rel="noreferrer"
              disableRipple
              disableTouchRipple
            >
              {homeLink.label}
            </ButtonNaked>
            <ButtonNaked
              size="small"
              aria-label={getAppData().common.assistance.ariaLabel}
              href={getAppData().common.assistance.href}
              color="text"
              target="_blank"
              rel="noreferrer"
              disableRipple
              disableTouchRipple
              startIcon={<HelpOutlineOutlinedIcon fontSize="inherit" />}
            >
              {getAppData().common.assistance.label}
            </ButtonNaked>
          </Stack>
        </Stack>
        <NavigationBar />
        <Alert severity="info">{getAppData().common.alert}</Alert>
        <Box sx={{ flexGrow: 1 }} component="main">
          {children}
        </Box>
        <Footer
          loggedUser={false}
          companyLink={{
            ...pagoPALink,
            onClick: () => window.open(pagoPALink.href, "_blank"),
          }}
          legalInfo={companyLegalInfo}
          postLoginLinks={postLoginLinks}
          preLoginLinks={preLoginLinks(pageType)}
          currentLangCode={lang.selectedLanguage}
          onLanguageChanged={lang.changeLanguage}
          languages={LANGUAGES}
        />
      </Stack>
    </Box>
  );
};

export default LandingLayout;
