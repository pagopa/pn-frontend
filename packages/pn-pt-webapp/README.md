## Run app in local

Edit your hosts file depending on your OS [windows] (https://en.wikiversity.org/wiki/Hosts_file/Edit) [mac](https://osxdaily.com/2012/08/07/edit-hosts-file-mac-os-x/)

with this entry:

`127.0.0.1 partner.dev.notifichedigitali.it`

add a new .env file in this root with name `.env.local`. Then edit it with these commands:

```
HOST='partner.dev.notifichedigitali.it'
HTTPS=true
PORT=443
```

Now you can run `yarn dev` to run your application and to make redirect from reference URL to app in localhost
