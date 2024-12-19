import {  Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Grid } from '@mui/material';
import { A11yContainerInvisible, CustomMobileDialogAction } from '@pagopa-pn/pn-commons';

type Props = {
  filtersApplied: boolean;
  isInitialSearch: boolean;
  cleanFilters: () => void;
  isInDialog?: boolean;
};

const FilterNotificationsFormActions = ({
  filtersApplied,
  cleanFilters,
  isInDialog = false,
  isInitialSearch,
}: Props) => {
  const { t } = useTranslation(['common']);
  const [feedbackSubmit, setFeedbackSubmit] = useState(false);
  const [feedbackCancel, setFeedbackCancel] = useState(false);

  const handleCancel = () =>{
    setFeedbackCancel(true);
    cleanFilters();
  };

  const confirmAction = (
    <Grid item lg="auto" xs={12}>
      <Button
        id="filter-notifications-button"
        variant="outlined"
        type="submit"
        size="small"
        disabled={isInitialSearch && !filtersApplied}
        onClick={()=>setFeedbackSubmit(true)}
      >
        {t('button.filtra')}
      </Button>
      {feedbackSubmit && (
      <A11yContainerInvisible field="Azione completata" ariaLive='assertive' role='alert'></A11yContainerInvisible>
      )}
    </Grid>
  );

  const cancelAction = (
    <Grid item lg="auto" xs={12}>
      <Button
        data-testid="cancelButton"
        size="small"
        onClick={handleCancel}
        disabled={!filtersApplied}
        
      >
        {t('button.annulla filtro')}
      </Button>
      {feedbackCancel && <A11yContainerInvisible field="Cancellazione Completata" ariaLive='assertive' role='alert'></A11yContainerInvisible>
      }
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
