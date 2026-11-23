import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { A11yMessageAnnouncer } from '@pagopa-pn/pn-commons';

import { act, fireEvent, render, waitFor } from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import EmailStep from '../EmailStep';

describe('EmailStep', () => {
  const labelPrefix = 'onboarding.digital-domicile.email';
  const mockEmail = 'test@mock.pagopa.it';
  const updatedEmail = 'updated@mock.pagopa.it';

  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  const createProps = () => ({
    value: undefined,
    alreadySet: false,
    onChange: vi.fn(),
    onVerified: vi.fn(),
  });

  it('renders the entry state when no email is available', () => {
    const props = createProps();

    const { getByText, getByLabelText, getByRole, queryByRole } = render(<EmailStep {...props} />);

    expect(getByText(`${labelPrefix}.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.description`)).toBeInTheDocument();
    expect(getByLabelText(`${labelPrefix}.input-label`)).toBeInTheDocument();
    expect(getByRole('button', { name: `${labelPrefix}.verify-cta` })).toBeInTheDocument();
    expect(
      queryByRole('button', {
        name: 'button.modifica',
      })
    ).not.toBeInTheDocument();
  });

  it('announces the email validation error on each invalid verification attempt, but not while typing', async () => {
    const props = createProps();

    const { getByLabelText, getByRole, queryByRole } = render(
      <>
        <A11yMessageAnnouncer />
        <EmailStep {...props} />
      </>
    );

    const input = getByLabelText(`${labelPrefix}.input-label`);
    const verifyButton = getByRole('button', { name: `${labelPrefix}.verify-cta` });

    await act(async () => {
      fireEvent.change(input, { target: { value: 'abc' } });
    });

    expect(queryByRole('status')).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(verifyButton);
    });

    await waitFor(() => {
      expect(getByRole('status')).toHaveTextContent('courtesy-contacts.valid-email');
    });

    expect(input).toHaveAccessibleDescription('courtesy-contacts.valid-email');

    const firstAnnouncement = getByRole('status').textContent;

    await act(async () => {
      fireEvent.click(verifyButton);
    });

    await waitFor(() => {
      expect(getByRole('status').textContent).not.toBe(firstAnnouncement);
    });

    expect(getByRole('status')).toHaveTextContent('courtesy-contacts.valid-email');
    expect(props.onChange).not.toHaveBeenCalled();
    expect(props.onVerified).not.toHaveBeenCalled();
    expect(mock.history.post).toHaveLength(0);
  });

  it('verifies a new email and calls onChange and onVerified on success', async () => {
    const props = createProps();

    mock.onPost('/bff/v1/addresses/COURTESY/default/EMAIL').reply(200, {
      result: 'OK',
    });

    const { getByLabelText, getByRole, queryByRole } = render(
      <>
        <A11yMessageAnnouncer />
        <EmailStep {...props} />
      </>
    );

    await act(async () => {
      fireEvent.change(getByLabelText(`${labelPrefix}.input-label`), {
        target: { value: mockEmail },
      });
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: `${labelPrefix}.verify-cta` }));
    });

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: mockEmail,
      });
    });

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(mockEmail);
      expect(props.onVerified).toHaveBeenCalledTimes(1);
    });

    expect(queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders the readonly summary when a new email has already been added during the wizard', () => {
    const props = createProps();

    const { getByText, queryByRole } = render(
      <EmailStep {...props} value={mockEmail} alreadySet={false} />
    );

    expect(getByText(`${labelPrefix}.title-existing`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.description`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.label`)).toBeInTheDocument();
    expect(getByText(mockEmail)).toBeInTheDocument();
    expect(
      queryByRole('button', {
        name: 'button.modifica',
      })
    ).not.toBeInTheDocument();
  });

  it('renders an existing email in editable mode and enters edit state', async () => {
    const props = createProps();

    const { getByText, getByRole, getByLabelText } = render(
      <EmailStep {...props} value={mockEmail} alreadySet />
    );

    expect(getByText(`${labelPrefix}.title-existing`)).toBeInTheDocument();
    expect(getByText(mockEmail)).toBeInTheDocument();
    const editButton = getByRole('button', {
      name: 'button.modifica',
    });

    expect(editButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(editButton);
    });

    expect(getByLabelText(`${labelPrefix}.input-label`)).toBeInTheDocument();
    expect(getByRole('button', { name: 'button.conferma' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'button.annulla' })).toBeInTheDocument();
  });

  it('closes edit mode without API calls when confirming the same existing email', async () => {
    const props = createProps();

    const { getByRole, getByLabelText, queryByLabelText } = render(
      <EmailStep {...props} value={mockEmail} alreadySet />
    );

    await act(async () => {
      fireEvent.click(
        getByRole('button', {
          name: 'button.modifica',
        })
      );
    });

    await act(async () => {
      fireEvent.change(getByLabelText(`${labelPrefix}.input-label`), {
        target: { value: mockEmail },
      });
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.conferma' }));
    });

    await waitFor(() => {
      expect(queryByLabelText(`${labelPrefix}.input-label`)).not.toBeInTheDocument();
    });

    expect(props.onChange).not.toHaveBeenCalled();
    expect(props.onVerified).not.toHaveBeenCalled();
    expect(mock.history.post).toHaveLength(0);
  });

  it('verifies an edited existing email and calls onChange on success', async () => {
    const props = createProps();

    mock.onPost('/bff/v1/addresses/COURTESY/default/EMAIL').reply(200, {
      result: 'OK',
    });

    const { getByRole, getByLabelText } = render(
      <EmailStep {...props} value={mockEmail} alreadySet />
    );

    await act(async () => {
      fireEvent.click(
        getByRole('button', {
          name: 'button.modifica',
        })
      );
    });

    await act(async () => {
      fireEvent.change(getByLabelText(`${labelPrefix}.input-label`), {
        target: { value: updatedEmail },
      });
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.conferma' }));
    });

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: updatedEmail,
      });
    });

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(updatedEmail);
      expect(props.onVerified).not.toHaveBeenCalled();
    });
  });
});
