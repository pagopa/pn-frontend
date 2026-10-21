import MockAdapter from 'axios-mock-adapter';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { errorMock } from '../../__mocks__/Errors.mock';
import { INFORMAL_NOTIFICATION_TIMELINE_MOCK } from '../../__mocks__/InformalNotificationTimeline.mock';
import { RenderResult, act, fireEvent, render } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import * as routes from '../../navigation/routes.const';
import InformalNotificationTimeline from '../InformalNotificationTimeline.page';

const campaignId = 'campaign-id';
const iun = INFORMAL_NOTIFICATION_TIMELINE_MOCK.iun;
const timelineUrl = `/bff/v1/notifications/informal/sent/${iun}/timeline`;

const renderPage = () =>
  render(
    <>
      <ResponseEventDispatcher />
      <AppResponseMessage />
      <InformalNotificationTimeline />
    </>,
    {
      route: routes.GET_DETTAGLIO_COMBO_TIMELINE_PATH(campaignId, iun),
      path: routes.DETTAGLIO_COMBO_TIMELINE,
    }
  );

describe('InformalNotificationTimeline Page', () => {
  let result: RenderResult;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('fetches the timeline and renders it', async () => {
    mock.onGet(timelineUrl).reply(200, INFORMAL_NOTIFICATION_TIMELINE_MOCK);

    await act(async () => {
      result = renderPage();
    });

    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toBe(timelineUrl);
    // breadcrumb and page title
    expect(result.getAllByText('informal.timeline.title')).toHaveLength(2);
    expect(result.getByText('informal.status.accepted.label')).toBeInTheDocument();
  });

  it('shows the api error, keeping the iun of the route in the breadcrumb', async () => {
    mock.onGet(timelineUrl).reply(errorMock.status, errorMock.data);

    await act(async () => {
      result = renderPage();
    });

    expect(result.getByTestId('api-error-getSentInformalNotificationTimeline')).toBeInTheDocument();
    expect(result.getByText(iun)).toBeInTheDocument();
    expect(result.queryByText('informal.status.accepted.label')).not.toBeInTheDocument();
  });

  it('navigates to the communication detail from the breadcrumb', async () => {
    mock.onGet(timelineUrl).reply(200, INFORMAL_NOTIFICATION_TIMELINE_MOCK);

    await act(async () => {
      result = renderPage();
    });

    fireEvent.click(result.getByText(iun));

    expect(result.router.state.location.pathname).toBe(
      routes.GET_DETTAGLIO_COMBO_PATH(campaignId, iun)
    );
  });
});
