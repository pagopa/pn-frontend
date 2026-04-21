import { createRef } from 'react';
import { vi } from 'vitest';

import { fireEvent, render } from '../../../../../__test__/test-utils';
import { ChannelType } from '../../../../../models/contacts';
import CourtesyContactHandler from '../CourtesyContactHandler';

describe('CourtesyContactHandler', () => {
  const mockEmail = 'test@mock.pagopa.it';

  const createProps = (channelType: ChannelType.EMAIL | ChannelType.SMS = ChannelType.EMAIL) => ({
    channelType,
    contactValue: '',
    contactState: { value: undefined as string | undefined, alreadySet: false },
    onContactValueChange: vi.fn(),
    onInputBlur: vi.fn(),
    onVerifyContact: vi.fn(),
    onSubmitEdit: vi.fn(),
    onExpand: vi.fn(),
    onCollapse: vi.fn(),
    contactRef: createRef<{
      toggleEdit: () => void;
      resetForm: () => Promise<void>;
    }>(),
  });

  it('renders the collapsed mode and triggers onExpand when the CTA is clicked', () => {
    const props = createProps(ChannelType.SMS);
    const labelPrefix = 'onboarding.courtesy.sms.collapsed';

    const { getByText, getByRole } = render(
      <CourtesyContactHandler {...props} mode="collapsed" />
    );

    expect(getByText(`${labelPrefix}.label`)).toBeInTheDocument();
    expect(getByRole('button', { name: `${labelPrefix}.button-label` })).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: `${labelPrefix}.button-label` }));
    expect(props.onExpand).toHaveBeenCalledTimes(1);
  });

  it('renders the insert mode with title, input and submit/collapse callbacks', () => {
    const props = createProps(ChannelType.EMAIL);
    const labelPrefix = 'onboarding.courtesy.email.insert';

    const { getByText, getByLabelText, getByRole } = render(
      <CourtesyContactHandler
        {...props}
        mode="insert"
        contactValue={mockEmail}
        contactError="mock-error"
        contactTouched
      />
    );

    expect(getByText(`${labelPrefix}.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.description`)).toBeInTheDocument();
    expect(getByLabelText(`${labelPrefix}.input-label`)).toBeInTheDocument();
    expect(getByRole('button', { name: `${labelPrefix}.button-label` })).toBeInTheDocument();
    expect(
      getByRole('button', { name: `${labelPrefix}.collapse-label` })
    ).toBeInTheDocument();
    expect(getByText('mock-error')).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: `${labelPrefix}.button-label` }));
    expect(props.onVerifyContact).toHaveBeenCalledTimes(1);

    fireEvent.click(getByRole('button', { name: `${labelPrefix}.collapse-label` }));
    expect(props.onCollapse).toHaveBeenCalledTimes(1);
  });

  it('renders the readonly mode for a contact added during the wizard', () => {
    const props = createProps(ChannelType.EMAIL);
    const labelPrefix = 'onboarding.courtesy.email.readonly';

    const { getByText } = render(
      <CourtesyContactHandler
        {...props}
        mode="readonly"
        contactState={{ value: mockEmail, alreadySet: false }}
      />
    );

    expect(getByText(`${labelPrefix}.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.description`)).toBeInTheDocument();
    expect(getByText(mockEmail)).toBeInTheDocument();
  });

  it('does not render the readonly content for a contact that is alreadySet', () => {
    const props = createProps(ChannelType.EMAIL);
    const labelPrefix = 'onboarding.courtesy.email.readonly';

    const { queryByText } = render(
      <CourtesyContactHandler
        {...props}
        mode="readonly"
        contactState={{ value: mockEmail, alreadySet: true }}
      />
    );

    expect(queryByText(`${labelPrefix}.title`)).not.toBeInTheDocument();
    expect(queryByText(mockEmail)).not.toBeInTheDocument();
  });

  it('renders the edit mode with the title/description for an already-present contact', () => {
    const props = createProps(ChannelType.EMAIL);
    const labelPrefix = 'onboarding.courtesy.email.edit';

    const { getByText } = render(
      <CourtesyContactHandler
        {...props}
        mode="edit"
        contactState={{ value: mockEmail, alreadySet: true }}
      />
    );

    expect(getByText(`${labelPrefix}.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.description`)).toBeInTheDocument();
    expect(getByText(mockEmail)).toBeInTheDocument();
  });
});
