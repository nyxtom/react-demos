import React from 'react'

import './Article.css'

export class Article extends React.Component {
  render() {
    return (
      <article id={this.props.hash}>
        <div className="title">{this.props.title}</div>
        <div className="author">By <strong>{this.props.author}</strong></div>
        <pre>{this.props.text}</pre>
      </article>
    )
  }
}
