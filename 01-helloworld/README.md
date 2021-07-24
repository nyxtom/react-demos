# helloworld

Simple hello world react application demonstrating basic client setup from scratch without create-react-app.

### Setup Dependencies and Package

- Setup a package.json to work off of

  ```bash
  npm init -y
  ```

- Install basic dependencies

  ```bash
  npm i react react-dom -s
  ```

- Install dev dependencies

  ```bash
  npn i -D webpack webpack-cli webpack-dev-server -s
  ```

  webpack: Installs the webpack module bundler
  webpack-cli: Offers a variety of commands that make it easier to work with webpack on the command line
  webpack-dev-server: Allows us to use a simple web server with hot reload

- Setup babel

  ```bash
  npm i -D @babel/core @babel/preset-env @babel/preset-react @babel/eslint-parser babel-loader -s
  ```

  @babel/core: Core package for the Babel compiler
  @babel/preset-env: A smart preset that allows us to use the latest JavaScript syntax
  @babel/preset-react: As the name suggests, it transpiles React code to plain JavaScript
  @babel/eslint-parser: Parser for eslint based on babel
  babel-loader: A plugin that enables Webpack to work with Babel and its presets

- Setup dev dependencies for CSS and HTML (style parsing and autoprefixing)

  ```bash
  npm i -D -s style-loader css-loader postcss-loader html-webpack-plugin
  ```

- Setup prettier for code formatting

  ```bash
  npm i -D -s prettier
  ```

- Setup ESLint

  ```bash
  npm i -D -s eslint eslint-config-airbnb eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks @babel/eslint-parser
  ```

  ESLint plugins to support airbnb standard JavaScript, prettier, imports, jsx-a11y, react, react-hooks

- Setup husky and lint-staged

  ```bash
  npm i -D -s husky lint-staged
  ```

### Create Root Folder Structure

- `public/` for HTML file and assets (images, fonts..etc)
- `src/` for `.js` files and React components
- `babel.config.json` for babel configuration

### ESLINT

- Add `.eslintignore` to ignore `dist` and `node_modules`

  ```
  dist
  node_modules
  ```

- Setup eslint (you can use `eslint --init` or paste the following) in `.eslintrc.json`

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
    "parser": "@babel/eslint-parser",
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
      "import/no-extraneous-dependencies": [
        "error",
        { "devDependencies": true }
      ],
      "arrow-body-style": ["error", "as-needed"],
      "react/prop-types": 0,
      "no-console": 0
    }
  }
  ```

  Note the use of react-hooks rules, exhaustive-deps, react react/jsx filenames. Some adjustments to the arrow-body-style was made, imports, and fixes to devDependencies for imports prop-types.

- Add `eslint .` to the `package.json`

  ```json
  {
    "scripts": {
      "lint": "eslint .",
      "lint:fix": "eslint --fix ."
    }
  }
  ```

### Prettier

- To setup simple formating with `prettier` add a `.prettierrc` file with the following

  ```json
  {
    "tabwidth": 2,
    "singlequote": true,
    "semi": true
  }
  ```

- Add `prettier` formating to `package.json` scripts

  ```json
  {
    "scripts": {
      "format": "prettier --write \"**/*.+(js|jsx|json|css|md)\""
    }
  }
  ```

### Husky/Lint-Staged Git Commit Hooks

- To setup git commit hooks we can use husky to use githooks as if they are npm scripts and we use lint-staged to run scripts on staged files in git. Add the following precommit to scripts.

  ```json
  {
    "scripts": {
      "precommit": "lint-staged"
    },
    "lint-staged": {
      "src/**/*.{js,jsx,json,css,md}": [
        "prettier --write \"**/*.+(js|jsx|json|css|md)\"",
        "git add"
      ]
    }
  }
  ```

### Webpack/Babel Config

- Add presets to `babel.config.json`

  ```json
  {
    "presets": ["@babel/preset-env", "@babel/preset-react"]
  }
  ```

- Setup webpack development configuration

  ```javascript
  const webpack = require('webpack')

  const path = require('path')
  const HtmlWebpackPlugin = require('html-webpack-plugin')

  module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|ico)$/i,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'public/index.html',
      }),
      new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      port: process.env.PORT || 4000,
      open: true,
      hot: true,
    },
    devtool: 'inline-source-map'
  }
  ```

  load javascript files through `babel-loader`, `.css` through `style-loader` and `css-loader`, then recognize image files.

- Setup webpack production version

  ```javascript
  const webpack = require('webpack')
  const path = require('path')
  const HtmlWebpackPlugin = require('html-webpack-plugin')

  module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      publicPath: '',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|ico)$/i,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ],
  }
  ```

Mostly the only main differences here are the `mode: 'production'` and the use of the `output.filename`

## Add @babel/runtime and @babel/plugin-transform-runtime to allow async/await to work

```bash
npm i -D -s @babel/runtime @babel/plugin-transform-runtime
```

Then add the plugin to webpack.dev.config.js

```javascript
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: ['@babel/transform-runtime']
    },
  },
},
```

### Setup index.js

- In `src/index.js` we can now setup a simple hello world react app

  ```javascript
  import React from 'react'
  import ReactDOM from 'react-dom'

  const App = () => (
    <div id="app">
      <h1>Hello World!</h1>
    </div>
  )

  ReactDOM.render(<App />, document.getElementById('root'))
  ```

- Setup `public/index.html`

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
    </body>
  </html>
  ```

### Setup build and dev server scripts

- Add scripts for dev server and build in `package.json`

  ```json
  {
    "scripts": {
      "start": "webpack server --config webpack.dev.config.js",
      "build": "webpack --config webpack.prod.config.js"
    }
  }
  ```

### Run and see Hello World!

```bash
npm start
```
