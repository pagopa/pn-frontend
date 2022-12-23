const start = () => {
  // const host = process.env.HOST;
  // const port = process.env.PORT;
  // const HTTPS = process.env.HTTPS;

  // const server = `${HTTPS ? 'https://' : 'http://'}${host}:${port || '3000'}`;

  // exec('yarn start-waiton ')
  exec(`nohup yarn start & echo $! > pidfile`);
}

const stop = () => {
  exec('kill $(cat pidfile)');
}