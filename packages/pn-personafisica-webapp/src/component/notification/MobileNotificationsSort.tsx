import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CardSort, CustomMobileDialog, Sort } from '@pagopa-pn/pn-commons';
import { Button, FormControlLabel, Radio, RadioGroup } from '@mui/material';

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

  const dialogActions = [
    {
      key: 'confirm',
      component: (
        <Button variant="outlined" onClick={handleConfirmSort}>
          {t('sort.title')}
        </Button>
      ),
      closeOnClick: true,
    },
    {
      key: 'cancel',
      component: <Button onClick={handleCancelSort}>{t('sort.cancel')}</Button>,
      closeOnClick: true,
    },
  ];

  const dialogButton = <Button sx={{ pr: isSorted ? '10px' : 0 }}>{t('sort.title')}</Button>;

  return (
    <CustomMobileDialog title={t('sort.title')} actions={dialogActions} button={dialogButton} hasCounterBadge bagdeCount={isSorted ? 1 : 0}>
      <RadioGroup
        aria-labelledby={t('sort.options')}
        name="radio-buttons-group"
        onChange={handleChange}
        value={sortValue}
      >
        {sortFields.map((f) => (
          <FormControlLabel key={f.id} value={f.id} control={<Radio />} label={f.label} />
        ))}
      </RadioGroup>
    </CustomMobileDialog>
  );
};

export default MobileNotificationsSort;
