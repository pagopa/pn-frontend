import { act } from 'react-dom/test-utils';
import * as reactRouterDom from 'react-router-dom';
import { vi } from 'vitest';

import { renderHook } from '../../test-utils';
import { usePreviousLocation } from '../usePreviousLocation';

const mockNavigateFn = vi.fn();

const MemoryRouter = reactRouterDom.MemoryRouter;

const mockLocation = {
  pathname: '/page-b',
  state: { from: '/page-a' },
  key: '',
  search: '',
  hash: '',
};

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

describe('usePreviousLocation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should return undefined for previousLocation if no state is provided', () => {
    const { result } = renderHook(() => usePreviousLocation(), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    expect(result.current.previousLocation).toBeUndefined();
  });

  it('should call navigate with the correct state', () => {
    const { result } = renderHook(() => usePreviousLocation(), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    act(() => {
      result.current.navigateWithState('/page-b');
    });

    expect(mockNavigateFn).toHaveBeenCalledWith('/page-b', {
      state: { from: '/' },
    });
  });

  it('should return previousLocation from state', () => {
    vi.spyOn(reactRouterDom, 'useLocation').mockReturnValue(mockLocation);

    const { result } = renderHook(() => usePreviousLocation(), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    expect(result.current.previousLocation).toBe('/page-a');
  });

  it('should call navigate(previousLocation) when previousLocation exists', () => {
    vi.spyOn(reactRouterDom, 'useLocation').mockReturnValue(mockLocation);

    const { result } = renderHook(() => usePreviousLocation(), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    act(() => {
      result.current.navigateToPreviousLocation();
    });

    expect(mockNavigateFn).toHaveBeenCalledWith('/page-a', { replace: true });
  });

  it('should call navigate(-1) when previousLocation is undefined', () => {
    vi.spyOn(reactRouterDom, 'useLocation').mockReturnValue({
      ...mockLocation,
      state: { from: undefined },
    });

    const { result } = renderHook(() => usePreviousLocation(), {
      wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>,
    });

    act(() => {
      result.current.navigateToPreviousLocation();
    });

    expect(mockNavigateFn).toHaveBeenCalledWith(-1);
  });
});
