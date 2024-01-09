import { events } from '../events';

describe('test track events', () => {
  it('app crash event', () => {
    const event = events['APP_CRASH'];
    expect(event).toEqual({
      event_category: 'app',
      event_type: 'app crashed',
    });
  });

  it('undefined event', () => {
    const event = events['TEST'];
    expect(event).toEqual(undefined);
  });

  it('app crash event', () => {
    const event = events['delegationsSlice/createDelegation/rejected'];
    expect(event.event_category).toEqual('delegation');
    expect(event.event_type).toEqual('error while adding new delegate');

    const attributes = event.getAttributes!({ response: { data: { title: 'test' } } });
    expect(attributes).toEqual({ type: 'test' });

    const noTitleAttr = event.getAttributes!({ response: { data: { test: 'test' } } });
    expect(noTitleAttr).toEqual({ type: 'generic error' });
  });

  it('error adding new delegate event', () => {
    const event = events['delegationsSlice/createDelegation/rejected'];
    expect(event.event_category).toEqual('delegation');
    expect(event.event_type).toEqual('error while adding new delegate');

    const error = event.getAttributes!({ response: { data: { title: 'test error' } } });
    expect(error).toEqual({ type: 'test error' });

    const noTitleError = event.getAttributes!({ response: { data: { test: 'test' } } });
    expect(noTitleError).toEqual({ type: 'generic error' });
  });

  it('error adding new delegate event', () => {
    const event = events['setSorting'];
    expect(event.event_category).toEqual('notification');
    expect(event.event_type).toEqual('change notification sorting order');

    const error = event.getAttributes!({ orderBy: 'date', order: 'asc' });
    expect(error).toEqual({
      orderBy: 'date',
      order: 'asc',
    });

    const noTitleError = event.getAttributes!({ response: { data: { test: 'test' } } });
    expect(noTitleError).toEqual({
      orderBy: undefined,
      order: undefined,
    });
  });
});
