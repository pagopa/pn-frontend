import { fireEvent, waitFor } from '@testing-library/react';

import { notificationsToFe } from '../../../../redux/dashboard/__test__/test-utils';
import { axe, render } from '../../../../__test__/test-utils';
import * as routes from '../../../../navigation/routes.const';
import MobileNotifications from '../MobileNotifications';

const mockNavigateFn = jest.fn();

// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    NotificationsCard: () => <div>Cards</div>,
    MobileNotificationsSort: () => <div>Sort</div>
  };
});

jest.mock('../FilterNotifications', () => {
  const { forwardRef } = jest.requireActual('react');
  return forwardRef(() => <div>Filters</div>);
});

describe('MobileNotifications Component', () => {

  it('renders MobileNotifications', () => {
    // render component
    const result = render(
      <MobileNotifications
        notifications={[]}
        sort={{ orderBy: 'mocked-field', order: 'asc' }}
        onChangeSorting={() => {}}
        onCancelSearch={() => {}}
        onManualSend={() => {}}
        onApiKeys={() => {}}
      />
    );
    expect(result.container).toHaveTextContent(/Filters/i);
    expect(result.container).toHaveTextContent(/Sort/i);
    expect(result.container).toHaveTextContent(
      /L'ente non ha ancora inviato nessuna notifica. Usa le Chiavi API o fai un invio manuale/i
    );
  });

  it('clicks on go to detail action', async () => {
    // render component
    const result = render(
      <MobileNotifications
        notifications={notificationsToFe.resultsPage}
        sort={{ orderBy: '', order: 'asc' }}
        onCancelSearch={() => {}}
        onManualSend={() => {}}
        onApiKeys={() => {}}
      />
    );
    const notificationsCardButton = result?.container.querySelector('button');
    fireEvent.click(notificationsCardButton!);
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
      expect(mockNavigateFn).toBeCalledWith(
        routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationsToFe.resultsPage[0].iun)
      );
    });
  });

  it('does not have basic accessibility issues', async () => {
    const result = render(
      <MobileNotifications
        notifications={notificationsToFe.resultsPage}
        sort={{ orderBy: '', order: 'asc' }}
        onCancelSearch={() => {}}
        onManualSend={() => {}}
        onApiKeys={() => {}}
      />
    );

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail("render() returned undefined!");
    }
  });

  it('does not have basic accessibility issues (empty notifications)', async () => {
    const result = render(
      <MobileNotifications
        notifications={[]}
        sort={{ orderBy: 'mocked-field', order: 'asc' }}
        onChangeSorting={() => {}}
        onCancelSearch={() => {}}
        onManualSend={() => {}}
        onApiKeys={() => {}}
      />
    );

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail("render() returned undefined!");
    }
  });
});
