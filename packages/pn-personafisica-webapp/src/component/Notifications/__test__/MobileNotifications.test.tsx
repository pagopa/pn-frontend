import { fireEvent, waitFor } from '@testing-library/react';

import { notificationsToFe } from '../../../redux/dashboard/__test__/test-utils';
import { render } from '../../../__test__/test-utils';
import * as routes from '../../../navigation/routes.const';
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
  };
});

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
}));
jest.mock('../MobileNotificationsSort', () => () => <div>Sort</div>);
jest.mock('../FilterNotifications', () => () => <div>Filters</div>);

describe('MobileNotifications Component', () => {
  it('renders MobileNotifications', () => {
    // render component
    const result = render(
      <MobileNotifications
        notifications={[]}
        sort={{ orderBy: 'mocked-field', order: 'asc' }}
        onChangeSorting={() => {}}
        onCancelSearch={() => {}}
      />
    );
    expect(result.container).toHaveTextContent(/Filters/i);
    expect(result.container).toHaveTextContent(/Sort/i);
    expect(result.container).toHaveTextContent(
      /I filtri che hai aggiunto non hanno dato nessun risultato./i
    );
  });

  it('clicks on go to detail action', async () => {
    // render component
    const result = render(
      <MobileNotifications
        notifications={notificationsToFe.result}
        sort={{ orderBy: '', order: 'asc' }}
        onCancelSearch={() => {}}
      />
    );
    const notificationsCardButton = result?.container.querySelector('button');
    fireEvent.click(notificationsCardButton!);
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
      expect(mockNavigateFn).toBeCalledWith(
        routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationsToFe.result[0].iun)
      );
    });
  });
});
