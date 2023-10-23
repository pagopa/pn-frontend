import React from 'react';

import { CardElement } from '../../../../models';
import { render } from '../../../../test-utils';
import ItemsCardBody from '../ItemsCardBody';
import ItemsCardContent from '../ItemsCardContent';
import ItemsCardContents from '../ItemsCardContents';

const mockBody: CardElement = {
  id: 'column-1',
  label: 'Column 1',
  getLabel: (value: string) => value,
};

describe('ItemsCardBody', () => {
  it('render component', () => {
    const { container } = render(
      <ItemsCardBody>
        <ItemsCardContents>
          <ItemsCardContent body={mockBody}>mock-items-card-body</ItemsCardContent>
        </ItemsCardContents>
      </ItemsCardBody>
    );
    expect(container).toHaveTextContent('mock-items-card-body');
  });
});
