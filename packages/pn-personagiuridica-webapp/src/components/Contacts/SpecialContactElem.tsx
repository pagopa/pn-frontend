import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { TableCell, TableRow, Typography } from '@mui/material';
import { useIsMobile, useSpecialContactsContext } from '@pagopa-pn/pn-commons';

import { ChannelType, DigitalAddress } from '../../models/contacts';
import { allowedAddressTypes } from '../../utility/contacts.utility';
import EmailContactItem from './EmailContactItem';
import PecContactItem from './PecContactItem';
import SmsContactItem from './SmsContactItem';

type Props = {
  addresses: Array<DigitalAddress>;
};

type Field = {
  id: string;
  label: string;
  labelRoot: string;
  address?: DigitalAddress;
};

const SpecialContactElem: React.FC<Props> = ({ addresses }) => {
  const { t } = useTranslation(['recapiti']);
  const isMobile = useIsMobile();
  const { contextEditMode, setContextEditMode } = useSpecialContactsContext();

  const fields: Array<Field> = allowedAddressTypes.map((type) => ({
    id: `${addresses[0].senderId}_${type.toLowerCase()}`,
    label: t(`special-contacts.${type.toLowerCase()}`, { ns: 'recapiti' }),
    labelRoot: type === ChannelType.PEC ? 'legal-contacts' : 'courtesy-contacts',
    address: addresses.find((a) => a.channelType === type),
  }));

  const jsxField = (f: Field) => (
    <>
      {f.address ? (
        <>
          {f.address?.channelType === ChannelType.PEC && (
            <PecContactItem
              value={f.address.value}
              verifyingAddress={!f.address.pecValid}
              senderId={f.address.senderId}
              senderName={f.address.senderName}
              blockEdit={contextEditMode}
              onEdit={(editFlag) => setContextEditMode(editFlag)}
            />
          )}
          {f.address?.channelType === ChannelType.EMAIL && (
            <EmailContactItem
              value={f.address.value}
              senderId={f.address.senderId}
              senderName={f.address.senderName}
              blockEdit={contextEditMode}
              onEdit={(editFlag) => setContextEditMode(editFlag)}
            />
          )}
          {f.address?.channelType === ChannelType.SMS && (
            <SmsContactItem
              value={f.address.value}
              senderId={f.address.senderId}
              senderName={f.address.senderName}
              blockEdit={contextEditMode}
              onEdit={(editFlag) => setContextEditMode(editFlag)}
            />
          )}
        </>
      ) : (
        '-'
      )}
    </>
  );

  if (isMobile) {
    return (
      <>
        <Typography fontWeight={600}>{t('special-contacts.sender', { ns: 'recapiti' })}</Typography>
        <Typography fontWeight={700} fontSize={16}>
          {addresses[0].senderName}
        </Typography>
        {fields.map((f) => (
          <Fragment key={f.id}>
            <Typography fontWeight={600} sx={{ marginTop: '20px', marginBottom: '10px' }}>
              {f.label}
            </Typography>
            {jsxField(f)}
          </Fragment>
        ))}
      </>
    );
  }

  return (
    <TableRow>
      <TableCell width="25%" sx={{ borderBottomColor: 'divider' }}>
        <Typography fontWeight={700}>{addresses[0].senderName}</Typography>
      </TableCell>
      {fields.map((f) => (
        <TableCell width="25%" key={f.id} sx={{ borderBottomColor: 'divider' }}>
          {jsxField(f)}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default SpecialContactElem;
