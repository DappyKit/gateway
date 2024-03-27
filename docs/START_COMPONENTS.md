# Start components

### OP Sepolia

```shell
# install dependencies
npm ci

# copy and fill the env
cp op-sepolia-example.env .env

# create DB
mysql -u root -p < ./migrations/db_op_sepolia.sql

# start interactive mode for MySQL user creation:
mysql -u root -p

# and run commands
CREATE USER 'op_sepolia_dappy_verify_deploy'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON op_sepolia_dappy_verify_deploy.* TO 'op_sepolia_dappy_verify_deploy'@'localhost';
FLUSH PRIVILEGES;

# apply migrations
npx knex migrate:latest --env production

# start verification API server
npx pm2 start npm --name "[OP Sepolia] DappyKit Verification API" -- run start

# start deployer service via PM2
npx pm2 start npm --name "[OP Sepolia] DappyKit Deployer" -- run start-deployer

# OR start the server manually
npm run start
```

### OP Mainnet

```shell
# install dependencies
npm ci

# copy and fill the env
cp op-mainnet-example.env .env

# create DB
mysql -u root -p < ./migrations/db_op_mainnet.sql

# start interactive mode for MySQL user creation:
mysql -u root -p

# and run commands
CREATE USER 'op_mainnet_dappy_verify_deploy'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON op_mainnet_dappy_verify_deploy.* TO 'op_mainnet_dappy_verify_deploy'@'localhost';
FLUSH PRIVILEGES;

# apply migrations
npx knex migrate:latest --env production

# start verification API server
npx pm2 start npm --name "[OP Mainnet] DappyKit Verification API" -- run start

# start deployer service via PM2
npx pm2 start npm --name "[OP Mainnet] DappyKit Deployer" -- run start-deployer

# OR start the server manually
npm run start
```

## Development

```shell
# create new migration
npx knex migrate:make my_new_migration
```

## Start Demo UI

```shell
# go to "Start the server" section and start the server
# go to web directory
cd demo/web

# install dependencies
npm ci

# start the UI
npm run start
```
