import { Mock, vi } from 'vitest';

import { notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { fireEvent, render, waitFor, within } from '../../../test-utils';
import NotificationDetailDocuments from '../NotificationDetailDocuments';

describe('NotificationDetailDocuments Component', () => {
  let mockClickFn: Mock;

  beforeEach(() => {
    mockClickFn = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component - no documents', () => {
    const { queryAllByTestId, getByTestId, container } = render(
      <NotificationDetailDocuments
        title="Mocked title"
        documents={[]}
        clickHandler={mockClickFn}
        documentsAvailable
        downloadFilesMessage="Mocked download message"
      />
    );
    expect(container).toHaveTextContent(/Mocked title/i);
    const notificationDetailDocuments = queryAllByTestId('notificationDetailDocuments');
    expect(notificationDetailDocuments).toHaveLength(0);
    const documentsMessage = getByTestId('documentsMessage');
    expect(documentsMessage).toBeInTheDocument();
  });

  it('renders component - with documents', () => {
    const { getAllByTestId, getByTestId, container } = render(
      <NotificationDetailDocuments
        title="Mocked title"
        documents={notificationDTO.documents}
        clickHandler={mockClickFn}
        documentsAvailable
        downloadFilesMessage="Mocked download message"
      />
    );
    expect(container).toHaveTextContent(/Mocked title/i);
    const notificationDetailDocuments = getAllByTestId('notificationDetailDocuments');
    expect(notificationDetailDocuments).toHaveLength(notificationDTO.documents.length);
    notificationDetailDocuments.forEach((doc, index) => {
      const currentDoc = notificationDTO.documents[index];
      if (currentDoc.title) {
        expect(doc).toHaveTextContent(currentDoc.title);
      } else {
        expect(doc).toHaveTextContent(currentDoc.ref.key);
      }
      const documentButton = within(doc).getByTestId('documentButton');
      expect(documentButton).toBeInTheDocument();
    });
    const documentsMessage = getByTestId('documentsMessage');
    expect(documentsMessage).toBeInTheDocument();
  });

  it('clicks on document button', async () => {
    const { getAllByTestId } = render(
      <NotificationDetailDocuments
        title="Mocked title"
        documents={notificationDTO.documents}
        clickHandler={mockClickFn}
        documentsAvailable
      />
    );
    const notificationDetailDocuments = getAllByTestId('notificationDetailDocuments');
    const documentButton = within(notificationDetailDocuments[0]).getByTestId('documentButton');
    fireEvent.click(documentButton);
    await waitFor(() => {
      expect(mockClickFn).toBeCalledTimes(1);
      expect(mockClickFn).toBeCalledWith('0');
    });
  });

  it('renders documents with disabled download', () => {
    const { getAllByTestId } = render(
      <NotificationDetailDocuments
        title="Mocked title"
        documents={notificationDTO.documents}
        clickHandler={mockClickFn}
        documentsAvailable
        disableDownloads
      />
    );
    const notificationDetailDocuments = getAllByTestId('notificationDetailDocuments');
    notificationDetailDocuments.forEach((doc) => {
      const button = within(doc).queryByTestId('documentButton');
      expect(button).not.toBeInTheDocument();
      expect(mockClickFn).not.toHaveBeenCalled();
      expect(doc).toHaveTextContent('not-available');
    });
  });

  it('renders component - documents not available', () => {
    const { queryAllByTestId, getByTestId } = render(
      <NotificationDetailDocuments
        title="Mocked title"
        documents={notificationDTO.documents}
        clickHandler={mockClickFn}
        documentsAvailable={false}
        downloadFilesMessage={'Mocked message'}
      />
    );
    const notificationDetailDocuments = queryAllByTestId('notificationDetailDocuments');
    expect(notificationDetailDocuments).toHaveLength(0);
    const documentsDisabledAlert = getByTestId('documentsDisabled');
    expect(documentsDisabledAlert).toBeInTheDocument();
  });
});
