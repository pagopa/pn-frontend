import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { CustomMobileDialogAction } from '@pagopa-pn/pn-commons';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  searchButton: {
    height: '43px !important',
    marginRight: '8px !important',
  },
  cancelButton: {
    height: '43px !important',
    padding: '0 16px !important',
    minWidth: '130px !important',
  },
});

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
  const classes = useStyles();
  const { t } = useTranslation(['common']);

  const confirmAction = (
    <Button
      data-testid="filterButton"
      variant="outlined"
      type="submit"
      size="small"
      className={classes.searchButton}
      disabled={isInitialSearch && !filtersApplied}
    >
      {t('button.filtra')}
    </Button>
  );

  const cancelAction = (
    <Button
      data-testid="cancelButton"
      className={classes.cancelButton}
      size="small"
      onClick={cleanFilters}
      disabled={!filtersApplied}
    >
      {t('button.annulla filtro')}
    </Button>
  );

  return (
    <Fragment>
      {isInDialog ? (
        <CustomMobileDialogAction >{confirmAction}</CustomMobileDialogAction>
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
