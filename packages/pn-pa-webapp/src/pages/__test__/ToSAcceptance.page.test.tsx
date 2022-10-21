import * as redux from 'react-redux';
import { render } from '../../__test__/test-utils';
import ToSAcceptance from '../ToSAcceptance.page';

const mockNavigateFn = jest.fn();
const mockDispatchFn = jest.fn();

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  Trans: (props: { i18nKey: string }) => props.i18nKey,
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

describe('test Terms of Service page', () => {
  beforeEach(() => {
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
  });

  it('checks the texts in the page', () => {
    const result = render(<ToSAcceptance />);

    expect(result.container).toHaveTextContent(/Piattaforma Notifiche/i);
    expect(result.container).toHaveTextContent(/Per accedere, leggi e accetta l’Informativa Privacy e i Termini e condizioni d’uso./i);
    expect(result.container).toHaveTextContent(/tos.switchLabel/i);
    expect(result.container).toHaveTextContent(/Accedi/i);
  });
});
