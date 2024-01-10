import { vi } from 'vitest';

import {
  RenderResult,
  fireEvent,
  initLocalizationForTest,
  render,
  waitFor,
} from '../../test-utils';
import FileUpload from '../FileUpload';

const mockUploadFn = vi.fn();
const mockUploadFileHandler = vi.fn();
const mockRemoveFileHandler = vi.fn();

const file = new File(['mocked content'], 'Mocked file', { type: 'text/plain' });
const bigFile = new File(['mocked content big'], 'Mocked big file', { type: 'text/plain' });
const wrongTypeFile = new File(['mocked content'], 'Wrong file type', { type: 'application/pdf' });

async function testFileUploading(result: RenderResult) {
  const fileInput = result.queryByTestId('fileInput');
  expect(fileInput).toBeInTheDocument();
  const input = fileInput?.querySelector('input');
  fireEvent.change(input!, { target: { files: [file] } });
  await waitFor(() => {
    expect(mockUploadFn).toBeCalledTimes(1);
    expect(mockUploadFn).toBeCalledWith(file, undefined);
    expect(result.container).toHaveTextContent('common - upload-file.loading');
  });
}

describe('FileUpload Component', () => {
  let result: RenderResult;

  beforeAll(() => {
    initLocalizationForTest();
  });

  beforeEach(() => {
    mockUploadFn.mockImplementation(vi.fn(() => Promise.resolve(null)));
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it('renders FileUpload', () => {
    // render component
    result = render(
      <FileUpload
        uploadText="Mocked upload text"
        accept="text/plain"
        uploadFn={mockUploadFn}
        onFileUploaded={mockUploadFileHandler}
        onRemoveFile={mockRemoveFileHandler}
        fileSizeLimit={file.size}
      />
    );
    expect(result.container).toHaveTextContent(/Mocked upload text/i);
    const loadFromPc = result.getByTestId('loadFromPc');
    expect(loadFromPc).toBeInTheDocument();
    const fileInput = result.getByTestId('fileInput');
    expect(fileInput).toBeInTheDocument();
  });

  it('uploads file (file too big)', async () => {
    // render component
    result = render(
      <FileUpload
        uploadText="Mocked upload text"
        accept="text/plain"
        uploadFn={mockUploadFn}
        onFileUploaded={mockUploadFileHandler}
        onRemoveFile={mockRemoveFileHandler}
        fileSizeLimit={file.size}
      />
    );
    const fileInput = result.getByTestId('fileInput');
    const input = fileInput?.querySelector('input');
    fireEvent.change(input!, { target: { files: [bigFile] } });
    await waitFor(() => {
      expect(mockUploadFn).not.toBeCalled();
      expect(result.container).toHaveTextContent(/Mocked upload text/i);
      expect(result.container).toHaveTextContent(
        `common - upload-file.file-size-exceeded - ${JSON.stringify({ limit: '14 Bytes' })}`
      );
    });
  });

  it('uploads file (wrong format)', async () => {
    // render component
    result = render(
      <FileUpload
        uploadText="Mocked upload text"
        accept="text/plain"
        uploadFn={mockUploadFn}
        onFileUploaded={mockUploadFileHandler}
        onRemoveFile={mockRemoveFileHandler}
        fileSizeLimit={file.size}
      />
    );
    const fileInput = result.queryByTestId('fileInput');
    expect(fileInput).toBeInTheDocument();
    const input = fileInput?.querySelector('input');
    fireEvent.change(input!, { target: { files: [wrongTypeFile] } });
    await waitFor(() => {
      expect(mockUploadFn).not.toBeCalled();
      expect(result.container).toHaveTextContent(/Mocked upload text/i);
      expect(result.container).toHaveTextContent('common - upload-file.ext-not-supported');
    });
  });

  it('uploads file (error)', async () => {
    // render component
    result = render(
      <FileUpload
        uploadText="Mocked upload text"
        accept="text/plain"
        uploadFn={mockUploadFn}
        onFileUploaded={mockUploadFileHandler}
        onRemoveFile={mockRemoveFileHandler}
        fileSizeLimit={file.size}
      />
    );
    mockUploadFn.mockImplementation(vi.fn(() => Promise.reject(null)));
    await testFileUploading(result);
    expect(result.container).toHaveTextContent('common - upload-file.loading-error');
  });

  it('uploads the same file', async () => {
    // render component
    result = render(
      <FileUpload
        uploadText="Mocked upload text"
        accept="text/plain"
        uploadFn={mockUploadFn}
        onFileUploaded={mockUploadFileHandler}
        onRemoveFile={mockRemoveFileHandler}
        fileSizeLimit={file.size}
        fileUploaded={{
          file: { data: file, sha256: { hashHex: 'hashHex', hashBase64: 'hashBase64' } },
        }}
      />
    );
    mockUploadFn.mockImplementation(vi.fn(() => Promise.resolve(null)));
    await waitFor(() => {
      expect(result.container).toHaveTextContent(/Mocked file/i);
      expect(mockUploadFileHandler).toBeCalledTimes(0);
    });
  });

  it('uploads file (correct format)', async () => {
    // render component
    result = render(
      <FileUpload
        uploadText="Mocked upload text"
        accept="text/plain"
        uploadFn={mockUploadFn}
        onFileUploaded={mockUploadFileHandler}
        onRemoveFile={mockRemoveFileHandler}
        fileSizeLimit={file.size}
      />
    );
    await testFileUploading(result);
    await waitFor(() => {
      expect(result.container).toHaveTextContent(/Mocked file/i);
      expect(mockUploadFileHandler).toBeCalledTimes(1);
    });
  });

  it('removes file uploaded', async () => {
    // render component
    result = render(
      <FileUpload
        uploadText="Mocked upload text"
        accept="text/plain"
        uploadFn={mockUploadFn}
        onFileUploaded={mockUploadFileHandler}
        onRemoveFile={mockRemoveFileHandler}
        fileSizeLimit={file.size}
      />
    );
    await testFileUploading(result);
    const removeIcon = result.queryByTestId('CloseIcon');
    expect(removeIcon).toBeInTheDocument();
    fireEvent.click(removeIcon!);
    await waitFor(() => {
      expect(mockRemoveFileHandler).toBeCalledTimes(1);
      expect(result.container).toHaveTextContent(/Mocked upload text/i);
    });
  });
});
