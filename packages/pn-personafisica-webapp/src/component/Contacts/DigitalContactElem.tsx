import { forwardRef, Fragment, ReactChild, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Dialog, Typography, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useIsMobile } from '@pagopa-pn/pn-commons';

type Props = {
  fields: Array<{
    component: ReactChild;
    id: string;
    isEditable?: boolean;
    size: 'auto' | 'variable';
  }>;
  saveDisabled?: boolean;
  removeModalTitle: string;
  removeModalBody: string;
  onRemoveClick: () => void;
};

const DigitalContactElem = forwardRef(
  (
    { fields, saveDisabled = false, onRemoveClick, removeModalTitle, removeModalBody }: Props,
    ref
  ) => {
    const { t } = useTranslation(['common']);
    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const isMobile = useIsMobile();

    const mappedChildren = fields.map((f) => (
      <Grid key={f.id} item lg={f.size === 'auto' ? true : 'auto'} xs={12}>
        {!f.isEditable && f.component}
        {f.isEditable && editMode && f.component}
        {f.isEditable && !editMode && <Typography>{(f.component as any).props.value}</Typography>}
      </Grid>
    ));

    const toggleEdit = () => {
      setEditMode(!editMode);
    };

    const handleModalClose = () => {
      setShowModal(false);
    };

    const removeHandler = () => {
      setShowModal(true);
    };

    const confirmHandler = () => {
      handleModalClose();
      onRemoveClick();
    };

    // export toggleEdit method
    useImperativeHandle(ref, () => ({
      toggleEdit,
    }));

    return (
      <Fragment>
        <Grid container spacing={4} direction="row" alignItems="center">
          {!isMobile && (
            <Grid item lg="auto">
              <CloseIcon
                sx={{ cursor: 'pointer', position: 'relative', top: '4px', color: 'action.active' }}
                onClick={removeHandler}
              />
            </Grid>
          )}
          {mappedChildren}
          {!editMode && (
            <Grid item lg={2} xs={12} textAlign={isMobile ? 'left' : 'right'}>
              {isMobile && (
                <ButtonNaked color="primary" sx={{ marginRight: '10px' }} onClick={removeHandler}>
                  {t('button.rimuovi')}
                </ButtonNaked>
              )}
              <ButtonNaked color="primary" onClick={toggleEdit}>
                {t('button.modifica')}
              </ButtonNaked>
            </Grid>
          )}
          {editMode && (
            <Grid item lg={2} xs={12} textAlign={isMobile ? 'left' : 'right'}>
              <ButtonNaked color="primary" type="submit" disabled={saveDisabled}>
                {t('button.salva')}
              </ButtonNaked>
            </Grid>
          )}
        </Grid>
        <Dialog
          open={showModal}
          onClose={handleModalClose}
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
        >
          <DialogTitle id="dialog-title">{removeModalTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText id="dialog-description">{removeModalBody}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose} variant="outlined">{t('button.annulla')}</Button>
            <Button onClick={confirmHandler} variant="contained">{t('button.conferma')}</Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
);

export default DigitalContactElem;
