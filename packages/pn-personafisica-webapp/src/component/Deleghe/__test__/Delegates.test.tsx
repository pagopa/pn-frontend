import { axe, render } from '../../../__test__/test-utils';
import Delegates from '../Delegates';
import { arrayOfDelegates } from '../../../redux/delegation/__test__/test.utils';
import * as hooks from '../../../redux/hooks';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('Delegates Component', () => {
  it('renders the empty state', () => {
    const result = render(<Delegates />);

    expect(result.container).toHaveTextContent(/deleghe.delegatesTitle/i);
    expect(result.container).toHaveTextContent(/deleghe.add/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.name/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.delegationStart/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.delegationEnd/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.permissions/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.status/i);
    expect(result.container).toHaveTextContent(/deleghe.no_delegates/i);
  });

  it('renders the delegates', () => {
    const mockUseAppSelector = jest.spyOn(hooks, 'useAppSelector');
    mockUseAppSelector.mockReturnValueOnce(arrayOfDelegates);
    const result = render(<Delegates />);

    expect(result.container).toHaveTextContent(/marco verdi/i);
    expect(result.container).toHaveTextContent(/davide legato/i);
    expect(result.container).not.toHaveTextContent(/luca blu/i);
  });

  it('renders the error component', () => {
    const mockUseAppSelector = jest.spyOn(hooks, 'useAppSelector');
    mockUseAppSelector.mockReturnValueOnce(arrayOfDelegates).mockReturnValueOnce(true);
    const result = render(<Delegates />);

    expect(result.container).not.toHaveTextContent(/marco verdi/i);
    expect(result.container).not.toHaveTextContent(/davide legato/i);
    expect(result.container).toHaveTextContent(/deleghe.error/i);
  });

  it('is Delegates component accessible', async ()=>{
    const mockUseAppSelector = jest.spyOn(hooks, 'useAppSelector');
    mockUseAppSelector.mockReturnValueOnce(arrayOfDelegates);
    const result = render(<Delegates />);
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
