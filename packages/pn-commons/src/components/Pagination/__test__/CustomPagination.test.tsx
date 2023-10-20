import React from 'react';

import { PaginationData } from '../../../models/Pagination';
import { fireEvent, getById, render, waitFor, within } from '../../../test-utils';
import CustomPagination from '../CustomPagination';

let paginationData: PaginationData = {
  page: 0,
  size: 50,
  totalElements: 500,
};

const handlePageChange = jest.fn();
const mockEventTrackingPageSize = jest.fn();

describe('CustomPagination Component', () => {
  afterEach(() => {
    handlePageChange.mockClear();
    paginationData = {
      page: 0,
      size: 50,
      totalElements: 500,
    };
  });

  it('renders custom pagination', () => {
    // render component
    const { getByTestId } = render(
      <CustomPagination
        paginationData={paginationData}
        eventTrackingCallbackPageSize={mockEventTrackingPageSize}
        onPageRequest={handlePageChange}
      />
    );
    const itemsPerPageSelector = getByTestId('itemsPerPageSelector');
    expect(itemsPerPageSelector).toBeInTheDocument();
    const pageSelector = getByTestId('pageSelector');
    expect(pageSelector).toBeInTheDocument();
  });

  it('changes items per page', async () => {
    const { container, getAllByRole, getByRole } = render(
      <CustomPagination
        paginationData={paginationData}
        eventTrackingCallbackPageSize={mockEventTrackingPageSize}
        onPageRequest={handlePageChange}
      />
    );
    const button = getById(container, 'rows-per-page');
    expect(button).toHaveTextContent(/50/i);
    fireEvent.click(button);
    const itemsPerPageListContainer = await waitFor(() => getByRole('presentation'));
    expect(itemsPerPageListContainer).toBeInTheDocument();
    const itemsPerPageList = getAllByRole('menuitem');
    expect(itemsPerPageList).toHaveLength(3);
    fireEvent.click(itemsPerPageList![1]);
    await waitFor(() => {
      expect(button).toHaveTextContent(/20/i);
      expect(handlePageChange).toBeCalledTimes(1);
      expect(mockEventTrackingPageSize).toBeCalledTimes(1);
      expect(handlePageChange).toBeCalledWith({
        page: 0,
        size: 20,
        totalElements: 500,
      });
    });
  });

  it('changes page', async () => {
    const { getByTestId } = render(
      <CustomPagination paginationData={paginationData} onPageRequest={handlePageChange} />
    );
    const pageSelector = getByTestId('pageSelector');
    const pageButtons = within(pageSelector!).getAllByRole('button');
    // depends on mui pagination
    // for 10 pages we have: < 1 2 3 4 5 ... 10 >
    expect(pageButtons).toHaveLength(8);
    expect(pageButtons![1]).toHaveTextContent(/1/i);
    expect(pageButtons![2]).toHaveTextContent(/2/i);
    expect(pageButtons![3]).toHaveTextContent(/3/i);
    expect(pageButtons![4]).toHaveTextContent(/4/i);
    expect(pageButtons![5]).toHaveTextContent(/5/i);
    expect(pageButtons![6]).toHaveTextContent(/10/i);
    fireEvent.click(pageButtons![5]);
    await waitFor(() => {
      expect(handlePageChange).toBeCalledTimes(1);
      expect(handlePageChange).toBeCalledWith({
        page: 4,
        size: 50,
        totalElements: 500,
      });
    });
  });
});
