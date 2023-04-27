import _ from 'lodash';
import { FormEvent, PropsWithChildren } from 'react';
import { Box, Button, DialogActions, DialogContent, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { useIsMobile } from '../../hooks';
import { filtersApplied } from '../../utils';
import CustomMobileDialog from '../CustomMobileDialog/CustomMobileDialog';
import CustomMobileDialogContent from '../CustomMobileDialog/CustomMobileDialogContent';
import CustomMobileDialogToggle from '../CustomMobileDialog/CustomMobileDialogToggle';
import CustomMobileDialogAction from '../CustomMobileDialog/CustomMobileDialogAction';

type Props<FormValues> = {
  /** label to show for the filter button */
  filterLabel: string;
  /** label to show for the cancel button */
  cancelLabel: string;
  /** function to be called when filters are submitted */
  onSubmit: (event?: FormEvent<HTMLFormElement> | undefined) => void;
  /** function to be called when filters are cleaned */
  onClear: () => void;
  /** flag to check if the form is valid */
  formIsValid: boolean;
  /** current form values */
  formValues: FormValues;
  /** initial form values */
  initialValues: FormValues;
};

const useStyles = makeStyles({
  helperTextFormat: {
    // Use existing space / prevents shifting content below field
    alignItems: 'flex',
  },
});

/**
 * SmartFilter show filter in desktop view and dialog in mobile view.
 */
const SmartFilter = <FormValues extends object>({
  filterLabel,
  cancelLabel,
  onSubmit,
  onClear,
  children,
  formIsValid,
  formValues,
  initialValues,
}: PropsWithChildren<Props<FormValues>>) => {
  const isMobile = useIsMobile();
  const classes = useStyles();
  const isInitialSearch = _.isEqual(formValues, initialValues);
  const filtersCount = filtersApplied(initialValues, formValues);

  const confirmAction = (
    <Button
      data-testid="confirmButton"
      variant="outlined"
      type="submit"
      size="small"
      disabled={!formIsValid || (isInitialSearch && !filtersCount)}
    >
      {filterLabel}
    </Button>
  );

  const cancelAction = (
    <Button data-testid="cancelButton" size="small" onClick={onClear} disabled={!filtersCount}>
      {cancelLabel}
    </Button>
  );

  if (isMobile) {
    return (
      <CustomMobileDialog>
        <CustomMobileDialogToggle
          sx={{
            pl: 0,
            pr: filtersCount ? '10px' : 0,
            justifyContent: 'left',
            minWidth: 'unset',
            height: '24px',
          }}
          hasCounterBadge
          bagdeCount={filtersCount}
        >
          {filterLabel}
        </CustomMobileDialogToggle>
        <CustomMobileDialogContent title={filterLabel}>
          <form onSubmit={onSubmit}>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
              <CustomMobileDialogAction>{confirmAction}</CustomMobileDialogAction>
              <CustomMobileDialogAction>{cancelAction}</CustomMobileDialogAction>
            </DialogActions>
          </form>
        </CustomMobileDialogContent>
      </CustomMobileDialog>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <Box sx={{ flexGrow: 1, mt: 3 }}>
        <Grid container spacing={1} className={classes.helperTextFormat} alignItems="center">
          {children}
          <Grid item lg="auto" xs={12}>
            {confirmAction}
          </Grid>
          <Grid item lg="auto" xs={12}>
            {cancelAction}
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default SmartFilter;
