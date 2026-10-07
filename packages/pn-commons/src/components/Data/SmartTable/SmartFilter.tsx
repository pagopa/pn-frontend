import { isEqual } from 'lodash-es';
import { FormEvent, PropsWithChildren, useRef, useState } from 'react';

import { Button, DialogActions, DialogContent, Grid, Theme } from '@mui/material';

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
  onSubmit: (
    event?: FormEvent<HTMLFormElement> | undefined
  ) => void | boolean | Promise<void | boolean>;
  /** function to be called when filters are cleaned */
  onClear: () => void;
  /** flag to check if the form is valid */
  formIsValid: boolean;
  /** current form values */
  formValues: FormValues;
  /** initial form values */
  initialValues: FormValues;
};

const actionItemStyle = {
  display: 'flex',
  alignItems: 'center',
  minHeight: (theme: Theme) => `calc(48px + ${theme.spacing(1)})`,
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
  const [currentFilters, setCurrentFilters] = useState<FormValues>(formValues);
  const isPreviousSearch = isEqual(formValues, currentFilters);
  const filtersCount = filtersApplied(currentFilters, initialValues);
  const dialogRef = useRef<{ toggleOpen: () => void }>(null);

  const submitHandler = async (e?: FormEvent<HTMLFormElement> | undefined) => {
    const result = await onSubmit(e);
    if (result === false) {
      return;
    }
    setCurrentFilters(formValues);
    dialogRef.current?.toggleOpen();
  };

  const clearHandler = () => {
    setCurrentFilters(initialValues);
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
      <Grid container spacing={1} sx={{ alignItems: 'flex-start', mt: 2 }}>
        {children}
        <Grid item lg="auto" xs={12} sx={actionItemStyle}>
          {confirmAction}
        </Grid>
        <Grid item lg="auto" xs={12} sx={actionItemStyle}>
          {cancelAction}
        </Grid>
      </Grid>
    </form>
  );
};

export default SmartFilter;
