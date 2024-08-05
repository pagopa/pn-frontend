import {
  Dispatch,
  Fragment,
  ReactNode,
  SetStateAction,
  forwardRef,
  memo,
  useImperativeHandle,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { CourtesyChannelType, LegalChannelType } from '../../models/contacts';
import { useDigitalContactsCodeVerificationContext } from './DigitalContactsCodeVerification.context';

type Props = {
  field: {
    component: ReactNode;
    id: string;
    key: string;
  };
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
      field,
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
      <>
        {
          <Fragment key={field.key}>
            {editMode && field.component}
            {!editMode && (
              <Typography
                sx={{
                  wordBreak: 'break-word',
                }}
                id={field.id}
              >
                {(field.component as any).props.value}
              </Typography>
            )}
          </Fragment>
        }
        {!editMode ? (
          <>
            <ButtonNaked
              color="primary"
              onClick={toggleEdit}
              sx={{ marginRight: '10px' }}
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
              sx={{ marginRight: '10px' }}
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
