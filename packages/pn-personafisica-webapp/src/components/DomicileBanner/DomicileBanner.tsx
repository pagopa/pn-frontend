import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Alert, Box, Link, Typography } from '@mui/material';

import { PFEventsType } from '../../models/PFEventsType';
import { ChannelType } from '../../models/contacts';
import * as routes from '../../navigation/routes.const';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { closeDomicileBanner } from '../../redux/sidemenu/reducers';
import { RootState } from '../../redux/store';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';

type Props = {
  source?: string;
};

const DomicileBanner = forwardRef(({ source = 'home_notifiche' }: Props, ref) => {
  const { t } = useTranslation(['notifiche']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const defaultAddresses = useAppSelector(
    (state: RootState) => state.generalInfoState.defaultAddresses
  );
  const addresses = useAppSelector(contactsSelectors.selectAddresses);

  /**
   * open è TRUE
   *    se il domicilio digitale non è attivato
   *    se domicilio digitale è attivato ma non ci sono recapiti di cortesia
   * open è FALSE
   *    se il domicilio digitale è attivato e se c'è ALMENO un recapito di cortesia
   *    se viene chiuso
   */

  useEffect(() => {
    /**
     *      1. prendi dallo stato gli indirizzi
     *      2. se non ha il domicilio digitale
     *          - setta open a true
     *      3. se ha il domicilio digitale attivato
     *          - se non ha i recapiti di cortesia
     *            * setta open a true
     *          - se ha i recapiti di cortesia
     *            * setta opena a false
     */
    console.log('------------------------', defaultAddresses);

    if (
      addresses.defaultSERCQAddress &&
      defaultAddresses.filter(
        (e) =>
          e.channelType === ChannelType.EMAIL ||
          e.channelType === ChannelType.SMS ||
          e.channelType === ChannelType.IOMSG
      )
    ) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [addresses.defaultSERCQAddress]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [closeDomicileBanner]);

  const handleAddDomicile = useCallback(() => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_VIEW_CONTACT_DETAILS, { source });
    navigate(routes.RECAPITI);
  }, []);

  const messageType = useMemo(() => {
    const lackingAddressTypes = [
      ChannelType.PEC,
      ChannelType.EMAIL,
      ChannelType.IOMSG,
      ChannelType.SERCQ,
    ].filter((type) => !defaultAddresses.some((address) => address.channelType === type));
    const messageIndex = Math.floor(Math.random() * lackingAddressTypes.length);
    return lackingAddressTypes.length > 0 ? (lackingAddressTypes[messageIndex] as string) : null;
  }, [defaultAddresses]);

  useEffect(() => {
    if (!messageType) {
      dispatch(closeDomicileBanner());
    }
  }, [messageType]);

  useImperativeHandle(ref, () => messageType);

  return open ? (
    <Box mb={5}>
      <Alert
        severity="warning"
        variant="outlined"
        onClose={handleClose}
        data-testid="addDomicileBanner"
        sx={{ padding: 2 }}
      >
        {/* 
          The link has the attribute component="button" since this allows it to be launched by pressing the Enter key,
          otherwise it is launched through the mouse only.
          Cfr. PN-5528.
        */}
        <Box>
          <Typography fontWeight="bold" variant="body2">
            {t(`detail.domicile_SERCQ_title`)}
          </Typography>
          <Typography variant="body2">{t(`detail.domicile_SERCQ`)}</Typography>
          <Link
            role="button"
            component="button"
            variant="body2"
            fontWeight="bold"
            onClick={handleAddDomicile}
            display="inline-block"
            sx={{ cursor: 'pointer' }}
          >
            {t(`detail.add_domicile_SERCQ`)}
          </Link>
        </Box>
      </Alert>
    </Box>
  ) : (
    <></>
  );
});

export default DomicileBanner;
