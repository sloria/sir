# sir: Your open source assistant

## Requirements

- Node `^4.0.0` or `^5.0.0` ([npm3](https://www.npmjs.com/package/npm3) recommended).
- Python 3.5

## Getting started

### Set up GitHub credentials

Create a Developer App on GitHub and add the following variables to a ``.env`` file in the root project directory (NOTE: ``.env`` will not be versioned).

```shell
SIR_GITHUB_CLIENT_ID='your-client-id'
SIR_GITHUB_CLIENT_SECRET='your-client-secret'
```

### Start the API server

#### With Docker

```shell
docker-compose -f docker-compose-dev.yml build
docker-compose -f docker-compose-dev.yml up
```

Set the ``APIHOST`` environment variable to the IP of the Docker host machine.

```shell
# Assuming a virtual machine named 'dev'
docker-machine ip dev
# => 192.168.99.100
```

Add the following to your ``.env`` file.

```shell
APIHOST=192.168.99.100
```

#### Without Docker

Requires Python 3.5 and Redis.

```shell
# After creating and activating a new virtual environment
pip install -r requirements-dev.txt
invoke server
```

Add the following to your ``.env`` file.

```shell
APIHOST=localhost:5000
```

### Start the frontend app

Install requirements:

```shell
npm install
```
Start the app:

```shell
npm start
```

Browse to http://localhost:3000 to view the app.

## Running tests

### API tests

#### With Docker

```shell
docker-compose run api inv test
```

#### Without Docker

```shell
invoke test
```

## Client-side tests

```shell
npm test
```
