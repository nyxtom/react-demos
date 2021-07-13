import React from 'react'

import { VirtualList, layouts } from './VirtualList'
import { Post } from './PostList'

export const PostGrid = ({ posts = [] }) => {
  const onRender = ({ startIndex, endIndex, itemHeight, itemWidth, maxCols }) => {
    if (startIndex !== null && endIndex != null) {
      let results = []
      for (let i = startIndex; i <= endIndex; i+= maxCols) {
        for (let j = 0; j < maxCols; j++) {
          if (i + j > endIndex) break
          let post = posts[i + j]
          results.push((
            <Post key={post.id} {...post} style={{ overflow: 'hidden', position: 'absolute', top: (i * itemHeight / maxCols), left: j * itemWidth, height: itemHeight, width: itemWidth  }} />
          ))
        }
      }
      return results
    }
  }

  if (posts) {
    return <VirtualList length={posts.length} layout={{ height: 132, width: 400 }} render={onRender} calculate={layouts.grid} />
  }

  return null
}

