import { RenderResult, act, fireEvent, waitFor } from '@testing-library/react';
import * as redux from 'react-redux';

import { render } from '../../../../__test__/test-utils';
import * as actions from '../../../../redux/newNotification/actions';
import { UploadAttachmentParams } from '../../../../models/NewNotification';
import Attachments from '../Attachments';

describe('Attachments Component', () => {
  let result: RenderResult;
  let mockDispatchFn: jest.Mock;
  let mockActionFn: jest.Mock;
  const confirmHandlerMk = jest.fn();

  const file = new Blob(['mocked content'], { type: 'application/pdf' });
  (file as any).name = 'Mocked file';

  function uploadDocument(elem: ParentNode, index: number) {
    const fileInput = elem.querySelector('[data-testid="fileInput"]');
    const input = fileInput?.querySelector('input');
    fireEvent.change(input!, { target: { files: [file] } });
    const nameInput = elem.querySelector(`[id="documents.${index}.name"]`);
    fireEvent.change(nameInput!, { target: { value: `Doc${index}` } });
  }

  async function testConfirm(
    button: HTMLButtonElement,
    documents: Array<UploadAttachmentParams>
  ) {
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith(documents);
      expect(confirmHandlerMk).toBeCalledTimes(1);
    });
  }

  beforeEach(async () => {
    // mock action
    mockActionFn = jest.fn();
    const actionSpy = jest.spyOn(actions, 'uploadNotificationAttachment');
    actionSpy.mockImplementation(mockActionFn);
    // mock dispatch
    mockDispatchFn = jest.fn(() => ({
      unwrap: () => Promise.resolve(),
    }));
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    // render component
    await act(async () => {
      result = render(<Attachments onConfirm={confirmHandlerMk} />);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('renders Attachments', () => {
    const form = result.container.querySelector('form');
    expect(form).toHaveTextContent(/Allegati per tutti i destinatari/i);
    const attachmentBoxes = result.queryAllByTestId('attachmentBox');
    expect(attachmentBoxes).toHaveLength(1);
    expect(attachmentBoxes[0]).toHaveTextContent(/Allega l'atto*/i);
    const deleteIcon = attachmentBoxes[0].querySelector('[data-testid="DeleteIcon"]');
    expect(deleteIcon).not.toBeInTheDocument();
    const fileInput = attachmentBoxes[0].parentNode?.querySelector('[data-testid="fileInput"]');
    expect(fileInput).toBeInTheDocument();
    const buttons = form?.querySelectorAll('button');
    expect(buttons).toHaveLength(3);
    expect(buttons![2]).toBeDisabled();
  });

  it('adds document and click on confirm', async () => {
    const form = result.container.querySelector('form');
    const attachmentBoxes = result.queryAllByTestId('attachmentBox');
    uploadDocument(attachmentBoxes[0].parentNode!, 0);
    const buttons = await waitFor(() => form?.querySelectorAll('button'));
    expect(buttons![2]).toBeEnabled();
    testConfirm(buttons![2], [
      {
        key: 'Doc0',
        contentType: 'application/pdf',
        file: new Uint8Array(),
        sha256: 'mocked-hasBase64',
      },
    ]);
  });

  it('adds another document and click on confirm', async () => {
    const form = result.container.querySelector('form');
    const attachmentBoxes = result.queryAllByTestId('attachmentBox');
    uploadDocument(attachmentBoxes[0].parentNode!, 0);
    const buttons = await waitFor(() => form?.querySelectorAll('button'));
    fireEvent.click(buttons![0]);
    await waitFor(() => {
      expect(buttons![2]).toBeDisabled();
    });
    const newAttachmentBoxes = result.queryAllByTestId('attachmentBox');
    expect(newAttachmentBoxes).toHaveLength(2);
    expect(newAttachmentBoxes[1]).toHaveTextContent(/Allega un altro documento*/i);
    const deleteIcon = newAttachmentBoxes[1].querySelector('[data-testid="DeleteIcon"]');
    expect(deleteIcon).toBeInTheDocument();
    uploadDocument(newAttachmentBoxes[1].parentNode!, 1);
    await waitFor(() => expect(buttons![2]).toBeEnabled());
    testConfirm(buttons![2], [
      {
        key: 'Doc0',
        contentType: 'application/pdf',
        file: new Uint8Array(),
        sha256: 'mocked-hasBase64',
      },
      {
        key: 'Doc1',
        contentType: 'application/pdf',
        file: new Uint8Array(),
        sha256: 'mocked-hasBase64',
      },
    ]);
  });

  it('delete document and click on confirm', async () => {
    const form = result.container.querySelector('form');
    const attachmentBoxes = result.queryAllByTestId('attachmentBox');
    uploadDocument(attachmentBoxes[0].parentNode!, 0);
    const buttons = await waitFor(() => form?.querySelectorAll('button'));
    fireEvent.click(buttons![0]);
    let newAttachmentBoxes = await waitFor(() => result.queryAllByTestId('attachmentBox'));
    const deleteIcon = newAttachmentBoxes[1].querySelector('[data-testid="DeleteIcon"]');
    fireEvent.click(deleteIcon!);
    newAttachmentBoxes = await waitFor(() => result.queryAllByTestId('attachmentBox'));
    expect(newAttachmentBoxes).toHaveLength(1);
    await waitFor(() => expect(buttons![2]).toBeEnabled());
    testConfirm(buttons![2], [
      {
        key: 'Doc0',
        contentType: 'application/pdf',
        file: new Uint8Array(),
        sha256: 'mocked-hasBase64',
      },
    ]);
  });
});
