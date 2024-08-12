import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { InputAdornment, TextField, TextFieldProps, Typography } from '@mui/material';
import { WithRequired } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { ChannelType } from '../../models/contacts';
import { useDigitalContactsCodeVerificationContext } from './DigitalContactsCodeVerification.context';

type Props = {
  inputProps: WithRequired<TextFieldProps & { prefix?: string }, 'id'>;
  senderId: string;
  senderName?: string;
  contactType: ChannelType;
  saveDisabled?: boolean;
  onConfirm?: (status: 'validated' | 'cancelled') => void;
  onEdit?: (editFlag: boolean) => void;
  onEditCancel: () => void;
  onDelete: () => void;
  editDisabled?: boolean;
  // this is a temporary property. it is needed until we remove the context
  editManagedFromOutside?: boolean;
};

const DigitalContactElem = forwardRef<{ editContact: () => void; toggleEdit?: () => void }, Props>(
  (
    {
      inputProps,
      saveDisabled = false,
      senderId,
      senderName,
      contactType,
      onConfirm,
      onEdit,
      onEditCancel,
      editDisabled = false,
      onDelete,
      editManagedFromOutside = false,
    },
    ref
  ) => {
    const { t } = useTranslation(['common']);
    const [editMode, setEditMode] = useState(false);
    const { initValidation } = useDigitalContactsCodeVerificationContext(editManagedFromOutside);

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

    const editHandler = () => {
      if (editManagedFromOutside) {
        return;
      }
      initValidation(
        contactType,
        inputProps.value as string,
        senderId,
        senderName,
        (status: 'validated' | 'cancelled') => {
          if (onConfirm) {
            onConfirm(status);
          }
          toggleEdit();
        }
      );
    };

    useImperativeHandle(ref, () => ({
      editContact: editHandler,
      toggleEdit,
    }));

    return (
      <>
        {editMode && (
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
        )}
        {!editMode && (
          <Typography
            sx={{
              wordBreak: 'break-word',
            }}
            id={`${inputProps.id}-typography`}
          >
            {inputProps.prefix ? `${inputProps.prefix}${inputProps.value}` : `${inputProps.value}`}
          </Typography>
        )}
        {!editMode ? (
          <>
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
              color="primary"
              onClick={onDelete}
              disabled={editDisabled}
            >
              {t('button.elimina')}
            </ButtonNaked>
          </>
        ) : (
          <>
            <ButtonNaked
              key="saveButton"
              color="primary"
              disabled={saveDisabled}
              type="submit"
              onClick={editHandler}
              sx={{ mr: 2 }}
              id={`saveModifyButton-${senderId}`}
            >
              {t('button.salva')}
            </ButtonNaked>
            <ButtonNaked color="primary" onClick={onCancel}>
              {t('button.annulla')}
            </ButtonNaked>
          </>
        )}
      </>
    );
  }
);

export default DigitalContactElem;
