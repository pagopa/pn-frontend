import type { Services } from 'i18next';
import { Mock, vi } from 'vitest';

import TranslationOverlayBackend, { mergeTranslations } from '../translationOverlay.backend';

type FakeBackend = {
  loadPath: string;
  read: Mock;
};

const { instances, mockGetConfiguration } = vi.hoisted(() => ({
  instances: [] as Array<FakeBackend>,
  mockGetConfiguration: vi.fn(),
}));

vi.mock('i18next-http-backend', () => {
  class FakeHttpBackend {
    // il costruttore vero applica già i default, fra cui questo loadPath
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

vi.mock('../../services/configuration.service', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../services/configuration.service')>()),
  getConfiguration: mockGetConfiguration,
}));

const BASE_LOAD_PATH = '/locales/{{lng}}/{{ns}}.json';
const OVERLAY_LOAD_PATH = '/locales/{{lng}}/{{ns}}-v2.json';

const baseTranslations = {
  detail: {
    timeline: {
      'schedule-digital-workflow': 'testo corrente',
      legalfact: {
        'sender-ack': 'presa in carico corrente',
        'recipient-access': 'accesso corrente',
      },
    },
  },
};

const createBackend = () => {
  const backend = new TranslationOverlayBackend();
  backend.init({} as Services);
  return { backend, base: instances[0], overlay: instances[1] };
};

describe('TranslationOverlayBackend', () => {
  beforeEach(() => {
    instances.length = 0;
    mockGetConfiguration.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // il base deve restare sul default di i18next-http-backend: a flag spento nulla cambia
  it('inizializza i due backend sui percorsi attesi', () => {
    const { base, overlay } = createBackend();

    expect(base.loadPath).toBe(BASE_LOAD_PATH);
    expect(overlay.loadPath).toBe(OVERLAY_LOAD_PATH);
  });

  it('a feature flag spento fa una sola richiesta e restituisce le traduzioni correnti', () => {
    mockGetConfiguration.mockReturnValue({ IS_NEW_TIMELINE_COPY_ENABLED: false });
    const { backend, base, overlay } = createBackend();
    base.read.mockImplementation((_lng, _ns, cb) => cb(null, baseTranslations));
    const callback = vi.fn();

    backend.read('it', 'notifiche', callback);

    expect(overlay.read).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(null, baseTranslations);
  });

  // all'avvio i18next carica `common` mentre loadPfConfiguration non è ancora arrivata in fondo:
  // il namespace va scartato prima di toccare la configurazione, altrimenti il boot si rompe
  it('non interroga la configurazione per i namespace fuori overlay', () => {
    mockGetConfiguration.mockImplementation(() => {
      throw new Error('loadConfiguration must be called before any call to getConfiguration');
    });
    const { backend, base, overlay } = createBackend();
    base.read.mockImplementation((_lng, _ns, cb) => cb(null, { button: { exit: 'Esci' } }));
    const callback = vi.fn();

    backend.read('it', 'common', callback);

    expect(mockGetConfiguration).not.toHaveBeenCalled();
    expect(overlay.read).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(null, { button: { exit: 'Esci' } });
  });

  it('degrada alle traduzioni correnti se la configurazione non è ancora disponibile', () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockGetConfiguration.mockImplementation(() => {
      throw new Error('loadConfiguration must be called before any call to getConfiguration');
    });
    const { backend, base, overlay } = createBackend();
    base.read.mockImplementation((_lng, _ns, cb) => cb(null, baseTranslations));
    const callback = vi.fn();

    expect(() => backend.read('it', 'notifiche', callback)).not.toThrow();

    expect(overlay.read).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(null, baseTranslations);
    expect(consoleWarn).toHaveBeenCalled();
  });

  it('a feature flag acceso lancia le due richieste insieme e fonde l’overlay sulle traduzioni correnti', async () => {
    mockGetConfiguration.mockReturnValue({ IS_NEW_TIMELINE_COPY_ENABLED: true });
    const { backend, base, overlay } = createBackend();
    base.read.mockImplementation((_lng, _ns, cb) => cb(null, baseTranslations));
    overlay.read.mockImplementation((_lng, _ns, cb) =>
      cb(null, { detail: { timeline: { legalfact: { 'sender-ack': 'presa in carico rivista' } } } })
    );
    const callback = vi.fn();

    backend.read('it', 'notifiche', callback);

    // entrambe le richieste partono prima che arrivi una risposta
    expect(base.read).toHaveBeenCalledTimes(1);
    expect(overlay.read).toHaveBeenCalledTimes(1);

    await vi.waitFor(() => expect(callback).toHaveBeenCalledTimes(1));
    expect(callback).toHaveBeenCalledWith(null, {
      detail: {
        timeline: {
          'schedule-digital-workflow': 'testo corrente',
          legalfact: {
            'sender-ack': 'presa in carico rivista',
            'recipient-access': 'accesso corrente',
          },
        },
      },
    });
  });

  it('usa le traduzioni correnti se l’overlay non esiste o non è leggibile', async () => {
    mockGetConfiguration.mockReturnValue({ IS_NEW_TIMELINE_COPY_ENABLED: true });
    const { backend, base, overlay } = createBackend();
    base.read.mockImplementation((_lng, _ns, cb) => cb(null, baseTranslations));
    overlay.read.mockImplementation((_lng, _ns, cb) => cb(new Error('404'), false));
    const callback = vi.fn();

    backend.read('it', 'notifiche', callback);

    await vi.waitFor(() => expect(callback).toHaveBeenCalledTimes(1));
    expect(callback).toHaveBeenCalledWith(null, baseTranslations);
  });

  it('propaga l’errore del backend base', async () => {
    mockGetConfiguration.mockReturnValue({ IS_NEW_TIMELINE_COPY_ENABLED: true });
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
  it('sovrascrive solo le foglie dichiarate dall’overlay, a qualsiasi profondità', () => {
    const result = mergeTranslations(
      { a: { b: { c: 'vecchio c', d: 'vecchio d' }, e: 'vecchio e' } },
      { a: { b: { c: 'nuovo c' } } }
    );

    expect(result).toStrictEqual({ a: { b: { c: 'nuovo c', d: 'vecchio d' }, e: 'vecchio e' } });
  });

  it('aggiunge le chiavi presenti solo nell’overlay', () => {
    const result = mergeTranslations({ a: 'vecchio a' }, { b: 'nuovo b' });

    expect(result).toStrictEqual({ a: 'vecchio a', b: 'nuovo b' });
  });

  // il default di lodash fonderebbe per indice, lasciando in coda le voci della lista vecchia
  it('sostituisce le liste per intero invece di fonderle per indice', () => {
    const result = mergeTranslations(
      { list: ['vecchio 1', 'vecchio 2', 'vecchio 3'] },
      { list: ['nuovo 1'] }
    );

    expect(result).toStrictEqual({ list: ['nuovo 1'] });
  });

  it('non modifica gli oggetti ricevuti', () => {
    const base = { a: { b: 'vecchio b' } };
    const overlay = { a: { b: 'nuovo b' } };

    mergeTranslations(base, overlay);

    expect(base).toStrictEqual({ a: { b: 'vecchio b' } });
    expect(overlay).toStrictEqual({ a: { b: 'nuovo b' } });
  });
});
