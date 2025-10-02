import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Link, Typography } from '@mui/material';
import {
  ApiErrorWrapper,
  CardElement,
  CodeModal,
  EmptyState,
  PnCard,
  PnCardContent,
  PnCardContentItem,
  PnCardHeader,
  PnCardHeaderItem,
  PnCardsList,
  Row,
} from '@pagopa-pn/pn-commons';

import { DelegationColumnData, DelegationData } from '../../models/Deleghe';
import { PFEventsType } from '../../models/PFEventsType';
import * as routes from '../../navigation/routes.const';
import { DELEGATION_ACTIONS, getMandatesByDelegator } from '../../redux/delegation/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import delegationToItem from '../../utility/delegation.utility';
import DelegatorsDataSwitch from './DelegationDataSwitch';

type Props = {
  handleAddDelegationClick: (source: string) => void;
  children?: React.ReactNode;
};

const LinkAddDelegate: React.FC<Props> = ({ children, handleAddDelegationClick }) => (
  <Link
    component={'button'}
    variant="body1"
    id="call-to-action-first"
    key="add-delegate"
    data-testid="link-add-delegate"
    onClick={(_e, source = 'empty_state') => handleAddDelegationClick(source)}
  >
    {children}
  </Link>
);

const MobileDelegates = () => {
  const { t } = useTranslation(['deleghe']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const delegates = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegates
  );
  const [showCodeModal, setShowCodeModal] = useState({ open: false, name: '', code: '' });

  const cardData: Array<Row<DelegationData>> = delegationToItem(delegates);

  const cardBody: Array<CardElement<DelegationColumnData>> = [
    {
      id: 'name',
      label: t('deleghe.table.name'),
      wrapValueInTypography: false,
    },
    {
      id: 'startDate',
      label: t('deleghe.table.delegationStart'),
    },
    {
      id: 'endDate',
      label: t('deleghe.table.delegationEnd'),
    },
    {
      id: 'visibilityIds',
      label: t('deleghe.table.permissions'),
      wrapValueInTypography: false,
    },
  ];

  const handleAddDelegationClick = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_MANDATE_START);
    navigate(routes.NUOVA_DELEGA);
  };

  const handleCloseShowCodeModal = () => {
    setShowCodeModal({ open: false, name: '', code: '' });
  };

  return (
    <>
      <CodeModal
        title={t('deleghe.show_code_title', { name: showCodeModal.name })}
        subtitle={t('deleghe.show_code_subtitle')}
        open={showCodeModal.open}
        codeLength={5}
        initialValue={showCodeModal.code}
        cancelCallback={handleCloseShowCodeModal}
        cancelLabel={t('deleghe.close')}
        codeSectionTitle={t('deleghe.verification_code')}
        isReadOnly
      />
      <Box data-testid="mobile-delegates-wrapper">
        <Typography variant="h4" mb={3}>
          {t('deleghe.delegatesTitle')}
        </Typography>
        <Box mb={2}>
          <Button
            id="add-delegation-button"
            variant="outlined"
            onClick={() => handleAddDelegationClick()}
            sx={{ mb: 1 }}
            data-testid="add-delegation"
          >
            <AddIcon fontSize={'small'} sx={{ marginRight: 1 }} />
            {t('deleghe.add')}
          </Button>
        </Box>
        <ApiErrorWrapper
          apiId={DELEGATION_ACTIONS.GET_MANDATES_BY_DELEGATOR}
          reloadAction={() => dispatch(getMandatesByDelegator())}
        >
          {cardData.length ? (
            <PnCardsList>
              {cardData.map((data) => (
                <PnCard key={data.id} testId="mobileDelegatesCards">
                  <PnCardHeader
                    headerGridProps={{
                      direction: { xs: 'row', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                    }}
                  >
                    <PnCardHeaderItem
                      position="left"
                      gridProps={{
                        xs: 8,
                      }}
                    >
                      <DelegatorsDataSwitch data={data} type="status" menuType="delegates" />
                    </PnCardHeaderItem>
                    <PnCardHeaderItem
                      position="right"
                      gridProps={{
                        xs: 4,
                      }}
                    >
                      <DelegatorsDataSwitch
                        data={data}
                        type="menu"
                        menuType="delegates"
                        setShowCodeModal={setShowCodeModal}
                      />
                    </PnCardHeaderItem>
                  </PnCardHeader>
                  <PnCardContent>
                    {cardBody.map((body) => (
                      <PnCardContentItem
                        key={body.id}
                        label={body.label}
                        wrapValueInTypography={body.wrapValueInTypography}
                      >
                        <DelegatorsDataSwitch data={data} type={body.id} menuType="delegates" />
                      </PnCardContentItem>
                    ))}
                  </PnCardContent>
                </PnCard>
              ))}
            </PnCardsList>
          ) : (
            <EmptyState>
              <Trans
                i18nKey={'deleghe.no_delegates'}
                ns={'deleghe'}
                components={[
                  <LinkAddDelegate
                    key={'add-delegate'}
                    handleAddDelegationClick={handleAddDelegationClick}
                  />,
                ]}
              />
            </EmptyState>
          )}
        </ApiErrorWrapper>
      </Box>
    </>
  );
};

export default MobileDelegates;
