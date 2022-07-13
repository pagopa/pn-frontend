import { useState, useRef } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

import { CardSort } from '../../types';
import { Sort } from '../../types';
import CustomMobileDialog from '../CustomMobileDialog/CustomMobileDialog';
import CustomMobileDialogToggle from '../CustomMobileDialog/CustomMobileDialogToggle';
import CustomMobileDialogContent from '../CustomMobileDialog/CustomMobileDialogContent';
import CustomMobileDialogAction from '../CustomMobileDialog/CustomMobileDialogAction';

type Props = {
  sortFields: Array<CardSort>;
  /** Card sort */
  sort: Sort;
  /** The function to be invoked if the user change sorting */
  onChangeSorting: (s: Sort) => void;
  /** Title of the dialog */
  title: string;
  /** Title of the options section */
  optionsTitle: string;
  /** Label of the cancel button */
  cancelLabel: string;

};

const MobileNotificationsSort = ({ sortFields, sort, onChangeSorting, title, optionsTitle, cancelLabel }: Props) => {
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
        sx={{ pr: isSorted ? '10px' : 0, height: '24px' }}
        hasCounterBadge
        bagdeCount={isSorted ? 1 : 0}
      >
        {title}
      </CustomMobileDialogToggle>
      <CustomMobileDialogContent title={title}>
        <DialogContent>
          <RadioGroup
            aria-labelledby={optionsTitle}
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
              {title}
            </Button>
          </CustomMobileDialogAction>
          <CustomMobileDialogAction closeOnClick>
            <Button onClick={handleCancelSort}>{cancelLabel}</Button>
          </CustomMobileDialogAction>
        </DialogActions>
      </CustomMobileDialogContent>
    </CustomMobileDialog>
  );
};

export default MobileNotificationsSort;
