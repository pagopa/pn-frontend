import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@mui/material';
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
  cleanFilters,
  isInitialSearch,
  isInDialog = false,
}: Props) => {
  const { t } = useTranslation(['common']);

  const confirmAction = (
    <Button
      id="filter-button"
      data-testid="filterButton"
      variant="outlined"
      type="submit"
      sx={{
        height: '43px !important',
        marginRight: '8px !important',
      }}
      disabled={isInitialSearch && !filtersApplied}
    >
      {t('button.filtra')}
    </Button>
  );

  const cancelAction = (
    <MIButton
      data-testid="cancelButton"
      sx={{
        height: '43px !important',
        padding: '0 16px !important',
        minWidth: '130px !important',
      }}
      variant="text"
      onClick={cleanFilters}
    >
      {t('button.annulla filtro')}
    </MIButton>
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
