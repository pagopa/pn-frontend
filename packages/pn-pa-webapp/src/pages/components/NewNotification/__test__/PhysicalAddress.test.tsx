import PhysicalAddress from '../PhysicalAddress';
import { render } from '../../../../__test__/test-utils';
import { formTestErrors, formTestTouched, formTestValues } from './test-utils';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const mockSetValue = jest.fn();

describe('PhysicalAddress Component', () => {
  it('renders the component', () => {
    const result = render(
      <PhysicalAddress
        values={formTestValues}
        touched={formTestTouched}
        errors={formTestErrors}
        recipient={1}
        setFieldValue={mockSetValue}
      />
    );

    expect(result.container).toHaveTextContent(/at/i);
    expect(result.container).toHaveTextContent(/foreign-state*/i);
    expect(result.container).toHaveTextContent(/address*/i);
    expect(result.container).toHaveTextContent(/house-number*/i);
    expect(result.container).toHaveTextContent(/zip*/i);
    expect(result.container).toHaveTextContent(/municipality*/i);
    expect(result.container).toHaveTextContent(/municipality-details/i);
    expect(result.container).toHaveTextContent(/province*/i);
    expect(result.container).toHaveTextContent(/address-details/i);
  });
});
