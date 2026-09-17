import type { Services } from 'i18next';
import { Mock, vi } from 'vitest';

import { Configuration } from '../../services/configuration.service';
import TranslationOverlayBackend, {
  OverlaidNamespaces,
  mergeTranslations,
} from '../translationOverlay.backend';

type FakeBackend = {
  loadPath: string;
  read: Mock;
};

const { instances } = vi.hoisted(() => ({
  instances: [] as Array<FakeBackend>,
}));

vi.mock('i18next-http-backend', () => {
  class FakeHttpBackend {
    // the real constructor already applies the defaults, this loadPath among them
    loadPath = '/locales/{{lng}}/{{ns}}.json';
    read = vi.fn();

    constructor() {
      instances.push(this as unknown as FakeBackend);
    }

    init(_services: unknown, options: { loadPath: string }) {
      this.loadPath = options.loadPath;
    }
  }
  return { default: FakeHttpBackend };
});

const BASE_LOAD_PATH = '/locales/{{lng}}/{{ns}}.json';
const OVERLAY_LOAD_PATH = '/locales/{{lng}}/{{ns}}-v2.json';

type TestConfiguration = {
  API_BASE_URL: string;
  IS_NEW_TIMELINE_COPY_ENABLED: boolean;
};

const overlaidNamespaces: OverlaidNamespaces<TestConfiguration> = {
  notifiche: 'IS_NEW_TIMELINE_COPY_ENABLED',
};

const baseTranslations = {
  detail: {
    timeline: {
      'schedule-digital-workflow': 'current text',
      legalfact: {
        'sender-ack': 'current sender ack',
        'recipient-access': 'current recipient access',
      },
    },
  },
};

const setFlag = (value: boolean) =>
  Configuration.setForTest<TestConfiguration>({
    API_BASE_URL: 'https://fake.api',
    IS_NEW_TIMELINE_COPY_ENABLED: value,
  });

const createBackend = (options = { overlaidNamespaces }) => {
  const backend = new TranslationOverlayBackend();
  backend.init({} as Services, options);
  return { backend, base: instances[0], overlay: instances[1] };
};

describe('TranslationOverlayBackend', () => {
  beforeEach(() => {
    instances.length = 0;
    Configuration.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    Configuration.clear();
  });

  // the base one must stay on the i18next-http-backend default: with the flag off nothing changes
  it('initializes the two inner backends on the expected paths', () => {
    const { base, overlay } = createBackend();

    expect(base.loadPath).toBe(BASE_LOAD_PATH);
    expect(overlay.loadPath).toBe(OVERLAY_LOAD_PATH);
  });

  it('makes a single request and returns the current translations when the flag is off', () => {
    setFlag(false);
    const { backend, base, overlay } = createBackend();
    base.read.mockImplementation((_lng, _ns, cb) => cb(null, baseTranslations));
    const callback = vi.fn();

    backend.read('it', 'notifiche', callback);

    expect(overlay.read).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(null, baseTranslations);
  });

  // on startup i18next loads `common` while loadConfiguration has not finished yet: the namespace
  // must be discarded before touching the configuration, or the boot breaks
  it('does not read the configuration for namespaces outside the map', () => {
    // no setForTest on purpose: reading the configuration here would throw
    const { backend, base, overlay } = createBackend();
    base.read.mockImplementation((_lng, _ns, cb) => cb(null, { button: { exit: 'Esci' } }));
    const callback = vi.fn();

    expect(() => backend.read('it', 'common', callback)).not.toThrow();

    expect(overlay.read).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(null, { button: { exit: 'Esci' } });
  });

  it('treats missing options as no overlaid namespace at all', () => {
    setFlag(true);
    const { backend, base, overlay } = createBackend({} as { overlaidNamespaces: never });
    base.read.mockImplementation((_lng, _ns, cb) => cb(null, baseTranslations));
    const callback = vi.fn();

    expect(() => backend.read('it', 'notifiche', callback)).not.toThrow();

    expect(overlay.read).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(null, baseTranslations);
  });

  it('falls back to the current translations when the configuration is not available yet', () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { backend, base, overlay } = createBackend();
    base.read.mockImplementation((_lng, _ns, cb) => cb(null, baseTranslations));
    const callback = vi.fn();

    expect(() => backend.read('it', 'notifiche', callback)).not.toThrow();

    expect(overlay.read).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(null, baseTranslations);
    expect(consoleWarn).toHaveBeenCalled();
  });

  it('fires both requests together and merges the overlay onto the current translations', async () => {
    setFlag(true);
    const { backend, base, overlay } = createBackend();
    base.read.mockImplementation((_lng, _ns, cb) => cb(null, baseTranslations));
    overlay.read.mockImplementation((_lng, _ns, cb) =>
      cb(null, { detail: { timeline: { legalfact: { 'sender-ack': 'revised sender ack' } } } })
    );
    const callback = vi.fn();

    backend.read('it', 'notifiche', callback);

    // both requests start before any answer comes back
    expect(base.read).toHaveBeenCalledTimes(1);
    expect(overlay.read).toHaveBeenCalledTimes(1);

    await vi.waitFor(() => expect(callback).toHaveBeenCalledTimes(1));
    expect(callback).toHaveBeenCalledWith(null, {
      detail: {
        timeline: {
          'schedule-digital-workflow': 'current text',
          legalfact: {
            'sender-ack': 'revised sender ack',
            'recipient-access': 'current recipient access',
          },
        },
      },
    });
  });

  it('uses the current translations when the overlay is missing or unreadable', async () => {
    setFlag(true);
    const { backend, base, overlay } = createBackend();
    base.read.mockImplementation((_lng, _ns, cb) => cb(null, baseTranslations));
    overlay.read.mockImplementation((_lng, _ns, cb) => cb(new Error('404'), false));
    const callback = vi.fn();

    backend.read('it', 'notifiche', callback);

    await vi.waitFor(() => expect(callback).toHaveBeenCalledTimes(1));
    expect(callback).toHaveBeenCalledWith(null, baseTranslations);
  });

  it('propagates the error of the base backend', async () => {
    setFlag(true);
    const { backend, base, overlay } = createBackend();
    const baseError = new Error('500');
    base.read.mockImplementation((_lng, _ns, cb) => cb(baseError, false));
    overlay.read.mockImplementation((_lng, _ns, cb) => cb(null, { detail: {} }));
    const callback = vi.fn();

    backend.read('it', 'notifiche', callback);

    await vi.waitFor(() => expect(callback).toHaveBeenCalledTimes(1));
    expect(callback).toHaveBeenCalledWith(baseError, false);
  });
});

describe('mergeTranslations', () => {
  it('overrides only the leaves declared by the overlay, at any depth', () => {
    const result = mergeTranslations(
      { a: { b: { c: 'old c', d: 'old d' }, e: 'old e' } },
      { a: { b: { c: 'new c' } } }
    );

    expect(result).toStrictEqual({ a: { b: { c: 'new c', d: 'old d' }, e: 'old e' } });
  });

  it('adds the keys that only the overlay declares', () => {
    const result = mergeTranslations({ a: 'old a' }, { b: 'new b' });

    expect(result).toStrictEqual({ a: 'old a', b: 'new b' });
  });

  // lodash' default would merge by index, leaving the trailing entries of the old list behind
  it('replaces lists as a whole instead of merging them by index', () => {
    const result = mergeTranslations({ list: ['old 1', 'old 2', 'old 3'] }, { list: ['new 1'] });

    expect(result).toStrictEqual({ list: ['new 1'] });
  });

  it('does not mutate the objects it receives', () => {
    const base = { a: { b: 'old b' } };
    const overlay = { a: { b: 'new b' } };

    mergeTranslations(base, overlay);

    expect(base).toStrictEqual({ a: { b: 'old b' } });
    expect(overlay).toStrictEqual({ a: { b: 'new b' } });
  });
});
