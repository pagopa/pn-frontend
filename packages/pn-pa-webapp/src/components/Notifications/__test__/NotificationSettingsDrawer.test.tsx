import { vi } from 'vitest';

import { testRadio } from '@pagopa-pn/pn-commons/src/test-utils';
import userEvent from '@testing-library/user-event';

import { RenderResult, act, render } from '../../../__test__/test-utils';
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

  it('should pre-select de language in form', async () => {
    await act(async () => {
      result = render(<NotificationSettingsDrawer />, {
        preloadedState: { userState: { additionalLanguages: ['de'] } },
      });
    });
    const settingsLangBtn = result.queryByTestId('settingsLangBtn');
    expect(settingsLangBtn).toBeInTheDocument();
    userEvent.click(settingsLangBtn!);

    await act(async () => {
      // time to appear the drawer
      await new Promise((r) => setTimeout(r, 500));
    });

    const drawer = document.querySelector("[data-testid='settingsLangDrawer']") as HTMLElement;
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
