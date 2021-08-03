# code editor

Sample jsx code editor react application

## Based on 13-vite

This project is based on the `13-vite` project setup. All eslint, vite, react, prettier, and build configuration is based on that setup.

## Setup app structure

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'

const App = () => {
  const iframe = React.useRef()
  const [content, setContent] = React.useState(defaultValue)
  const textarea = React.useRef()

  return (
    <div id="app">
      <div className="editor">
        <textarea ref={textarea} />
      </div>
      <div className="result">
        <iframe title="result" className="iframe" ref={iframe} />
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
```

## Add some css

```css
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  font-size: 14px;
}
#app {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100%;
}
.editor, .result, iframe {
  display: flex;
  width: 50%;
  height: 100vh;
}
.editor textarea {
  border: none;
  height: calc(100vh - 2rem);
  width: 100%;
  margin: 0;
  padding: 1rem;
}
.result iframe {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  border: none;
}
```

## Add dependency for codemirror

```bash
npm i --save codemirror
```

## Import codemirror

Make use of codemirror by importing it along with the jsx mode we will be using.

```javascript
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/jsx/jsx'
```

Now we need to create an actual instance of CodeMirror so that it will transform the `textarea` whenever the page loads. We'll need to create a *useEffect* to do this that will setup the instance, mode, and change events.

```javascript
  React.useEffect(() => {
    const onEditorChange = (editor) => {
      console.log(editor.getValue())
      setContent(editor.getValue())
    }
    const instance = CodeMirror.fromTextArea(textarea.current, {
      tabSize: 2,
      lineNumbers: true
    })
    instance.setValue(defaultValue)
    instance.setOption('mode', 'jsx')
    instance.on('change', onEditorChange)
    return () => {
      instance.off('change', onEditorChange)
      instance.toTextArea()
    }
  }, [])
```

## Setup iframe document

In order to display the content of the codemirror textarea, we will need a **useEffect** that will update the iframe document whenever the `content` has changed.

```javascript
  React.useEffect(() => {
    const doc = iframe.current.contentDocument

    const documentContents = `
      <!doctype html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>
          <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
      </head>
      <body>
      <div id="root"></div>
      <script data-plugins="transform-es2015-modules-umd" type="text/babel">
      ${content}
      </script>
      </body>
      </html>
    `

    doc.open()
    doc.write(documentContents)
    doc.close()
  }, [content])
```

## Setup css for codemirror

Codemirrow needs a bit of css to display properly in our current container.

```css
.CodeMirror {
  font-family: 'source-code-pro', Menlo, 'Courier New', Consolas, monospace;
  color: black;
  direction: ltr;
  font-size: 14px;
  z-index: 0;
  height: auto;
  background: transparent;
  width: 100%;
  border-right: solid 1px #333;
}
```

## Run the app

```bash
npm start
```
