import { vi } from 'vitest';

import { getById, queryById } from '@pagopa-pn/pn-commons/src/test-utils';

import { IDPS_MOCK } from '../../../__mocks__/IDPS.mock';
import { fireEvent, render } from '../../../__test__/test-utils';
import OneIdentitySpidSelectDialog from '../SpidSelectDialog';

const SPID_REQUEST_LINK = 'https://spid.test/request';

vi.mock('../../../services/configuration.service', async () => ({
  ...(await vi.importActual<any>('../../../services/configuration.service')),
  getConfiguration: () => ({
    SPID_REQUEST_LINK,
  }),
}));

vi.mock('../../../utility/utils', async () => ({
  ...(await vi.importActual<any>('../../../utility/utils')),
  shuffleList: vi.fn().mockImplementation(<T,>(list: Array<T>) => list),
}));

describe('OneIdentitySpidSelectDialog', () => {
  const onClose = vi.fn();
  const handleSelectIDP = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    show: true,
    IDPS: IDPS_MOCK,
    loading: false,
    authorizingEntityId: null,
    onClose,
    handleSelectIDP,
  };

  it('does not render dialog content when show is false', () => {
    render(<OneIdentitySpidSelectDialog {...defaultProps} show={false} />);
    expect(queryById(document.body, 'spidSelect')).not.toBeInTheDocument();
  });

  it('renders the modal', () => {
    render(<OneIdentitySpidSelectDialog {...defaultProps} />);
    expect(document.body).toHaveTextContent('spidSelect.title');

    fireEvent.click(getById(document.body, 'backIcon'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the cancel button is clicked', () => {
    render(<OneIdentitySpidSelectDialog {...defaultProps} />);
    fireEvent.click(getById(document.body, 'backButton'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders the request spid link with the correct href', () => {
    render(<OneIdentitySpidSelectDialog {...defaultProps} />);
    const link = getById(document.body, 'requestForSpid');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', SPID_REQUEST_LINK);
  });

  it('shows loading spinner when loading is true', () => {
    render(<OneIdentitySpidSelectDialog {...defaultProps} loading={true} />);
    expect(document.body.querySelector('[data-testid="spid-loader"]')).toBeInTheDocument();
  });

  it('calls handleSelectIDP with the correct idp when an idp button is clicked', () => {
    render(<OneIdentitySpidSelectDialog {...defaultProps} />);
    const btn = document.getElementById(`spid-select-${IDPS_MOCK[0].entityID}`)!;
    fireEvent.click(btn);
    expect(handleSelectIDP).toHaveBeenCalledTimes(1);
    expect(handleSelectIDP).toHaveBeenCalledWith(IDPS_MOCK[0]);
  });

  it('disables idp buttons and shows overlay spinner when authorizingEntityId is set', () => {
    const authorizingId = IDPS_MOCK[0].entityID;
    render(<OneIdentitySpidSelectDialog {...defaultProps} authorizingEntityId={authorizingId} />);
    const btn = document.getElementById(`spid-select-${authorizingId}`)!;
    expect(btn).toBeDisabled();
    expect(btn.querySelector('[role="progressbar"]')).toBeInTheDocument();
  });
});
