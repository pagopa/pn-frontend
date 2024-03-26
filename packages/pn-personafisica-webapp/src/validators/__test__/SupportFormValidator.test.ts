import validator from '../SupportFormValidator';

describe('Tests SupportFormValidator', () => {
  it('validation OK', () => {
    const result = validator.validate({ email: 'test@mail.it', confirmEmail: 'test@mail.it' });
    expect(result).toBeNull();
  });

  it('validation KO - divergent emails', () => {
    const result = validator.validate({
      email: 'test@mail.it',
      confirmEmail: 'test-divergent@mail.it',
    });
    expect(result).toEqual({ confirmEmail: 'not-the-same' });
  });

  it('validation KO - empty email', () => {
    const result = validator.validate({
      email: '',
      confirmEmail: 'test@mail.it',
    });
    expect(result).toEqual({
      email: 'not-valid',
      confirmEmail: 'not-the-same',
    });
  });

  it('validation KO - empty confirmation email', () => {
    const result = validator.validate({
      email: 'test@mail.it',
      confirmEmail: '',
    });
    expect(result).toEqual({ confirmEmail: 'not-valid' });
  });
});
