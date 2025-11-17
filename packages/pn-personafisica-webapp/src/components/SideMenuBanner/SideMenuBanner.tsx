import { useTranslation } from 'react-i18next';

import { FeedbackBanner } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../../services/configuration.service';

const SideMenuBanner = () => {
  const { t } = useTranslation('common');
  const { FEEDBACK_SURVEY_URL } = getConfiguration();

  return (
    <FeedbackBanner
      title={t('feedback_banner.title')}
      content={t('feedback_banner.content')}
      action={{
        kind: 'link',
        text: t('button.start'),
        href: FEEDBACK_SURVEY_URL,
        target: '_blank',
      }}
    />
  );
};

export default SideMenuBanner;
