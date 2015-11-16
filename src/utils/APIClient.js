// TODO: switch to isomorphic-fetch
import superagent from 'superagent';

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

/*
 * This silly underscore is here to avoid a mysterious "ReferenceError: ApiClient is not defined" error.
 * See Issue #14. https://github.com/erikras/react-redux-universal-hot-example/issues/14
 *
 * Remove it at your own risk.
 */

const methods = ['get', 'post', 'put', 'patch', 'del'];
class _APIClient {
  constructor() {
    methods.forEach((method) =>
      this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
        const url = formatUrl(path);
        console.log(url);
        const request = superagent[method](url);

        if (params) {
          request.query(params);
        }

//         if (__SERVER__ && req.get('cookie')) {
//           request.set('cookie', req.get('cookie'));
//         }

        if (data) {
          request.send(data);
        }

        request.end((err, { body } = {}) => err ? reject(body || err) : resolve(body));
      }));
  }
}

const APIClient = _APIClient;

export default APIClient;
