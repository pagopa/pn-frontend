import { vi } from 'vitest';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { getInstitutionsResponse } from '../../__mocks__/Institutions.mock';
import { act, fireEvent, render, screen, waitFor, within } from '../../__test__/test-utils';
import { InstitutionsApi } from '../../api/institutions/Institutions.api';
import Home from '../Institutions.page';

describe('Institutions page', () => {
  const getInstitutionsSpy = vi.spyOn(InstitutionsApi, 'getInstitutions');

  beforeEach(() => {
    getInstitutionsSpy.mockImplementation((params) =>
      Promise.resolve(getInstitutionsResponse(params))
    );
  });

  afterEach(() => {
    getInstitutionsSpy.mockReset();
  });

  afterAll(() => {
    getInstitutionsSpy.mockRestore();
  });

  const renderPage = () => act(async () => render(<Home />));

  it('renders title and subtitle', async () => {
    await renderPage();
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('work-in-progress-alert')).toBeInTheDocument();
  });

  it('fetches the institutions and renders the table', async () => {
    await renderPage();
    expect(getInstitutionsSpy).toHaveBeenCalledTimes(1);
    expect(getInstitutionsSpy).toHaveBeenCalledWith({
      search: undefined,
      limit: 10,
      lastKey: undefined,
    });

    expect(screen.getByText('table.columns.institution-name')).toBeInTheDocument();
    expect(screen.getByText('table.columns.tax-code')).toBeInTheDocument();
    expect(screen.getByText('table.columns.delegation')).toBeInTheDocument();

    const rows = await screen.findAllByTestId('institutionsBodyRowDesktop');
    expect(rows).toHaveLength(10);
    expect(rows[0]).toHaveTextContent('Ente Fittizio 01');
    expect(rows[0]).toHaveTextContent('00000000001');
    expect(rows[0]).toHaveTextContent('table.delegation-status.active');
    expect(rows[1]).toHaveTextContent('Ente Fittizio 02');
    expect(rows[1]).toHaveTextContent('00000000002');
    expect(rows[1]).toHaveTextContent('table.delegation-status.revoked');
  });

  it('shows the skeleton rows while the institutions are loading', async () => {
    let resolveRequest: () => void = () => {};
    getInstitutionsSpy.mockImplementationOnce(
      (params) =>
        new Promise((resolve) => {
          resolveRequest = () => resolve(getInstitutionsResponse(params));
        })
    );
    await renderPage();

    expect(screen.getAllByTestId('institutionsSkeletonRowDesktop')).toHaveLength(10);
    expect(screen.queryByTestId('institutionsBodyRowDesktop')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pageSelector')).not.toBeInTheDocument();
    expect(screen.queryByText('table.empty.title')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('loading');
    expect(screen.getByTestId('institutionsList')).toHaveAttribute('aria-busy', 'true');

    await act(async () => resolveRequest());

    expect(screen.queryByTestId('institutionsSkeletonRowDesktop')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('institutionsBodyRowDesktop')).toHaveLength(10);
    expect(screen.getByTestId('pageSelector')).toBeInTheDocument();
    expect(screen.getByTestId('institutionsList')).not.toHaveAttribute('aria-busy');
  });

  it('shows the error state and retries when the api fails', async () => {
    getInstitutionsSpy.mockRejectedValueOnce({ response: { status: 500, data: {} } });
    await act(async () =>
      render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <Home />
        </>
      )
    );
    const apiError = await screen.findByTestId('institutionsApiError');
    expect(apiError).toHaveTextContent('table.error.title');
    expect(screen.queryByTestId('institutionsList')).not.toBeInTheDocument();

    fireEvent.click(within(apiError).getByRole('button', { name: 'table.error.action' }));
    expect(await screen.findAllByTestId('institutionsBodyRowDesktop')).toHaveLength(10);
    expect(screen.queryByTestId('institutionsApiError')).not.toBeInTheDocument();
    expect(getInstitutionsSpy).toHaveBeenCalledTimes(2);
  });

  it('removes the filter when searching with an empty value', async () => {
    await renderPage();
    const input = screen.getByRole('textbox', { name: /search.label/ });
    fireEvent.change(input, { target: { value: 'Fittizio 02' } });
    fireEvent.click(screen.getByTestId('searchButton'));
    await waitFor(() => expect(getInstitutionsSpy).toHaveBeenCalledTimes(2));

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByTestId('searchButton'));
    await waitFor(() => {
      expect(getInstitutionsSpy).toHaveBeenCalledTimes(3);
      expect(getInstitutionsSpy).toHaveBeenLastCalledWith({
        search: undefined,
        limit: 10,
        lastKey: undefined,
      });
    });
    expect(screen.queryByText('search.min-length')).not.toBeInTheDocument();
  });

  it('resets the search and pagination when leaving the page', async () => {
    const { testStore, unmount } = await renderPage();
    fireEvent.change(screen.getByRole('textbox', { name: /search.label/ }), {
      target: { value: 'Fittizio' },
    });
    fireEvent.click(screen.getByTestId('searchButton'));
    await waitFor(() => expect(testStore.getState().institutionsState.search).toBe('Fittizio'));

    unmount();

    const { search, pagination } = testStore.getState().institutionsState;
    expect(search).toBe('');
    expect(pagination).toEqual({ page: 0, size: 10, nextPagesKey: [] });
  });

  it('shows a validation error when searching with less than 3 characters', async () => {
    await renderPage();
    fireEvent.change(screen.getByRole('textbox', { name: /search.label/ }), {
      target: { value: 'En' },
    });
    fireEvent.click(screen.getByTestId('searchButton'));
    expect(await screen.findByText('search.min-length')).toBeInTheDocument();
    expect(getInstitutionsSpy).toHaveBeenCalledTimes(1);
    expect(screen.getAllByTestId('institutionsBodyRowDesktop')).toHaveLength(10);
  });

  it('searches institutions by name or tax code', async () => {
    await renderPage();
    fireEvent.change(screen.getByRole('textbox', { name: /search.label/ }), {
      target: { value: 'Fittizio 02' },
    });
    fireEvent.click(screen.getByTestId('searchButton'));

    await waitFor(() => {
      expect(getInstitutionsSpy).toHaveBeenCalledTimes(2);
      expect(getInstitutionsSpy).toHaveBeenLastCalledWith({
        search: 'Fittizio 02',
        limit: 10,
        lastKey: undefined,
      });
      const rows = screen.getAllByTestId('institutionsBodyRowDesktop');
      expect(rows).toHaveLength(1);
      expect(rows[0]).toHaveTextContent('Ente Fittizio 02');
    });
  });

  it('shows the no-results state when the search has no matches', async () => {
    await renderPage();
    fireEvent.change(screen.getByRole('textbox', { name: /search.label/ }), {
      target: { value: 'nessun ente' },
    });
    fireEvent.click(screen.getByTestId('searchButton'));

    expect(await screen.findByText('table.no-results.title')).toBeInTheDocument();
    expect(screen.getByText('table.no-results.description')).toBeInTheDocument();
    expect(screen.queryByTestId('institutionsBodyRowDesktop')).not.toBeInTheDocument();
  });

  it('changes page using the lastKey of the previous page', async () => {
    await renderPage();
    const pageSelector = await screen.findByTestId('pageSelector');
    // only the next page is known until it is loaded
    expect(within(pageSelector).queryByRole('button', { name: /3/ })).not.toBeInTheDocument();
    fireEvent.click(within(pageSelector).getByRole('button', { name: /2/ }));

    await waitFor(() => {
      expect(getInstitutionsSpy).toHaveBeenLastCalledWith({
        search: undefined,
        limit: 10,
        lastKey: '10',
      });
      expect(screen.getAllByTestId('institutionsBodyRowDesktop')[0]).toHaveTextContent(
        'Ente Fittizio 11'
      );
    });

    fireEvent.click(within(screen.getByTestId('pageSelector')).getByRole('button', { name: /3/ }));
    await waitFor(() => {
      expect(getInstitutionsSpy).toHaveBeenLastCalledWith({
        search: undefined,
        limit: 10,
        lastKey: '20',
      });
      const rows = screen.getAllByTestId('institutionsBodyRowDesktop');
      expect(rows).toHaveLength(5);
      expect(rows[0]).toHaveTextContent('Ente Fittizio 21');
    });
    expect(
      within(screen.getByTestId('pageSelector')).queryByRole('button', { name: /4/ })
    ).not.toBeInTheDocument();
  });

  it('keeps the next pages available when the same search is submitted again', async () => {
    await renderPage();
    const input = screen.getByRole('textbox', { name: /search.label/ });
    fireEvent.change(input, { target: { value: 'Ente' } });
    fireEvent.click(screen.getByTestId('searchButton'));
    await waitFor(() => {
      expect(getInstitutionsSpy).toHaveBeenCalledTimes(2);
      expect(
        within(screen.getByTestId('pageSelector')).getByRole('button', { name: /2/ })
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('searchButton'));
    // let formik complete the async submit
    await act(async () => {});
    expect(getInstitutionsSpy).toHaveBeenCalledTimes(2);

    fireEvent.click(within(screen.getByTestId('pageSelector')).getByRole('button', { name: /2/ }));
    await waitFor(() => {
      expect(getInstitutionsSpy).toHaveBeenLastCalledWith({
        search: 'Ente',
        limit: 10,
        lastKey: '10',
      });
      expect(screen.getAllByTestId('institutionsBodyRowDesktop')[0]).toHaveTextContent(
        'Ente Fittizio 11'
      );
    });
  });

  it('changes page size and resets to the first page', async () => {
    await renderPage();
    fireEvent.click(
      within(await screen.findByTestId('pageSelector')).getByRole('button', { name: /2/ })
    );
    await waitFor(() =>
      expect(screen.getAllByTestId('institutionsBodyRowDesktop')[0]).toHaveTextContent(
        'Ente Fittizio 11'
      )
    );

    fireEvent.click(within(screen.getByTestId('itemsPerPageSelector')).getByRole('button'));
    fireEvent.click(await screen.findByTestId('pageSize-20'));

    await waitFor(() => {
      expect(getInstitutionsSpy).toHaveBeenLastCalledWith({
        search: undefined,
        limit: 20,
        lastKey: undefined,
      });
      const rows = screen.getAllByTestId('institutionsBodyRowDesktop');
      expect(rows).toHaveLength(20);
      expect(rows[0]).toHaveTextContent('Ente Fittizio 01');
    });
  });
});
