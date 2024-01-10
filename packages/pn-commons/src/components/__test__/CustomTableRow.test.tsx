import { render } from '../../test-utils';
import CustomTableRow from '../CustomTableRow';

describe('CustomTableRow Component', () => {
  it('renders CustomTableRow - no value', () => {
    const { getByTestId } = render(
      <table>
        <tbody>
          <CustomTableRow label="Name" />
        </tbody>
      </table>
    );
    const label = getByTestId('label');
    const value = getByTestId('value');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Name');
    expect(value).toBeInTheDocument();
    expect(value).toHaveTextContent('-');
  });

  it('renders CustomTableRow - with value', () => {
    const { getByTestId } = render(
      <table>
        <tbody>
          <CustomTableRow label="Name" value="Mario" />
        </tbody>
      </table>
    );
    const label = getByTestId('label');
    const value = getByTestId('value');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Name');
    expect(value).toBeInTheDocument();
    expect(value).toHaveTextContent('Mario');
  });
});
