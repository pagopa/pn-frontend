import { vi } from 'vitest';

import { testRadio } from '@pagopa-pn/pn-commons/src/test-utils';
import { getByTestId, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RenderResult, render } from '../../../__test__/test-utils';
import NotificationSettingsDrawer from '../NotificationSettingsDrawer';

// mock imports
vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

describe('Notification Settings Drawer', async () => {
  let result: RenderResult;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders button component', async () => {
    result = render(<NotificationSettingsDrawer />);

    const settingsLangBtn = result.queryByTestId('settingsLangBtn');
    expect(settingsLangBtn).toBeInTheDocument();
  });

  it('open drawer with default value', async () => {
    result = render(<NotificationSettingsDrawer />);

    const settingsLangBtn = result.queryByTestId('settingsLangBtn');
    expect(settingsLangBtn).toBeInTheDocument();
    userEvent.click(settingsLangBtn!);

    const drawer = await waitFor(() => getByTestId(document.body, 'settingsLangDrawer'));
    expect(drawer).toBeInTheDocument();

    await testRadio(
      drawer,
      'notificationLanguageRadio',
      ['Italiano', 'new-notification.steps.preliminary-informations.italian-and-other-language'],
      0
    );
  });

  it('should pre-select de language in form', async () => {
    result = render(<NotificationSettingsDrawer />, {
      preloadedState: { userState: { additionalLanguages: ['de'] } },
    });

    const settingsLangBtn = result.queryByTestId('settingsLangBtn');
    expect(settingsLangBtn).toBeInTheDocument();
    userEvent.click(settingsLangBtn!);

    const drawer = await waitFor(() => getByTestId(document.body, 'settingsLangDrawer'));
    expect(drawer).toBeInTheDocument();

    await testRadio(
      drawer,
      'notificationLanguageRadio',
      ['Italiano', 'new-notification.steps.preliminary-informations.italian-and-other-language'],
      1
    );

    const inputOtherLang = drawer.querySelector("input[name='additionalLang']") as HTMLInputElement;
    expect(inputOtherLang).toBeInTheDocument();

    expect(inputOtherLang.value).toBe('de');
  });
});
