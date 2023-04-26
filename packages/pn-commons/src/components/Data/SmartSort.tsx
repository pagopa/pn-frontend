import { PropsWithChildren, useRef, useState } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

import CustomMobileDialog from '../CustomMobileDialog/CustomMobileDialog';
import CustomMobileDialogContent from '../CustomMobileDialog/CustomMobileDialogContent';
import CustomMobileDialogToggle from '../CustomMobileDialog/CustomMobileDialogToggle';
import CustomMobileDialogAction from '../CustomMobileDialog/CustomMobileDialogAction';
import { CardSort, Sort } from '../../types';

type Props<TSortOption> = {
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
  sort: Sort<TSortOption>;
  /** list of available sort fields */
  sortFields: Array<{ id: string; label: string }>;
  /** the function to be invoked if the user change sorting */
  onChangeSorting: (s: Sort<TSortOption>) => void;
};

const SmartSort = <TSortOption extends string>({
  title,
  optionsTitle,
  cancelLabel,
  ascLabel,
  dscLabel,
  sort,
  sortFields,
  onChangeSorting,
}: PropsWithChildren<Props<TSortOption>>) => {
  const [sortValue, setSortValue] = useState(sort.orderBy ? `${sort.orderBy}-${sort.order}` : '');
  const prevSort = useRef<string>(sortValue);
  const isSorted = sortValue !== '';
  const fields = sortFields.reduce((arr, item) => {
    /* eslint-disable functional/immutable-data */
    arr.push(
      {
        id: `${item.id}-asc`,
        label: `${item.label} ${ascLabel}`,
        field: item.id as TSortOption,
        value: 'asc',
      },
      {
        id: `${item.id}-desc`,
        label: `${item.label} ${dscLabel}`,
        field: item.id as TSortOption,
        value: 'desc',
      }
    );
    /* eslint-enable functional/immutable-data */
    return arr;
  }, [] as Array<CardSort<TSortOption>>);

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
    onChangeSorting({ order: 'asc', orderBy: '' as TSortOption });
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
              <FormControlLabel
                key={f.id}
                value={f.id}
                control={<Radio aria-label={f.label} />}
                label={f.label}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <CustomMobileDialogAction closeOnClick>
            <Button
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
