import { vi } from 'vitest';

import { act, createMatchMedia, render } from '../../test-utils';
import SessionModal from '../SessionModal';

describe('test SessionModal component', () => {
  const original = window.matchMedia;

  afterAll(() => {
    window.matchMedia = original;
  });

  it('renders the component without confirm button', () => {
    const { baseElement } = render(
      <SessionModal open title={'Test title'} message={'test message'} />
    );
    expect(baseElement).toHaveTextContent(/test title/i);
    expect(baseElement).toHaveTextContent(/test message/i);
  });

  it('renders the full component with custom label', () => {
    const { baseElement } = render(
      <SessionModal
        open
        title={'Test title'}
        message={'test message'}
        onConfirm={() => {}}
        onConfirmLabel={'Confirm'}
      />
    );
    expect(baseElement).toHaveTextContent(/test title/i);
    expect(baseElement).toHaveTextContent(/test message/i);
    expect(baseElement).toHaveTextContent(/confirm/i);
  });

  it('renders the full component with default label', () => {
    const { baseElement } = render(
      <SessionModal open title={'Test title'} message={'test message'} onConfirm={() => {}} />
    );
    expect(baseElement).toHaveTextContent(/test title/i);
    expect(baseElement).toHaveTextContent(/test message/i);
    expect(baseElement).toHaveTextContent(/riprova/i);
  });

  it('check that close function is called after timeout', async () => {
    window.matchMedia = createMatchMedia(800);
    const mockCloseHandler = vi.fn();
    render(
      <SessionModal
        open
        title={'Test title'}
        message={'test message'}
        onConfirm={() => {}}
        onConfirmLabel={'Confirm'}
        initTimeout
        handleClose={mockCloseHandler}
      />
    );
    // wait timeout
    await act(() => new Promise((t) => setTimeout(t, 3000)));
    expect(mockCloseHandler).toBeCalledTimes(1);
  });

  it('renders the full component in mobile view', () => {
    window.matchMedia = createMatchMedia(800);
    const { baseElement } = render(
      <SessionModal
        open
        title={'Test title'}
        message={'test message'}
        onConfirm={() => {}}
        onConfirmLabel={'Confirm'}
      />
    );
    expect(baseElement).toHaveTextContent(/test title/i);
    expect(baseElement).toHaveTextContent(/test message/i);
    expect(baseElement).toHaveTextContent(/confirm/i);
  });
});
