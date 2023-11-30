import { Children, ReactElement, isValidElement } from 'react';

import { Card } from '@mui/material';

import PnCardActions from './PnCardActions';
import PnCardContent from './PnCardContent';
import PnCardHeader from './PnCardHeader';

type Props = {
  testId?: string;
  children:
    | ReactElement
    | [ReactElement, ReactElement]
    | [ReactElement, ReactElement, ReactElement];
};

const PnCard: React.FC<Props> = ({ testId = 'itemCard', children }) => {
  // eslint-disable-next-line functional/no-let
  let header = 0;
  // eslint-disable-next-line functional/no-let
  let contents = 0;
  // eslint-disable-next-line functional/no-let
  let actions = 0;

  // check on children
  // PnCard can have only one child of type PnCardHeader, only one child of type PnCardContent and only one child of type PnCardActions
  // the cast ReactElement | [ReactElement, ReactElement] | [ReactElement, ReactElement, ReactElement] of property children
  // ensures that the PnCard can have two defined children (not null and not undefined)
  Children.forEach(children, (element) => {
    if (!isValidElement(element)) {
      return;
    }
    if (
      element.type !== PnCardHeader &&
      element.type !== PnCardContent &&
      element.type !== PnCardActions
    ) {
      throw new Error(
        'PnCard must have only children of type PnCardHeader, PnCardContent and PnCardActions'
      );
    }
    if (element.type === PnCardHeader) {
      header++;
    }
    if (element.type === PnCardContent) {
      contents++;
    }
    if (element.type === PnCardActions) {
      actions++;
    }
  });

  if (contents === 0 || contents > 1) {
    throw new Error('PnCard must have one child of type PnCardContent');
  }

  if (header > 1) {
    throw new Error('PnCard must have one child of type PnCardHeader');
  }

  if (actions > 1) {
    throw new Error('PnCard must have one child of type PnCardActions');
  }

  return (
    <Card
      raised
      data-testid={testId}
      sx={{
        mb: 2,
        p: 3,
      }}
    >
      {children}
    </Card>
  );
};

export default PnCard;
