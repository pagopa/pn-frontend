import { AppRouteParams, compileRoute, getRapidAccessParam } from '../routes.utility';

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

  it('Route with version', () => {
    const route = compileRoute({
      prefix: 'prefix',
      version: 'v1',
    });
    expect(route).toEqual('/prefix/v1');
  });

  // Tests for getRapidAccessParam
  it('getRapidAccessParam returns correct param when present', () => {
    const params = new URLSearchParams({ aar: 'value' });
    const result = getRapidAccessParam(params);
    expect(result).toEqual({ param: AppRouteParams.AAR, value: 'value' });
  });

  it('getRapidAccessParam returns undefined when no params are present', () => {
    const params = new URLSearchParams();
    const result = getRapidAccessParam(params);
    expect(result).toBeUndefined();
  });

  it('getRapidAccessParam returns correct param when multiple params are present', () => {
    const params = new URLSearchParams({ aar: 'value', retrievalId: '123' });
    const result = getRapidAccessParam(params);
    expect(result).toEqual({ param: AppRouteParams.AAR, value: 'value' });
  });

  it('getRapidAccessParam returns correct param when only retrievalId is present', () => {
    const params = new URLSearchParams({ retrievalId: '123' });
    const result = getRapidAccessParam(params);
    expect(result).toEqual({ param: AppRouteParams.RETRIEVAL_ID, value: '123' });
  });

  it('getRapidAccessParam returns undefined when param is empty', () => {
    const params = new URLSearchParams({ aar: '' });
    const result = getRapidAccessParam(params);
    expect(result).toBeUndefined();
  });

  it('getRapidAccessParam returns undefined when parameters is unknown', () => {
    const params = new URLSearchParams({ unknownParam: 'test-param' });
    const result = getRapidAccessParam(params);
    expect(result).toBeUndefined();
  });
});
