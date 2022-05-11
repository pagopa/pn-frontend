import { fireEvent, waitFor, RenderResult } from '@testing-library/react';

import { render } from '../../../test-utils';
import { NotificationDetailDocument } from '../../../types/Notifications';
import NotificationDetailDocuments from '../NotificationDetailDocuments';

const documents: Array<NotificationDetailDocument> = [
  {
    digests: {
      sha256: 'mocked-sha'
    },
    contentType: 'mocked-contentType',
    title: 'mocked-doc-title'
  }
]

describe('NotificationDetailDocuments Component', () => {
  let result: RenderResult | undefined;
  let mockClickFn: jest.Mock;

  beforeEach(() => {
    mockClickFn = jest.fn();
    // render component
    result = render(<NotificationDetailDocuments title="Mocked title" documents={documents} clickHandler={mockClickFn}/>);
  });

  afterEach(() => {
    result = undefined;
    jest.clearAllMocks();
  });

  it('renders NotificationDetailDocuments', () => {
    expect(result?.container).toHaveTextContent(/Mocked title/i);
    // expect(result?.container).toHaveTextContent(/Scarica tutti gli Atti/i);
    const documentsButtons = result?.getAllByTestId('documentButton');
    expect(documentsButtons).toHaveLength(documents.length);
  });

  it('test click on document button', async () => {
    const documentsButtons = result?.getAllByTestId('documentButton');
    fireEvent.click(documentsButtons![0]);
    await waitFor(() => {
      expect(mockClickFn).toBeCalledTimes(1);
      expect(mockClickFn).toBeCalledWith(0);
    });
  });

});