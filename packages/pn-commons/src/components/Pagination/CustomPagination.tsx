import { ChangeEvent, useState } from 'react';
import { Button, Grid, Menu, MenuItem, Pagination, PaginationItem, SxProps } from '@mui/material';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';

import { getLocalizedOrDefaultLabel } from '../../services/localization.service';
import { PaginationData, A11yPaginationLabelsTypes } from './types';

type Props = {
  /** The actual paginationData */
  paginationData: PaginationData;
  /** The function to be invoked if the user change paginationData */
  onPageRequest: (r: PaginationData) => void;
  /** The list of numbers of the elements per page */
  elementsPerPage?: Array<number>;
  /** an array containing pages to show */
  pagesToShow?: Array<number>;
  /** custom style */
  sx?: SxProps;
  /** event tracking function callback for page size */
  eventTrackingCallbackPageSize?: (pageSize: number) => void;
};

const getA11yPaginationLabels = (
  type: A11yPaginationLabelsTypes,
  page: number,
  selected: boolean
): string => {
  // eslint-disable-next-line functional/no-let
  let ariaStr;
  switch (type) {
    case 'first':
      ariaStr = getLocalizedOrDefaultLabel('common', 'paginator.first', 'primo elemento');
      break;
    case 'last':
      ariaStr = getLocalizedOrDefaultLabel('common', 'paginator.last', 'ultimo elemento');
      break;
    case 'page':
      ariaStr = `${getLocalizedOrDefaultLabel(
        'common',
        'paginator.page',
        'pagina'
      )} ${page.toString()}`;
      break;
    case 'next':
      ariaStr = getLocalizedOrDefaultLabel(
        'common',
        'paginator.next',
        'Vai alla pagina successiva'
      );
      break;
    case 'previous':
      ariaStr = getLocalizedOrDefaultLabel(
        'common',
        'paginator.previous',
        'Vai alla pagina precedente'
      );
      break;
  }
  if (selected) {
    ariaStr += `, ${getLocalizedOrDefaultLabel(
      'common',
      'paginator.selected',
      'elemento selezionato'
    )}`;
  }
  return ariaStr;
};

/** Selfcare custom table available pages component */
export default function CustomPagination({
  paginationData,
  onPageRequest,
  elementsPerPage = [10, 20, 50],
  pagesToShow,
  sx,
  eventTrackingCallbackPageSize,
}: Props) {
  const size = paginationData.size || elementsPerPage[0];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeElementsPerPage = (selectedSize: number) => {
    if (size !== selectedSize) {
      paginationData.size = selectedSize;
      // reset current page
      paginationData.page = 0;
      onPageRequest(paginationData);
      if (eventTrackingCallbackPageSize) eventTrackingCallbackPageSize(selectedSize);
    }
    handleClose();
  };

  return (
    <Grid container sx={sx}>
      <Grid
        item
        xs={4}
        display="flex"
        justifyContent="start"
        alignItems={'center'}
        data-testid="itemsPerPageSelector"
        className="items-per-page-selector"
      >
        <Button
          sx={{ color: 'text.primary', fontWeight: 400 }}
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          endIcon={<ArrowDropDown />}
          aria-label={getLocalizedOrDefaultLabel(
            'common',
            'paginator.rows-per-page',
            'Righe per pagina'
          )}
        >
          {size}
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': getLocalizedOrDefaultLabel(
              'common',
              'paginator.rows-per-page',
              'Righe per pagina'
            ),
          }}
        >
          {elementsPerPage.map((ep) => (
            <MenuItem key={ep} onClick={() => handleChangeElementsPerPage(ep)}>
              {ep}
            </MenuItem>
          ))}
        </Menu>
      </Grid>
      <Grid
        item
        xs={8}
        display="flex"
        justifyContent="end"
        alignItems={'center'}
        data-testid="pageSelector"
        className="page-selector"
      >
        {paginationData.totalElements > size && (
          <Pagination
            sx={{ display: 'flex' }}
            aria-label={getLocalizedOrDefaultLabel(
              'common',
              'paginator.aria-label',
              'Menu Paginazione'
            )}
            color="primary"
            variant="text"
            shape="circular"
            page={paginationData.page + 1}
            count={Math.ceil(paginationData.totalElements / size)}
            getItemAriaLabel={getA11yPaginationLabels}
            renderItem={(props2) => {
              if (
                pagesToShow &&
                props2.type === 'page' &&
                props2.page !== null &&
                pagesToShow.indexOf(props2.page) === -1
              ) {
                return null;
              }
              return <PaginationItem {...props2} sx={{ border: 'none' }} />;
            }}
            onChange={(_event: ChangeEvent<unknown>, value: number) =>
              onPageRequest({
                ...paginationData,
                page: value - 1,
              })
            }
          />
        )}
      </Grid>
    </Grid>
  );
}
