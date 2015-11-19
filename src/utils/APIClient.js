/**
 * API client for sending JSON requests to the API.
 * Automatically formats the URL with the correct host, port,
 * protocol, and API Prefix.
 *
 * Usage:
 *
 *   const client = new APIClient();
 *   client.get('/repos/')
 *    .then((data) => {
 *        console.log(data);
 *    })
 */
import fetch from 'isomorphic-fetch';

const API_PREFIX = '/v1';
// Use variables from config to build API URL
let API_BASE = __APIHOST__;
if (__APIPORT__) {
  API_BASE += ':' + __APIPORT__;
}

const USE_HTTPS = __PROD__;

const PROTOCOL = USE_HTTPS ? 'https://' : 'http://';

function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  return PROTOCOL + API_BASE + API_PREFIX + adjustedPath;
}

// https://github.com/github/fetch#handling-http-error-statuses
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    let error = new Error(response.statusText); //eslint-disable-line
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

/*
 * This silly underscore is here to avoid a mysterious "ReferenceError: ApiClient is not defined" error.
 * See Issue #14. https://github.com/erikras/react-redux-universal-hot-example/issues/14
 *
 * Remove it at your own risk.
 *
 * This class is adapted from https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/helpers/ApiClient.js
 */
const methods = ['get', 'post', 'put', 'patch', 'del'];
class _APIClient {
  constructor() {
    methods.forEach((method) =>
      this[method] = (path, { data, overrides} = {}) => new Promise((resolve, reject) => {
        const url = formatUrl(path);
        const defaults = {
          method: method,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        };
        if (data) {
          defaults.body = JSON.stringify(data);
        }
        const options = Object.assign({}, defaults, overrides);
        fetch(url, options)
          .then(checkStatus)
          .then(parseJSON)
          .then((body) => {
            resolve(body);
          })
          .catch((error) => {
            reject(error);
          });
      }));
  }
}

const APIClient = _APIClient;

export default APIClient;
