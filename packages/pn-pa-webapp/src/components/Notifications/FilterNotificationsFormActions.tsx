import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@mui/material';
import { CustomMobileDialogAction } from '@pagopa-pn/pn-commons';

const style = {
  searchButton: {
    height: '43px !important',
    marginRight: '8px !important',
  },
  cancelButton: {
    height: '43px !important',
    padding: '0 16px !important',
    minWidth: '130px !important',
  },
};

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

  const confirmAction = (
    <Button
      id="filter-button"
      data-testid="filterButton"
      variant="outlined"
      type="submit"
      size="small"
      sx={style.searchButton}
      disabled={isInitialSearch && !filtersApplied}
    >
      {t('button.filtra')}
    </Button>
  );

  const cancelAction = (
    <Button
      data-testid="cancelButton"
      sx={style.cancelButton}
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
