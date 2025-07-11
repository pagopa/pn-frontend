import { useRef } from 'react';
import { vi } from 'vitest';

import { getById, queryById } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { ChannelType } from '../../../models/contacts';
import DigitalContact, { LabelVisibility } from '../DigitalContact';

const mockSubmitCbk = vi.fn();
const mockDeleteCbk = vi.fn();
const mockCancelCbk = vi.fn();

describe('DigitalContact Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('renders label based on showLabel prop', () => {
    const visibilities: LabelVisibility[] = ['always', 'never', 'insert', 'edit'];

    visibilities.forEach((visibility) => {
      const { container, unmount } = render(
        <DigitalContact
          label={`Label ${visibility}`}
          value=""
          channelType={ChannelType.PEC}
          inputProps={{ label: 'Input label' }}
          insertButtonLabel="Button"
          onSubmit={mockSubmitCbk}
          onDelete={mockDeleteCbk}
          showLabel={visibility}
        />
      );

      const label = queryById(container, 'default_pec-custom-label');
      if (visibility === 'never' || visibility === 'edit') {
        expect(label).not.toBeInTheDocument();
      } else {
        expect(label).toBeInTheDocument();
        expect(label).toHaveTextContent(`Label ${visibility}`);
      }

      unmount();
    });
  });

  it('renders component - filled with showLabel = "always"', () => {
    const { container } = render(
      <DigitalContact
        label="Mocked label"
        value="mocked@pec.it"
        channelType={ChannelType.PEC}
        inputProps={{ label: 'Input label' }}
        insertButtonLabel="Button"
        onSubmit={mockSubmitCbk}
        onDelete={mockDeleteCbk}
        showLabel="always"
      />
    );

    const label = queryById(container, 'default_pec-custom-label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Mocked label');
    expect(container).toHaveTextContent('mocked@pec.it');
  });

  it('renders component - empty', async () => {
    // render component
    const { container } = render(
      <DigitalContact
        showLabel="insert"
        label="Mocked label"
        value=""
        channelType={ChannelType.PEC}
        inputProps={{
          label: 'Mocked input label',
        }}
        insertButtonLabel="Button"
        onSubmit={mockSubmitCbk}
        onDelete={mockDeleteCbk}
      />
    );
    const label = getById(container, 'default_pec-custom-label');
    expect(label).toHaveTextContent('Mocked label');
    const input = getById(container, 'default_pec');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
    const button = await waitFor(() => getById(container, 'default_pec-button'));
    expect(button).toHaveTextContent('Button');
    expect(button).toBeEnabled();

    let errorText = queryById(container, 'default_pec-helper-text');
    expect(errorText).not.toBeInTheDocument();

    fireEvent.click(button);

    errorText = getById(container, 'default_pec-helper-text');
    expect(errorText).toBeInTheDocument();
  });

  it('renders component - empty with cancelInsert button', async () => {
    // render component
    const result = render(
      <DigitalContact
        label="Mocked label"
        value=""
        channelType={ChannelType.PEC}
        inputProps={{
          label: 'Mocked input label',
        }}
        insertButtonLabel="Button"
        onSubmit={mockSubmitCbk}
        onDelete={mockDeleteCbk}
        onCancelInsert={mockCancelCbk}
      />
    );

    const buttonCancel = result.getByRole('button', { name: 'button.annulla' });
    expect(buttonCancel).toBeInTheDocument();

    fireEvent.click(buttonCancel);
    await waitFor(() => {
      expect(mockCancelCbk).toHaveBeenCalledTimes(1);
    });
  });

  it('insert value', async () => {
    // render component
    const { container } = render(
      <DigitalContact
        label="Mocked label"
        value=""
        channelType={ChannelType.PEC}
        inputProps={{
          label: 'Mocked input label',
        }}
        insertButtonLabel="Button"
        onSubmit={mockSubmitCbk}
        onDelete={mockDeleteCbk}
      />
    );
    const input = container.querySelector('[name="default_pec"]');
    fireEvent.change(input!, { target: { value: 'mocked@pec.it' } });
    await waitFor(() => {
      expect(input).toHaveValue('mocked@pec.it');
    });
    const button = await waitFor(() => getById(container, 'default_pec-button'));
    expect(button).toBeEnabled();
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockSubmitCbk).toHaveBeenCalledTimes(1);
      expect(mockSubmitCbk).toHaveBeenCalledWith('mocked@pec.it');
    });
  });

  it('insert invalid value', async () => {
    // render component
    const { container } = render(
      <DigitalContact
        label="Mocked label"
        value=""
        channelType={ChannelType.PEC}
        inputProps={{
          label: 'Mocked input label',
        }}
        insertButtonLabel="Button"
        onSubmit={mockSubmitCbk}
        onDelete={mockDeleteCbk}
      />
    );
    const input = container.querySelector('[name="default_pec"]');
    fireEvent.change(input!, { target: { value: 'not valid' } });
    await waitFor(() => {
      expect(input).toHaveValue('not valid');
    });
    const button = await waitFor(() => getById(container, 'default_pec-button'));
    expect(button).toBeEnabled();
    const errorMessage = container.querySelector(`#default_pec-helper-text`);
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders component - filled', () => {
    // render component
    const { container } = render(
      <DigitalContact
        showLabel="never"
        label="Mocked label"
        value="mocked@pec.it"
        channelType={ChannelType.PEC}
        inputProps={{
          label: 'Mocked input label',
        }}
        insertButtonLabel="Button"
        onSubmit={mockSubmitCbk}
        onDelete={mockDeleteCbk}
      />
    );
    const label = queryById(container, 'default_pec-custom-label');
    expect(label).not.toBeInTheDocument();
    const input = queryById(container, 'default_pec');
    expect(input).not.toBeInTheDocument();
    expect(container).toHaveTextContent('mocked@pec.it');
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('button.modifica');
    expect(buttons[1]).toHaveTextContent('button.elimina');
  });

  it('renders component - filled with verified icon', () => {
    // render component
    const result = render(
      <DigitalContact
        label="Mocked label"
        value="mocked@pec.it"
        channelType={ChannelType.PEC}
        inputProps={{
          label: 'Mocked input label',
        }}
        insertButtonLabel="Button"
        onSubmit={mockSubmitCbk}
        onDelete={mockDeleteCbk}
        showVerifiedIcon
      />
    );

    const verifiedIcon = result.getByTestId('CheckCircleIcon');
    expect(verifiedIcon).toBeInTheDocument();
  });

  it('edit value', async () => {
    const Component = () => {
      const digitalElemRef = useRef<{ toggleEdit: () => void }>({ toggleEdit: () => {} });
      const onSubmit = (value: string) => {
        mockSubmitCbk(value);
        digitalElemRef.current.toggleEdit();
      };
      return (
        <DigitalContact
          label="Mocked label"
          value="mocked@pec.it"
          channelType={ChannelType.PEC}
          inputProps={{
            label: 'Mocked input label',
          }}
          insertButtonLabel="Button"
          onSubmit={onSubmit}
          onDelete={mockDeleteCbk}
          ref={digitalElemRef}
        />
      );
    };
    // render component
    const { container } = render(<Component />);
    let buttons = container.querySelectorAll('button');
    fireEvent.click(buttons[0]);
    let input = await waitFor(() => container.querySelector('[name="default_pec"]'));
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('mocked@pec.it');
    let newButtons = container.querySelectorAll('button');
    expect(newButtons).toHaveLength(2);
    expect(newButtons[0]).toHaveTextContent('button.conferma');
    expect(newButtons[1]).toHaveTextContent('button.annulla');
    // cancel edit
    fireEvent.change(input!, { target: { value: 'new-mocked@pec.it' } });
    await waitFor(() => {
      expect(input).toHaveValue('new-mocked@pec.it');
    });
    fireEvent.click(newButtons[1]);
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
      expect(container).toHaveTextContent('mocked@pec.it');
    });
    // confirm edit
    buttons = container.querySelectorAll('button');
    fireEvent.click(buttons[0]);
    input = await waitFor(() => container.querySelector('[name="default_pec"]'));
    expect(input).toBeInTheDocument();
    fireEvent.change(input!, { target: { value: 'new-mocked@pec.it' } });
    await waitFor(() => {
      expect(input).toHaveValue('new-mocked@pec.it');
    });
    newButtons = container.querySelectorAll('button');
    fireEvent.click(newButtons[0]);
    await waitFor(() => {
      expect(mockSubmitCbk).toHaveBeenCalledTimes(1);
      expect(mockSubmitCbk).toHaveBeenCalledWith('new-mocked@pec.it');
    });
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
  });

  it('edit with invalid value', async () => {
    // render component
    const { container } = render(
      <DigitalContact
        label="Mocked label"
        value="mocked@pec.it"
        channelType={ChannelType.PEC}
        inputProps={{
          label: 'Mocked input label',
        }}
        insertButtonLabel="Button"
        onSubmit={mockSubmitCbk}
        onDelete={mockDeleteCbk}
      />
    );
    const buttons = container.querySelectorAll('button');
    fireEvent.click(buttons[0]);
    const input = await waitFor(() => container.querySelector('[name="default_pec"]'));
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('mocked@pec.it');
    fireEvent.change(input!, { target: { value: 'invalid value' } });
    await waitFor(() => {
      expect(input).toHaveValue('invalid value');
    });
    const newButtons = container.querySelectorAll('button');
    expect(newButtons[0]).toBeEnabled();
  });

  it('remove contact', () => {
    // render component
    const { container } = render(
      <DigitalContact
        label="Mocked label"
        value="mocked@pec.it"
        channelType={ChannelType.PEC}
        inputProps={{
          label: 'Mocked input label',
        }}
        insertButtonLabel="Button"
        onSubmit={mockSubmitCbk}
        onDelete={mockDeleteCbk}
      />
    );
    const buttons = container.querySelectorAll('button');
    fireEvent.click(buttons[1]);
    expect(mockDeleteCbk).toHaveBeenCalledTimes(1);
  });

  it('does not render duplicate label elements', () => {
    const { container } = render(
      <DigitalContact
        label="No Duplicates"
        value=""
        channelType={ChannelType.PEC}
        inputProps={{ label: 'Input label' }}
        insertButtonLabel="Button"
        onSubmit={mockSubmitCbk}
        onDelete={mockDeleteCbk}
        showLabel="always"
      />
    );

    const labels = container.querySelectorAll('#default_pec-custom-label');
    expect(labels.length).toBe(1);
  });
});
