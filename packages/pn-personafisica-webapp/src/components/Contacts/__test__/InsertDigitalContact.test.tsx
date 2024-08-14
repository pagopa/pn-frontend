import { ChangeEvent, useState } from 'react';
import { vi } from 'vitest';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';
import { waitFor } from '@testing-library/react';

import { fireEvent, render } from '../../../__test__/test-utils';
import InsertDigitalContact from '../InsertDigitalContact';

const mockOnChangeCbk = vi.fn();
const mockEditConfirmCbk = vi.fn();

describe('InsertDigitalContact Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('renders component - empty and disabled', () => {
    // render component
    const { container } = render(
      <InsertDigitalContact
        label="Mocked label"
        inputProps={{
          id: 'contact',
          name: 'contact',
        }}
        insertDisabled
        buttonLabel="Button"
      />
    );
    const label = getById(container, 'contact-label');
    expect(label).toHaveTextContent('Mocked label');
    const input = getById(container, 'contact');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
    const button = getById(container, 'contact-button');
    expect(button).toHaveTextContent('Button');
    expect(button).toBeDisabled();
  });

  it('renders component - filled and enabled', () => {
    // render component
    const { container } = render(
      <InsertDigitalContact
        label="Mocked label"
        inputProps={{
          id: 'contact',
          name: 'contact',
          value: 'mocked@pec.it',
        }}
        insertDisabled={false}
        buttonLabel="Button"
      />
    );
    const label = getById(container, 'contact-label');
    expect(label).toHaveTextContent('Mocked label');
    const input = getById(container, 'contact');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('mocked@pec.it');
    const button = getById(container, 'contact-button');
    expect(button).toHaveTextContent('Button');
    expect(button).toBeEnabled();
  });

  it('edit value', async () => {
    const Component = () => {
      const [value, setValue] = useState('mocked@pec.it');
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mockEditConfirmCbk();
          }}
        >
          <InsertDigitalContact
            label="Mocked label"
            inputProps={{
              id: 'contact',
              name: 'contact',
              value,
              onChange: (e: ChangeEvent<HTMLInputElement>) => {
                setValue(e.target.value);
                mockOnChangeCbk();
              },
            }}
            insertDisabled={false}
            buttonLabel="Button"
          />
        </form>
      );
    };
    // render component
    const { container } = render(<Component />);
    const label = getById(container, 'contact-label');
    expect(label).toHaveTextContent('Mocked label');
    const input = getById(container, 'contact');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('mocked@pec.it');
    fireEvent.change(input, { target: { value: 'mocked-modified@pec.it' } });
    await waitFor(() => expect(input).toHaveValue('mocked-modified@pec.it'));
    expect(mockOnChangeCbk).toHaveBeenCalledTimes(1);
    const button = getById(container, 'contact-button');
    fireEvent.click(button);
    expect(mockEditConfirmCbk).toHaveBeenCalledTimes(1);
  });
});
