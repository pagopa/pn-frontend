import { vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';
import userEvent from '@testing-library/user-event';

import { userResponse } from '../../__mocks__/Auth.mock';
import { render, waitFor } from '../../__test__/test-utils';
import * as useRapidAccessParamHook from '../../hooks/useRapidAccessParam';
import * as routes from '../../navigation/routes.const';
import { TPP_LANDING_UTM, UTM_KEY } from '../../utility/utm.utility';
import TppLanding from '../TppLanding.page';

const mockOpenFn = vi.fn();

describe('TppLanding page', () => {
  const mockRetrievalId = '123456';
  const original = globalThis.open;

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(globalThis, 'open', {
      configurable: true,
      value: mockOpenFn,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(globalThis, 'open', { configurable: true, value: original });
  });

  it('should renders page with valid params', () => {
    vi.spyOn(useRapidAccessParamHook, 'useRapidAccessParam').mockReturnValue([
      AppRouteParams.RETRIEVAL_ID,
      mockRetrievalId,
    ]);

    const { getByTestId } = render(<TppLanding />);

    const container = getByTestId('tppLandingContainer');
    expect(container).toBeInTheDocument();

    const illustration = getByTestId('tppLandingIllustration');
    expect(illustration).toBeInTheDocument();

    const title = getByTestId('tppLandingTitle');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(/title/);

    const description = getByTestId('tppLandingDescription');
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent(/description/);

    const accessButton = getByTestId('accessButton');
    expect(accessButton).toBeInTheDocument();
    expect(accessButton).toHaveTextContent(/access-button/);

    const faqSection = getByTestId('faqSection');
    expect(faqSection).toBeInTheDocument();

    const faqTitle = getByTestId('faqTitle');
    expect(faqTitle).toBeInTheDocument();
    expect(faqTitle).toHaveTextContent(/faq.title/);
  });

  it('should redirects to home when no param is provided', () => {
    vi.spyOn(useRapidAccessParamHook, 'useRapidAccessParam').mockReturnValue(undefined);

    const { queryByTestId, router } = render(<TppLanding />);

    expect(router.state.location.pathname).toBe('/');
    expect(router.state.historyAction).toBe('REPLACE');
    expect(queryByTestId('tppLandingContainer')).not.toBeInTheDocument();
    expect(queryByTestId('accessButton')).not.toBeInTheDocument();
    expect(queryByTestId('faqSection')).not.toBeInTheDocument();
  });

  it('should redirects to home when param is invalid', () => {
    vi.spyOn(useRapidAccessParamHook, 'useRapidAccessParam').mockReturnValue([
      AppRouteParams.AAR,
      mockRetrievalId,
    ]);

    const { queryByTestId, router } = render(<TppLanding />);

    expect(router.state.location.pathname).toBe('/');
    expect(router.state.historyAction).toBe('REPLACE');
    expect(queryByTestId('tppLandingContainer')).not.toBeInTheDocument();
  });

  it('should redirects to home when value is missing', () => {
    vi.spyOn(useRapidAccessParamHook, 'useRapidAccessParam').mockReturnValue([
      AppRouteParams.RETRIEVAL_ID,
      '',
    ]);

    const { queryByTestId, router } = render(<TppLanding />);

    expect(router.state.location.pathname).toBe('/');
    expect(router.state.historyAction).toBe('REPLACE');
    expect(queryByTestId('tppLandingContainer')).not.toBeInTheDocument();
  });

  it('should handle access button click - user logged in and navigate with retrievalId + TPP UTMs', async () => {
    vi.spyOn(useRapidAccessParamHook, 'useRapidAccessParam').mockReturnValue([
      AppRouteParams.RETRIEVAL_ID,
      mockRetrievalId,
    ]);

    const { getByTestId, router } = render(<TppLanding />, {
      route: `${routes.TPP_LANDING}?${AppRouteParams.RETRIEVAL_ID}=${mockRetrievalId}`,
      preloadedState: {
        userState: {
          user: userResponse,
        },
      },
    });

    const accessButton = getByTestId('accessButton');
    expect(accessButton).toBeEnabled();

    await userEvent.click(accessButton);

    expect(router.state.location.pathname).toBe('/');

    const sp = new URLSearchParams(router.state.location.search);

    expect(sp.get(AppRouteParams.RETRIEVAL_ID)).toBe(mockRetrievalId);
    expect(sp.get(UTM_KEY.CAMPAIGN)).toBe(TPP_LANDING_UTM[UTM_KEY.CAMPAIGN]);
    expect(sp.get(UTM_KEY.SOURCE)).toBe(TPP_LANDING_UTM[UTM_KEY.SOURCE]);
    expect(sp.get(UTM_KEY.MEDIUM)).toBe(TPP_LANDING_UTM[UTM_KEY.MEDIUM]);
  });

  it('should handle access button click - user not logged in', async () => {
    vi.spyOn(useRapidAccessParamHook, 'useRapidAccessParam').mockReturnValue([
      AppRouteParams.RETRIEVAL_ID,
      mockRetrievalId,
    ]);

    const { getByTestId } = render(<TppLanding />, {
      route: `${routes.TPP_LANDING}?${AppRouteParams.RETRIEVAL_ID}=${mockRetrievalId}`,
    });

    const accessButton = getByTestId('accessButton');
    expect(accessButton).toBeEnabled();

    await userEvent.click(accessButton);

    expect(mockOpenFn).toHaveBeenCalledTimes(1);

    const [redirectUrl, target] = mockOpenFn.mock.calls[0];
    expect(target).toBe('_self');

    const parsed = new URL(redirectUrl, 'https://test.pagopa.it');
    expect(parsed.pathname).toBe('/auth/logout');

    expect(parsed.searchParams.get(AppRouteParams.RETRIEVAL_ID)).toBe(mockRetrievalId);
    expect(parsed.searchParams.get(UTM_KEY.CAMPAIGN)).toBe(TPP_LANDING_UTM[UTM_KEY.CAMPAIGN]);
    expect(parsed.searchParams.get(UTM_KEY.SOURCE)).toBe(TPP_LANDING_UTM[UTM_KEY.SOURCE]);
    expect(parsed.searchParams.get(UTM_KEY.MEDIUM)).toBe(TPP_LANDING_UTM[UTM_KEY.MEDIUM]);
  });

  it('should displays FAQ correctly', async () => {
    vi.spyOn(useRapidAccessParamHook, 'useRapidAccessParam').mockReturnValue([
      AppRouteParams.RETRIEVAL_ID,
      mockRetrievalId,
    ]);

    const { getByTestId } = render(<TppLanding />);

    const notificationsAccordionSummary = getByTestId('notificationsAccordionSummary');
    expect(notificationsAccordionSummary).toHaveTextContent(/faq.what-are-notifications.question/);
    await userEvent.click(notificationsAccordionSummary);

    await waitFor(() => {
      const notificationsAccordionDetails = getByTestId('notificationsAccordionDetails');
      expect(notificationsAccordionDetails).toBeVisible();
      expect(notificationsAccordionDetails).toHaveTextContent(/faq.what-are-notifications.answer/);
    });

    const sendAccordionSummary = getByTestId('sendAccordionSummary');
    expect(sendAccordionSummary).toHaveTextContent(/faq.what-is-send.question/);
    await userEvent.click(sendAccordionSummary);

    await waitFor(() => {
      const sendAccordionDetails = getByTestId('sendAccordionDetails');
      expect(sendAccordionDetails).toBeVisible();
      expect(sendAccordionDetails).toHaveTextContent(/faq.what-is-send.answer/);
    });
  });

  it('should not add landing UTM params on first render', () => {
    vi.spyOn(useRapidAccessParamHook, 'useRapidAccessParam').mockReturnValue([
      AppRouteParams.RETRIEVAL_ID,
      mockRetrievalId,
    ]);

    const { router } = render(<TppLanding />, {
      route: `${routes.TPP_LANDING}?${AppRouteParams.RETRIEVAL_ID}=${mockRetrievalId}`,
    });

    const sp = new URLSearchParams(router.state.location.search);

    expect(sp.get(AppRouteParams.RETRIEVAL_ID)).toBe(mockRetrievalId);
    expect(sp.get(UTM_KEY.CAMPAIGN)).toBeNull();
    expect(sp.get(UTM_KEY.SOURCE)).toBeNull();
    expect(sp.get(UTM_KEY.MEDIUM)).toBeNull();
  });

  it('should override required UTM params on TPP access button click', async () => {
    vi.spyOn(useRapidAccessParamHook, 'useRapidAccessParam').mockReturnValue([
      AppRouteParams.RETRIEVAL_ID,
      mockRetrievalId,
    ]);

    const { getByTestId, router } = render(<TppLanding />, {
      route: `${routes.TPP_LANDING}?${AppRouteParams.RETRIEVAL_ID}=${mockRetrievalId}&${UTM_KEY.SOURCE}=already_present`,
      preloadedState: {
        userState: {
          user: userResponse,
        },
      },
    });

    await userEvent.click(getByTestId('accessButton'));

    const sp = new URLSearchParams(router.state.location.search);

    expect(sp.get(AppRouteParams.RETRIEVAL_ID)).toBe(mockRetrievalId);
    expect(sp.get(UTM_KEY.CAMPAIGN)).toBe(TPP_LANDING_UTM[UTM_KEY.CAMPAIGN]);
    expect(sp.get(UTM_KEY.SOURCE)).toBe(TPP_LANDING_UTM[UTM_KEY.SOURCE]);
    expect(sp.get(UTM_KEY.MEDIUM)).toBe(TPP_LANDING_UTM[UTM_KEY.MEDIUM]);
  });
});
