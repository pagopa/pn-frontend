import { forwardRef, ReactChild, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Typography } from '@mui/material';
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
};

const DigitalContactElem = forwardRef(({ fields, saveDisabled = false }: Props, ref) => {
  const { t } = useTranslation(['common']);
  const [editMode, setEditMode] = useState(false);
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

  // export toggleEdit method
  useImperativeHandle(ref, () => ({
    toggleEdit
  }));

  return (
    <Grid container spacing={4} direction="row" alignItems="center">
      {!isMobile && (
        <Grid item lg="auto">
          <CloseIcon
            sx={{ cursor: 'pointer', position: 'relative', top: '4px', color: 'action.active' }}
          />
        </Grid>
      )}
      {mappedChildren}
      {!editMode && (
        <Grid item lg={2} xs={12} textAlign={isMobile ? 'left' : 'right'}>
          {isMobile && (
            <ButtonNaked color="primary" sx={{ marginRight: '10px' }}>
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
          <ButtonNaked color="primary" type='submit' disabled={saveDisabled}>
            {t('button.salva')}
          </ButtonNaked>
        </Grid>
      )}
    </Grid>
  );
});

export default DigitalContactElem;
