import { useEffect, useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';

import { TitleBox } from '@pagopa-pn/pn-commons';
import { useTranslation } from 'react-i18next';
import { TabPanel } from '@pagopa-pn/pn-commons';
import { useAppDispatch } from '../redux/hooks';
import { resetState } from '../redux/delegation/reducers';

import LoadingPageWrapper from '../component/LoadingPageWrapper/LoadingPageWrapper';
import DelegatesByCompany from '../component/Deleghe/DelegatesByCompany';
import DelegationsOfTheCompany from '../component/Deleghe/DelegationsOfTheCompany';

const Deleghe = () => {
  const { t } = useTranslation(['deleghe']);
  const [pageReady, setPageReady] = useState(false);
  const [value, setValue] = useState(0);
  const dispatch = useAppDispatch();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const retrieveData = async () => {
    setPageReady(true);
  };

  useEffect(() => {
    void retrieveData();
    return () => {
      dispatch(resetState());
    };
  }, []);

  return (
    <LoadingPageWrapper isInitialized={pageReady}>
      <Box
        sx={{
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <Box mb={2} p={3}>
          <TitleBox title={t('deleghe.title')} variantTitle={'h4'}>
            {t('deleghe.description')}
          </TitleBox>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mx: 3 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label={t('deleghe.tab_aria_label')}
            centered
            variant="fullWidth"
          >
            <Tab data-testid="tab1" label={t('deleghe.tab_delegati')} />
            <Tab data-testid="tab2" label={t('deleghe.tab_deleghe')} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <DelegatesByCompany />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <DelegationsOfTheCompany></DelegationsOfTheCompany>
        </TabPanel>
      </Box>
    </LoadingPageWrapper>
  );
};

export default Deleghe;
