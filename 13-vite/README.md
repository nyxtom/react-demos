# vite

Simple react application setup using vite + eslint + prettier + react without babel/webpack

## Setup npm

- Setup a package.json to work off of

  ```bash
  npm init -y
  ```

- Install basic dependencies

  ```bash
  npm i --save react react-dom
  ```

- Install dev dependencies for vite

  ```bash
  npm i --save-dev vite @vitejs/plugin-react-refresh
  ```

- Install dev dependencies for eslint

  ```bash
  npm i --save-dev eslint eslint-config-airbnb eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks
  ```

- Install dev dependencies for prettier

  ```bash
  npm i --save-dev prettier
  ```

## Configure prettier

To setup prettier, simply setup the `.prettierrc` file

```json
{
  "tabWidth": 2,
  "singleQuote": true,
  "semi": false
}
```

## Configure eslint

ESLint will be configured with the following configs and plugins

- eslint-config-airbnb: Default JavaScript syntax eslint recommendations
- eslint-config-prettier: Default prettier javascript syntax configurations
- eslint-plugin-import: import module syntax linting
- eslint-plugin-jsx-a11y: jsx a11y es linting
- eslint-plugin-prettier: prettier integration
- eslint-plugin-react: react integration
- eslint-plugin-react-hooks: react hooks linting

```json
{
  "env": {
    "browser": true,
    "es6": true,
    "mocha": true
  },
  "extends": ["airbnb", "prettier"],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
    "window": true,
    "document": true,
    "localStorage": true,
    "FormData": true,
    "FileReader": true,
    "Blob": true,
    "navigator": true
  },
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2020,
    "sourceType": "module"
  },
  "plugins": ["react", "prettier", "react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-filename-extension": [
      1,
      {
        "extensions": [".js", ".jsx"]
      }
    ],
    "import/imports-first": ["error", "absolute-first"],
    "import/newline-after-import": "error",
    "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
    "arrow-body-style": ["error", "as-needed"],
    "react/prop-types": 0,
    "no-console": 0
  }
}
```

In addition, we need to ignore dist and node_modules in `.eslintignore`

```
dist
node_modules
```

## Setup vite

Vite is intended to target modern browsers with native ES modules support. This eliminates the need for babel and brings in `rollup` and `esbuild` along with plugin support for react.

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  esbuild: {
    include: /\.jsx?$/,
    exclude: [],
    loader: 'jsx',
  },
})
```

Configure the `package.json` for `start` and `build`

```json
{
  "scripts": {
    "build": "vite build",
    "start": "vite"
  }
}
```

## Setup index.html

In vite, `index.html` is considered part of the source and module graph. Vite uses `index.html` as the entry point for building the module graph so any references to `script type="module"` and `link ref` will be detected for building.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hello World</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./index.js"></script>
  </body>
</html>
```

## Setup React index

Now we can setup the simple hello world in React

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

const App = () => (
  <div id="app">
    <h1>Hello world</h1>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
```
