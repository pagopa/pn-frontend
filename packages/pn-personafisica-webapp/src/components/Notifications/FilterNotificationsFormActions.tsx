import {  Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Grid } from '@mui/material';
import {  CustomMobileDialogAction } from '@pagopa-pn/pn-commons';

type Props = {
  filtersApplied: boolean;
  isInitialSearch: boolean;
  cleanFilters: () => void;
  isInDialog?: boolean;
  lengthOfNotifications?: number;
};

const FilterNotificationsFormActions = ({
  filtersApplied,
  cleanFilters,
  isInDialog = false,
  isInitialSearch,
  lengthOfNotifications
}: Props) => {
  const { t } = useTranslation(['common']);
  const [feedbackSubmit, setFeedbackSubmit] = useState(false);
  const [feedbackCancel, setFeedbackCancel] = useState(false);

  const handleCancel = () =>{
    setFeedbackCancel(true);
    cleanFilters();
    setFeedbackSubmit(false);
    setFeedbackCancel(false);
  };

  useEffect(()=>{
    console.log('feedbackSubmit :>> ', feedbackSubmit);
    console.log('feedbackCancel :>> ', feedbackCancel);
    console.log('object :>> ', lengthOfNotifications);
  },[feedbackSubmit,feedbackCancel]);

  const confirmAction = (
    <Grid item lg="auto" xs={12}>
      <Button
        aria-label={feedbackSubmit ? lengthOfNotifications ?`Filtro completato: risultati prodotti ${lengthOfNotifications}, Sei su Filtra pulsante`:'Il filtro non ha prodotto risultati, Sei sul pulsante filtra ': 'Bottone Filtra'}
        id="filter-notifications-button"
        variant="outlined"
        type="submit"
        size="small"
        disabled={isInitialSearch && !filtersApplied}
        onClick={()=>setFeedbackSubmit(true)}
      >
        {t('button.filtra')}
      </Button>
    </Grid>
  );

  const cancelAction = (
    <Grid item lg="auto" xs={12}>
      <Button
        aria-label={feedbackSubmit ? 'Cancellazione Completata, Sei su Cancella filtri pulsante':'Sei su Cancella filtri pulsante'}
        data-testid="cancelButton"
        size="small"
        onClick={handleCancel}
        disabled={!filtersApplied}
      >
        {t('button.annulla filtro')}
      </Button>
    </Grid>
  );

  return (
    <Fragment>
      {isInDialog ? (
        <CustomMobileDialogAction>{confirmAction}</CustomMobileDialogAction>
      ) : (
        confirmAction
      )}
      {isInDialog ? (
        <CustomMobileDialogAction closeOnClick>{cancelAction}</CustomMobileDialogAction>
      ) : (
        cancelAction
      )}
    </Fragment>
  );
};

export default FilterNotificationsFormActions;
