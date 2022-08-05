/**
 * Initial proposal of regex for different kinds of info expressed as strings,
 * the current aim is just to avoid security issues and/or 
 * security warnings in the static analysis of the source code.
 * In particular, the one for the phone number could be done *a lot* better.
 * ------------------------
 * Carlos Lombardi, 2022.08.05
 */
export const dataRegex = {
  phoneNumber: /^[0-9\-()+.\s]+$/,
  name: /^[A-Za-zÀ-ÿ\-'" 0-9\.]+$/,
  lettersAndNumbers: /^[A-Za-z0-9]+$/,
  simpleServer: /^[A-Za-z0-9.\-/]+$/,           // the server part of an URL, no protocol, no query params
  token: /^[A-Za-z0-9\-._~+/]+$/,               // cfr. https://stackoverflow.com/questions/50031993/what-characters-are-allowed-in-an-oauth2-access-token
};
