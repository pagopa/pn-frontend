import * as redux from "react-redux";
import Statistics from "../Statistics.page";
import { render } from "../../__test__/test-utils";

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