import { IAppMessage } from '../../types/AppMessage';
import { createAppError, createAppMessage } from '../message.service';

const _404error: IAppMessage = {
  id: '1',
  title: 'Risorsa non trovata',
  message: 'Si è verificato un errore. Si prega di riprovare più tardi',
  blocking: false,
  toNotify: true,
};

const _403error: IAppMessage = {
  id: '2',
  title: 'Utente non autenticato',
  message: "L'utente corrente non è autenticato",
  blocking: false,
  toNotify: true,
};

const _genericError: IAppMessage = {
  id: '3',
  title: 'Errore generico',
  message: 'Si è verificato un errore. Si prega di riprovare più tardi',
  blocking: false,
  toNotify: true,
};

const _genericMessage: IAppMessage = {
  id: '4',
  title: 'mocked-title',
  message: 'mocked-message',
  blocking: false,
  toNotify: true,
};

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

test('return generic message', () => {
  const genericMessage = createAppMessage('mocked-title', 'mocked-message');
  expect(genericMessage).toEqual(_genericMessage);
});
