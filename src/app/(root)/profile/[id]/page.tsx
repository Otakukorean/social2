import React, { Fragment } from 'react'
import Profile from '~/components/Profile'

const page = ({
    params: {id}
} : {params : {id : string}}) => {
  return (
    <Fragment>
        <Profile userId={id} />
    </Fragment>
  )
}

export default page