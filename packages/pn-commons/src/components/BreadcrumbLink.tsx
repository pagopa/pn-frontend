import { RefAttributes } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { styled } from '@mui/material';

const StyledLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: `${theme.palette.text.primary} !important`,
  texDecoration: 'none !important',
  '&:hover, &:focus': {
    textDecoration: 'underline !important',
  },
}));

const BreadcrumbLink = (props: LinkProps & RefAttributes<HTMLAnchorElement>) => <StyledLink {...props}/>;

export default BreadcrumbLink;