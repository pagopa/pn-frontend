import * as redux from 'react-redux';
import { fireEvent } from '@testing-library/react';
import { render } from '../../__test__/test-utils';
import TermsOfService from '../TermsOfService.page';

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
    const result = render(<TermsOfService />);

    expect(result.container).toHaveTextContent(/tos.title/i);
    expect(result.container).toHaveTextContent(/tos.body/i);
    expect(result.container).toHaveTextContent(/tos.switchLabel/i);
    expect(result.container).toHaveTextContent(/tos.button/i);
  });

  it('checks the switch and button', () => {
    const result = render(<TermsOfService />);
    const acceptSwitch = result.getByTestId('tosSwitch');
    const accessButton = result.getByTestId('accessButton');

    expect(accessButton).toBeDisabled();

    fireEvent.click(acceptSwitch);
    expect(accessButton).toBeEnabled();
  });
});
