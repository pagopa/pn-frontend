import { fireEvent, waitFor } from '@testing-library/react';

import { render } from '../../../test-utils';
import CodeInput from '../CodeInput';

const handleChangeMock = jest.fn();

const renderComponent = (initialValues: Array<string>) => (
  <CodeInput
    initialValues={initialValues}
    onChange={handleChangeMock}
  />
);

describe('CodeInput Component', () => {
  it('renders CodeInput (empty inputs)', () => {
    // render component
    const result = render(renderComponent(new Array(5).fill('')));
    const codeInputs = result.container.querySelectorAll('input');
    expect(codeInputs).toHaveLength(5);
    codeInputs?.forEach((input) => {
      expect(input).toHaveValue('');
    });
  });

  it('renders CodeInput (filled inputs)', () => {
    // render component
    const result = render(renderComponent(new Array(5).fill('1')));
    const codeInputs = result.container.querySelectorAll('input');
    expect(codeInputs).toHaveLength(5);
    codeInputs?.forEach((input) => {
      expect(input).toHaveValue('1');
    });
  });

  it('handles change event', async () => {
    // render component
    const result = render(renderComponent(new Array(5).fill('')));
    const codeInputs = result.container.querySelectorAll('input');
    fireEvent.change(codeInputs[2], {target: {value: '3'}});
    expect(codeInputs[2]).toHaveValue('3');
    await waitFor(() => {
      expect(handleChangeMock).toBeCalledTimes(2);
    })
  });
});
