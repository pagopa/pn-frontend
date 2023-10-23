import React from 'react';

import { CardElement } from '../../../../models';
import { render } from '../../../../test-utils';
import ItemsCard from '../../ItemsCard';
import ItemsCardBody from '../ItemsCardBody';
import ItemsCardContent from '../ItemsCardContent';
import ItemsCardContents from '../ItemsCardContents';

const cardBody: CardElement = {
  id: 'mocked-column-id',
  label: 'mocked-column-name',
  getLabel: (value: string) => value,
};

describe('ItemsCardAction', () => {
  it('render component', () => {
    const { container } = render(
      <ItemsCard>
        <ItemsCardBody>
          <ItemsCardContents>
            <ItemsCardContent body={cardBody}>mocked-card-content-1</ItemsCardContent>
          </ItemsCardContents>
        </ItemsCardBody>
      </ItemsCard>
    );
    expect(container).toHaveTextContent('mocked-column-namemocked-card-content-1');
  });
});
