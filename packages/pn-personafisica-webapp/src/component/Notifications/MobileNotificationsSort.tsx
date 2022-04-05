import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CardSort,
  CustomMobileDialog,
  CustomMobileDialogAction,
  CustomMobileDialogContent,
  CustomMobileDialogToggle,
  Sort,
} from '@pagopa-pn/pn-commons';
import {
  Button,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

type Props = {
  sortFields: Array<CardSort>;
  /** Card sort */
  sort: Sort;
  /** The function to be invoked if the user change sorting */
  onChangeSorting: (s: Sort) => void;
};

const MobileNotificationsSort = ({ sortFields, sort, onChangeSorting }: Props) => {
  const { t } = useTranslation('notifiche');
  const [sortValue, setSortValue] = useState(sort ? `${sort.orderBy}-${sort.order}` : '');
  const prevSort = useRef(sortValue);
  const isSorted = sort.orderBy !== '';

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sortSelected = (event.target as HTMLInputElement).value;
    setSortValue(sortSelected);
  };

  const handleConfirmSort = () => {
    const sortField = sortFields.find((f) => f.id === sortValue);
    if (sortField && prevSort.current !== sortField.value) {
      onChangeSorting({ order: sortField.value, orderBy: sortField.field });
      /* eslint-disable-next-line functional/immutable-data */
      prevSort.current = sortField.value;
    }
  };

  const handleCancelSort = () => {
    setSortValue('');
    onChangeSorting({ order: 'asc', orderBy: '' });
  };

  return (
    <CustomMobileDialog>
      <CustomMobileDialogToggle
        sx={{ pr: isSorted ? '10px' : 0 }}
        hasCounterBadge
        bagdeCount={isSorted ? 1 : 0}
      >
        {t('sort.title')}
      </CustomMobileDialogToggle>
      <CustomMobileDialogContent title={t('sort.title')}>
        <DialogContent>
          <RadioGroup
            aria-labelledby={t('sort.options')}
            name="radio-buttons-group"
            onChange={handleChange}
            value={sortValue}
          >
            {sortFields.map((f) => (
              <FormControlLabel key={f.id} value={f.id} control={<Radio aria-label={f.label}/>} label={f.label} />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <CustomMobileDialogAction closeOnClick>
            <Button variant="outlined" onClick={handleConfirmSort}>
              {t('sort.title')}
            </Button>
          </CustomMobileDialogAction>
          <CustomMobileDialogAction closeOnClick>
            <Button onClick={handleCancelSort}>{t('sort.cancel')}</Button>
          </CustomMobileDialogAction>
        </DialogActions>
      </CustomMobileDialogContent>
    </CustomMobileDialog>
  );
};

export default MobileNotificationsSort;
