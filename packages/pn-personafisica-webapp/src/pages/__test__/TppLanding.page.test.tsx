import { vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';
import userEvent from '@testing-library/user-event';

import { render, waitFor } from '../../__test__/test-utils';
import * as useRapidAccessParamHook from '../../hooks/useRapidAccessParam';
import TppLanding from '../TppLanding.page';

const mockNavigateFn = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
  Navigate: ({ to, replace }: { to: string; replace?: boolean }) => {
    mockNavigateFn(to, { replace });
    return null;
  },
}));

describe('TppLanding page', () => {
  const mockRetrievalId = '123456';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
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

  it('should redirects to login when no param is provided', () => {
    vi.spyOn(useRapidAccessParamHook, 'useRapidAccessParam').mockReturnValue(undefined);

    const { queryByTestId } = render(<TppLanding />);

    expect(mockNavigateFn).toHaveBeenCalledWith('/', { replace: true });
    expect(queryByTestId('tppLandingContainer')).not.toBeInTheDocument();
    expect(queryByTestId('accessButton')).not.toBeInTheDocument();
    expect(queryByTestId('faqSection')).not.toBeInTheDocument();
  });

  it('should redirects to login when param is invalid', () => {
    vi.spyOn(useRapidAccessParamHook, 'useRapidAccessParam').mockReturnValue([
      AppRouteParams.AAR,
      mockRetrievalId,
    ]);

    const { queryByTestId } = render(<TppLanding />);

    expect(mockNavigateFn).toHaveBeenCalledWith('/', { replace: true });
    expect(queryByTestId('tppLandingContainer')).not.toBeInTheDocument();
  });

  it('should redirects to login when value is missing', () => {
    vi.spyOn(useRapidAccessParamHook, 'useRapidAccessParam').mockReturnValue([
      AppRouteParams.RETRIEVAL_ID,
      '',
    ]);

    const { queryByTestId } = render(<TppLanding />);

    expect(mockNavigateFn).toHaveBeenCalledWith('/', { replace: true });
    expect(queryByTestId('tppLandingContainer')).not.toBeInTheDocument();
  });

  it('should handle access button click', async () => {
    vi.spyOn(useRapidAccessParamHook, 'useRapidAccessParam').mockReturnValue([
      AppRouteParams.RETRIEVAL_ID,
      mockRetrievalId,
    ]);

    const { getByTestId } = render(<TppLanding />);

    const accessButton = getByTestId('accessButton');
    expect(accessButton).toBeEnabled();

    await userEvent.click(accessButton);

    expect(mockNavigateFn).toHaveBeenCalledWith(
      `/?${AppRouteParams.RETRIEVAL_ID}=${mockRetrievalId}`,
      { replace: true }
    );
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
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
});
