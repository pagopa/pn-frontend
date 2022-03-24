import { styled } from '@mui/material';
import { Link } from 'react-router-dom';

/**
 * StyledLink. It works as first element in breadcrumbs path
 */
const StyledLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: `${theme.palette.text.primary} !important`,
  texDecoration: 'none !important',
  '&:hover, &:focus': {
    textDecoration: 'underline !important',
  },
}));

export default StyledLink;