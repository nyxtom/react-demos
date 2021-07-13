import React from 'react'

import { VirtualList } from './VirtualList'

export const Post = ({ title, body, id, style }) => {
  return (
    <div style={style}>
      <article className="post">
        <h3>{id} {title}</h3>
        <pre>{body}</pre>
      </article>
    </div>
  )
}

export const PostList = ({ posts = [] }) => {
  const onRender = ({ startIndex, endIndex, itemHeight, itemWidth }) => {
    if (startIndex !== null && endIndex != null) {
      return posts.slice(startIndex, endIndex + 1).map((post, i) => (
        <Post key={post.id} {...post} style={{ position: 'absolute', top: ((startIndex + i) * itemHeight), height: itemHeight, width: itemWidth  }} />
      ))
    }
  }

  if (posts) {
    return <VirtualList length={posts.length} layout={{ height: 132 }} render={onRender} />
  }

  return null
}
