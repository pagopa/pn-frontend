import { Fragment } from 'react';
import { Button } from '@mui/material';
import { CustomMobileDialogAction } from '@pagopa-pn/pn-commons';
import { FormikValues } from 'formik';
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
  formikInstance: {
    isValid: boolean;
    values: FormikValues;
    initialValues: FormikValues;
  };
  isInDialog?: boolean;
};

const FilterNotificationsFormActions = ({
  filtersApplied,
  cleanFilters,
  formikInstance,
  isInDialog = false,
  isInitialSearch,
}: Props) => {
  const classes = useStyles();

  const confirmAction = (
    <Button
      variant="outlined"
      type="submit"
      size="small"
      className={classes.searchButton}
      disabled={
        !formikInstance.isValid || (isInitialSearch && !filtersApplied)
      }
    >
      Filtra
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
      Rimuovi filtri
    </Button>
  );

  return (
    <Fragment>
      {isInDialog ? (
        <CustomMobileDialogAction closeOnClick>{confirmAction}</CustomMobileDialogAction>
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
