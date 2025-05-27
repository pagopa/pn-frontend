/* 
This function removes from error object all those informations that are not used by the application.
This is needed because redux, when recives an action, does a serializability check and, if the obeject is not serializable, it launchs a warning 
*/
export function parseError(e: any) {
  if (e.response) {
    const { data, status, headers } = e.response;

    return {
      response: {
        data: {
          ...data,
          traceId: headers?.['x-amzn-trace-id'] || data?.traceId || '',
        },
        status: status || 500,
      },
    };
  }
  // if the error doesn't have the response object, the user interface doesn't react to the failing api
  // so we set a generic error without data
  return { response: { status: 500 } };
}
