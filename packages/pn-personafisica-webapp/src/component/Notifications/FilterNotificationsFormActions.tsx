import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Grid } from '@mui/material';
import { CustomMobileDialogAction } from '@pagopa-pn/pn-commons';
import { FormikValues } from 'formik';

type Props = {
  appliedFilters: number;
  cleanFilters: () => void;
  formikInstance: {
    isValid: boolean;
    values: FormikValues;
    initialValues: FormikValues;
  };
  isInDialog?: boolean;
};

const FilterNotificationsFormActions = ({
  appliedFilters,
  cleanFilters,
  formikInstance,
  isInDialog = false,
}: Props) => {
  const { t } = useTranslation(['common']);

  const confirmAction = (
    <Grid item lg="auto" xs={12}>
      <Button
        variant="outlined"
        type="submit"
        size="small"
        disabled={!formikInstance.isValid || formikInstance.values === formikInstance.initialValues}
      >
        {t('button.cerca')}
      </Button>
    </Grid>
  );

  const cancelAction = (
    <Grid item lg="auto" xs={12}>
      <Button
        data-testid="cancelButton"
        size="small"
        onClick={cleanFilters}
        disabled={appliedFilters === 0}
      >
        {t('button.annulla ricerca')}
      </Button>
    </Grid>
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
