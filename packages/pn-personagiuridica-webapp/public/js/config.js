const regex = new RegExp('https://imprese.((dev|test|uat|hotfix).?)notifichedigitali.it');
const origin = window.origin;
if (regex.test(origin)) {
  document.write(`<meta name="robots" content="noindex">`);
}
