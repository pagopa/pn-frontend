import { useFormik } from 'formik';
import { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { CodeModal, ErrorMessage, useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import { ChannelType, DigitalAddress } from '../../models/contacts';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import { contactAlreadyExists } from '../../utility/contacts.utility';
import AddSpecialContactDialog from './AddSpecialContactDialog';

type Props = {
  digitalAddresses: Array<DigitalAddress>;
  channelType: ChannelType;
  handleConfirm: (code?: string) => void;
};

enum ModalType {
  EXISTING = 'existing',
  VALIDATION = 'validation',
  CODE = 'code',
  SPECIAL = 'special',
}

const SpecialContacts: React.FC<Props> = ({ digitalAddresses, channelType, handleConfirm }) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const isMobile = useIsMobile();
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const codeModalRef =
    useRef<{ updateError: (error: ErrorMessage, codeNotValid: boolean) => void }>(null);

  const initialValues = {
    sender: [],
    addressType: channelType,
    s_value: '',
  };

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      const event =
        values.addressType === ChannelType.PEC
          ? PFEventsType.SEND_ADD_PEC_START
          : values.addressType === ChannelType.SMS
          ? PFEventsType.SEND_ADD_SMS_START
          : PFEventsType.SEND_ADD_EMAIL_START;
      PFEventStrategyFactory.triggerEvent(event, values.sender.id);
      // first check if contact already exists
      if (
        contactAlreadyExists(digitalAddresses, values.s_value, values.sender.id, values.addressType)
      ) {
        setModalOpen(ModalType.EXISTING);
        return;
      }
    },
  });

  const labelRoot =
    formik.values.addressType === ChannelType.PEC ? 'legal-contacts' : 'courtesy-contacts';
  const contactType = formik.values.addressType.toLowerCase();

  return (
    <>
      {digitalAddresses &&
        digitalAddresses.map((address) => (
          <>
            <Divider
              sx={{
                backgroundColor: 'white',
                color: 'text.secondary',
                my: isMobile ? 3 : 2,
              }}
            />
            <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={2}>
              <Stack direction="row" spacing={2}>
                <VerifiedIcon
                  fontSize="small"
                  color="success"
                  sx={{ position: 'relative', top: '2px' }}
                />
                <Box>
                  <Typography
                    sx={{
                      wordBreak: 'break-word',
                      fontWeight: 600,
                    }}
                    variant="body2"
                    id={`${address.senderId}-typography`}
                  >
                    {address.value}
                  </Typography>
                  <ButtonNaked
                    key="editButton"
                    color="primary"
                    onClick={() => {}}
                    sx={{ mr: 2 }}
                    disabled={false}
                    id={`modifyContact-${address.senderId}`}
                    size="medium"
                  >
                    {t('button.modifica')}
                  </ButtonNaked>
                  <ButtonNaked
                    id={`cancelContact-${address.senderId}`}
                    color="error"
                    onClick={() => {}}
                    disabled={false}
                    size="medium"
                  >
                    {t('button.elimina')}
                  </ButtonNaked>
                </Box>
              </Stack>
              <Stack paddingLeft={{ xs: 0, sm: 8 }}>
                <Typography variant="caption-semibold">
                  {t(`special-contacts.sender-list`, { ns: 'recapiti' })}
                </Typography>
                <Typography variant="caption">{address.senderId}</Typography>
              </Stack>
            </Stack>
          </>
        ))}

      <CodeModal
        title={
          t(`${labelRoot}.${contactType}-verify`, { ns: 'recapiti' }) + ` ${formik.values.s_value}`
        }
        subtitle={<Trans i18nKey={`${labelRoot}.${contactType}-verify-descr`} ns="recapiti" />}
        open={modalOpen === ModalType.CODE}
        initialValues={new Array(5).fill('')}
        codeSectionTitle={t(`${labelRoot}.insert-code`, { ns: 'recapiti' })}
        codeSectionAdditional={
          <>
            <Typography variant="body2" display="inline">
              {t(`${labelRoot}.${contactType}-new-code`, { ns: 'recapiti' })}
              &nbsp;
            </Typography>
            <ButtonNaked
              component={Box}
              onClick={() => handleConfirm()}
              sx={{ verticalAlign: 'unset', display: 'inline' }}
            >
              <Typography
                display="inline"
                color="primary"
                variant="body2"
                sx={{ textDecoration: 'underline' }}
              >
                {t(`${labelRoot}.new-code-link`, { ns: 'recapiti' })}.
              </Typography>
            </ButtonNaked>
          </>
        }
        cancelLabel={t('button.annulla')}
        confirmLabel={t('button.conferma')}
        cancelCallback={() => setModalOpen(null)}
        confirmCallback={(values: Array<string>) => handleConfirm(values.join(''))}
        ref={codeModalRef}
      />
      <AddSpecialContactDialog
        open={modalOpen === ModalType.SPECIAL}
        handleClose={() => setModalOpen(null)}
        handleConfirm={handleConfirm}
        digitalAddresses={digitalAddresses}
        channelType={channelType}
      />
      <Divider
        sx={{
          backgroundColor: 'white',
          color: 'text.secondary',
          my: 2,
        }}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} mt={{ xs: 1, sm: 0 }} alignItems="baseline">
        <Typography variant="caption" lineHeight="1.125rem">
          {t(`special-contacts.${channelType.toLowerCase()}-add-more-caption`, { ns: 'recapiti' })}
        </Typography>
        <ButtonNaked
          component={Stack}
          onClick={() => setModalOpen(ModalType.SPECIAL)}
          color="primary"
          size="small"
          p={{ xs: '0.5rem 0', sm: 1 }}
        >
          {t(`special-contacts.${channelType.toLowerCase()}-add-more-button`, { ns: 'recapiti' })}
        </ButtonNaked>
      </Stack>
    </>
  );
};

export default SpecialContacts;
