import React from 'react'
import ReactDOM from 'react-dom'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/jsx/jsx'

import './index.css'

const defaultValue = `const App = () => (
  <h2>Hello World</h2>
)

ReactDOM.render(<App />, document.getElementById('root'))`

const App = () => {
  const iframe = React.useRef()
  const [content, setContent] = React.useState(defaultValue)
  const textarea = React.useRef()

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
