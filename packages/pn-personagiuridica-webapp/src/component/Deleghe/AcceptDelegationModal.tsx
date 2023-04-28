import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { CodeModal, useIsMobile } from '@pagopa-pn/pn-commons';

import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';

type Props = {
  isEditMode: boolean;
  open: boolean;
  name: string;
  handleCloseAcceptModal: () => void;
  handleConfirm: (code: Array<string>, groups: Array<{ id: string; name: string }>) => void;
};

const AcceptDelegationModal: React.FC<Props> = ({
  isEditMode,
  open,
  name,
  handleCloseAcceptModal,
  handleConfirm,
}) => {
  const [step, setStep] = useState<0 | 1>(isEditMode ? 1 : 0);
  const [associateGroup, setAssociateGroup] = useState(false);
  const [groupForm, setGroupForm] = useState<{
    touched: boolean;
    value: Array<{ id: string; name: string }>;
  }>({
    touched: false,
    value: [],
  });
  const [groupInputValue, setGroupInputValue] = useState('');
  const [code, setCode] = useState<Array<string>>([]);
  const { t } = useTranslation(['deleghe']);
  const isMobile = useIsMobile();
  const textPosition = useMemo(() => (isMobile ? 'center' : 'left'), [isMobile]);
  const groups = useAppSelector((state: RootState) => state.delegationsState.groups);

  const getOptionLabel = (option: { name: string; id: string }) => option.name || '';
  const renderOption = (props: any, option: { name: string; id: string }) => (
    <li {...props}>{option.name}</li>
  );

  const handleFirstStepConfirm = (code: Array<string>) => {
    setStep(1);
    setCode(code);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const radioSelection = (event.target as HTMLInputElement).value;
    setAssociateGroup(radioSelection !== 'no-group');
    if (radioSelection === 'no-group') {
      setGroupForm({ value: [], touched: false });
    }
  };

  const handleClose = () => {
    setGroupForm({ value: [], touched: false });
    setCode([]);
    if (!isEditMode) {
      setStep(0);
    }
    handleCloseAcceptModal();
  };

  const handleBack = () => {
    setStep(0);
  };

  if (step === 0) {
    return (
      <CodeModal
        title={t('deleghe.accept_title')}
        subtitle={t('deleghe.accept_description', { name })}
        open={open}
        initialValues={code.length ? code : new Array(5).fill('')}
        handleClose={handleClose}
        cancelCallback={handleClose}
        cancelLabel={t('button.annulla', { ns: 'common' })}
        confirmCallback={handleFirstStepConfirm}
        confirmLabel={t('deleghe.accept')}
        codeSectionTitle={t('deleghe.verification_code')}
      ></CodeModal>
    );
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      data-testid="groupDialog"
    >
      <DialogTitle id="dialog-title" sx={{ textAlign: textPosition }}>
        {t('deleghe.associate-groups-title')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description" sx={{ textAlign: textPosition }}>
          {t('deleghe.associate-groups-subtitle')}
        </DialogContentText>
        <Divider sx={{ margin: '20px 0' }} />
        <FormControl>
          <RadioGroup
            aria-label={t('deleghe.associate-group')}
            defaultValue="no-group"
            name="radio-buttons-group"
            onChange={handleChange}
          >
            <FormControlLabel
              value="no-group"
              control={<Radio data-testid="no-group" />}
              label={t('deleghe.no-group')}
            />
            <FormControlLabel
              value="associate-group"
              control={<Radio data-testid="associate-group" />}
              label={t('deleghe.associate-group')}
            />
          </RadioGroup>
        </FormControl>
        {associateGroup && (
          <Autocomplete
            id="groups"
            size="small"
            fullWidth
            options={groups}
            disableCloseOnSelect
            multiple
            noOptionsText={t('deleghe.table.no-group-found')}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={renderOption}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('deleghe.select-group')}
                placeholder={t('deleghe.select-group')}
                name="groups"
                error={groupForm.touched && groupForm.value.length === 0}
                helperText={
                  groupForm.touched && groupForm.value.length === 0
                    ? t('required-field', { ns: 'common' })
                    : ''
                }
              />
            )}
            value={groupForm.value}
            onChange={(_event: any, newValue: Array<{ id: string; name: string }>) =>
              setGroupForm({ value: newValue, touched: true })
            }
            data-testid="groups"
            inputValue={groupInputValue}
            onInputChange={(_event, newInputValue) => setGroupInputValue(newInputValue)}
            sx={{ my: 2 }}
          />
        )}
      </DialogContent>
      <DialogActions
        disableSpacing={isMobile}
        sx={{
          textAlign: textPosition,
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        <Button
          variant="outlined"
          onClick={isEditMode ? handleClose : handleBack}
          fullWidth={isMobile}
          data-testid="groupCancelButton"
        >
          {isEditMode
            ? t('button.annulla', { ns: 'common' })
            : t('button.indietro', { ns: 'common' })}
        </Button>
        <Button
          variant="contained"
          data-testid="groupConfirmButton"
          onClick={() => handleConfirm(code, groupForm.value)}
          disabled={groupForm.value.length === 0 && associateGroup}
          fullWidth={isMobile}
          sx={{ marginTop: isMobile ? '10px' : 0 }}
        >
          {t('deleghe.accept')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AcceptDelegationModal;
