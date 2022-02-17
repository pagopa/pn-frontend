import { ChangeEvent, Fragment, useState } from 'react';
import { Button, Grid, Menu, MenuItem, Pagination, PaginationItem } from '@mui/material';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';

import { PaginationData } from './types';

type Props = {
  /** The actual paginationData */
  paginationData: PaginationData;
  /** The function to be invoked if the user change paginationData */
  onPageRequest: (r: PaginationData) => void;
   /** The list of numbers of the elements per page */
  elementsPerPage: Array<number>;
  /** an array containing pages to show */
  pagesToShow?: Array<number>;
};

/** Selfcare custom table available pages component */
export default function CustomPagination({ paginationData, onPageRequest, elementsPerPage, pagesToShow }: Props) {
  const size = paginationData.size;
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
            endIcon={(size >= elementsPerPage[0]) && <ArrowDropDown />}
          >
            {size}
          </Button>
          { (size >= elementsPerPage[0]) && 
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'Righe per pagina',
              }}
            >
              {elementsPerPage.map(ep => <MenuItem key={ep} onClick={() => handleChangeElementsPerPage(ep)}>{ep}</MenuItem>)}
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
              renderItem={(props2) => {
                if (pagesToShow && props2.type === 'page' && pagesToShow.indexOf(props2.page) === -1) {
                  return null;
                }
                console.log(props2);
                return <PaginationItem {...props2} sx={{ border: 'none' }} />
              }}
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

/*
renderItem={(props2) => {
                return props2.page === 10 ? null : <PaginationItem {...props2} sx={{ border: 'none' }} />
              }}
*/