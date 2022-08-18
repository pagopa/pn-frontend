import { render } from '../../__test__/test-utils';
import { act } from '@testing-library/react';
import * as redux from '../../redux/hooks';
import RequireAuth from '../RequireAuth';

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    Outlet: () => <div>Generic Page</div>,
  };
});

// Unfortunately a mock on SessionModal won't work since it is invoked from HandleAuth, which also lies in pn-commons.
// We mock the Dialog which is used inside SessionModal instead.
// --------------------
// Carlos Lombardi, 2022.08.18
jest.mock('@mui/material', () => {
  const original = jest.requireActual('@mui/material');
  return {
    ...original,
    Dialog: () => <div>Session Modal</div>,
  };
});

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({ t: (str: string) => str }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('RequireAuth Component', () => {
  it('renders RequireAuth (user enabled to access)', async () => {
    // useSelector mock
    const useSelectorSpy = jest.spyOn(redux, 'useAppSelector');
    useSelectorSpy
      .mockReturnValueOnce('mocked-token')
      .mockReturnValueOnce({ tos: true, fetchedTos: true });
    // render component
    let result: any = null;
    await act(async () => {result = await render(<RequireAuth />)});
    expect(result?.container).toHaveTextContent(/Generic Page/i);
    useSelectorSpy.mockClear();
    useSelectorSpy.mockReset();
  });

  it('renders RequireAuth (user not enabled to access)', async () => {
    // useSelector mock
    const useSelectorSpy = jest.spyOn(redux, 'useAppSelector');
    useSelectorSpy
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce({ tos: true, fetchedTos: true });
    // render component
    let result: any = null;
    await act(async () => {result = await render(<RequireAuth />)});
    expect(result?.container).toHaveTextContent(/Session Modal/i);
    useSelectorSpy.mockClear();
    useSelectorSpy.mockReset();
  });
});
