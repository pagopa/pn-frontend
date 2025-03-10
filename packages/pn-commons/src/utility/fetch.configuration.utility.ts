/*
 * this function is defined in a file separate from configuration.utility.ts
 * just to ease its mocking when testing loadConfiguration and getConfiguration.
 */

export async function fetchConfiguration(): Promise<any> {
  try {
    const res = await fetch(import.meta.env.BASE_URL + 'conf/config.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
    return await res.json();
  } catch (e) {
    if (process.env.NODE_ENV !== 'test') {
      console.error(e);
    }
    throw e;
  }
}
