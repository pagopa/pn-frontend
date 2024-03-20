const regex = new RegExp('https://cittadini.((dev|test|uat|hotfix)?.?)notifichedigitali.it');
const origin = window.origin;
if (regex.test(origin)) {
  document.write(`<meta name="robots" content="noindex">`);
}
