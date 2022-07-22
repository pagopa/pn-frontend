import { Alert, Box, Stack } from "@mui/material";
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { Footer, ButtonNaked } from "@pagopa/mui-italia";
import { ReactNode, useContext } from "react";

import LangContext from "../../provider/lang-context";
import {
  companyLegalInfo,
  LANGUAGES,
  pagoPALink,
  postLoginLinks,
  preLoginLinks,
} from "./footer.constants";
import { PAGOPA_HELP_EMAIL, PAGOPA_HOME } from "@utils/constants";
import NavigationBar from "../components/NavigationBar";
import {getAppData} from "../../api";

interface Props {
  children?: ReactNode;
}

const LandingLayout = ({ children }: Props) => {
  const lang = useContext(LangContext);

  const homeLink = {
    label: "PagoPA S.p.A.",
    href: PAGOPA_HOME ?? "",
    ariaLabel: "Titolo",
    title: "PagoPa S.p.A.",
  };

  const handleAssistanceClick = () => {
    if (PAGOPA_HELP_EMAIL) {
      /* eslint-disable-next-line functional/immutable-data */
      if (typeof window !== "undefined") window.open(`mailto:${PAGOPA_HELP_EMAIL}`);
    }
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
              flexDirection: "column"
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
              aria-label={getAppData()['common'].assistance.ariaLabel}
              href={getAppData()['common'].assistance.href}
              color="text"
              target="_blank"
              rel="noreferrer"
              disableRipple
              disableTouchRipple
              startIcon={<HelpOutlineOutlinedIcon fontSize="inherit" />}
            >
              {getAppData()['common'].assistance.label}
            </ButtonNaked>
          </Stack>
        </Stack>
        <NavigationBar />
        <Alert severity="info">
          {getAppData()['common'].alert}
        </Alert>
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
          preLoginLinks={preLoginLinks}
          currentLangCode={lang.selectedLanguage}
          onLanguageChanged={lang.changeLanguage}
          languages={LANGUAGES}
        />
      </Stack>
    </Box>
  );
};

export default LandingLayout;
