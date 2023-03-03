import React from 'react';

import { render } from '../../test-utils';
import CustomTableRow from '../CustomTableRow';

describe('CustomTableRow Component', () => {
  it('renders CustomTableRow - no value', () => {
    const result = render(
      <table>
        <tbody>
          <CustomTableRow label="Name" />
        </tbody>
      </table>
    );
    const label = result.getByTestId('label');
    const value = result.getByTestId('value');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Name');
    expect(value).toBeInTheDocument();
    expect(value).toHaveTextContent('-');
  });

  it('renders CustomTableRow - with value', () => {
    const result = render(
      <table>
        <tbody>
          <CustomTableRow label="Name" value="Mario" />
        </tbody>
      </table>
    );
    const label = result.getByTestId('label');
    const value = result.getByTestId('value');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Name');
    expect(value).toBeInTheDocument();
    expect(value).toHaveTextContent('Mario');
  });
});
