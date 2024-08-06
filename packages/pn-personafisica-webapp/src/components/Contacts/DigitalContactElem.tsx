import { Dispatch, SetStateAction, forwardRef, memo, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TextField, TextFieldProps, Typography } from '@mui/material';
import { WithRequired } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { CourtesyChannelType, LegalChannelType } from '../../models/contacts';
import { useDigitalContactsCodeVerificationContext } from './DigitalContactsCodeVerification.context';

type Props = {
  inputProps: WithRequired<TextFieldProps, 'id'>;
  senderId: string;
  senderName?: string;
  contactType: CourtesyChannelType | LegalChannelType;
  saveDisabled?: boolean;
  onConfirm: (status: 'validated' | 'cancelled') => void;
  resetModifyValue: () => void;
  onDelete: () => void;
  editDisabled?: boolean;
  setContextEditMode?: Dispatch<SetStateAction<boolean>>;
};

const DigitalContactElem = forwardRef<{ editContact: () => void }, Props>(
  (
    {
      inputProps,
      saveDisabled = false,
      senderId,
      senderName,
      contactType,
      onConfirm,
      resetModifyValue,
      editDisabled,
      setContextEditMode,
      onDelete,
    },
    ref
  ) => {
    const { t } = useTranslation(['common']);
    const [editMode, setEditMode] = useState(false);
    const { initValidation } = useDigitalContactsCodeVerificationContext();
    const toggleEdit = () => {
      setEditMode(!editMode);
      if (setContextEditMode) {
        setContextEditMode(!editMode);
      }
    };

    const onCancel = () => {
      resetModifyValue();
      toggleEdit();
    };

    const editHandler = () => {
      initValidation(
        contactType,
        inputProps.value as string,
        senderId,
        senderName,
        (status: 'validated' | 'cancelled') => {
          onConfirm(status);
          toggleEdit();
        }
      );
    };

    useImperativeHandle(ref, () => ({
      editContact: editHandler,
    }));

    return (
      <>
        {editMode && (
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            data-testid={inputProps.id}
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
            {inputProps.value as string}
          </Typography>
        )}
        {!editMode ? (
          <>
            <ButtonNaked
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
              color="primary"
              disabled={saveDisabled}
              type="button"
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

export default memo(DigitalContactElem);
