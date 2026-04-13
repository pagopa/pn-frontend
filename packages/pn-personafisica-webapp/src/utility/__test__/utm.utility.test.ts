import { AAR_UTM, UTM_KEY, buildSearchWithUtm } from '../utm.utility';

describe('buildSearchWithUtm', () => {
  it('builds search with required UTM params when none are present', () => {
    const result = buildSearchWithUtm('?generic_param=value', AAR_UTM);

    expect(result.changed).toBe(true);

    const parsed = new URLSearchParams(result.search);

    expect(parsed.get(UTM_KEY.CAMPAIGN)).toBe(AAR_UTM.utm_campaign);
    expect(parsed.get(UTM_KEY.SOURCE)).toBe(AAR_UTM.utm_source);
    expect(parsed.get(UTM_KEY.MEDIUM)).toBe(AAR_UTM.utm_medium);
    expect(parsed.get('generic_param')).toBe('value');
  });

  it('builds search overriding existing required UTM params by default', () => {
    const result = buildSearchWithUtm(
      '?utm_source=old-source&utm_campaign=old-campaign&generic_param=value',
      AAR_UTM
    );

    expect(result.changed).toBe(true);

    const parsed = new URLSearchParams(result.search);

    expect(parsed.get(UTM_KEY.CAMPAIGN)).toBe(AAR_UTM[UTM_KEY.CAMPAIGN]);
    expect(parsed.get(UTM_KEY.SOURCE)).toBe(AAR_UTM[UTM_KEY.SOURCE]);
    expect(parsed.get(UTM_KEY.MEDIUM)).toBe(AAR_UTM[UTM_KEY.MEDIUM]);
    expect(parsed.get('generic_param')).toBe('value');
  });

  it('returns search unchanged when any required UTM param is already present and avoidOverride is true', () => {
    const currentSearch = '?utm_source=source&generic_param=value';

    const result = buildSearchWithUtm(currentSearch, AAR_UTM, { avoidOverride: true });

    expect(result.changed).toBe(false);
    expect(result.search).toBe(currentSearch);
  });

  it('builds search with optional utm_* params together with required ones', () => {
    const result = buildSearchWithUtm('?generic_param=value', {
      ...AAR_UTM,
      utm_content: 'hero-banner',
      utm_term: 'send',
    });

    expect(result.changed).toBe(true);

    const parsed = new URLSearchParams(result.search);

    expect(parsed.get(UTM_KEY.CAMPAIGN)).toBe(AAR_UTM[UTM_KEY.CAMPAIGN]);
    expect(parsed.get(UTM_KEY.SOURCE)).toBe(AAR_UTM[UTM_KEY.SOURCE]);
    expect(parsed.get(UTM_KEY.MEDIUM)).toBe(AAR_UTM[UTM_KEY.MEDIUM]);
    expect(parsed.get('utm_content')).toBe('hero-banner');
    expect(parsed.get('utm_term')).toBe('send');
    expect(parsed.get('generic_param')).toBe('value');
  });
});
