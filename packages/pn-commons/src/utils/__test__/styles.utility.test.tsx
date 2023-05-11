import { buttonNakedInheritStyle } from '../styles.utility';
import { ButtonNaked } from '@pagopa/mui-italia';
import { render } from '../../test-utils';
import React from 'react';

describe('Styles utilities test', () => {

  it('buttonNakedInheritStyle test', () => {
    const expetedResultStyle =
      "color: 'inherit', border: 'none', font-size: 'inherit', font-family: 'inherit', background: 'inherit', margin: 0, padding: 0, font-weight: 'inherit', text-align: 'inherit', display: 'initial'";
    const result = render(<ButtonNaked sx={buttonNakedInheritStyle}>Mocked-button</ButtonNaked>);
    expect(result.container).toHaveStyle(expetedResultStyle);
  });
});
