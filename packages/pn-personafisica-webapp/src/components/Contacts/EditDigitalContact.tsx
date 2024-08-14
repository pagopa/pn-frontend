import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, InputAdornment, Stack, TextField, TextFieldProps, Typography } from '@mui/material';
import { WithRequired } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

type Props = {
  inputProps: WithRequired<TextFieldProps & { prefix?: string }, 'id'>;
  senderId: string;
  saveDisabled?: boolean;
  onEdit?: (editFlag: boolean) => void;
  onEditCancel: () => void;
  onDelete: () => void;
  editDisabled?: boolean;
};

const EditDigitalContact = forwardRef<{ toggleEdit: () => void }, Props>(
  (
    {
      inputProps,
      saveDisabled = false,
      senderId,
      onEdit,
      onEditCancel,
      editDisabled = false,
      onDelete,
    },
    ref
  ) => {
    const { t } = useTranslation(['common']);
    const [editMode, setEditMode] = useState(false);

    const toggleEdit = () => {
      setEditMode(!editMode);
      if (onEdit) {
        onEdit(!editMode);
      }
    };

    const onCancel = () => {
      onEditCancel();
      toggleEdit();
    };

    useImperativeHandle(ref, () => ({
      toggleEdit,
    }));

    return (
      <>
        {editMode && (
          <>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              data-testid={inputProps.id}
              InputProps={{
                startAdornment: inputProps.prefix ? (
                  <InputAdornment position="start">{inputProps.prefix}</InputAdornment>
                ) : null,
              }}
              {...inputProps}
            />
            <ButtonNaked
              key="saveButton"
              color="primary"
              disabled={saveDisabled}
              type="submit"
              sx={{ mr: 2 }}
              id={`saveModifyButton-${senderId}`}
            >
              {t('button.salva')}
            </ButtonNaked>
            <ButtonNaked color="error" onClick={onCancel}>
              {t('button.annulla')}
            </ButtonNaked>
          </>
        )}
        {!editMode && (
          <Stack direction="row" spacing={2}>
            <VerifiedIcon
              fontSize="small"
              color="success"
              sx={{ position: 'relative', top: '2px' }}
            />
            <Box>
              <Typography
                sx={{
                  wordBreak: 'break-word',
                }}
                id={`${inputProps.id}-typography`}
              >
                {inputProps.prefix
                  ? `${inputProps.prefix}${inputProps.value}`
                  : `${inputProps.value}`}
              </Typography>
              <ButtonNaked
                key="editButton"
                color="primary"
                onClick={toggleEdit}
                sx={{ mr: 2 }}
                disabled={editDisabled}
                id={`modifyContact-${senderId}`}
              >
                {t('button.modifica')}
              </ButtonNaked>
              <ButtonNaked
                id={`cancelContact-${senderId}`}
                color="error"
                onClick={onDelete}
                disabled={editDisabled}
              >
                {t('button.elimina')}
              </ButtonNaked>
            </Box>
          </Stack>
        )}
      </>
    );
  }
);

export default EditDigitalContact;
