import { CSSProperties, JSXElementConstructor, forwardRef } from 'react';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ButtonProps, Stack, TextFieldProps, Typography, TypographyProps } from '@mui/material';

import { ChannelType } from '../../models/contacts';

type Props = {
  label: string;
  value: string;
  channelType: ChannelType;
  slots?: {
    label?: JSXElementConstructor<TypographyProps>;
    editButton?: JSXElementConstructor<ButtonProps>;
  };
  slotsProps?: {
    container?: CSSProperties;
    textField?: Partial<TextFieldProps>;
    button?: Partial<ButtonProps>;
  };
  showLabelOnEdit?: boolean;
  senderId?: string;
  inputProps: { label: string; prefix?: string };
  insertButtonLabel: string;
  showVerifiedIcon?: boolean;
  onSubmit: (value: string) => void;
  onDelete?: () => void;
  onCancelInsert?: () => void;
  onEditCallback?: (editMode: boolean) => void;
  beforeValidationCallback?: (value: string, errors?: string) => void;
};

const SpecialSercqEmail = forwardRef<{ toggleEdit: () => void }, Props>(
  ({ value, channelType, senderId = 'default', showVerifiedIcon = false }) => {
    const contactType = channelType.toLowerCase();

    return (
      <Stack
        width={{ xs: '100%', lg: 'auto' }}
        direction="row"
        justifyContent={{ xs: 'space-between', lg: 'auto' }}
      >
        <Typography
          sx={{
            wordBreak: 'break-word',
            fontSize: '18px',
            fontWeight: 600,
          }}
          component="span"
          variant="body2"
          id={`${senderId}_${contactType}-typography`}
        >
          {value}
        </Typography>
        {showVerifiedIcon && <CheckCircleIcon sx={{ ml: 1 }} fontSize="small" color="success" />}
      </Stack>
    );
  }
);

export default SpecialSercqEmail;
