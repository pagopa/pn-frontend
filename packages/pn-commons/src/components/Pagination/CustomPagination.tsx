import { ChangeEvent, Fragment, useState } from 'react';
import { Button, Grid, Menu, MenuItem, Pagination } from '@mui/material';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';

import { PaginationData } from './types';

function defaultLabelDisplayedRows(from: number, to: number) {
  return `${from}-${to}`;
}

const getLabelDisplayedRowsTo = (count: number, paginationData: number, size: number) => {
  if (count === -1) {
    return (paginationData + 1) * size;
  }

  return size === -1 ? count : Math.min(count, (paginationData + 1) * size);
};

type Props = {
  /** The actual paginationData */
  paginationData: PaginationData;
  /** The function to be invoked if the user change paginationData */
  onPageRequest: (r: PaginationData) => void;
   /** The list of numbers of the elements per page */
  elementsPerPage: Array<number>;
};

/** Selfcare custom table available pages component */
export default function CustomPagination({ paginationData, onPageRequest, elementsPerPage }: Props) {
  const count = paginationData.totalElements;
  const elsPerPage = elementsPerPage.filter(p => p <= count);
  const size = paginationData.size || elsPerPage[0] || count;
  const from = count === 0 ? 0 : paginationData.page * size + 1;
  const to = getLabelDisplayedRowsTo(count, paginationData.page, size);
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
    }
    handleClose();
  }

  return (
    <Fragment>
      <Grid container sx={{ padding: '0 10px' }}>
        <Grid item xs={6} display="flex" justifyContent="start" alignItems={'center'}>
          <Button
            id="basic-button"
            sx={{color: 'text.primary', fontWeight: 400}}
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            endIcon={elsPerPage.length > 0 && <ArrowDropDown />}
          >
            {defaultLabelDisplayedRows(from, to)}
          </Button>
          { elsPerPage.length > 0 && 
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'Righe per pagina',
              }}
            >
              {elsPerPage.map(ep => <MenuItem key={ep} onClick={() => handleChangeElementsPerPage(ep)}>{ep}</MenuItem>)}
            </Menu>
          }
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="end" alignItems={'center'}>
          {paginationData.totalElements > size && (
            <Pagination
              sx={{ display: 'flex' }}
              color="primary"
              variant="outlined"
              shape="circular"
              page={paginationData.page + 1}
              count={Math.ceil(paginationData.totalElements / size)}
              renderItem={(props2) => <PaginationItem {...props2} sx={{ border: 'none' }} />}
              onChange={(_event: ChangeEvent<unknown>, value: number) => (
                onPageRequest({
                  ...paginationData,
                  page: value - 1
                })
              )}
            />
          )}
        </Grid>
      </Grid>
    </Fragment>
  );
}