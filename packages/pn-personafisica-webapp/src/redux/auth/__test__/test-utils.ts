import { AuthApi } from "../../../api/auth/Auth.api";
import { store } from "../../store";
import { exchangeToken, logout } from "../actions";
import { User } from "../types";

export const mockLogin = async (): Promise<any> => {
  const apiSpy = jest.spyOn(AuthApi, 'exchangeToken');
  apiSpy.mockResolvedValue(userResponse);
  return store.dispatch(exchangeToken('mocked-token'));
};

export const mockLogout = async (): Promise<any> => store.dispatch(logout());

export const mockAuthentication = () => {
  beforeAll(() => {
    mockLogin();
  });

  afterAll(() => {
    mockLogout();
    jest.resetAllMocks();
  });
};


export const userResponse: User = {
  sessionToken: 'mocked-session-token',
  name: 'Mario',
  family_name: 'Rossi',
  fiscal_number: 'RSSMRA80A01H501U',
  email: 'info@agid.gov.it',
  mobile_phone: '333333334',
  from_aa: false,
  uid: 'mocked-uid',
  level: 'L2',
  iat: 1646394256,
  exp: 1646397856,
  iss: 'spid-hub-test.dev.pn.pagopa.it',
  jti: 'mocked-jti',
};