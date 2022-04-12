import { render } from '../../../__test__/test-utils';
import { arrayOfDelegates, arrayOfDelegators } from '../../../redux/delegation/__test__/test.utils';
import * as hooks from '../../../redux/hooks';
import Delegators from '../Delegators';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('Delegators Component', () => {
  it('renders the empty state', () => {
    const result = render(<Delegators />);

    expect(result.container).not.toHaveTextContent(/deleghe.delegatorsTitle/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.name/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.email/i);
  });

  it('renders the delegators', () => {
    const mockUseAppSelector = jest.spyOn(hooks, 'useAppSelector');
    mockUseAppSelector.mockReturnValueOnce(arrayOfDelegators);
    const result = render(<Delegators />);

    expect(result.container).toHaveTextContent(/marco verdi/i);
    expect(result.container).toHaveTextContent(/davide legato/i);
    expect(result.container).not.toHaveTextContent(/luca blu/i);
  });

  it('renders the error component', () => {
    const mockUseAppSelector = jest.spyOn(hooks, 'useAppSelector');
    mockUseAppSelector.mockReturnValueOnce(arrayOfDelegates).mockReturnValueOnce(true);
    const result = render(<Delegators />);

    expect(result.container).toHaveTextContent(/deleghe.delegatorsTitle/i);
    expect(result.container).toHaveTextContent(/deleghe.error/i);
    expect(result.container).toHaveTextContent(/deleghe.reload/i);
  });
});
