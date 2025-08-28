import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
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
  ErrorMessage,
  PnAutocomplete,
  PnDialog,
  PnDialogActions,
  PnDialogContent,
} from '@pagopa-pn/pn-commons';
import SearchIcon from '@mui/icons-material/Search';

import { GroupStatus } from '../../models/groups';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { ServerResponseErrorCode } from '../../utility/AppError/types';

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
  const codeModalRef =
    useRef<{ updateError: (error: ErrorMessage, codeNotValid: boolean) => void }>(null);
  const { t } = useTranslation(['deleghe']);
  const groups = useAppSelector((state: RootState) => state.delegationsState.groups);
  // when there are groups, the codeModal component is unmounted at confirm button click
  // so the updateError call in the handleAcceptanceError has no effect
  // we use the useRef hook to store the value of the error without force re-rendering
  const errorRef = useRef<{ title: string; message: string; hasError: boolean }>({
    title: '',
    message: '',
    hasError: false,
  });

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
    codeModalRef.current?.updateError({ title: '', content: '' }, false);
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
      if (groups.length) {
        // eslint-disable-next-line functional/immutable-data
        errorRef.current.title = error.message.title;
        // eslint-disable-next-line functional/immutable-data
        errorRef.current.message = error.message.content;
        // eslint-disable-next-line functional/immutable-data
        errorRef.current.hasError = true;
      } else {
        codeModalRef.current?.updateError(
          {
            title: error.message.title,
            content: error.message.content,
          },
          true
        );
      }
    }
    return true;
  }, []);

  useEffect(() => {
    // code validation is done only during acceptance and not during update
    if (!isEditMode) {
      AppResponsePublisher.error.subscribe('acceptMandate', handleAcceptanceError);
    }

    return () => {
      if (!isEditMode) {
        AppResponsePublisher.error.unsubscribe('acceptMandate', handleAcceptanceError);
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
        cancelLabel={t('button.indietro', { ns: 'common' })}
        confirmCallback={handleFirstStepConfirm}
        confirmLabel={t('deleghe.accept-delegation')}
        codeSectionTitle={t('deleghe.verification_code')}
        ref={codeModalRef}
        error={errorRef.current}
      />
    );
  }
  return (
    <PnDialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      data-testid="groupDialog"
    >
      <DialogTitle id="dialog-title">
        {isEditMode ? t('deleghe.edit-groups-title') : t('deleghe.associate-groups-title')}
      </DialogTitle>
      <PnDialogContent>
        <DialogContentText id="dialog-description">
          {t('deleghe.associate-groups-subtitle')}
        </DialogContentText>
        <Divider sx={{ my: 2 }} />
        <FormControl>
          <RadioGroup
            aria-label={t('deleghe.associate-group')}
            defaultValue={hasGroupsAssociated ? 'associate-group' : 'no-group'}
            name="radio-buttons-group"
            onChange={handleChange}
          >
            <FormControlLabel
              id="associate-form-group"
              value="no-group"
              control={<Radio id="associate-no-group" data-testid="no-group" />}
              label={t('deleghe.no-group')}
            />
            <FormControlLabel
              id="associate-form-group"
              value="associate-group"
              control={<Radio id="associate-group" data-testid="associate-group" />}
              label={t('deleghe.associate-group')}
            />
          </RadioGroup>
        </FormControl>
        {associateGroup && (
          <PnAutocomplete
            id="input-group"
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
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <SearchIcon sx={{color:'text.secondary'}}/>
                  ),
                }}
              />
            )}
            value={groupForm.value}
            onChange={(_event: any, newValue: Array<{ id: string; name: string }>) =>
              setGroupForm({ value: newValue, touched: true })
            }
            data-testid="groups"
            inputValue={groupInputValue}
            onInputChange={(_event, newInputValue) => setGroupInputValue(newInputValue)}
            sx={{ mt: 2 }}
          />
        )}
      </PnDialogContent>
      <PnDialogActions>
        <Button
          variant="outlined"
          onClick={isEditMode ? handleClose : handleBack}
          data-testid="groupCancelButton"
        >
          {isEditMode
            ? t('button.annulla', { ns: 'common' })
            : t('button.indietro', { ns: 'common' })}
        </Button>
        <Button
          id="group-confirm-button"
          variant="contained"
          data-testid="groupConfirmButton"
          onClick={() => handleConfirm(code, groupForm.value)}
          disabled={groupForm.value.length === 0 && associateGroup}
          autoFocus
        >
          {t('button.conferma', { ns: 'common' })}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default AcceptDelegationModal;
