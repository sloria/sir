# sir

[![Greenkeeper badge](https://badges.greenkeeper.io/sloria/sir.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/sloria/sir.svg?branch=master)](https://travis-ci.org/sloria/sir)

![screenshot](https://dl.dropboxusercontent.com/u/1693233/github/sir.png "sir")

## A work in progress

This is a rough work yet, but here's a preview: [http://sir.surge.sh](http://sir.surge.sh)

## Tools

### API server


* Python 3.5
* aiohttp web framework
* redis for caching
* Task runner: invoke

The API server runs in a Docker container, deployed to DigitalOcean.

### Client-side app


* ES6, compiled with Babel.js
* Redux for state management
* React for the view layer
* Bootstrap + bootstrap-material-design + react-bootstrap for styling
* Webpack for building it all
* Task runner: npm scripts

The web app runs as a static site, deployed with [surge](https://surge.sh/).

## Getting up and running

### Start the API server

#### With Docker

```shell
docker-compose -f docker-compose-dev.yml build
docker-compose -f docker-compose-dev.yml up -d
```

Set the ``APIHOST`` environment variable to the IP of the Docker host machine.

```shell
docker-machine ip dev
# => 192.168.99.100
```

Add the IP to your ``.env`` file.

```shell
APIHOST=192.168.99.100
```

#### Without Docker

Requires Python 3.5 and Redis.

```shell
# After creating and activating a new virtual environment
pip install -r requirements-dev.txt
redis
inv server
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

### Optional, but recommended: Set up GitHub credentials

Create a Developer App on GitHub and add the following variables to a ``.env`` file in the root project directory (NOTE: ``.env`` will not be versioned).

```shell
SIR_GITHUB_CLIENT_ID='your-client-id'
SIR_GITHUB_CLIENT_SECRET='your-client-secret'
```

## Running tests

### API tests

#### With Docker

```shell
docker-compose run api inv test
```

#### Without Docker

```shell
inv test
```

## Client-side tests

```shell
npm test
```

## License

MIT licensed.
