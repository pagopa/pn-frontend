import { fireEvent, waitFor, RenderResult, screen } from '@testing-library/react';

import { render } from '../../../test-utils';
import { NotificationDetailDocument } from '../../../types';
import NotificationDetailDocuments from '../NotificationDetailDocuments';
import React from 'react';

const documents: Array<NotificationDetailDocument> = [
  {
    digests: {
      sha256: 'mocked-sha',
    },
    ref: {
      key: 'mocked-doc-title',
      versionToken: 'mocked-versionToken',
    },
    contentType: 'mocked-contentType',
    title: 'mocked-doc-title',
    docIdx: '0',
  },
];

describe('NotificationDetailDocuments Component', () => {
  let mockClickFn: jest.Mock;

  beforeEach(() => {
    mockClickFn = jest.fn();
    // render component

    /*  resultNotDownloadableFiles = render(
      <NotificationDetailDocuments
        title="Mocked title"
        documents={documents}
        clickHandler={mockClickFn}
        documentsAvailable={false}
        downloadFilesMessage="mocked"
      />
    ); */
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders NotificationDetailDocuments', () => {
    const resultWithDownloadableFiles = render(
      <NotificationDetailDocuments
        title="Mocked title"
        documents={documents}
        clickHandler={mockClickFn}
        documentsAvailable
      />
    );
    expect(resultWithDownloadableFiles?.container).toHaveTextContent(/Mocked title/i);
    // expect(result?.container).toHaveTextContent(/Scarica tutti gli Atti/i);
    const documentsButtons = resultWithDownloadableFiles?.getAllByTestId('documentButton');
    expect(documentsButtons).toHaveLength(documents.length);
  });

  it('test click on document button', async () => {
    const resultWithDownloadableFiles = render(
      <NotificationDetailDocuments
        title="Mocked title"
        documents={documents}
        clickHandler={mockClickFn}
        documentsAvailable
      />
    );
    const documentsButtons = resultWithDownloadableFiles?.getAllByTestId('documentButton');
    fireEvent.click(documentsButtons![0]);
    await waitFor(() => {
      expect(mockClickFn).toBeCalledTimes(1);
      expect(mockClickFn).toBeCalledWith('0');
    });
  });

  it('renders documents with disabled our download', () => {
    const resultDisabledFiles = render(
      <NotificationDetailDocuments
        title="Mocked title"
        documents={documents}
        clickHandler={mockClickFn}
        documentsAvailable
        disableDownloads={true}
      />
    );
    const documentsButtons = resultDisabledFiles?.getByTestId('documentButton');
    expect(documentsButtons).toHaveAttribute('disabled');
  });
});
