import React from 'react'
import TagPosts from '~/components/TagPosts'

const page = ({
  params : {tag}
}  : {params : {tag : string}}) => {
  return (
    <TagPosts tag={tag} />
  )
}

export default page