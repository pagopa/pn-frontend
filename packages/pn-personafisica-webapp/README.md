## Run app in local with auth

Edit your hosts file depending on your OS [windows] (https://en.wikiversity.org/wiki/Hosts_file/Edit) [mac](https://osxdaily.com/2012/08/07/edit-hosts-file-mac-os-x/)

with this entry:

`127.0.0.1 cittadini.dev.notifichedigitali.it`

add a new .env file in this root with name `.env.local`. Then edit it with these commands:

```
HOST='cittadini.dev.notifichedigitali.it'
HTTPS=true
PORT=443
```
### Env variables (development)

Copy the content of the file located in `public/conf/env/config.dev.json` in a file config.json located in `public/conf/`


Now you can run `yarn start` to run your application and to make redirect from reference URL to app in localhost.
