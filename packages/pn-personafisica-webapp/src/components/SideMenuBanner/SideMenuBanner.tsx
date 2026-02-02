import { useTranslation } from 'react-i18next';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Banner } from '@pagopa/mui-italia';

import { getConfiguration } from '../../services/configuration.service';

const SideMenuBanner: React.FC = () => {
  const { t } = useTranslation('common');
  const { FEEDBACK_SURVEY_URL } = getConfiguration();

  return (
    <Banner
      variant="tertiary"
      color="info"
      icon={<EditOutlinedIcon fontSize="small" />}
      title={t('feedback_banner.title')}
      message={t('feedback_banner.content')}
      cta={{
        label: t('button.start'),
        href: FEEDBACK_SURVEY_URL,
        target: '_blank',
      }}
    />
  );
};

export default SideMenuBanner;
