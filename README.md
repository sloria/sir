# sir: Your open source assistant

Requirements
------------

- Node `^4.0.0` or `^5.0.0` ([npm3](https://www.npmjs.com/package/npm3) recommended).
- Python 3.5

Getting Started
---------------

Install requirements:

```shell
npm install
pip install -r api/requirements.txt
```

Create a Developer App on GitHub and add the following envvars:

```shell
export SIR_GITHUB_CLIENT_ID='your-client-id'
export SIR_GITHUB_CLIENT_SECRET='your-client-secret'
```

Start the app:

```shell
npm start
```

Usage
-----

#### `npm start`
Runs the webpack build system with webpack-dev-server (by default found at `localhost:3000`) and run the API server in development mode concurrently.

#### `npm run dev`
Run the client-side app with webpack-dev-server.

#### `npm run dev:api`
Run the API server.

#### `npm run dev:nw`
Same as `npm run start` but opens the debug tools in a new window.

**Note:** you'll need to allow popups in Chrome, or you'll see an error: [issue 110](https://github.com/davezuko/react-redux-starter-kit/issues/110)

#### `npm run dev:no-debug`
Same as `npm run start` but disables devtools.

#### `npm run compile`
Runs the webpack build system with your current NODE_ENV and compiles the application to disk (`~/dist`).

#### `npm run test`
Runs unit tests with Karma and generates coverage reports.

#### `npm run test:dev`
Similar to `npm run test`, but will watch for changes and re-run tests; does not generate coverage reports.

#### `npm run lint`
Lint both server and client code.

#### `npm run lint:client`
Lint client-side code.

#### `npm run lint:api`
Lint server-side code.

#### `npm run lint:tests`
Lints all `.spec.js` files in of `~/tests`.

#### `npm run deploy`
Helper script to run linter, tests, and then, on success, compile your application to disk.

