/** 
 * The regex used in this project to validate a phone number.
 * This could be done *a lot* better, this initial version is just to avoid 
 * security warnings in the static analysis of the source code.
 */
export const phoneNumberRegex = /^[0-9\-()+.\s]+$/; 