import { IAppMessage } from '../../types';
import { createAppError, createAppMessage } from '../message.service';

const _404error: IAppMessage = {
  id: '1',
  title: 'Risorsa non trovata',
  message: 'Si è verificato un errore. Si prega di riprovare più tardi',
  blocking: false,
  toNotify: true,
  status: 404
};

const _403error: IAppMessage = {
  id: '2',
  title: 'La sessione è scaduta',
  message: "Entra e accedi con SPID o CIE.",
  blocking: false,
  toNotify: true,
  status: 403
};

const _401error: IAppMessage = {
  id: '3',
  title: 'Utente non autorizzato',
  message: "L'utente corrente non ha le autorizzazioni",
  blocking: false,
  toNotify: true,
  status: 401
};

const _500error: IAppMessage = {
  id: '4',
  title: 'Il servizio non è disponibile',
  message: "Per un problema temporaneo del servizio, la tua richiesta non è stata inviata. Riprova più tardi.",
  blocking: false,
  toNotify: true,
  status: 500
};

const _genericError: IAppMessage = {
  id: '5',
  title: 'Errore generico',
  message: 'Si è verificato un errore. Si prega di riprovare più tardi',
  blocking: false,
  toNotify: true,
  status: 501
};

const _genericMessage: IAppMessage = {
  id: '6',
  title: 'mocked-title',
  message: 'mocked-message',
  blocking: false,
  toNotify: true,
  status: undefined
};

const _customMessage: IAppMessage = {
  id: '7',
  title: 'custom-title',
  message: 'custom-message',
  blocking: false,
  toNotify: true,
  status: 401
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

test('return 401 error message', () => {
  const response = { response: { status: 401 } };
  const errorMessage = createAppError(response);
  expect(errorMessage).toEqual(_401error);
});

test('return 500 error message', () => {
  const response = { response: { status: 500 } };
  const errorMessage = createAppError(response);
  expect(errorMessage).toEqual(_500error);
});

test('return generic error message', () => {
  const response = { response: { status: 501 } };
  const errorMessage = createAppError(response);
  expect(errorMessage).toEqual(_genericError);
});

test('return generic message', () => {
  const genericMessage = createAppMessage('mocked-title', 'mocked-message');
  expect(genericMessage).toEqual(_genericMessage);
});

test('return custom message', () => {
  const response = { response: { status: 401, customMessage: { title: 'custom-title', message: 'custom-message'} } };
  const customMessage = createAppError(response);
  expect(customMessage).toEqual(_customMessage);
});
