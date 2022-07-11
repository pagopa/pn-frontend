import PhysicalAddress from '../PhysicalAddress';
import { render } from '../../../../__test__/test-utils';
import { formTestErrors, formTestTouched, formTestValues } from './test-utils';

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

    expect(result.container).toHaveTextContent(/Presso/i);
    expect(result.container).toHaveTextContent(/Stato*/i);
    expect(result.container).toHaveTextContent(/Indirizzo*/i);
    expect(result.container).toHaveTextContent(/Numero civico*/i);
    expect(result.container).toHaveTextContent(/Codice postale*/i);
    expect(result.container).toHaveTextContent(/Comune*/i);
    expect(result.container).toHaveTextContent(/Località/i);
    expect(result.container).toHaveTextContent(/Provincia*/i);
    expect(result.container).toHaveTextContent(/Note aggiuntive \(scala, piano\)/i);
  });
});
