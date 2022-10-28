## Run app in local

Edit your hosts file depending on your OS [windows] (https://en.wikiversity.org/wiki/Hosts_file/Edit) [mac](https://osxdaily.com/2012/08/07/edit-hosts-file-mac-os-x/)

with this entry:

`127.0.0.1 portale-pa.dev.pn.pagopa.it`

add a new .env file in this root with name `.env.development.local`. Then edit it with these commands:

```
HOST='portale-pa.dev.pn.pagopa.it'
HTTPS=true
PORT=443
```

Now you can run `yarn start` to make redirect from reference URL to app in localhost.

## Env variables (development)

You need to add following variables to your `.env.development.local` file:

```
REACT_APP_URL_SELFCARE_LOGIN
REACT_APP_URL_SELFCARE_BASE
REACT_APP_URL_API
REACT_APP_PAGOPA_HELP_EMAIL = support email, you can use a fake one in development.
REACT_APP_DISABLE_INACTIVITY_HANDLER = true if you want to disable user inactivity check.
```
