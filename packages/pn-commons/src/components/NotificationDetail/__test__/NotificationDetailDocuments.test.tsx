import { fireEvent, waitFor, RenderResult } from '@testing-library/react';

import { render } from '../../../test-utils';
import { NotificationDetailDocument } from '../../../types';
import NotificationDetailDocuments from '../NotificationDetailDocuments';

const documents: Array<NotificationDetailDocument> = [
  {
    digests: {
      sha256: 'mocked-sha',
    },
    ref: {
      key: 'mocked-doc-title',
      versionToken: 'mocked-versionToken'
    },
    contentType: 'mocked-contentType',
    title: 'mocked-doc-title',
    docIdx: '0'
  },
];

describe('NotificationDetailDocuments Component', () => {
  let resultWithDownloadableFiles: RenderResult | undefined;
  let resultNotDownloadableFiles: RenderResult | undefined;
  let mockClickFn: jest.Mock;

  beforeEach(() => {
    mockClickFn = jest.fn();
    // render component
    resultWithDownloadableFiles = render(
      <NotificationDetailDocuments
        title="Mocked title"
        documents={documents}
        clickHandler={mockClickFn}
        documentsAvailable
      />
    );
    resultNotDownloadableFiles = render(
      <NotificationDetailDocuments
        title="Mocked title"
        documents={documents}
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

  it('renders NotificationDetailDocuments', () => {
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
      expect(mockClickFn).toBeCalledWith('0');
    });
  });
});
