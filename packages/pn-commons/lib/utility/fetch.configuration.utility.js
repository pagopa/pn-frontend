/*
 * this function is defined in a file separate from configuration.utility.ts
 * just to ease its mocking when testing loadConfiguration and getConfiguration.
 */
export async function fetchConfiguration() {
    try {
        const res = await fetch('conf/config.json', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        return await res.json();
    }
    catch (e) {
        if (process.env.NODE_ENV !== 'test') {
            console.error(e);
        }
        throw e;
    }
}
