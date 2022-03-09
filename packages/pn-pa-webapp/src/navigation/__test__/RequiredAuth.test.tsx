import { act, prettyDOM, RenderResult } from "@testing-library/react";
import * as redux from 'react-redux';

import { UserRole } from "../../models/user";
import { render } from "../../__test__/test-utils";
import RequireAuth from "../RequiredAuth";

/*
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    default: jest.fn(() => ({})),
    Outlet: () => <div>Generic Page</div>
  }
});

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    default: jest.fn(() => ({})),
    AccessDenied: () => <div>Access Denied Page</div>
  }
});
*/

describe('RequireAuth Component', () => {

  beforeAll(() => {
    const useSelectorSpy = jest.spyOn(redux, 'useSelector');
    useSelectorSpy
      .mockReturnValueOnce('mocked-token')
      .mockReturnValueOnce(UserRole.REFERENTE_AMMINISTRATIVO);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it.skip('renders RequireAuth (user enabled to access)', async () => {

    let result: RenderResult | undefined;
    // render component
    await act(async () => {
      result = render(<RequireAuth roles={[UserRole.REFERENTE_AMMINISTRATIVO]} />);
    });
    console.log(prettyDOM(result?.container, 100000));
  });
});