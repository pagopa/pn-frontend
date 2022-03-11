import { AppError } from '../..';
import { createAppError } from '../error.service';

const _404error: AppError = {
  id: '1',
  title: 'Risorsa non trovata',
  message: 'Si è verificato un errore. Si prega di riprovare più tardi',
  blocking: false,
  toNotify: true,
};

const _403error: AppError = {
  id: '2',
  title: 'Utente non autenticato',
  message: "L'utente corrente non è autenticato",
  blocking: false,
  toNotify: true,
};

const _genericError: AppError = {
  id: '3',
  title: 'Errore generico',
  message: 'Si è verificato un errore. Si prega di riprovare più tardi',
  blocking: false,
  toNotify: true,
};

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: any) => str,
    };
  },
}));

test('return 404 error message', () => {
  const response = { response: { status: 404 } };
  const errorMessage = createAppError(response);
  expect(errorMessage).toEqual(_404error);
});

test('return 403 error message', () => {
  const response = { response: { status: 403 } };
  const errorMessage = createAppError(response);
  expect(errorMessage).toEqual(_403error);
});

test('return generic error message', () => {
  const response = { response: { status: 500 } };
  const errorMessage = createAppError(response);
  expect(errorMessage).toEqual(_genericError);
});
