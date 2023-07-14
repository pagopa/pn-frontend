import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Grid } from '@mui/material';
import { CustomMobileDialogAction } from '@pagopa-pn/pn-commons';

type Props = {
  filtersApplied: boolean;
  isInitialSearch: boolean;
  cleanFilters: () => void;
  isInDialog?: boolean;
  isValid?: boolean;
};

const FilterNotificationsFormActions = ({
  filtersApplied,
  cleanFilters,
  isInDialog = false,
  isInitialSearch,
  isValid = true,
}: Props) => {
  const { t } = useTranslation(['common']);

  const confirmAction = (
    <Grid item lg="auto" xs={12}>
      <Button
        id="filter-notifications-button"
        variant="outlined"
        type="submit"
        size="small"
        disabled={isInitialSearch && !filtersApplied}
      >
        {t('button.filtra')}
      </Button>
    </Grid>
  );

  const cancelAction = (
    <Grid item lg="auto" xs={12}>
      <Button
        data-testid="cancelButton"
        size="small"
        onClick={cleanFilters}
        disabled={!filtersApplied}
      >
        {t('button.annulla filtro')}
      </Button>
    </Grid>
  );

  return (
    <Fragment>
      {isInDialog ? (
        <CustomMobileDialogAction closeOnClick={isValid}>{confirmAction}</CustomMobileDialogAction>
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
