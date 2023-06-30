import { fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../../../__test__/test-utils';
import FormTextField from '../FormTextField';
import { formTestErrors, formTestTouched, formTestValues } from './test-utils';

const mockSetValue = jest.fn();
const mockBlur = jest.fn();

describe('FormTextField Component', () => {
  it('renders the component', () => {
    const result = render(
      <FormTextField
        keyName={'testKey'}
        label={'testLabel'}
        values={formTestValues}
        touched={{}}
        errors={{}}
        setFieldValue={mockSetValue}
        width={4}
      />
    );

    expect(result.container).toHaveTextContent(/testLabel/i);
  });

  it('renders the component with an error', () => {
    const result = render(
      <FormTextField
        keyName={'testKey'}
        label={'testLabel'}
        values={formTestValues}
        touched={formTestTouched}
        errors={formTestErrors}
        setFieldValue={mockSetValue}
        handleBlur={mockBlur}
      />
    );

    expect(result.container).toHaveTextContent(/error/i);
  });

  it('renders the component with an error - not touched but with value', () => {
    const result = render(
      <FormTextField
        keyName={'testKey'}
        label={'testLabel'}
        values={formTestValues}
        touched={{}}
        errors={formTestErrors}
        setFieldValue={mockSetValue}
        handleBlur={mockBlur}
      />
    );

    expect(result.container).toHaveTextContent(/error/i);
  });

  it('tests the onChange function', async () => {
    const result = render(
      <FormTextField
        keyName={'testKey'}
        label={'testLabel'}
        values={formTestValues}
        touched={formTestTouched}
        errors={formTestErrors}
        setFieldValue={mockSetValue}
        handleBlur={mockBlur}
        width={4}
      />
    );
    const input = result.container.querySelector(`input[name="testKey"]`);
    fireEvent.change(input!, { target: { value: 's' } });
    await waitFor(() => {
      expect(input).toHaveValue('someText');
    });
    expect(mockSetValue).toHaveBeenCalled();
  });
});
