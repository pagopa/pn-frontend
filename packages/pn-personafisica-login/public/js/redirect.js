const regex = new RegExp('https://login\\.(((dev|test|uat|hotfix)\\.)?)notifichedigitali\\.it');
const origin = window.origin;
if (regex.test(origin)) {
  const matches = origin.match(regex);
  const newloginElements = ['https://cittadini.', matches[1], 'notifichedigitali.it/auth'];

  const newlogin = newloginElements.join('');
  document.write(`<meta http-equiv="refresh" content="0; url=${newlogin}">`);
  document.write(`<meta name="robots" content="noindex">`);
}

const currentPath = window.location.pathname;
const currentParams = new URLSearchParams(window.location.search);

const noIndexPaths = ['/auth/login/error', '/auth/login/success', '/auth/logout'];

if (noIndexPaths.includes(currentPath)) {
  document.write(`<meta name="robots" content="noindex">`);
} else if (currentParams.has('aar') || currentParams.has('retrievalId')) {
  document.write(`<link rel="canonical" href="${window.location.origin}/auth/login">`);
}
