import { fireEvent, waitFor, RenderResult } from '@testing-library/react';

import { render } from '../../../test-utils';
import { NotificationDetailOtherDocument } from '../../../types';
import NotificationDetailOtherDocuments from '../NotificationDetailOtherDocuments';

const documents: Array<NotificationDetailOtherDocument> = [
  {
    documentId: 'mocked-document-id',
    documentType: 'mocked-document-type'
  },
];

describe('NotificationDetailOtherDocuments Component', () => {
  let resultWithDownloadableFiles: RenderResult | undefined;
  let resultNotDownloadableFiles: RenderResult | undefined;
  let mockClickFn: jest.Mock;

  beforeEach(() => {
    mockClickFn = jest.fn();
    // render component
    resultWithDownloadableFiles = render(
      <NotificationDetailOtherDocuments
        title="Mocked title"
        otherDocuments={documents}
        clickHandler={mockClickFn}
        documentsAvailable
      />
    );
    resultNotDownloadableFiles = render(
      <NotificationDetailOtherDocuments
        title="Mocked title"
        otherDocuments={documents}
        clickHandler={mockClickFn}
        documentsAvailable={false}
        downloadFilesMessage="mocked"
      />
    );
  });
  afterEach(() => {
    resultWithDownloadableFiles = undefined;
    resultNotDownloadableFiles = undefined;
    jest.clearAllMocks();
  });

  it('renders NotificationDetailOtherDocuments', () => {
    expect(resultWithDownloadableFiles?.container).toHaveTextContent(/Mocked title/i);
    // expect(result?.container).toHaveTextContent(/Scarica tutti gli Atti/i);
    const documentsButtons = resultWithDownloadableFiles?.getAllByTestId('documentButton');
    expect(documentsButtons).toHaveLength(documents.length);
  });

  it('test click on document button', async () => {
    const documentsButtons = resultWithDownloadableFiles?.getAllByTestId('documentButton');
    fireEvent.click(documentsButtons![0]);
    await waitFor(() => {
      expect(mockClickFn).toBeCalledTimes(1);
      expect(mockClickFn).toBeCalledWith(documents[0]);
    });
  });
});
