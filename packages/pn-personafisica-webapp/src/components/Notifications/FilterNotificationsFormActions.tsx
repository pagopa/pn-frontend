import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Grid } from '@mui/material';
import { CustomMobileDialogAction } from '@pagopa-pn/pn-commons';
import { MIButton } from '@pagopa/mui-italia';

type Props = {
  filtersApplied: boolean;
  isInitialSearch: boolean;
  cleanFilters: () => void;
  isInDialog?: boolean;
};

const FilterNotificationsFormActions = ({
  filtersApplied,
  isInitialSearch,
  cleanFilters,
  isInDialog = false,
}: Props) => {
  const { t } = useTranslation(['common']);

  const confirmAction = (
    <Grid item lg="auto" xs={12}>
      <Button
        type="submit"
        id="filter-notifications-button"
        variant="outlined"
        size="small"
        disabled={isInitialSearch && !filtersApplied}
      >
        {t('button.filtra')}
      </Button>
    </Grid>
  );

  const cancelAction = (
    <Grid item lg="auto" xs={12}>
      <MIButton data-testid="cancelButton" onClick={cleanFilters}>
        {t('button.annulla filtro')}
      </MIButton>
    </Grid>
  );

  return (
    <Fragment>
      {isInDialog ? (
        <CustomMobileDialogAction>{confirmAction}</CustomMobileDialogAction>
      ) : (
        confirmAction
      )}
      {filtersApplied &&
        (isInDialog ? (
          <CustomMobileDialogAction closeOnClick>{cancelAction}</CustomMobileDialogAction>
        ) : (
          cancelAction
        ))}
    </Fragment>
  );
};

export default FilterNotificationsFormActions;
