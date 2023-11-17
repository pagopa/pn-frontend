import React from 'react';
import { vi } from 'vitest';

import { fireEvent, render } from '../../../__test__/test-utils';
import FormTextField from '../FormTextField';

const mockSetValue = vi.fn();
const mockBlur = vi.fn();

const keyName = 'testKey';

const formTestValues = {
  testKey: 'someText',
  testKey2: 'anotherText',
  testKey3: 'thirdText',
};

const formTestTouched = {
  testKey: true,
};

const formTestErrors = {
  testKey: 'error',
};

describe('FormTextField Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders the component', () => {
    const { container } = render(
      <FormTextField
        keyName={keyName}
        label={'testLabel'}
        values={formTestValues}
        touched={{}}
        errors={{}}
        setFieldValue={mockSetValue}
        width={4}
      />
    );

    expect(container).toHaveTextContent(/testLabel/i);
    const input = container.querySelector(`input[name="${keyName}"]`);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(formTestValues[keyName]);
  });

  it('renders the component with an error', () => {
    const { container } = render(
      <FormTextField
        keyName={keyName}
        label={'testLabel'}
        values={formTestValues}
        touched={formTestTouched}
        errors={formTestErrors}
        setFieldValue={mockSetValue}
        handleBlur={mockBlur}
      />
    );

    const helperText = container.querySelector(`#${keyName}-helper-text`);
    expect(helperText).toHaveTextContent(/error/i);
  });

  it('tests the onChange function', async () => {
    const { container } = render(
      <FormTextField
        keyName={keyName}
        label={'testLabel'}
        values={formTestValues}
        touched={formTestTouched}
        errors={formTestErrors}
        setFieldValue={mockSetValue}
        handleBlur={mockBlur}
        width={4}
      />
    );
    const input = container.querySelector(`input[name="${keyName}"]`);
    fireEvent.change(input!, { target: { value: 'anotherText' } });
    expect(mockSetValue).toHaveBeenCalledTimes(1);
    expect(mockSetValue).toHaveBeenCalledWith(keyName, 'anotherText');
  });

  it('tests the onBlur function', async () => {
    const { container } = render(
      <FormTextField
        keyName={keyName}
        label={'testLabel'}
        values={formTestValues}
        touched={formTestTouched}
        errors={formTestErrors}
        setFieldValue={mockSetValue}
        handleBlur={mockBlur}
        width={4}
      />
    );
    const input = container.querySelector(`input[name="${keyName}"]`);
    fireEvent.focus(input!);
    fireEvent.blur(input!);
    expect(mockBlur).toBeCalledTimes(1);
  });
});
