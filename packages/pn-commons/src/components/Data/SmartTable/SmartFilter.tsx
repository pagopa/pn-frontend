import _ from 'lodash';
import { FormEvent, PropsWithChildren, useRef } from 'react';

import { Box, Button, DialogActions, DialogContent, Grid } from '@mui/material';

import { useIsMobile } from '../../../hooks/useIsMobile';
import { filtersApplied } from '../../../utility/genericFunctions.utility';
import CustomMobileDialog from '../../CustomMobileDialog/CustomMobileDialog';
import CustomMobileDialogAction from '../../CustomMobileDialog/CustomMobileDialogAction';
import CustomMobileDialogContent from '../../CustomMobileDialog/CustomMobileDialogContent';
import CustomMobileDialogToggle from '../../CustomMobileDialog/CustomMobileDialogToggle';

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
  const currentFilters = useRef<FormValues>(formValues);
  const isPreviousSearch = _.isEqual(formValues, currentFilters.current);
  const filtersCount = filtersApplied(currentFilters.current, initialValues);
  const dialogRef = useRef<{ toggleOpen: () => void }>(null);

  const submitHandler = (e?: FormEvent<HTMLFormElement> | undefined) => {
    // eslint-disable-next-line functional/immutable-data
    currentFilters.current = formValues;
    dialogRef.current?.toggleOpen();
    onSubmit(e);
  };

  const clearHandler = () => {
    // eslint-disable-next-line functional/immutable-data
    currentFilters.current = initialValues;
    onClear();
  };

  const confirmAction = (
    <Button
      id="confirm-button"
      data-testid="confirmButton"
      variant="outlined"
      type="submit"
      size="small"
      disabled={!formIsValid || isPreviousSearch}
    >
      {filterLabel}
    </Button>
  );

  const cancelAction = (
    <Button data-testid="cancelButton" size="small" onClick={clearHandler} disabled={!filtersCount}>
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
        <CustomMobileDialogContent title={filterLabel} ref={dialogRef}>
          <form onSubmit={submitHandler}>
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
    <form onSubmit={submitHandler}>
      <Box sx={{ flexGrow: 1, mt: 3 }}>
        <Grid container spacing={1} sx={{ alignItems: 'flex' }} alignItems="center">
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
