import React, { ComponentProps, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Layout, PRIVACY_LINK_RELATIVE_PATH as PRIVACY_POLICY } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../../services/configuration.service';

const unloggedUser = { id: '', name: undefined, surname: undefined, email: undefined };

type Props = {
  children: ReactNode;
  slotsProps?: ComponentProps<typeof Layout>['slotsProps'];
};

/**
 * Layout (header and footer) shared by the One Identity login pages, for an unlogged user.
 */
const OneIdentityLayout: React.FC<Props> = ({ children, slotsProps }) => {
  const { i18n } = useTranslation();
  const { PAGOPA_HELP_EMAIL, PF_URL, ACCESSIBILITY_LINK, SERCQ_SERVICE_STATEMENT_LINK } =
    getConfiguration();

  const handleLanguageChange = (langCode: string) => i18n.changeLanguage(langCode);

  // eslint-disable-next-line functional/immutable-data
  const handleAssistanceClick = () => (window.location.href = `mailto:${PAGOPA_HELP_EMAIL}`);

  return (
    <Layout
      productsList={[]}
      onAssistanceClick={handleAssistanceClick}
      currentLanguage={i18n.language}
      onLanguageChanged={handleLanguageChange}
      showSideMenu={false}
      privacyPolicyHref={`${PF_URL}${PRIVACY_POLICY}`}
      accessibilityLink={ACCESSIBILITY_LINK}
      sercqServiceStatementLink={SERCQ_SERVICE_STATEMENT_LINK}
      loggedUser={unloggedUser}
      slotsProps={slotsProps}
    >
      {children}
    </Layout>
  );
};

export default OneIdentityLayout;
