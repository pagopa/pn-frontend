import * as redux from "react-redux";
import Statistics from "../Statistics.page";
import { render } from "../../__test__/test-utils";

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('Statistics Page tests', () => {
  const mockDispatchFn = jest.fn();

  beforeEach(async () => {
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  test('renders Statistics Page', () => {
    const result = render(<Statistics />, {
      preloadedState: {
        userState: { organizationParty: { name: 'mocked-sender' } },
      },
    });

    expect(result.container).toHaveTextContent('title');
    expect(result.container).toHaveTextContent('subtitle');
  });
});