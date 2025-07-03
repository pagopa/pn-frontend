import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import {
  Alert,
  Box,
  Button,
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import { getConfiguration } from '../../services/configuration.service';
import InformativeDialog from './InformativeDialog';

enum ModalType {
  DELIVERED = 'DELIVERED',
}

type Props = {
  goToNextStep?: () => void;
  setShowPecWizard: (showPecWizard: boolean) => void;
};

const HowItWorksContactWizard: React.FC<Props> = ({ goToNextStep, setShowPecWizard }) => {
  const { t } = useTranslation(['recapiti', 'common']);

  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const { defaultPECAddress } = useAppSelector(contactsSelectors.selectAddresses);
  const { IS_DOD_ENABLED } = getConfiguration();

  const sercqSendInfoList: Array<{ title: string; description: string }> = t(
    'legal-contacts.sercq-send-wizard.step_1.info-list',
    {
      returnObjects: true,
      defaultValue: [],
    }
  );

  return (
    <Box data-testid="sercqSendContactWizard">
      <Typography fontSize="22px" fontWeight={700} mb={2}>
        {t('legal-contacts.sercq-send-wizard.step_1.title')}
      </Typography>

      {IS_DOD_ENABLED && (
        <>
          <List dense sx={{ p: 0 }} data-testid="sercq-send-info-list">
            {sercqSendInfoList.map((item, index) => (
              <Stack key={index} spacing={2} direction="row" alignItems="flex-start">
                <Box
                  sx={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#35C1EC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" fontSize="14px" fontWeight={400} color="white">
                    {index + 1}
                  </Typography>
                </Box>
                <ListItem key={index} sx={{ px: 0, pt: 0, pb: 3 }}>
                  <ListItemText disableTypography>
                    <Typography fontSize="16px" fontWeight={600} mb={1}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2">
                      <Trans
                        i18nKey={item.description}
                        ns="recapiti"
                        components={[
                          <Link
                            data-testid="deliveredLink"
                            key="delivered"
                            sx={{
                              cursor: 'pointer',
                              textDecoration: 'underline',
                            }}
                            onClick={() => setModalOpen(ModalType.DELIVERED)}
                          />,
                        ]}
                      />
                    </Typography>
                  </ListItemText>
                </ListItem>
              </Stack>
            ))}
          </List>

          {defaultPECAddress && (
            <Alert severity="info" sx={{ mb: 4 }} data-testid="default-pec-info">
              {t('legal-contacts.sercq-send-wizard.step_1.pec-info-alert')}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={goToNextStep}
            sx={{ textTransform: 'none', mb: !defaultPECAddress ? 3 : 0 }}
            data-testid="continueButton"
          >
            {t('button.continue', { ns: 'common' })}
          </Button>

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
          <ButtonNaked color="primary" size="medium" onClick={() => setShowPecWizard(true)}>
            {t('legal-contacts.sercq-send-wizard.step_1.insert-pec')}
          </ButtonNaked>
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
