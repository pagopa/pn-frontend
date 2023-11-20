import { Children, cloneElement, isValidElement } from 'react';

import { Card } from '@mui/material';

import PnCardActions from './PnCardActions';
import PnCardContent from './PnCardContent';
import PnCardHeader from './PnCardHeader';

interface Props {
  testId?: string;
  children: React.ReactNode;
}

const PnCard: React.FC<Props> = ({ testId = 'itemCard', children }) => {
  const header = children
    ? Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === PnCardHeader)
        .map((child) =>
          isValidElement(child)
            ? cloneElement(child, { ...child.props, testId: `${testId}.header` })
            : child
        )
    : [];

  const contents = children
    ? Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === PnCardContent)
        .map((child) =>
          isValidElement(child)
            ? cloneElement(child, { ...child.props, testId: `${testId}.contents` })
            : child
        )
    : [];

  const actions = children
    ? Children.toArray(children)
        .filter((child) => (child as JSX.Element).type === PnCardActions)
        .map((child) =>
          isValidElement(child)
            ? cloneElement(child, { ...child.props, testId: `${testId}.actions` })
            : child
        )
    : [];

  if (header.length === 0 && contents.length === 0 && actions.length === 0) {
    throw new Error('PnCard must have at least one child');
  }

  if (contents.length === 0) {
    throw new Error('PnCard must have at least one child of type PnCardContent');
  }

  if (header.length + contents.length + actions.length < Children.toArray(children).length) {
    throw new Error(
      'PnCard must have only children of type PnCardHeader, PnCardContent and PnCardActions'
    );
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
      {header}
      {contents}
      {actions}
    </Card>
  );
};

export default PnCard;
