import { Box, Stack } from "@mui/material";
import { HeaderAccount, Footer } from "@pagopa/mui-italia";
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
        <HeaderAccount
          enableLogin={false}
          rootLink={homeLink}
          onAssistanceClick={handleAssistanceClick}
        />
        <NavigationBar />
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
