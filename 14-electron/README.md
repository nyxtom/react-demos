# electron

Simple react application demonstrating how to build an electron desktop app with React

## Based on 13-vite

This project is based on the `13-vite` project setup. All eslint, vite, react, prettier, and build configuration is based on that setup.

## Update vite.config.js

We need to configure the output for `vite.config.js` to use a different `base` path so that it uses relative file paths rather than `/` root url.

```javascript
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import eslint from '@rollup/plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    {
      ...eslint({
        include: ['**/**.jsx', '**/**.js'],
        exclude: ['node_modules/**', 'dist/**'],
        configFile: '.eslintrc.json',
        throwOnError: true,
        throwOnWarning: true,
      }),
      enforce: 'pre',
    },
    reactRefresh(),
  ],
})
```

## Update app structure

Update the `<App />` to setup a simple sidebar/header layout

```javascript
// index.jsx
import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'

const App = () => (
  <div id="app">
    <header>
      <h1>Hello world</h1>
    </header>
    <div className="container">
      <section className="sidebar">
        Sidebar
      </section>
      <section className="content">
        Messages
      </section>
    </div>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
```

## Update some app styling

Add a bit of css to create the layout in `index.css`

```css
html, body {
  margin: 0px;
  padding: 0px;
  font-size: 12px;
}
h1 {
  margin: 0px;
  padding: 0px;
  font-size: 1.4rem;
}
header {
  background: #fff;
  box-shadow: 0px 0px 6px -2px #000;
  padding: 8px;
  z-index: 2;
  position: relative;
}
.container {
  display: flex;
  flex-direction: row;
}
.sidebar {
  width: 200px;
  z-index: 1;
  box-shadow: 2px 2px 3px -1px #ccc;
}
.sidebar, .content {
  display: flex;
  height: calc(100vh - 20px);
  padding: 12px;
  background: #fff;
}
.content {
  flex-grow: 1;
  background: #f9f9f9;
}
```

## Setup electron dependencies

Now we can setup `main.js` to setup electron. First, however, we need to install the `electron` dependency.

```bash
npm i --save electron
```

In order to run `electron` we are also going to update `package.json` to have a few scripts.

```json
{
  "main": "main.js",
  "scripts": {
    "build": "vite build",
    "serve": "vite serve",
    "start": "vite",
    "format": "prettier --write \"**/*.+(js|jsx|json|css|md)\"",
    "lint": "eslint . --ext .js,.jsx",
    "lint:fix": "eslint --fix . --ext .js,.jsx",
    "precommit": "lint-staged",
    "electron": "electron ."
  }
}
```

## Setup main.js

`main.js` will be the code for the electron app to launch the desktop window

```javascript
const { app, BrowserWindow } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
          nodeIntegration: true
      }
  })

  win.loadFile('dist/index.html')
  win.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
```

That's it!

## Run the app

Build the vite app bundle to `dist/`

```bash
npm run build
```

Then run the electron app below

```bash
npm run electron
```
