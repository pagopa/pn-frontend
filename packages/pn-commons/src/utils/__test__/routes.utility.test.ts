import { compileRoute } from '../routes.utility';

describe('Routes utility', () => {
  it('Route with no params and no path', () => {
    const route = compileRoute({
      prefix: ['mocked', 'route'],
    });
    expect(route).toEqual('/mocked/route');
  });

  it('Route with path and no params', () => {
    const route = compileRoute({
      prefix: ['mocked', 'route'],
      path: 'mocked-path',
    });
    expect(route).toEqual('/mocked/route/mocked-path');
  });

  it('Route with path params', () => {
    const route = compileRoute({
      prefix: 'prefix',
      path: 'path/:foo',
      params: {
        foo: 'bar',
      },
    });
    expect(route).toEqual('/prefix/path/bar');
  });

  it('Route with query params', () => {
    const route = compileRoute({
      prefix: 'prefix',
      query: {
        foo: 'bar',
      },
    });
    expect(route).toEqual('/prefix?foo=bar');
  });

  it('Route with 2 query params', () => {
    const route = compileRoute({
      prefix: 'prefix',
      query: {
        foo: 'bar',
        foo2: 'bar2',
      },
    });
    expect(route).toEqual('/prefix?foo=bar&foo2=bar2');
  });

  it('Route with array query param', () => {
    const route = compileRoute({
      prefix: 'prefix',
      query: {
        foo: 'bar',
        foo2: ['bar21', 'bar22'],
      },
    });
    expect(route).toEqual('/prefix?foo=bar&foo2=bar21&foo2=bar22');
  });

  it('Route with undefined query params', () => {
    const route = compileRoute({
      prefix: 'prefix',
      query: {
        foo: '',
      },
    });
    expect(route).toEqual('/prefix');
  });
});
