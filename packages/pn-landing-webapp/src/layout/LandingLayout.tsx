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

interface Props {
  children?: ReactNode;
}

const LandingLayout = ({ children }: Props) => {
  const lang = useContext(LangContext);

  const homeLink = {
    label: "PagoPA S.p.A.",
    href: "#",
    ariaLabel: "Titolo",
    title: "PagoPa S.p.A.",
  };

  const handleAssistanceClick = () => {
    console.log("go to assistance");
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
