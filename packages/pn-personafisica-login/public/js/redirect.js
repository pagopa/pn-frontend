const regex = new RegExp('https://login\\.(((dev|test|uat|hotfix)\\.)?)notifichedigitali\\.it') 
const origin = window.origin;
if (regex.test(origin)) {
  const matches = origin.match(regex);
  const newloginElements = ['https://cittadini.', matches[1], 'notifichedigitali.it/auth'];

  const newlogin = newloginElements.join('');
  document.write(`<meta http-equiv="refresh" content="0; url=${newlogin}">`);
  document.write(`<meta name="robots" content="noindex">`);
}