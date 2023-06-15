import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
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
import {
  AppResponse,
  AppResponsePublisher,
  CodeModal,
  PnAutocomplete,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import { ServerResponseErrorCode } from '../../utils/AppError/types';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { GroupStatus } from '../../models/groups';

type Props = {
  isEditMode: boolean;
  open: boolean;
  name: string;
  currentGroups?: Array<{ id: string; name: string }>;
  handleCloseAcceptModal: () => void;
  handleConfirm: (code: Array<string>, groups: Array<{ id: string; name: string }>) => void;
};

const AcceptDelegationModal: React.FC<Props> = ({
  isEditMode,
  open,
  name,
  currentGroups = [],
  handleCloseAcceptModal,
  handleConfirm,
}) => {
  const hasGroupsAssociated = isEditMode && currentGroups?.length > 0;
  const [step, setStep] = useState<0 | 1>(isEditMode ? 1 : 0);
  const [associateGroup, setAssociateGroup] = useState(hasGroupsAssociated);
  const [groupForm, setGroupForm] = useState<{
    touched: boolean;
    value: Array<{ id: string; name: string }>;
  }>({
    touched: false,
    value: hasGroupsAssociated ? currentGroups : [],
  });
  const [groupInputValue, setGroupInputValue] = useState('');
  const [code, setCode] = useState<Array<string>>([]);
  const [error, setError] = useState<{ title: string; content: string }>();
  const { t } = useTranslation(['deleghe']);
  const isMobile = useIsMobile();
  const textPosition = useMemo(() => (isMobile ? 'center' : 'left'), [isMobile]);
  const groups = useAppSelector((state: RootState) => state.delegationsState.groups);

  const getOptionLabel = (option: { name: string; id: string }) => option.name || '';
  const renderOption = (props: any, option: { name: string; id: string }) => (
    <li {...props}>{option.name}</li>
  );

  const handleFirstStepConfirm = (code: Array<string>) => {
    if (groups.length) {
      setStep(1);
      setCode(code);
      return;
    }
    setError(undefined);
    handleConfirm(code, []);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const radioSelection = (event.target as HTMLInputElement).value;
    setAssociateGroup(radioSelection !== 'no-group');
    if (radioSelection === 'no-group') {
      setGroupForm({ value: [], touched: false });
    }
  };

  const handleClose = () => {
    setGroupForm({
      value: hasGroupsAssociated ? currentGroups : [],
      touched: false,
    });
    setCode([]);
    if (!isEditMode) {
      setStep(0);
    }
    handleCloseAcceptModal();
  };

  const handleBack = () => {
    setStep(0);
  };

  const handleAcceptanceError = useCallback((responseError: AppResponse) => {
    // if code is invalid, pass the error to the AcceptModal and after to the CodeModal
    const error = responseError.errors ? responseError.errors[0] : null;
    if (error?.code === ServerResponseErrorCode.PN_MANDATE_INVALIDVERIFICATIONCODE) {
      setError(error?.message);
    }
    return true;
  }, []);

  useEffect(() => {
    // code validation is done only during acceptance and not during update
    if (!isEditMode) {
      AppResponsePublisher.error.subscribe('acceptDelegation', handleAcceptanceError);
    }

    return () => {
      if (!isEditMode) {
        AppResponsePublisher.error.unsubscribe('acceptDelegation', handleAcceptanceError);
      }
    };
  }, [handleAcceptanceError]);

  if (step === 0) {
    return (
      <CodeModal
        title={t('deleghe.accept_title')}
        subtitle={t('deleghe.accept_description', { name })}
        open={open}
        initialValues={code.length ? code : new Array(5).fill('')}
        cancelCallback={handleClose}
        cancelLabel={t('button.annulla', { ns: 'common' })}
        confirmCallback={handleFirstStepConfirm}
        confirmLabel={t('deleghe.accept-delegation')}
        codeSectionTitle={t('deleghe.verification_code')}
        errorTitle={error?.title}
        errorMessage={error?.content}
        hasError={Boolean(error)}
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
        {isEditMode ? t('deleghe.edit-groups-title') : t('deleghe.associate-groups-title')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description" sx={{ textAlign: textPosition }}>
          {t('deleghe.associate-groups-subtitle')}
        </DialogContentText>
        <Divider sx={{ margin: '20px 0' }} />
        <FormControl>
          <RadioGroup
            aria-label={t('deleghe.associate-group')}
            defaultValue={hasGroupsAssociated ? 'associate-group' : 'no-group'}
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
          <PnAutocomplete
            id="groups"
            size="small"
            fullWidth
            options={groups.filter((group) => group.status === GroupStatus.ACTIVE)}
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
          {t('button.conferma', { ns: 'common' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AcceptDelegationModal;
