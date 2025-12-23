'use client';

import React from 'react';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import ReportProblemRounded from '@mui/icons-material/ReportProblemRounded';
import ReportRoundedIcon from '@mui/icons-material/ReportRounded';
import { SxProps, styled } from '@mui/system';
import { theme } from '@pagopa/mui-italia';

export const colorTextPrimary = '#17324D';
export const shadowColor = '#002B55';
export const backdropBackground = '#17324D';
export const menuItemBackground = '#17324D';
export const colorPrimaryContainedHover = '#0055AA';
export const none = 'transparent'; // Not exposed by the theme object

const neutral = {
  black: '#0E0F13',
  grey: {
    850: '#2B2E38',
    700: '#555C70',
    650: '#636B82',
    450: '#99A3C1',
    300: '#BBC2D6',
    200: '#D2D6E3',
    100: '#E8EBF1',
    50: '#F4F5F8',
  },
  white: '#FFFFFF',
};

const blue = {
  850: '#031344',
  600: '#0932B6',
  500: '#0B3EE3',
  400: '#3C65E9',
  300: '#6D8BEE',
  200: '#9DB2F4',
  150: '#B6C5F7',
  100: '#CED8F9',
  50: '#E7ECFC',
};

const turquoise = {
  850: '#003B3D',
  600: '#009EA2',
  500: '#00C5CA',
  300: '#61DCDF',
  150: '#AAEEEF',
  100: '#C2F3F4',
  50: '#DBF9FA',
};

const blueitalia = {
  850: '#001F3D',
  600: '#0052A3',
  500: '#0066CC',
  400: '#3184D6',
  100: '#C4DCF5',
  50: '#DDEBFA',
};

const info = {
  850: '#225C76',
  700: '#418DAF',
  500: '#6BCFFB',
  400: '#89D9FC',
  100: '#E1F5FE',
};

const success = {
  850: '#224021',
  700: '#427940',
  500: '#6CC66A',
  100: '#E1F4E1',
};

const warning = {
  850: '#614C15',
  700: '#A5822A',
  500: '#FFC824',
  400: '#FFD56B',
  100: '#FFF5DA',
};

const error = {
  850: '#5D1313',
  600: '#D13333',
  500: '#FF4040',
  400: '#FF6666',
  100: '#FFD9D9',
};

const purple = {
  850: '#1A0744',
  500: '#5517E3',
  250: '#CCB9F7',
  100: '#DDD1F9',
  50: '#EEE8FC',
};

export const colors = {
  neutral,
  blue,
  turquoise,
  blueitalia,
  info,
  success,
  warning,
  error,
  purple,
};

export const text = {
  heading: neutral.black,
  description: neutral.grey[700],
};

export type Variants = 'default' | 'info' | 'warning' | 'error' | 'success' | 'only-icon';

export interface TagProps {
  /** Content of the component */
  value: string;
  /** Variant of the colour. You can set `Light` variant if
   * you want a washed out variant of the color. */
  variant?: Variants;
  /** Icon in case of default tag element. It is passed
   * as a React Node and it has blue[500] as color.
   */
  icon?: React.ReactElement;
  /* Style to override tag style */
  sx?: SxProps;
}

function pxToRem(value: number): string {
  return `${value / 16}rem`;
}

/* Transform HTML component into MUI Styled Component
in order to accept `sx` prop */
const StyledTag = styled('span')({
  fontSize: pxToRem(12),
  fontWeight: 600,
  whiteSpace: 'nowrap',
  userSelect: 'none',
  padding: `${pxToRem(4)} ${pxToRem(8)}`,
  backgroundColor: theme.palette.common.white,
  color: theme.palette.grey[700],
  fontFamily: theme.typography.fontFamily,
  borderRadius: pxToRem(6),
  border: `1px solid ${theme.palette.grey[100]}`,
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  lineHeight: pxToRem(18),
  textTransform: 'uppercase',
});

const fontSize = pxToRem(14);

const Icon = ({ variant, icon }: { variant: Variants; icon?: React.ReactElement }) => {
  if (variant === 'info') {
    return <InfoRoundedIcon sx={{ color: colors.info[700], fontSize }} />;
  }
  if (variant === 'warning') {
    return <ReportProblemRounded sx={{ color: colors.warning[700], fontSize }} />;
  }
  if (variant === 'error') {
    return <ReportRoundedIcon sx={{ color: colors.error[600], fontSize }} />;
  }
  if (variant === 'success') {
    return <CheckCircleRoundedIcon sx={{ color: colors.success[700], fontSize }} />;
  }
  if (variant === 'default') {
    return icon
      ? React.cloneElement(icon, {
          sx: { color: colors.blue[500], fontSize, ...(icon.props.sx || {}) },
        })
      : null;
  }
  if (variant === 'only-icon' && icon) {
    return React.cloneElement(icon, {
      sx: { fill: colors.neutral.grey[700], fontSize, ...(icon.props.sx || {}) },
    });
  }
  return null;
};

export const Tag = ({
  value,
  variant = 'default',
  icon,
  sx = {},
  ...rest
}: TagProps): JSX.Element => {
  const getContent = (value: string) => {
    if (variant === 'only-icon') {
      return null;
    }
    return value;
  };

  if (variant === 'only-icon' && icon) {
    return <Icon variant={variant} icon={icon} />;
  } else {
    return (
      <StyledTag sx={sx} {...rest}>
        <Icon variant={variant} icon={icon} />
        {getContent(value)}
      </StyledTag>
    );
  }
};
