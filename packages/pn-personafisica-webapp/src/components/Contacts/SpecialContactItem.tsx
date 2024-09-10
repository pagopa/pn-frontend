import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Stack, Typography } from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { AddressType, ChannelType, DigitalAddress, Sender } from '../../models/contacts';
import { allowedAddressTypes } from '../../utility/contacts.utility';

type Props = {
  addresses: Array<DigitalAddress>;
  onEdit: (
    value: string,
    channelType: ChannelType,
    addressType: AddressType,
    sender: Sender
  ) => void;
  onDelete: (
    value: string,
    channelType: ChannelType,
    addressType: AddressType,
    sender: Sender
  ) => void;
};

type Field = {
  id: string;
  label: string;
  labelRoot: string;
  address?: DigitalAddress;
};

const SpecialContactElem: React.FC<Props> = ({ addresses, onDelete, onEdit }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const isMobile = useIsMobile();

  const fields: Array<Field> = allowedAddressTypes.map((type) => ({
    id: `${addresses[0].senderId}_${type.toLowerCase()}`,
    label: t(`special-contacts.${type.toLowerCase()}`, { ns: 'recapiti' }),
    labelRoot: type === ChannelType.PEC ? 'legal-contacts' : 'courtesy-contacts',
    address: addresses.find((a) => a.channelType === type),
  }));

  const jsxField = (f: Field) => (
    <Fragment key={f.id}>
      {f.address ? (
        <Stack
          direction="row"
          spacing={1}
          data-testid={`${f.address.senderId}_${f.address.channelType.toLowerCase()}Contact`}
        >
          <VerifiedIcon fontSize="small" color="success" />
          <Box>
            <Typography
              sx={{
                wordBreak: 'break-word',
                fontWeight: 600,
                mb: 2,
              }}
              variant="body2"
              data-testid={`special_${f.address.channelType}-typography`}
            >
              {f.address.value}
            </Typography>
            <ButtonNaked
              key="editButton"
              color="primary"
              onClick={() =>
                onEdit(
                  f.address?.value ?? '',
                  f.address?.channelType ?? ChannelType.PEC,
                  f.address?.addressType ?? AddressType.LEGAL,
                  {
                    senderId: f.address?.senderId ?? '',
                    senderName: f.address?.senderName ?? '',
                  }
                )
              }
              sx={{ mr: 2 }}
              disabled={false}
              data-testid={`modifyContact-special_${f.address.channelType}`}
              size="medium"
            >
              {t('button.modifica', { ns: 'common' })}
            </ButtonNaked>
            <ButtonNaked
              data-testid={`cancelContact-special_${f.address.channelType}`}
              color="error"
              onClick={() =>
                onDelete(
                  f.address?.value ?? '',
                  f.address?.channelType ?? ChannelType.PEC,
                  f.address?.addressType ?? AddressType.LEGAL,
                  {
                    senderId: f.address?.senderId ?? '',
                    senderName: f.address?.senderName ?? '',
                  }
                )
              }
              disabled={false}
              size="medium"
            >
              {t('button.elimina', { ns: 'common' })}
            </ButtonNaked>
          </Box>
        </Stack>
      ) : (
        ''
      )}
    </Fragment>
  );

  return (
    <Stack
      direction={isMobile ? 'column' : 'row'}
      spacing={isMobile ? 0 : 6}
      sx={{ mb: isMobile ? 2 : 0.5, mt: isMobile ? 2 : '43px' }}
    >
      {isMobile && (
        <Typography variant="caption" fontWeight={600} lineHeight="18px">
          {t('special-contacts.sender', { ns: 'recapiti' })}
        </Typography>
      )}

      <Typography
        variant="caption"
        fontWeight={600}
        mt={isMobile ? 1 : undefined}
        mb={isMobile ? 3 : undefined}
        sx={{ width: isMobile ? 'auto' : '224px' }}
      >
        {addresses[0].senderName}
      </Typography>

      {isMobile && (
        <Typography variant="caption" fontWeight={600} mb={1}>
          {t('special-contacts.contacts', { ns: 'recapiti' })}
        </Typography>
      )}

      <Stack direction={isMobile ? 'column' : 'row'} spacing={3}>
        {fields.map((f) => !!f.address && jsxField(f))}
      </Stack>
    </Stack>
  );
};

export default SpecialContactElem;
