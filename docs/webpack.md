Webpack
-------

### Configuration
The webpack compiler configuration is located in `~/build/webpack`. Here you'll find configurations for each environment; `development`, `production`, and `development_hot` exist out of the box. These configurations are selected based on your current `NODE_ENV`, with the exception of `development_hot` which will _always_ be used by webpack dev server.

**Note**: There has been a conscious decision to keep development-specific configuration (such as hot-reloading) out of `.babelrc`. By doing this, it's possible to create cleaner development builds (such as for teams that have a `dev` -> `stage` -> `production` workflow) that don't, for example, constantly poll for HMR updates.

So why not just disable HMR? Well, as a further explanation, enabling `react-transform-hmr` in `.babelrc` but building the project without HMR enabled (think of running tests with `NODE_ENV=development` but without a dev server) causes errors to be thrown, so this decision also alleviates that issue.

### Vendor Bundle
You can redefine which packages to treat as vendor dependencies by editing `vendor_dependencies` in `~/config/index.js`. These default to:

```js
[
  'history',
  'react',
  'react-redux',
  'react-router',
  'redux-router',
  'redux'
]
```

### Aliases
As mentioned in features, the default webpack configuration provides some globals and aliases to make your life easier. These can be used as such:

```js
// current file: ~/src/views/some/nested/View.js
import SomeComponent from '../../../components/SomeComponent'; // without alias
import SomeComponent from 'components/SomeComponent'; // with alias
```

Available aliases:
```js
actions     => '~/src/actions'
components  => '~/src/components'
containers  => '~/src/containers'
layouts     => '~/src/layouts'
reducers    => '~/src/reducers'
routes      => '~/src/routes'
styles      => '~/src/styles'
utils       => '~/src/utils'
views       => '~/src/views'
```

### Globals

These are global variables available to you anywhere in your source code. If you wish to modify them, they can be found as the `globals` key in `~/config/index.js`.

#### `__DEV__`
True when `process.env.NODE_ENV` is `development`

#### `__PROD__`
True when `process.env.NODE_ENV` is `production`

#### `__DEBUG__`
True when the compiler is run with `--debug` (any environment).

