import { vi } from 'vitest';

import { Configuration } from '@pagopa-pn/pn-commons';

import { IDPS_MOCK } from '../../../__mocks__/IDPS.mock';
import { fireEvent, render } from '../../../__test__/test-utils';
import { LoginConfiguration } from '../../../services/configuration.service';
import SpidList from '../SpidList';

const handleSelect = vi.fn();

describe('SpidList', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner when loading is true', () => {
    const { getByTestId, queryAllByRole } = render(
      <SpidList idps={IDPS_MOCK} loading={true} onSelect={handleSelect} />
    );
    expect(getByTestId('spid-loader')).toBeInTheDocument();
    expect(queryAllByRole('button')).toHaveLength(0);
  });

  it('renders idp buttons when not loading', () => {
    const { queryByTestId, getAllByRole } = render(
      <SpidList idps={IDPS_MOCK} loading={false} onSelect={handleSelect} />
    );
    expect(queryByTestId('spid-loader')).not.toBeInTheDocument();
    expect(getAllByRole('button')).toHaveLength(IDPS_MOCK.length);
  });

  it('renders a button for each idp with correct id and aria-label', () => {
    render(<SpidList idps={IDPS_MOCK} loading={false} onSelect={handleSelect} />);
    IDPS_MOCK.forEach((idp) => {
      const btn = document.getElementById(`spid-select-${idp.entityID}`);
      expect(btn).toBeInTheDocument();
      expect(btn).toHaveAttribute('aria-label', idp.friendlyName);
    });
  });

  it('calls onSelect with the correct idp when a button is clicked', () => {
    const onSelect = vi.fn();
    render(<SpidList idps={IDPS_MOCK} loading={false} onSelect={onSelect} />);
    const btn = document.getElementById(`spid-select-${IDPS_MOCK[0].entityID}`)!;
    fireEvent.click(btn);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(IDPS_MOCK[0]);
  });

  it('renders images with correct src built from CDN and btoa(entityID)', () => {
    render(<SpidList idps={IDPS_MOCK} loading={false} onSelect={handleSelect} />);
    const cdnUrl = Configuration.get<LoginConfiguration>().ONE_IDENTITY_CDN_URL;

    IDPS_MOCK.forEach((idp) => {
      const expectedSrc = `${cdnUrl}/assets/idps/${btoa(idp.entityID)}.png`;
      const btn = document.getElementById(`spid-select-${idp.entityID}`)!;
      const img = btn.querySelector('img');
      expect(img).toHaveAttribute('src', expectedSrc);
    });
  });

  it('renders no empty state when idps list is empty', () => {
    const { getByTestId } = render(<SpidList idps={[]} loading={false} onSelect={handleSelect} />);

    expect(getByTestId('idp-empty-state')).toBeInTheDocument();
  });
});
