// todo should get task from the db and deploy+issue the token in one tx
async function start(): Promise<void> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-console
      console.log('Deployer running')
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

start().then()
