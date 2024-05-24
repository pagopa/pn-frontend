import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { testInput } from '@pagopa-pn/pn-commons/src/test-utils';

import { newNotification } from '../../../__mocks__/NewNotification.mock';
import {
  RenderResult,
  act,
  fireEvent,
  render,
  testStore,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import { apiClient, externalClient } from '../../../api/apiClients';
import { NewNotificationDocument } from '../../../models/NewNotification';
import Attachments from '../Attachments';

const mockIsPaymentEnabledGetter = vi.fn();

// mock imports
vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

vi.mock('../../../services/configuration.service', async () => {
  return {
    ...(await vi.importActual<any>('../../../services/configuration.service')),
    getConfiguration: () => ({
      IS_PAYMENT_ENABLED: mockIsPaymentEnabledGetter(),
    }),
  };
});

const confirmHandlerMk = vi.fn();

async function uploadDocument(elem: HTMLElement, index: number, document: NewNotificationDocument) {
  const nameInput = elem.querySelector(`[id="documents.${index}.name"]`);
  fireEvent.change(nameInput!, { target: { value: document.name } });
  await waitFor(() => {
    expect(nameInput).toHaveValue(document.name);
  });
  const fileInput = elem.querySelector('[data-testid="fileInput"]');
  const input = fileInput?.querySelector('input');
  fireEvent.change(input!, { target: { files: [document.file.data] } });
  await waitFor(() => {
    expect(elem).toHaveTextContent(document.file.data?.name!);
  });
}

describe('Attachments Component with payment enabled', async () => {
  let result: RenderResult;
  let mock: MockAdapter;
  let extMock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    extMock = new MockAdapter(externalClient);
  });

  beforeEach(async () => {
    mockIsPaymentEnabledGetter.mockReturnValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
    mock.reset();
    extMock.reset();
  });

  afterAll(() => {
    mock.restore();
    extMock.restore();
  });

  it('renders component', async () => {
    // render component
    await act(async () => {
      result = render(<Attachments isCompleted={false} onConfirm={confirmHandlerMk} />);
    });
    const form = result.container.querySelector('form');
    expect(form).toHaveTextContent(/attach-for-recipients/i);
    const attachmentBoxes = within(form!).getAllByTestId('attachmentBox');
    expect(attachmentBoxes).toHaveLength(1);
    expect(attachmentBoxes[0]).toHaveTextContent(/act-attachment*/i);
    const deleteIcon = within(attachmentBoxes[0]).queryByTestId('deletebutton');
    expect(deleteIcon).not.toBeInTheDocument();
    const fileInput = within(attachmentBoxes[0]).getByTestId('fileInput');
    expect(fileInput).toBeInTheDocument();
    const attachmentNameInput = within(attachmentBoxes[0]).getByTestId('attachmentNameInput');
    expect(attachmentNameInput).toBeInTheDocument();
    const buttonSubmit = result.getByTestId('step-submit');
    const buttonPrevious = result.getByTestId('previous-step');
    expect(buttonSubmit).toBeDisabled();
    expect(buttonSubmit).toHaveTextContent('button.continue');
    expect(buttonPrevious).toBeInTheDocument();
  });

  it('changes form values and clicks on confirm - one document', async () => {
    mock
      .onPost('/bff/v1/notifications/sent/documents/preload', [
        {
          contentType: newNotification.documents[0].contentType,
          sha256: 'mocked-hashBase64',
        },
      ])
      .reply(200, [
        {
          url: 'https://mocked-url.com',
          secret: 'mocked-secret',
          httpMethod: 'PUT',
          key: 'mocked-key',
        },
      ]);
    extMock.onPut(`https://mocked-url.com`).reply(200, newNotification.documents[0].file.data, {
      'x-amz-version-id': 'mocked-versionToken',
    });
    // render component
    await act(async () => {
      result = render(<Attachments isCompleted={false} onConfirm={confirmHandlerMk} />);
    });
    const form = result.container.querySelector('form');
    let attachmentBoxes = within(form!).getAllByTestId('attachmentBox');
    await uploadDocument(attachmentBoxes[0], 0, newNotification.documents[0]);
    const buttonSubmit = await waitFor(() => result.getByTestId('step-submit'));
    // add second document form
    const addButton = result.getByTestId('add-another-doc');
    fireEvent.click(addButton);
    await waitFor(() => {
      attachmentBoxes = within(form!).getAllByTestId('attachmentBox');
      expect(buttonSubmit).toBeDisabled();
    });
    // remove second document form
    const deleteButton = within(attachmentBoxes[1]).getByTestId('deletebutton');
    fireEvent.click(deleteButton);
    await waitFor(() => {
      expect(buttonSubmit).toBeEnabled();
    });
    fireEvent.click(buttonSubmit);
    await waitFor(() => {
      // check api call
      expect(mock.history.post).toHaveLength(1);
      expect(extMock.history.put).toHaveLength(1);
      // check data stored in redux state
      const state = testStore.getState();
      expect(state.newNotificationState.notification.documents).toStrictEqual([
        {
          ...newNotification.documents[0],
          id: 'documents.0',
          file: {
            ...newNotification.documents[0].file,
            sha256: {
              hashBase64: 'mocked-hashBase64',
              hashHex: 'mocked-hashHex',
            },
          },
          ref: {
            versionToken: 'mocked-versionToken',
            key: 'mocked-key',
          },
        },
      ]);
    });
    expect(confirmHandlerMk).toBeCalledTimes(1);
  });

  it('fills form with invalid values - one document', async () => {
    // render component
    await act(async () => {
      result = render(<Attachments isCompleted={false} onConfirm={confirmHandlerMk} />);
    });
    const form = result.container.querySelector('form');
    let attachmentBoxes = within(form!).getAllByTestId('attachmentBox');
    // upload first document
    await uploadDocument(attachmentBoxes[0], 0, newNotification.documents[0]);
    const buttonSubmit = await waitFor(() => result.getByTestId('step-submit'));
    expect(buttonSubmit).toBeEnabled();
    // remove document uploaded
    const removeDocument = within(attachmentBoxes[0]).getByTestId('removeDocument');
    fireEvent.click(removeDocument);
    await waitFor(() => {
      expect(buttonSubmit).toBeDisabled();
    });
    await testInput(form!, `documents.0.name`, '');
    await testInput(form!, `documents.0.name`, ' text-with-spaces ');
    const error = form!.querySelector(`[id="documents.0.name-helper-text"]`);
    expect(error).toHaveTextContent('no-spaces-at-edges');
  });

  it('changes form values and clicks on back - one document', async () => {
    const previousHandlerMk = vi.fn();
    // render component
    await act(async () => {
      result = render(
        <Attachments
          isCompleted={false}
          onConfirm={confirmHandlerMk}
          onPreviousStep={previousHandlerMk}
        />
      );
    });
    const form = result.container.querySelector('form');
    const attachmentBoxes = within(form!).getAllByTestId('attachmentBox');
    // upload first document
    await uploadDocument(attachmentBoxes[0], 0, newNotification.documents[0]);
    const backButton = await waitFor(() => within(form!).getByTestId('previous-step'));
    fireEvent.click(backButton);
    await waitFor(() => {
      // check data stored in redux state
      const state = testStore.getState();
      expect(state.newNotificationState.notification.documents).toStrictEqual([
        {
          ...newNotification.documents[0],
          id: 'documents.0',
          file: {
            ...newNotification.documents[0].file,
            sha256: {
              hashBase64: 'mocked-hashBase64',
              hashHex: 'mocked-hashHex',
            },
          },
          ref: {
            versionToken: '',
            key: '',
          },
        },
      ]);
    });
    expect(previousHandlerMk).toBeCalledTimes(1);
  });

  it('changes form values and clicks on confirm - two documents', async () => {
    mock
      .onPost('/bff/v1/notifications/sent/documents/preload', [
        {
          contentType: newNotification.documents[0].contentType,
          sha256: 'mocked-hashBase64',
        },
        {
          contentType: newNotification.documents[1].contentType,
          sha256: 'mocked-hashBase64',
        },
      ])
      .reply(200, [
        {
          url: 'https://mocked-url-0.com',
          secret: 'mocked-secret',
          httpMethod: 'PUT',
          key: 'mocked-key-0',
        },
        {
          url: 'https://mocked-url-1.com',
          secret: 'mocked-secret',
          httpMethod: 'PUT',
          key: 'mocked-key-1',
        },
      ]);
    extMock.onPut(`https://mocked-url-0.com`).reply(200, newNotification.documents[0].file.data, {
      'x-amz-version-id': 'mocked-versionToken-0',
    });
    extMock.onPut(`https://mocked-url-1.com`).reply(200, newNotification.documents[1].file.data, {
      'x-amz-version-id': 'mocked-versionToken-1',
    });
    // render component
    await act(async () => {
      result = render(<Attachments isCompleted={false} onConfirm={confirmHandlerMk} />);
    });
    const form = result.container.querySelector('form');
    let attachmentBoxes = within(form!).getAllByTestId('attachmentBox');
    // upload first document
    await uploadDocument(attachmentBoxes[0], 0, newNotification.documents[0]);
    const buttonSubmit = await waitFor(() => result.getByTestId('step-submit'));
    expect(buttonSubmit).toBeEnabled();
    // add and upload second document
    const addButton = result.getByTestId('add-another-doc');
    fireEvent.click(addButton);
    attachmentBoxes = await waitFor(() => within(form!).getAllByTestId('attachmentBox'));
    expect(attachmentBoxes).toHaveLength(2);
    expect(buttonSubmit).toBeDisabled();
    await uploadDocument(attachmentBoxes[1], 1, newNotification.documents[1]);
    await waitFor(() => {
      expect(buttonSubmit).toBeEnabled();
    });
    fireEvent.click(buttonSubmit);
    await waitFor(() => {
      // check api call
      expect(mock.history.post).toHaveLength(1);
      expect(extMock.history.put).toHaveLength(2);
      // check data stored in redux state
      const state = testStore.getState();
      expect(state.newNotificationState.notification.documents).toStrictEqual([
        {
          ...newNotification.documents[0],
          id: 'documents.0',
          file: {
            ...newNotification.documents[0].file,
            sha256: {
              hashBase64: 'mocked-hashBase64',
              hashHex: 'mocked-hashHex',
            },
          },
          ref: {
            versionToken: 'mocked-versionToken-0',
            key: 'mocked-key-0',
          },
        },
        {
          ...newNotification.documents[1],
          id: 'documents.1',
          file: {
            ...newNotification.documents[1].file,
            sha256: {
              hashBase64: 'mocked-hashBase64',
              hashHex: 'mocked-hashHex',
            },
          },
          ref: {
            versionToken: 'mocked-versionToken-1',
            key: 'mocked-key-1',
          },
        },
      ]);
    });
    expect(confirmHandlerMk).toBeCalledTimes(1);
  });

  it('fills form with invalid values - two documents', async () => {
    // render component
    await act(async () => {
      result = render(<Attachments isCompleted={false} onConfirm={confirmHandlerMk} />);
    });
    const form = result.container.querySelector('form');
    let attachmentBoxes = within(form!).getAllByTestId('attachmentBox');
    // upload first document
    await uploadDocument(attachmentBoxes[0], 0, newNotification.documents[0]);
    const buttonSubmit = await waitFor(() => result.getByTestId('step-submit'));
    expect(buttonSubmit).toBeEnabled();
    // add and upload second document
    const addButton = result.getByTestId('add-another-doc');
    fireEvent.click(addButton);
    attachmentBoxes = await waitFor(() => within(form!).getAllByTestId('attachmentBox'));
    expect(attachmentBoxes).toHaveLength(2);
    expect(buttonSubmit).toBeDisabled();
    await uploadDocument(attachmentBoxes[1], 1, newNotification.documents[1]);
    await waitFor(() => {
      expect(buttonSubmit).toBeEnabled();
    });
    // remove second document name
    await testInput(form!, `documents.1.name`, '');
    const error = form!.querySelector(`[id="documents.1.name-helper-text"]`);
    expect(error).toHaveTextContent('required-field');
    expect(buttonSubmit).toBeDisabled();
    // remove second document and check that the form returns valid
    const deleteButton = within(attachmentBoxes[1]).getByTestId('deletebutton');
    fireEvent.click(deleteButton);
    await waitFor(() => {
      expect(buttonSubmit).toBeEnabled();
    });
  });

  it('form initially filled - two documents', async () => {
    // render component
    await act(async () => {
      result = render(
        <Attachments
          isCompleted={false}
          onConfirm={confirmHandlerMk}
          attachmentsData={newNotification.documents}
        />
      );
    });
    const form = result.container.querySelector('form');
    const attachmentBoxes = within(form!).getAllByTestId('attachmentBox');
    expect(attachmentBoxes).toHaveLength(newNotification.documents.length);
    const submitButton = within(form!).getByTestId('step-submit');
    expect(submitButton).toBeEnabled();
  });

  it('Adds ten documents placeholders and checks that is not possible to add more', async () => {
    // render component
    await act(async () => {
      result = render(<Attachments isCompleted={false} onConfirm={confirmHandlerMk} />);
    });
    const form = result.container.querySelector('form');
    const buttonAddAnotherDoc = within(form!).getByTestId('add-another-doc');
    for (let i = 0; i < 10; i++) {
      await act(async () => {
        fireEvent.click(buttonAddAnotherDoc);
      });
    }
    expect(buttonAddAnotherDoc).not.toBeInTheDocument();
  });
});

describe('Attachments Component without payment enabled', () => {
  let result: RenderResult;

  beforeEach(async () => {
    mockIsPaymentEnabledGetter.mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component', async () => {
    // render component
    await act(async () => {
      result = render(<Attachments isCompleted={false} onConfirm={confirmHandlerMk} />);
    });
    const form = result.container.querySelector('form');
    const buttonSubmit = within(form!).getByTestId('step-submit');
    expect(buttonSubmit).toHaveTextContent('button.send');
  });

  it('changes form values and clicks on confirm - one document and completed set to true', async () => {
    // render component
    await act(async () => {
      result = render(<Attachments isCompleted={true} onConfirm={confirmHandlerMk} />);
    });
    const form = result.container.querySelector('form');
    const attachmentBoxes = within(form!).getAllByTestId('attachmentBox');
    await uploadDocument(attachmentBoxes[0], 0, newNotification.documents[0]);
    const buttonSubmit = await waitFor(() => within(form!).getByTestId('step-submit'));
    expect(buttonSubmit).toBeEnabled();
    fireEvent.click(buttonSubmit);
    await waitFor(() => {
      expect(confirmHandlerMk).toBeCalledTimes(1);
    });
  });
});
