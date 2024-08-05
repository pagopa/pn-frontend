import {
  Dispatch,
  ReactChild,
  SetStateAction,
  forwardRef,
  memo,
  useImperativeHandle,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { Grid, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { CourtesyChannelType, LegalChannelType } from '../../models/contacts';
import { useDigitalContactsCodeVerificationContext } from './DigitalContactsCodeVerification.context';

type Props = {
  fields: Array<{
    component: ReactChild;
    id: string;
    isEditable?: boolean;
    size: 'auto' | 'variable';
    key: string;
  }>;
  senderId: string;
  senderName?: string;
  contactType: CourtesyChannelType | LegalChannelType;
  saveDisabled?: boolean;
  value: string;
  onConfirmClick: (status: 'validated' | 'cancelled') => void;
  resetModifyValue: () => void;
  onDelete: () => void;
  editDisabled?: boolean;
  setContextEditMode?: Dispatch<SetStateAction<boolean>>;
};

const DigitalContactElem = forwardRef<{ editContact: () => void }, Props>(
  (
    {
      fields,
      saveDisabled = false,
      senderId,
      senderName,
      contactType,
      value,
      onConfirmClick,
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

    const mappedChildren = fields.map((f) => (
      <Grid key={f.key} item lg={f.size === 'auto' ? true : 'auto'} xs={12}>
        {!f.isEditable && f.component}
        {f.isEditable && editMode && f.component}
        {f.isEditable && !editMode && (
          <Typography
            sx={{
              wordBreak: 'break-word',
            }}
            id={f.id}
          >
            {(f.component as any).props.value}
          </Typography>
        )}
      </Grid>
    ));

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
        value,
        senderId,
        senderName,
        (status: 'validated' | 'cancelled') => {
          onConfirmClick(status);
          toggleEdit();
        }
      );
    };

    useImperativeHandle(ref, () => ({
      editContact: editHandler,
    }));

    return (
      <Grid container spacing="4" direction="row" alignItems="center">
        {mappedChildren}
        <Grid item lg={12} xs={12} textAlign={'left'}>
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
        </Grid>
      </Grid>
    );
  }
);

export default memo(DigitalContactElem);
