import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

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
  isInDialog = false,
}: Props) => {
  const { t } = useTranslation(['common']);

  const confirmAction = (
    <MIButton
      id="filter-button"
      data-testid="filterButton"
      variant="outlined"
      size="small"
      sx={{
        height: '43px !important',
        marginRight: '8px !important',
      }}
    >
      {t('button.filtra')}
    </MIButton>
  );

  const cancelAction = (
    <MIButton
      data-testid="cancelButton"
      sx={{
        height: '43px !important',
        padding: '0 16px !important',
        minWidth: '130px !important',
      }}
      size="small"
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
