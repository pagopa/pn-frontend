import { storageOpsBuilder } from '../storage.utility';

describe('test storageOpsBuilder', () => {
  it('test storageOpsBuilder read string function when empty', () => {
    const builder = storageOpsBuilder('testKey', 'string', true);
    const readTestKey = builder.read();
    expect(readTestKey).toBeUndefined();
  });

  it('test storageOpsBuilder string write function', () => {
    const builder = storageOpsBuilder('testKey', 'string', true);
    builder.write('testValue');
    const readTestKey = builder.read();
    expect(readTestKey).toEqual('testValue');
  });

  it('test storageOpsBuilder string delete function', () => {
    const builder = storageOpsBuilder('testKey', 'string', true);
    builder.delete();
    const readTestKey = builder.read();
    expect(readTestKey).toBeUndefined();
  });

  it('test storageOpsBuilder read number function when empty', () => {
    const builder = storageOpsBuilder('testKey', 'number', true);
    const readTestKey = builder.read();
    expect(readTestKey).toBeUndefined();
  });

  it('test storageOpsBuilder number write function', () => {
    const builder = storageOpsBuilder('testKey', 'number', true);
    builder.write(6);
    const readTestKey = builder.read();
    expect(readTestKey).toEqual(6);
  });

  it('test storageOpsBuilder number delete function', () => {
    const builder = storageOpsBuilder('testKey', 'number', true);
    builder.delete();
    const readTestKey = builder.read();
    expect(readTestKey).toBeUndefined();
  });

  it('test storageOpsBuilder read object function when empty', () => {
    const builder = storageOpsBuilder('testKey', 'object', true);
    const readTestKey = builder.read();
    expect(readTestKey).toBeUndefined();
  });

  it('test storageOpsBuilder object write function', () => {
    const builder = storageOpsBuilder('testKey', 'object', true);
    builder.write('testValue');
    const readTestKey = builder.read();
    expect(readTestKey).toEqual('testValue');
  });

  it('test storageOpsBuilder object delete function', () => {
    const builder = storageOpsBuilder('testKey', 'object', true);
    builder.delete();
    const readTestKey = builder.read();
    expect(readTestKey).toBeUndefined();
  });

  it('test storageOpsBuilder session', () => {
    const builder = storageOpsBuilder('testKey', 'string', false);
    const initialTestKey = builder.read();
    expect(initialTestKey).toBeUndefined();
    builder.write('testValue');
    const updatedTestKey = builder.read();
    expect(updatedTestKey).toEqual('testValue');
    builder.delete();
    const readTestKey = builder.read();
    expect(readTestKey).toBeUndefined();
  });

  it('test storageOpsBuilder session - xss attacks', () => {
    const builder = storageOpsBuilder('testKey', 'string', false);
    const initialTestKey = builder.read();
    expect(initialTestKey).toBeUndefined();
    builder.write('<script>malicious code</script>testValue');
    const updatedTestKey = builder.read();
    expect(updatedTestKey).toEqual('testValue');
    builder.delete();
    const readTestKey = builder.read();
    expect(readTestKey).toBeUndefined();
  });
});
