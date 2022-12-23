const cypress = require('cypress')
const server = require('my-server');

// start your server
return server.start().then(() => {
  // kick off a cypress run
  return cypress.run().then((results) => {
    // stop your server when it's complete
    return server.stop()
  })
})