import { extractRootTraceId } from '../support.utility';

describe('support utility', () => {
  describe('extractRootTraceId test', () => {
    it('should return undefined if has no Root element', () => {
      expect(extractRootTraceId(undefined)).toBeUndefined();
      expect(extractRootTraceId(null)).toBeUndefined();
      expect(extractRootTraceId('')).toBeUndefined();
      expect(extractRootTraceId('Key1=val1;Key2=val2')).toBeUndefined();
    });

    it('should extract Root value', () => {
      expect(extractRootTraceId('Root=atTheBeginning;Key2=val2')).toBe('atTheBeginning');
      expect(extractRootTraceId('Key1=val1;Root=inTheMiddle;Key3=val3')).toBe('inTheMiddle');
      expect(extractRootTraceId('Key1=val1;Key2=val2;Root=atTheEnd')).toBe('atTheEnd');
    });

    it('should not match similar keys', () => {
      expect(extractRootTraceId('Key1=val1;NonRoot=Root;Rooty=123;Key2=val2')).toBeUndefined();
    });
  });
});
