import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { EventAction } from '@pagopa-pn/pn-commons';
import { MIAlert, MIButton } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import { getConfiguration } from '../../services/configuration.service';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import InformativeDialog from './InformativeDialog';

enum ModalType {
  DELIVERED = 'DELIVERED',
}

type Props = {
  goToNextStep: () => void;
  setShowPecWizard: (showPecWizard: boolean) => void;
};

const HowItWorksContactWizard: React.FC<Props> = ({ goToNextStep, setShowPecWizard }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const theme = useTheme();

  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const { defaultPECAddress, addresses } = useAppSelector(contactsSelectors.selectAddresses);
  const { IS_DOD_ENABLED } = getConfiguration();

  const sercqSendInfoList: Array<{ title: string; description: string }> = t(
    'legal-contacts.sercq-send-wizard.step_1.info-list',
    {
      returnObjects: true,
      defaultValue: [],
    }
  );

  const handleShowDeliveredDialog = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP);
    setModalOpen(ModalType.DELIVERED);
  };

  const handleNextStep = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_START, {
      event_type: EventAction.ACTION,
      addresses,
    });
    goToNextStep();
  };

  const handleShowPecWizard = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_PEC_START, {
      event_type: EventAction.ACTION,
      addresses,
    });
    setShowPecWizard(true);
  };

  useEffect(() => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_INTRO, {
      event_type: EventAction.SCREEN_VIEW,
      addresses,
    });
  }, []);

  return (
    <Box data-testid="sercqSendContactWizard">
      <Typography fontSize="22px" fontWeight={700} mb={2}>
        {t('legal-contacts.sercq-send-wizard.step_1.title')}
      </Typography>

      {IS_DOD_ENABLED && (
        <>
          <List sx={{ p: 0, mb: 2 }} data-testid="sercq-send-info-list">
            {sercqSendInfoList.map((item, index) => (
              <ListItem key={index} sx={{ px: 0, pt: 0, mb: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Stack
                    alignItems={'center'}
                    sx={{
                      width: '24px',
                      height: '24px',
                    }}
                  >
                    <Typography
                      fontWeight={600}
                      fontSize="18px"
                      color={theme.colors.neutral.grey[300]}
                    >
                      {index + 1}.
                    </Typography>
                  </Stack>
                  <ListItemText disableTypography>
                    <Typography fontSize="16px" fontWeight={600} mb={1}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2">
                      <Trans
                        i18nKey={item.description}
                        ns="recapiti"
                        t={(s: string) => s}
                        components={[
                          <MIButton
                            variant="text"
                            key="delivered"
                            data-testid="deliveredLink"
                            onClick={handleShowDeliveredDialog}
                            aria-description={t(
                              'legal-contacts.sercq-send-wizard.step_1.info-list.0.aria-description'
                            )}
                            sx={{
                              textDecoration: 'underline',
                              display: 'inline',
                              fontWeight: 400,
                              verticalAlign: 'baseline',
                            }}
                          />,
                        ]}
                      />
                    </Typography>
                  </ListItemText>
                </Stack>
              </ListItem>
            ))}
          </List>

          {defaultPECAddress && (
            <MIAlert severity="info" data-testid="default-pec-info" sx={{ mb: 4 }}>
              {t('legal-contacts.sercq-send-wizard.step_1.pec-info-alert')}
            </MIAlert>
          )}

          <MIButton
            fullWidth
            variant="contained"
            onClick={handleNextStep}
            sx={{ textTransform: 'none', mb: !defaultPECAddress ? 3 : 0 }}
            data-testid="continueButton"
          >
            {t('button.continue', { ns: 'common' })}
          </MIButton>

          {!defaultPECAddress && (
            <Divider
              sx={{ mb: 3, fontSize: '14px', color: 'text.secondary', textTransform: 'capitalize' }}
            >
              {t('conjunctions.or', { ns: 'common' })}
            </Divider>
          )}
        </>
      )}

      {!defaultPECAddress && (
        <Box data-testid="pec-section">
          <Typography fontSize="16px" fontWeight={600} mb={0.5}>
            {t('legal-contacts.sercq-send-wizard.step_1.have-pec')}
          </Typography>
          <Typography variant="body2" mb={1}>
            {t('legal-contacts.sercq-send-wizard.step_1.have-pec-description')}
          </Typography>
          <MIButton variant="text" onClick={handleShowPecWizard}>
            {t('legal-contacts.sercq-send-wizard.step_1.insert-pec')}
          </MIButton>
        </Box>
      )}

      <InformativeDialog
        open={modalOpen === ModalType.DELIVERED}
        title={t('legal-contacts.sercq-send-wizard.step_1.delivered-dialog-title')}
        subtitle={
          <Trans
            i18nKey="legal-contacts.sercq-send-wizard.step_1.delivered-dialog-description"
            ns="recapiti"
          />
        }
        onConfirm={() => setModalOpen(null)}
      />
    </Box>
  );
};

export default HowItWorksContactWizard;
