import { useCallback, useEffect, useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';

import { TitleBox, TabPanel } from '@pagopa-pn/pn-commons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { closeRevocationModal, resetState } from '../redux/delegation/reducers';
import {
  getDelegators,
  getGroups,
  getDelegatesByCompany,
  getDelegatorsNames,
  revokeDelegation,
  rejectDelegation,
} from '../redux/delegation/actions';
import { RootState } from '../redux/store';
import LoadingPageWrapper from '../component/LoadingPageWrapper/LoadingPageWrapper';
import DelegatesByCompany from '../component/Deleghe/DelegatesByCompany';
import DelegationsOfTheCompany from '../component/Deleghe/DelegationsOfTheCompany';
import ConfirmationModal from '../component/Deleghe/ConfirmationModal';

const Deleghe = () => {
  const { t } = useTranslation(['deleghe']);
  const [pageReady, setPageReady] = useState(false);
  const [value, setValue] = useState(0);
  const { id, open, type } = useAppSelector(
    (state: RootState) => state.delegationsState.modalState
  );
  const dispatch = useAppDispatch();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleConfirmClick = () => {
    if (type === 'delegates') {
      void dispatch(revokeDelegation(id));
    } else {
      void dispatch(rejectDelegation(id));
    }
  };
  const handleCloseModal = () => {
    dispatch(closeRevocationModal());
  };

  const retrieveData = useCallback(() => {
    void dispatch(getDelegatesByCompany());
    void dispatch(getDelegators({ size: 10 }));
    void dispatch(getGroups());
    void dispatch(getDelegatorsNames());
    setPageReady(true);
  }, []);

  useEffect(() => {
    retrieveData();
    return () => {
      dispatch(resetState());
    };
  }, []);

  return (
    <LoadingPageWrapper isInitialized={pageReady}>
      <ConfirmationModal
        open={open}
        title={
          type === 'delegates' ? t('deleghe.revocation_question') : t('deleghe.rejection_question')
        }
        onCloseLabel={t('button.annulla', { ns: 'common' })}
        handleClose={handleCloseModal}
        onConfirm={handleConfirmClick}
        onConfirmLabel={
          type === 'delegates' ? t('deleghe.confirm_revocation') : t('deleghe.confirm_rejection')
        }
      />
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
