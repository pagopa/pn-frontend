import { fireEvent, render, waitFor } from '../../../../__test__/test-utils';
import ApiKeyModal, { ApiKeyModalProps } from '../ApiKeyModal';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const closeModalFn = jest.fn();
const actionModalFn = jest.fn();

const defaultProps: ApiKeyModalProps = {
  titleSx: {},
  title: 'mock-title',
  subTitle: 'mock-subtitle',
  content: <p>mocked-content</p>,
  closeButtonLabel: 'mock-close',
  closeModalHandler: closeModalFn,
  actionButtonLabel: 'mock-action',
  actionHandler: actionModalFn,
}

const propsWithBottomSubtitle = {
  ...defaultProps,
  subTitleAtBottom: true
}

describe('ApiKeyModal component', () => {

  it('render component', () => {
    const result = render(<ApiKeyModal {...defaultProps}/>)
    expect(result.container).toHaveTextContent('mock-title');
    expect(result.container).toHaveTextContent('mocked-content');
    expect(result.queryByTestId('subtitle-top')).toBeInTheDocument();
    expect(result.queryByTestId('subtitle-bottom')).not.toBeInTheDocument();
  });

  it('render component with subtitle at bottom', () => {
    const result = render(<ApiKeyModal {...propsWithBottomSubtitle}/>)
    expect(result.container).toHaveTextContent('mock-title');
    expect(result.container).toHaveTextContent('mocked-content');
    expect(result.queryByTestId('subtitle-top')).not.toBeInTheDocument();
    expect(result.queryByTestId('subtitle-bottom')).toBeInTheDocument();
  });

  it('render component and click close button', async () => {
    const result = render(<ApiKeyModal {...defaultProps}/>)
    expect(result.container).toHaveTextContent('mock-title');
    const closeButton = result.getByTestId('close-modal-button');
    await waitFor(() => fireEvent.click(closeButton));
    expect(closeModalFn).toBeCalledTimes(1);
  });

  it('render component and click action button', async () => {
    const result = render(<ApiKeyModal {...defaultProps}/>)
    expect(result.container).toHaveTextContent('mock-title');
    const actionButton = result.getByTestId('action-modal-button');
    await waitFor(() => fireEvent.click(actionButton));
    expect(actionModalFn).toBeCalledTimes(1);
  });
});
