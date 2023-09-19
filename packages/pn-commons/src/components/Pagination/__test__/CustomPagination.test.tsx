import React from 'react';

import { RenderResult, act, fireEvent, render, waitFor, within } from '../../../test-utils';
import CustomPagination from '../CustomPagination';
import { PaginationData } from '../types';

let paginationData: PaginationData = {
  page: 0,
  size: 50,
  totalElements: 500,
};

const handlePageChange = jest.fn();
const mockEventTrackingPageSize = jest.fn();

describe('CustomPagination Component', () => {
  let result: RenderResult | undefined;

  beforeEach(async () => {
    // render component
    await act(async () => {
      result = render(
        <CustomPagination
          paginationData={paginationData}
          eventTrackingCallbackPageSize={mockEventTrackingPageSize}
          onPageRequest={handlePageChange}
        />
      );
    });
  });

  afterEach(() => {
    result = undefined;
    handlePageChange.mockClear();
    paginationData = {
      page: 0,
      size: 50,
      totalElements: 500,
    };
  });

  it('renders custom pagination', () => {
    const itemsPerPageSelector = result?.getByTestId('itemsPerPageSelector');
    expect(itemsPerPageSelector).toBeInTheDocument();
    const pageSelector = result?.getByTestId('pageSelector');
    expect(pageSelector).toBeInTheDocument();
  });

  it('changes items per page', async () => {
    const button = result?.getByTestId('rows-per-page');
    expect(button).toHaveTextContent(/50/i);
    await waitFor(() => {
      fireEvent.click(button!);
    });

    const itemsPerPageListContainer = result?.getByRole('presentation');
    expect(itemsPerPageListContainer).toBeInTheDocument();
    const itemsPerPageList = result?.getAllByRole('menuitem');
    expect(itemsPerPageList).toHaveLength(3);
    await waitFor(() => {
      fireEvent.click(itemsPerPageList![1]);
    });
    expect(button).toHaveTextContent(/20/i);
    expect(handlePageChange).toBeCalledTimes(1);
    expect(mockEventTrackingPageSize).toBeCalledTimes(1);
    expect(handlePageChange).toBeCalledWith({
      page: 0,
      size: 20,
      totalElements: 500,
    });
  });

  it('changes page', async () => {
    const pageSelector = result?.getByTestId('pageSelector');
    let pageButtons = within(pageSelector!).getAllByRole('button');
    // depends on mui pagination
    // for 10 pages we have: < 1 2 3 4 5 ... 10 >
    expect(pageButtons).toHaveLength(8);
    expect(pageButtons![1]).toHaveTextContent(/1/i);
    expect(pageButtons![2]).toHaveTextContent(/2/i);
    expect(pageButtons![3]).toHaveTextContent(/3/i);
    expect(pageButtons![4]).toHaveTextContent(/4/i);
    expect(pageButtons![5]).toHaveTextContent(/5/i);
    expect(pageButtons![6]).toHaveTextContent(/10/i);
    await waitFor(() => {
      fireEvent.click(pageButtons![5]);
    });
    expect(handlePageChange).toBeCalledTimes(1);
    expect(handlePageChange).toBeCalledWith({
      page: 4,
      size: 50,
      totalElements: 500,
    });
  });
});
