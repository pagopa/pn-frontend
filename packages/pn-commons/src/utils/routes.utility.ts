interface Parameters {
  [key: string]: string | number | Date;
}

interface Route {
  prefix: string | string[];
  path?: string;
  params?: Parameters;
  query?: Parameters;
}

function compilePrefix(prefix: string | string[]) {
  return prefix instanceof Array ? prefix.join('/') : prefix;
}

function encode(param: string | number | Date) {
  return encodeURIComponent(param.toString());
}

export function compileRoute(route: Route) {
  let result = route.prefix ? `/${compilePrefix(route.prefix)}` : '';
  if (Boolean(route.path)) {
    result += `/${route.path}`;
  }
  if (route.params) {
    result = Object.entries(route.params).reduce(
      (agg, [k, v]) => agg.replace(`:${k}`, encode(v)),
      result
    );
  }
  if (route.query) {
    result = Object.entries(route.query)
      .filter(([, v]) => v)
      .reduce(
        (agg, [k, v]) => agg.concat(`${k}=${encode(v)}&`),
        `${result}?`
      )
      .slice(0, -1);
  }
  return result;
}
