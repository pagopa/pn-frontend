import { PropsWithChildren, useRef, useState } from 'react';

import {
  Button,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

import { CardSort } from '../../../models/PnCard';
import { Sort } from '../../../models/PnTable';
import CustomMobileDialog from '../../CustomMobileDialog/CustomMobileDialog';
import CustomMobileDialogAction from '../../CustomMobileDialog/CustomMobileDialogAction';
import CustomMobileDialogContent from '../../CustomMobileDialog/CustomMobileDialogContent';
import CustomMobileDialogToggle from '../../CustomMobileDialog/CustomMobileDialogToggle';

type Props<T> = {
  /** label to show for the sort button */
  title: string;
  /** label to shoe for the options title */
  optionsTitle: string;
  /** label of the cancel button */
  cancelLabel: string;
  /** localized ascending label */
  ascLabel: string;
  /** localized descending label */
  dscLabel: string;
  /** current sort */
  sort: Sort<T>;
  /** list of available sort fields */
  sortFields: Array<{ id: keyof T; label: string }>;
  /** the function to be invoked if the user change sorting */
  onChangeSorting: (s: Sort<T>) => void;
};

const SmartSort = <T,>({
  title,
  optionsTitle,
  cancelLabel,
  ascLabel,
  dscLabel,
  sort,
  sortFields,
  onChangeSorting,
}: PropsWithChildren<Props<T>>) => {
  const [sortValue, setSortValue] = useState(
    sort.orderBy ? `${sort.orderBy.toString()}-${sort.order}` : ''
  );
  const prevSort = useRef<string>(sortValue);
  const isSorted = sortValue !== '';
  const fields = sortFields.reduce((arr, item) => {
    /* eslint-disable functional/immutable-data */
    arr.push(
      {
        id: `${item.id.toString()}-asc`,
        label: `${item.label} ${ascLabel}`,
        field: item.id,
        value: 'asc',
      },
      {
        id: `${item.id.toString()}-desc`,
        label: `${item.label} ${dscLabel}`,
        field: item.id,
        value: 'desc',
      }
    );
    /* eslint-enable functional/immutable-data */
    return arr;
  }, [] as Array<CardSort<T>>);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sortSelected = (event.target as HTMLInputElement).value;
    setSortValue(sortSelected);
  };

  const handleConfirmSort = () => {
    const sortField = fields.find((f) => f.id === sortValue);
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
            {fields.map((f) => (
              <FormControlLabel key={f.id} value={f.id} control={<Radio />} label={f.label} />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <CustomMobileDialogAction closeOnClick>
            <Button
              id="confirm-button"
              variant="outlined"
              onClick={handleConfirmSort}
              data-testid="confirmButton"
              disabled={!isSorted}
            >
              {title}
            </Button>
          </CustomMobileDialogAction>
          <CustomMobileDialogAction closeOnClick>
            <Button onClick={handleCancelSort} data-testid="cancelButton">
              {cancelLabel}
            </Button>
          </CustomMobileDialogAction>
        </DialogActions>
      </CustomMobileDialogContent>
    </CustomMobileDialog>
  );
};

export default SmartSort;
