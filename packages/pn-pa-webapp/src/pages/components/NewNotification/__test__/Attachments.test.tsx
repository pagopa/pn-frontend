import React from 'react';
/* eslint-disable functional/no-let */

import { RenderResult, act, fireEvent, waitFor, screen } from '@testing-library/react';
import * as redux from 'react-redux';

import { render } from '../../../../__test__/test-utils';
import { UploadDocumentParams } from '../../../../redux/newNotification/types';
import * as actions from '../../../../redux/newNotification/actions';
import Attachments from '../Attachments';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const mockIsPaymentEnabledGetter = jest.fn();
jest.mock('../../../../services/configuration.service', () => {
  return {
    ...jest.requireActual('../../../../services/configuration.service'),
    getConfiguration: () => ({
      IS_PAYMENT_ENABLED: mockIsPaymentEnabledGetter(),
    }),
  };
});


describe('Attachments Component with payment enabled', () => {
  let result: RenderResult;
  let mockDispatchFn: jest.Mock;
  let mockActionFn: jest.Mock;
  const confirmHandlerMk = jest.fn();

  const file = new Blob(['mocked content'], { type: 'application/pdf' });
  // eslint-disable-next-line functional/immutable-data
  (file as any).name = 'Mocked file';

  function uploadDocument(elem: ParentNode, index: number) {
    const nameInput = elem.querySelector(`[id="documents.${index}.name"]`);
    fireEvent.change(nameInput!, { target: { value: `Doc${index}` } });
    const fileInput = elem.querySelector('[data-testid="fileInput"]');
    const input = fileInput?.querySelector('input');
    fireEvent.change(input!, { target: { files: [file] } });
  }

  async function testConfirm(button: HTMLButtonElement, documents: Array<UploadDocumentParams>) {
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith(documents);
      expect(confirmHandlerMk).toBeCalledTimes(1);
    });
  }

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();

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
    mockIsPaymentEnabledGetter.mockReturnValue(true);

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
    expect(form).toHaveTextContent(/attach-for-recipients/i);
    const attachmentBoxes = result.queryAllByTestId('attachmentBox');
    expect(attachmentBoxes).toHaveLength(1);
    expect(attachmentBoxes[0]).toHaveTextContent(/act-attachment*/i);
    const deleteIcon = attachmentBoxes[0].querySelector('[data-testid="DeleteIcon"]');
    expect(deleteIcon).not.toBeInTheDocument();
    const fileInput = attachmentBoxes[0].parentNode?.querySelector('[data-testid="fileInput"]');
    expect(fileInput).toBeInTheDocument();
    const buttonSubmit = result.getByTestId('step-submit');
    const buttonPrevious = result.getByTestId('previous-step');
    // Avendo cambiato posizione nella lista dei bottoni (in modo da avere sempre il bottone "continua" a dx, qui vado a prendere il primo bottone)
    // flexDirection row-reverse
    // PN-1843 Carlotta Dimatteo 12/08/2022
    expect(buttonSubmit).toBeDisabled();
    expect(buttonPrevious).toHaveTextContent(/back-to-recipient/i);
  });

  it('adds document and click on confirm', async () => {
    const form = result.container.querySelector('form');
    const attachmentBoxes = result.queryAllByTestId('attachmentBox');
    uploadDocument(attachmentBoxes[0].parentNode!, 0);
    const buttons = await waitFor(() => form?.querySelectorAll('button'));
    // Avendo cambiato posizione nella lista dei bottoni (in modo da avere sempre il bottone "continua" a dx, qui vado a prendere il primo bottone)
    // flexDirection row-reverse
    // PN-1843 Carlotta Dimatteo 12/08/2022
    expect(buttons![1]).toBeEnabled();
    void testConfirm(buttons![1], [
      {
        id: 'documents.0',
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
    // Avendo cambiato posizione nella lista dei bottoni (in modo da avere sempre il bottone "continua" a dx, qui vado a prendere il primo bottone)
    // flexDirection row-reverse
    // PN-1843 Carlotta Dimatteo 12/08/2022
    await waitFor(() => {
      expect(buttons![1]).toBeDisabled();
    });
    const newAttachmentBoxes = result.queryAllByTestId('attachmentBox');
    expect(newAttachmentBoxes).toHaveLength(2);
    expect(newAttachmentBoxes[1]).toHaveTextContent(/doc-attachment*/i);
    const deleteIcon = newAttachmentBoxes[1].querySelector('[data-testid="DeleteIcon"]');
    expect(deleteIcon).toBeInTheDocument();
    uploadDocument(newAttachmentBoxes[1].parentNode!, 1);
    await waitFor(() => expect(buttons![1]).toBeEnabled());
    void testConfirm(buttons![2], [
      {
        id: 'documents.0',
        key: 'Doc0',
        contentType: 'application/pdf',
        file: new Uint8Array(),
        sha256: 'mocked-hasBase64',
      },
      {
        id: 'documents.1',
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
    await waitFor(() => {
      newAttachmentBoxes = result.queryAllByTestId('attachmentBox');
      expect(newAttachmentBoxes).toHaveLength(1);
    });
    // Avendo cambiato posizione nella lista dei bottoni (in modo da avere sempre il bottone "continua" a dx, qui vado a prendere il primo bottone)
    // flexDirection row-reverse
    // PN-1843 Carlotta Dimatteo 12/08/2022
    await waitFor(() => expect(buttons![1]).toBeEnabled());
    void testConfirm(buttons![1], [
      {
        id: 'documents.0',
        key: 'Doc0',
        contentType: 'application/pdf',
        file: new Uint8Array(),
        sha256: 'mocked-hasBase64',
      },
    ]);
  });

  it('Adds ten documents placeholders and checks that is not possible to add more', async () => {
    const form = result.container.querySelector('form');
    const buttonAddAnotherDoc = result.getByTestId('add-another-doc');
    for (let i = 0; i < 10; i++) {
      fireEvent.click(buttonAddAnotherDoc);
    }
    expect(buttonAddAnotherDoc).not.toBeInTheDocument();
    const buttonNextStep = result.getByTestId('step-submit');
    expect(buttonNextStep).toHaveTextContent(/button.continue/i);
  });
});

describe('Attachments Component without payment enabled', () => {
  let result: RenderResult;
  let mockDispatchFn: jest.Mock;
  let mockActionFn: jest.Mock;
  const confirmHandlerMk = jest.fn();

  const file = new Blob(['mocked content'], { type: 'application/pdf' });
  // eslint-disable-next-line functional/immutable-data
  (file as any).name = 'Mocked file';

  function uploadDocument(elem: ParentNode, index: number) {
    const nameInput = elem.querySelector(`[id="documents.${index}.name"]`);
    fireEvent.change(nameInput!, { target: { value: `Doc${index}` } });
    const fileInput = elem.querySelector('[data-testid="fileInput"]');
    const input = fileInput?.querySelector('input');
    fireEvent.change(input!, { target: { files: [file] } });
  }

  async function testConfirm(button: HTMLButtonElement, documents: Array<UploadDocumentParams>) {
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith(documents);
      expect(confirmHandlerMk).toBeCalledTimes(1);
    });
  }

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();
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
    mockIsPaymentEnabledGetter.mockReturnValue(false);

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
    expect(form).toHaveTextContent(/attach-for-recipients/i);
    const attachmentBoxes = result.queryAllByTestId('attachmentBox');
    expect(attachmentBoxes).toHaveLength(1);
    expect(attachmentBoxes[0]).toHaveTextContent(/act-attachment*/i);
    const deleteIcon = attachmentBoxes[0].querySelector('[data-testid="DeleteIcon"]');
    expect(deleteIcon).not.toBeInTheDocument();
    const fileInput = attachmentBoxes[0].parentNode?.querySelector('[data-testid="fileInput"]');
    expect(fileInput).toBeInTheDocument();
    const buttonSubmit = result.getByTestId('step-submit');
    const buttonPrevious = result.getByTestId('previous-step');
    // Avendo cambiato posizione nella lista dei bottoni (in modo da avere sempre il bottone "continua" a dx, qui vado a prendere il primo bottone)
    // flexDirection row-reverse
    // PN-1843 Carlotta Dimatteo 12/08/2022
    waitFor(() => {
      expect(buttonSubmit).toBeDisabled();
    });
    expect(buttonPrevious).toHaveTextContent(/back-to-recipient/i);
  });

  it('adds document and click on confirm', async () => {
    const form = result.container.querySelector('form');
    const attachmentBoxes = result.queryAllByTestId('attachmentBox');
    uploadDocument(attachmentBoxes[0].parentNode!, 0);
    const button = await waitFor(() => result.getByTestId('step-submit'));
    // Avendo cambiato posizione nella lista dei bottoni (in modo da avere sempre il bottone "continua" a dx, qui vado a prendere il primo bottone)
    // flexDirection row-reverse
    // PN-1843 Carlotta Dimatteo 12/08/2022
    expect(button).toBeEnabled();
    void testConfirm(button as HTMLButtonElement, [
      {
        id: 'documents.0',
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
    // Avendo cambiato posizione nella lista dei bottoni (in modo da avere sempre il bottone "continua" a dx, qui vado a prendere il primo bottone)
    // flexDirection row-reverse
    // PN-1843 Carlotta Dimatteo 12/08/2022
    await waitFor(() => {
      expect(buttons![1]).toBeDisabled();
    });
    const newAttachmentBoxes = result.queryAllByTestId('attachmentBox');
    expect(newAttachmentBoxes).toHaveLength(2);
    expect(newAttachmentBoxes[1]).toHaveTextContent(/doc-attachment*/i);
    const deleteIcon = newAttachmentBoxes[1].querySelector('[data-testid="DeleteIcon"]');
    expect(deleteIcon).toBeInTheDocument();
    uploadDocument(newAttachmentBoxes[1].parentNode!, 1);
    await waitFor(() => expect(buttons![1]).toBeEnabled());
    void testConfirm(buttons![2], [
      {
        id: 'documents.0',
        key: 'Doc0',
        contentType: 'application/pdf',
        file: new Uint8Array(),
        sha256: 'mocked-hasBase64',
      },
      {
        id: 'documents.1',
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
    await waitFor(() => {
      newAttachmentBoxes = result.queryAllByTestId('attachmentBox');
      expect(newAttachmentBoxes).toHaveLength(1);
    });
    // Avendo cambiato posizione nella lista dei bottoni (in modo da avere sempre il bottone "continua" a dx, qui vado a prendere il primo bottone)
    // flexDirection row-reverse
    // PN-1843 Carlotta Dimatteo 12/08/2022
    await waitFor(() => expect(buttons![1]).toBeEnabled());
    void testConfirm(buttons![1], [
      {
        id: 'documents.0',
        key: 'Doc0',
        contentType: 'application/pdf',
        file: new Uint8Array(),
        sha256: 'mocked-hasBase64',
      },
    ]);
  });

  it('Adds ten documents placeholders and checks that is not possible to add more', async () => {
    const form = result.container.querySelector('form');
    const buttonAddAnotherDoc = result.getByTestId('add-another-doc');
    for (let i = 0; i < 10; i++) {
      fireEvent.click(buttonAddAnotherDoc);
    }
    expect(buttonAddAnotherDoc).not.toBeInTheDocument();
    const buttonNextStep = result.getByTestId('step-submit');
    expect(buttonNextStep).toHaveTextContent(/button.send/i);
  });
});
